package com.brothersphotography.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceItem extends BaseAuditableEntity {

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String fullDescription;

    private String priceStartingFrom;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(name = "cloudinary_public_id")
    private String cloudinaryPublicId;

    @Builder.Default
    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean active = true;
}
