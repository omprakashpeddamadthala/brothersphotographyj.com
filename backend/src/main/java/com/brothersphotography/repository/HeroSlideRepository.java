package com.brothersphotography.repository;

import com.brothersphotography.dto.PublicContentViews.HeroSlideView;
import com.brothersphotography.entity.HeroSlide;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HeroSlideRepository extends JpaRepository<HeroSlide, Long> {
    List<HeroSlide> findByActiveTrueOrderByOrderIndexAsc();

    @Query("SELECT h.id AS id, h.title AS title, h.subtitle AS subtitle, h.ctaText AS ctaText, h.ctaUrl AS ctaUrl, h.orderIndex AS orderIndex, h.active AS active FROM HeroSlide h WHERE h.active = true ORDER BY h.orderIndex ASC")
    List<HeroSlideView> findActiveMetadataByOrderIndexAsc();
    List<HeroSlide> findAllByOrderByOrderIndexAsc();
}
