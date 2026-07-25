package com.brothersphotography.repository;

import com.brothersphotography.entity.FaqItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FaqItemRepository extends JpaRepository<FaqItem, Long> {
    List<FaqItem> findByActiveTrueOrderByOrderIndexAsc();
    List<FaqItem> findAllByOrderByOrderIndexAsc();
}
