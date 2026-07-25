package com.brothersphotography.repository;

import com.brothersphotography.entity.WebsiteSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebsiteSettingRepository extends JpaRepository<WebsiteSetting, Long> {
    Optional<WebsiteSetting> findByKey(String key);
    List<WebsiteSetting> findByCategory(String category);
}
