package com.brothersphotography.repository;

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
    List<GalleryAlbum> findByPublishedTrueAndFeaturedTrue();
}
