package com.brothersphotography.repository;

import com.brothersphotography.entity.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
    List<SocialLink> findByActiveTrueOrderByOrderIndexAsc();
    List<SocialLink> findAllByOrderByOrderIndexAsc();
}
