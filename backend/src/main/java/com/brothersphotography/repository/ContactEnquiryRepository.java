package com.brothersphotography.repository;

import com.brothersphotography.entity.ContactEnquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactEnquiryRepository extends JpaRepository<ContactEnquiry, Long> {
    Page<ContactEnquiry> findByStatus(ContactEnquiry.EnquiryStatus status, Pageable pageable);
    long countByStatus(ContactEnquiry.EnquiryStatus status);
}
