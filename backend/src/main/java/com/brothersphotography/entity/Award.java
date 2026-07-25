package com.brothersphotography.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "awards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Award extends BaseAuditableEntity {

    @Column(nullable = false)
    private String title;

    private String organisation;

    private Integer year;

    @Column(name = "badge_url")
    private String badgeUrl;

    @Column(name = "cloudinary_public_id")
    private String cloudinaryPublicId;

    @Builder.Default
    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean active = true;
}
