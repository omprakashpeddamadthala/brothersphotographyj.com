package com.brothersphotography.dto;

import com.brothersphotography.dto.PublicContentViews.BlogSummaryView;
import com.brothersphotography.entity.Blog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Lightweight projection for blog list endpoints. Excludes the large
 * {@code content} HTML body and the lazy {@code images} collection so listing
 * blogs never ships full article bodies or triggers per-blog image queries.
 * The blog detail endpoint still returns the full entity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogSummaryDto {
    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String coverImageUrl;
    private String category;
    private String tags;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;

    public static BlogSummaryDto from(Blog b) {
        return BlogSummaryDto.builder()
                .id(b.getId())
                .title(b.getTitle())
                .slug(b.getSlug())
                .excerpt(b.getExcerpt())
                .coverImageUrl(b.getCoverImageUrl())
                .category(b.getCategory())
                .tags(b.getTags())
                .publishedAt(b.getPublishedAt())
                .createdAt(b.getCreatedAt())
                .build();
    }

    public static BlogSummaryDto from(BlogSummaryView b) {
        return BlogSummaryDto.builder()
                .id(b.getId())
                .title(b.getTitle())
                .slug(b.getSlug())
                .excerpt(b.getExcerpt())
                .category(b.getCategory())
                .tags(b.getTags())
                .publishedAt(b.getPublishedAt())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
