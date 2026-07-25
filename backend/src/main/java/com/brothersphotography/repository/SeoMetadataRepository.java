package com.brothersphotography.repository;

import com.brothersphotography.entity.SeoMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeoMetadataRepository extends JpaRepository<SeoMetadata, Long> {
    Optional<SeoMetadata> findByPageRoute(String pageRoute);
}
