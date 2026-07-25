package com.brothersphotography.repository;

import com.brothersphotography.entity.GalleryPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryPhotoRepository extends JpaRepository<GalleryPhoto, Long> {
    List<GalleryPhoto> findByAlbumIdOrderByOrderIndexAsc(Long albumId);
}
