package com.brothersphotography.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "testimonials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Testimonial extends BaseAuditableEntity {

    @Column(columnDefinition = "TEXT", nullable = false)
    private String quote;

    @Column(nullable = false)
    private String author;

    private String event;

    private String location;

    private Integer rating;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "cloudinary_public_id")
    private String cloudinaryPublicId;

    @Builder.Default
    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean active = true;
}
