package com.brothersphotography.repository;

import com.brothersphotography.dto.PublicContentViews.BlogImageView;
import com.brothersphotography.entity.BlogImage;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogImageRepository extends JpaRepository<BlogImage, Long> {
    List<BlogImage> findByBlogIdOrderByOrderIndexAsc(Long blogId);

    @Query("SELECT i.id AS id, i.caption AS caption, i.width AS width, i.height AS height FROM BlogImage i WHERE i.blog.id = :blogId ORDER BY i.orderIndex ASC")
    List<BlogImageView> findMetadataByBlogIdOrderByOrderIndexAsc(@Param("blogId") Long blogId);
}
