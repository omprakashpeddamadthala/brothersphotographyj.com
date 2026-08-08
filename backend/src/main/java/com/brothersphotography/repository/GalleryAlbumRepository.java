package com.brothersphotography.repository;

import com.brothersphotography.dto.PublicContentViews.AlbumDetailView;
import com.brothersphotography.dto.PublicContentViews.AlbumSummaryView;
import com.brothersphotography.entity.GalleryAlbum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GalleryAlbumRepository extends JpaRepository<GalleryAlbum, Long> {

    // Detail lookups fetch photos in a single query (avoids the 1 + N photo selects).
    @Query("SELECT DISTINCT a FROM GalleryAlbum a LEFT JOIN FETCH a.photos WHERE a.slug = :slug")
    Optional<GalleryAlbum> findBySlugWithPhotos(@Param("slug") String slug);

    Optional<GalleryAlbum> findBySlug(String slug);
    Page<GalleryAlbum> findByPublishedTrue(Pageable pageable);

    @Query("SELECT a.id AS id, a.title AS title, a.slug AS slug, a.couple AS couple, a.location AS location, a.eventDate AS eventDate, a.excerpt AS excerpt, a.category AS category, a.featured AS featured, a.published AS published FROM GalleryAlbum a WHERE a.published = true")
    Page<AlbumSummaryView> findPublishedMetadata(Pageable pageable);

    @Query("SELECT a.id AS id, a.title AS title, a.slug AS slug, a.couple AS couple, a.location AS location, a.eventDate AS eventDate, a.excerpt AS excerpt, a.category AS category FROM GalleryAlbum a WHERE a.slug = :slug AND a.published = true")
    Optional<AlbumDetailView> findPublishedMetadataBySlug(@Param("slug") String slug);
    List<GalleryAlbum> findByPublishedTrueAndFeaturedTrue();
}
