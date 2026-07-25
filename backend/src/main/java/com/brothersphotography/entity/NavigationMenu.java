package com.brothersphotography.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "navigation_menus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NavigationMenu extends BaseAuditableEntity {

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private String path;

    @Builder.Default
    @Column(name = "is_external")
    private Boolean external = false;

    @Builder.Default
    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean active = true;
}
