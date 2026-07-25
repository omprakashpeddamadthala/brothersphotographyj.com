package com.brothersphotography.repository;

import com.brothersphotography.entity.HeroSlide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HeroSlideRepository extends JpaRepository<HeroSlide, Long> {
    List<HeroSlide> findByActiveTrueOrderByOrderIndexAsc();
    List<HeroSlide> findAllByOrderByOrderIndexAsc();
}
