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
    }
}
