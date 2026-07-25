package com.brothersphotography.repository;

import com.brothersphotography.entity.Award;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AwardRepository extends JpaRepository<Award, Long> {
    List<Award> findByActiveTrueOrderByOrderIndexAsc();
    List<Award> findAllByOrderByOrderIndexAsc();
}
