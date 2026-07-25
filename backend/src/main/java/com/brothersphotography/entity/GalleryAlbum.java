package com.brothersphotography.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "gallery_albums")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GalleryAlbum extends BaseAuditableEntity {

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    private String couple;

    private String location;

    private String eventDate;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(name = "cover_image_url", columnDefinition = "TEXT")
    private String coverImageUrl;

    @Column(name = "cloudinary_public_id")
    private String cloudinaryPublicId;

    private String category;

    @Builder.Default
    @Column(name = "is_featured")
    private Boolean featured = false;

    @Builder.Default
    @Column(name = "is_published")
    private Boolean published = true;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private List<GalleryPhoto> photos = new ArrayList<>();
}
