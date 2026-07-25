package com.brothersphotography.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contact_enquiries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactEnquiry extends BaseAuditableEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String phone;

    private String eventDate;

    private String eventType;

    private String numberOfEvents;

    private String location;

    private String heardAboutUs;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EnquiryStatus status = EnquiryStatus.NEW;

    public enum EnquiryStatus {
        NEW,
        READ,
        REPLIED,
        ARCHIVED
    }
}
