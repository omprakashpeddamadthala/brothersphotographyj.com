package com.brothersphotography.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "website_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebsiteSetting extends BaseAuditableEntity {

    @Column(name = "setting_key", nullable = false, unique = true)
    private String key;

    @Column(name = "setting_value", columnDefinition = "TEXT")
    private String value;

    private String category;
}
