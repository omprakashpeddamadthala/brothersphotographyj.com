package com.brothersphotography.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MediaCacheService {

    private final JdbcTemplate jdbcTemplate;

    public Optional<CachedMedia> find(String kind, Long sourceId, Integer requestedWidth) {
        int width = requestedWidth == null ? 1600 : Math.max(320, Math.min(requestedWidth, 2400));
        return jdbcTemplate.query(
                "SELECT content_type, content, width FROM media_cache " +
                        "WHERE media_kind = ? AND source_id = ? " +
                        "ORDER BY (width < ?) ASC, ABS(width - ?) ASC LIMIT 1",
                ps -> {
                    ps.setString(1, kind);
                    ps.setLong(2, sourceId);
                    ps.setInt(3, width);
                    ps.setInt(4, width);
                },
                rs -> rs.next()
                        ? Optional.of(new CachedMedia(rs.getString("content_type"), rs.getBytes("content"), rs.getInt("width")))
                        : Optional.empty()
        );
    }

    public record CachedMedia(String contentType, byte[] content, int width) {
    }
}
