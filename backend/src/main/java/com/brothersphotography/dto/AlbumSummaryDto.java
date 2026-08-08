package com.brothersphotography.dto;

import com.brothersphotography.dto.PublicContentViews.AlbumSummaryView;
import com.brothersphotography.entity.GalleryAlbum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight projection for gallery list endpoints. Excludes the {@code photos}
 * collection so listing albums never triggers a per-album photo query (N+1) or
 * ships large nested payloads. Album detail endpoints still return full photos.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlbumSummaryDto {
    private Long id;
    private String title;
    private String slug;
    private String couple;
    private String location;
    private String eventDate;
    private String excerpt;
    private String coverImageUrl;
    private String category;
    private Boolean featured;
    private Boolean published;

    public static AlbumSummaryDto from(GalleryAlbum a) {
        return AlbumSummaryDto.builder()
                .id(a.getId())
                .title(a.getTitle())
                .slug(a.getSlug())
                .couple(a.getCouple())
                .location(a.getLocation())
                .eventDate(a.getEventDate())
                .excerpt(a.getExcerpt())
                .coverImageUrl(a.getCoverImageUrl())
                .category(a.getCategory())
                .featured(a.getFeatured())
                .published(a.getPublished())
                .build();
    }

    public static AlbumSummaryDto from(AlbumSummaryView a) {
        return AlbumSummaryDto.builder()
                .id(a.getId())
                .title(a.getTitle())
                .slug(a.getSlug())
                .couple(a.getCouple())
                .location(a.getLocation())
                .eventDate(a.getEventDate())
                .excerpt(a.getExcerpt())
                .category(a.getCategory())
                .featured(a.getFeatured())
                .published(a.getPublished())
                .build();
    }
}
