package com.brothersphotography.repository;

import com.brothersphotography.dto.PublicContentViews.GalleryPhotoView;
import com.brothersphotography.entity.GalleryPhoto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryPhotoRepository extends JpaRepository<GalleryPhoto, Long> {
    List<GalleryPhoto> findByAlbumIdOrderByOrderIndexAsc(Long albumId);

    @Query("SELECT p.id AS id, p.altText AS altText, p.width AS width, p.height AS height FROM GalleryPhoto p WHERE p.album.id = :albumId ORDER BY p.orderIndex ASC")
    List<GalleryPhotoView> findMetadataByAlbumIdOrderByOrderIndexAsc(@Param("albumId") Long albumId);
}
