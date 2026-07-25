package com.brothersphotography.repository;

import com.brothersphotography.entity.PackageItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageItemRepository extends JpaRepository<PackageItem, Long> {
    List<PackageItem> findByActiveTrueOrderByOrderIndexAsc();
    List<PackageItem> findAllByOrderByOrderIndexAsc();
}
