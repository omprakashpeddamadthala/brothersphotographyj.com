package com.brothersphotography.controller;

import com.brothersphotography.dto.ApiResponse;
import com.brothersphotography.entity.*;
import com.brothersphotography.service.CmsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Public CMS & Content", description = "Public endpoints for fetching website settings, hero slides, blogs, gallery albums, services, awards, testimonials, and submitting contact enquiries")
public class PublicCmsController {

    private final CmsService cmsService;

    @GetMapping("/public/settings")
    @Operation(summary = "Get all active website settings (Name, Logo, Phone, Address, Footer, SEO defaults)")
    public ResponseEntity<ApiResponse<Map<String, String>>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllSettingsMap()));
    }

    @GetMapping("/public/social-links")
    @Operation(summary = "Get active social media links")
    public ResponseEntity<ApiResponse<List<SocialLink>>> getSocialLinks() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getActiveSocialLinks()));
    }

    @GetMapping("/public/navigation-menu")
    @Operation(summary = "Get active navigation menu items")
    public ResponseEntity<ApiResponse<List<NavigationMenu>>> getNavigationMenu() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getActiveNavigationMenus()));
    }

    @GetMapping("/public/hero-slides")
    @Operation(summary = "Get active hero slide carousel images and copy")
    public ResponseEntity<ApiResponse<List<HeroSlide>>> getHeroSlides() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getActiveHeroSlides()));
    }

    @GetMapping("/public/homepage")
    @Operation(summary = "Aggregated homepage bundle for ultra-fast initial load")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHomepageData() {
        Map<String, Object> data = new HashMap<>();
        data.put("settings", cmsService.getAllSettingsMap());
        data.put("heroSlides", cmsService.getActiveHeroSlides());
        data.put("awards", cmsService.getActiveAwards());
        data.put("testimonials", cmsService.getActiveTestimonials());
        data.put("services", cmsService.getActiveServices());
        data.put("packages", cmsService.getActivePackages());
        data.put("blogs", cmsService.getPublishedBlogs(PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/public/blogs")
    @Operation(summary = "Get published blog posts with pagination and search")
    public ResponseEntity<ApiResponse<Page<Blog>>> getBlogs(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(ApiResponse.success(cmsService.searchBlogs(search, pageable)));
        }
        return ResponseEntity.ok(ApiResponse.success(cmsService.getPublishedBlogs(pageable)));
    }

    @GetMapping("/public/blogs/{slug}")
    @Operation(summary = "Get single published blog post by slug with gallery images")
    public ResponseEntity<ApiResponse<Blog>> getBlogBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getBlogBySlug(slug)));
    }

    @GetMapping("/public/gallery")
    @Operation(summary = "Get published gallery albums with pagination")
    public ResponseEntity<ApiResponse<Page<GalleryAlbum>>> getGallery(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success(cmsService.getPublishedAlbums(pageable)));
    }

    @GetMapping("/public/gallery/{slug}")
    @Operation(summary = "Get single gallery album by slug with photos")
    public ResponseEntity<ApiResponse<GalleryAlbum>> getAlbumBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAlbumBySlug(slug)));
    }

    @GetMapping("/public/testimonials")
    @Operation(summary = "Get active client testimonials")
    public ResponseEntity<ApiResponse<List<Testimonial>>> getTestimonials() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getActiveTestimonials()));
    }

    @GetMapping("/public/awards")
    @Operation(summary = "Get active awards and features")
    public ResponseEntity<ApiResponse<List<Award>>> getAwards() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getActiveAwards()));
    }

    @GetMapping("/public/services")
    @Operation(summary = "Get active photography services")
    public ResponseEntity<ApiResponse<List<ServiceItem>>> getServices() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getActiveServices()));
    }

    @GetMapping("/public/packages")
    @Operation(summary = "Get active packages and pricing tiers")
    public ResponseEntity<ApiResponse<List<PackageItem>>> getPackages() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getActivePackages()));
    }

    @GetMapping("/public/faqs")
    @Operation(summary = "Get active FAQs")
    public ResponseEntity<ApiResponse<List<FaqItem>>> getFaqs() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getActiveFaqs()));
    }

    @GetMapping("/public/seo")
    @Operation(summary = "Get page-level SEO metadata by page route")
    public ResponseEntity<ApiResponse<SeoMetadata>> getSeoMetadata(@RequestParam String route) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getSeoByRoute(route)));
    }

    @PostMapping("/enquiries")
    @Operation(summary = "Submit a client booking enquiry form")
    public ResponseEntity<ApiResponse<ContactEnquiry>> submitEnquiry(@Valid @RequestBody ContactEnquiry enquiry) {
        ContactEnquiry saved = cmsService.submitEnquiry(enquiry);
        return ResponseEntity.ok(ApiResponse.success(saved, "Enquiry submitted successfully"));
    }
}
