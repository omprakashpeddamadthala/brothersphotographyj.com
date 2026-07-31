package com.brothersphotography.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("Checking & converting image URL columns in PostgreSQL to TEXT type...");
        String[] alterQueries = {
                "ALTER TABLE IF EXISTS hero_slides ALTER COLUMN image_url TYPE TEXT;",
                "ALTER TABLE IF EXISTS gallery_photos ALTER COLUMN image_url TYPE TEXT;",
                "ALTER TABLE IF EXISTS blog_images ALTER COLUMN image_url TYPE TEXT;",
                "ALTER TABLE IF EXISTS blogs ALTER COLUMN cover_image_url TYPE TEXT;",
                "ALTER TABLE IF EXISTS gallery_albums ALTER COLUMN cover_image_url TYPE TEXT;",
                "ALTER TABLE IF EXISTS seo_metadata ALTER COLUMN og_image_url TYPE TEXT;",
                "ALTER TABLE IF EXISTS users ALTER COLUMN avatar_url TYPE TEXT;",
                "ALTER TABLE IF EXISTS website_settings ALTER COLUMN setting_value TYPE TEXT;"
        };

        for (String query : alterQueries) {
            try {
                jdbcTemplate.execute(query);
            } catch (Exception e) {
                log.warn("Schema column alter warning (might already be TEXT): {}", e.getMessage());
            }
        }
        log.info("PostgreSQL schema column conversion to TEXT completed successfully.");

        // PostgreSQL does not auto-create indexes on foreign keys or on the
        // columns we filter/sort by most often. Without these, every gallery/blog
        // read does a sequential scan, which dominates latency as content grows.
        log.info("Ensuring performance indexes exist...");
        String[] indexQueries = {
                // Foreign keys used by lazy collection / detail loads
                "CREATE INDEX IF NOT EXISTS idx_gallery_photos_album_id ON gallery_photos(album_id);",
                "CREATE INDEX IF NOT EXISTS idx_blog_images_blog_id ON blog_images(blog_id);",
                // Filter + sort columns for public listings
                "CREATE INDEX IF NOT EXISTS idx_gallery_albums_published_created ON gallery_albums(is_published, created_at DESC);",
                "CREATE INDEX IF NOT EXISTS idx_blogs_status_published ON blogs(status, published_at DESC);",
                "CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);",
                "CREATE INDEX IF NOT EXISTS idx_contact_enquiries_status_created ON contact_enquiries(status, created_at DESC);",
                // Slug lookups (album/blog detail pages)
                "CREATE INDEX IF NOT EXISTS idx_gallery_albums_slug ON gallery_albums(slug);",
                "CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);",
                // active + order_index driven lists (hero, testimonials, awards, services, packages, faqs, social, nav)
                "CREATE INDEX IF NOT EXISTS idx_hero_slides_active_order ON hero_slides(is_active, order_index);",
                "CREATE INDEX IF NOT EXISTS idx_testimonials_active_order ON testimonials(is_active, order_index);",
                "CREATE INDEX IF NOT EXISTS idx_awards_active_order ON awards(is_active, order_index);",
                "CREATE INDEX IF NOT EXISTS idx_service_items_active_order ON service_items(is_active, order_index);",
                "CREATE INDEX IF NOT EXISTS idx_package_items_active_order ON package_items(is_active, order_index);",
                "CREATE INDEX IF NOT EXISTS idx_faq_items_active_order ON faq_items(is_active, order_index);"
        };

        for (String query : indexQueries) {
            try {
                jdbcTemplate.execute(query);
            } catch (Exception e) {
                log.warn("Index creation warning (table/column may not exist yet): {}", e.getMessage());
            }
        }
        log.info("Performance index verification completed.");
    }
}
