package com.brothersphotography.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        cacheManager.setCacheNames(Arrays.asList(
                "siteSettings",
                "socialLinks",
                "navigationMenus",
                "heroSlides",
                "heroSlideMetadata",
                "homepageData",
                "blogs",
                "blogDetail",
                "galleryAlbums",
                "galleryDetail",
                "testimonials",
                "awards",
                "services",
                "packages",
                "faqs",
                "seoMetadata"
        ));
        return cacheManager;
    }
}
