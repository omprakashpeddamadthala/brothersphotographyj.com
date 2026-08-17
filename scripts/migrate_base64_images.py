#!/usr/bin/env python3
"""Migrate legacy data:image Base64 values into optimized PostgreSQL media cache rows."""

from __future__ import annotations

import argparse
import base64
import io
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import psycopg
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DATA_URI_PREFIX = "data:image/"
VARIANT_WIDTHS = (480, 800, 1600)


@dataclass(frozen=True)
class Target:
    table: str
    image_column: str
    media_kind: str


TARGETS = (
    Target("hero_slides", "image_url", "hero"),
    Target("gallery_albums", "cover_image_url", "album-cover"),
    Target("gallery_photos", "image_url", "album-photo"),
    Target("blogs", "cover_image_url", "blog-cover"),
    Target("blog_images", "image_url", "blog-image"),
)


MEDIA_CACHE_DDL = """
CREATE TABLE IF NOT EXISTS media_cache (
    id BIGSERIAL PRIMARY KEY,
    media_kind VARCHAR(64) NOT NULL,
    source_id BIGINT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    content_type VARCHAR(128) NOT NULL,
    content BYTEA NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_media_cache_source_variant UNIQUE (media_kind, source_id, width)
);
CREATE INDEX IF NOT EXISTS idx_media_cache_lookup
    ON media_cache(media_kind, source_id, width);
"""


def required_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing secure environment variable: {name}")
    return value


def db_connection_params() -> dict[str, Any]:
    raw_url = os.environ.get("SPRING_DATASOURCE_URL") or os.environ.get("DATABASE_URL")
    if not raw_url:
        raise RuntimeError("Missing secure environment variable: SPRING_DATASOURCE_URL or DATABASE_URL")
    normalized = raw_url.removeprefix("jdbc:").removeprefix("postgresql://")
    host_port, database = normalized.split("/", 1)
    host, port = host_port.rsplit(":", 1)
    return {
        "host": host,
        "port": int(port),
        "dbname": database,
        "user": required_env("SPRING_DATASOURCE_USERNAME"),
        "password": required_env("SPRING_DATASOURCE_PASSWORD"),
        "sslmode": "require",
        "connect_timeout": 15,
    }


def collect_rows(connection: psycopg.Connection[Any], target: Target) -> list[tuple[int, str]]:
    query = f"SELECT id, {target.image_column} FROM {target.table} WHERE {target.image_column} LIKE %s ORDER BY id"
    with connection.cursor() as cursor:
        cursor.execute(query, (f"{DATA_URI_PREFIX}%",))
        return [(int(row[0]), str(row[1])) for row in cursor.fetchall()]


def decode_data_uri(data_uri: str) -> tuple[str, bytes]:
    header, encoded = data_uri.split(",", 1)
    media_type = header[5:].split(";", 1)[0].lower()
    if not media_type.startswith("image/"):
        raise ValueError(f"unsupported media type {media_type}")
    return media_type, base64.b64decode(encoded, validate=True)


def encode_variant(source: bytes, requested_width: int) -> tuple[str, int, int, bytes]:
    with Image.open(io.BytesIO(source)) as source_image:
        image = ImageOps.exif_transpose(source_image).convert("RGB")
        if image.width > requested_width:
            height = max(1, round(image.height * requested_width / image.width))
            image = image.resize((requested_width, height), Image.Resampling.LANCZOS)
        output = io.BytesIO()
        image.save(output, format="JPEG", quality=82, optimize=True, progressive=True)
        return "image/jpeg", image.width, image.height, output.getvalue()


def upsert_variant(
    connection: psycopg.Connection[Any],
    media_kind: str,
    source_id: int,
    width: int,
    height: int,
    content_type: str,
    content: bytes,
) -> None:
    with connection.cursor() as cursor:
        cursor.execute(
            """INSERT INTO media_cache
                (media_kind, source_id, width, height, content_type, content, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
                ON CONFLICT (media_kind, source_id, width)
                DO UPDATE SET height = EXCLUDED.height,
                              content_type = EXCLUDED.content_type,
                              content = EXCLUDED.content,
                              updated_at = CURRENT_TIMESTAMP""",
            (media_kind, source_id, width, height, content_type, content),
        )
    connection.commit()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--execute", action="store_true", help="perform the media-cache migration")
    args = parser.parse_args()

    with psycopg.connect(**db_connection_params()) as connection:
        if args.execute:
            with connection.cursor() as cursor:
                cursor.execute(MEDIA_CACHE_DDL)
            connection.commit()

        all_rows: list[tuple[Target, int, str]] = []
        for target in TARGETS:
            rows = collect_rows(connection, target)
            if rows:
                print(f"{target.table}: {len(rows)} legacy image value(s)")
                all_rows.extend((target, row_id, data_uri) for row_id, data_uri in rows)

        print(f"total_legacy_images={len(all_rows)}")
        if not args.execute:
            print("dry_run_complete=true")
            return 0

        migrated_variants = 0
        for target, row_id, data_uri in all_rows:
            _, source = decode_data_uri(data_uri)
            for width in VARIANT_WIDTHS:
                content_type, actual_width, actual_height, content = encode_variant(source, width)
                upsert_variant(
                    connection, target.media_kind, row_id, width,
                    actual_height, content_type, content,
                )
                migrated_variants += 1
            print(f"cached={target.media_kind}:{row_id}")

        print(f"migrated_images={len(all_rows)}")
        print(f"migrated_variants={migrated_variants}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"migration_failed={type(exc).__name__}: {exc}", file=sys.stderr)
        raise SystemExit(1)
