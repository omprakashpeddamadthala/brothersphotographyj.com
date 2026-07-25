package com.brothersphotography.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "packages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackageItem extends BaseAuditableEntity {

    @Column(nullable = false)
    private String title;

    private String subtitle;

    private String price;

    private String duration;

    @Column(columnDefinition = "TEXT")
    private String featuresJson;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(name = "cloudinary_public_id")
    private String cloudinaryPublicId;

    @Builder.Default
    @Column(name = "is_featured")
    private Boolean featured = false;

    @Builder.Default
    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean active = true;
}
