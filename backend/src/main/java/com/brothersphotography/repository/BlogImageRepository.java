package com.brothersphotography.repository;

import com.brothersphotography.entity.BlogImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogImageRepository extends JpaRepository<BlogImage, Long> {
    List<BlogImage> findByBlogIdOrderByOrderIndexAsc(Long blogId);
}
