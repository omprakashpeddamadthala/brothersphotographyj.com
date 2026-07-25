package com.brothersphotography.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seo_metadata")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeoMetadata extends BaseAuditableEntity {

    @Column(name = "page_route", nullable = false, unique = true)
    private String pageRoute;

    private String metaTitle;

    @Column(columnDefinition = "TEXT")
    private String metaDescription;

    private String keywords;

    @Column(name = "og_image_url", columnDefinition = "TEXT")
    private String ogImageUrl;

    @Column(name = "canonical_url")
    private String canonicalUrl;
}
