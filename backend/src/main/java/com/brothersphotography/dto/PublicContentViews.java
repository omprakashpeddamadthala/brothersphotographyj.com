package com.brothersphotography.dto;

import java.time.LocalDateTime;

/**
 * Interface projections for public content reads. They deliberately omit image
 * data URL columns so multi-megabyte legacy image values are not loaded while
 * producing API metadata responses.
 */
public final class PublicContentViews {

    private PublicContentViews() {
    }

    public interface HeroSlideView {
        Long getId();
        String getTitle();
        String getSubtitle();
        String getCtaText();
        String getCtaUrl();
        Integer getOrderIndex();
        Boolean getActive();
    }

    public interface AlbumSummaryView {
        Long getId();
        String getTitle();
        String getSlug();
        String getCouple();
        String getLocation();
        String getEventDate();
        String getExcerpt();
        String getCategory();
        Boolean getFeatured();
        Boolean getPublished();
    }

    public interface AlbumDetailView {
        Long getId();
        String getTitle();
        String getSlug();
        String getCouple();
        String getLocation();
        String getEventDate();
        String getExcerpt();
        String getCategory();
    }

    public interface GalleryPhotoView {
        Long getId();
        String getAltText();
        Integer getWidth();
        Integer getHeight();
    }

    public interface BlogSummaryView {
        Long getId();
        String getTitle();
        String getSlug();
        String getExcerpt();
        String getCategory();
        String getTags();
        LocalDateTime getPublishedAt();
        LocalDateTime getCreatedAt();
    }

    public interface BlogDetailView {
        Long getId();
        String getTitle();
        String getSlug();
        String getExcerpt();
        String getContent();
        String getCategory();
        LocalDateTime getPublishedAt();
    }

    public interface BlogImageView {
        Long getId();
        String getCaption();
        Integer getWidth();
        Integer getHeight();
    }
}
