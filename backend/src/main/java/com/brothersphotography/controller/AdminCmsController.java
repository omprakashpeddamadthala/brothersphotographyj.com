package com.brothersphotography.controller;

import com.brothersphotography.dto.ApiResponse;
import com.brothersphotography.entity.Award;
import com.brothersphotography.entity.Blog;
import com.brothersphotography.entity.ContactEnquiry;
import com.brothersphotography.entity.FaqItem;
import com.brothersphotography.entity.GalleryAlbum;
import com.brothersphotography.entity.GalleryPhoto;
import com.brothersphotography.entity.HeroSlide;
import com.brothersphotography.entity.NavigationMenu;
import com.brothersphotography.entity.PackageItem;
import com.brothersphotography.entity.SeoMetadata;
import com.brothersphotography.entity.ServiceItem;
import com.brothersphotography.entity.SocialLink;
import com.brothersphotography.entity.Testimonial;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin CMS Management", description = "Protected CMS REST APIs for Site Settings, Hero Carousel, Blogs, Albums, Services, Packages, Testimonials, Awards, FAQs, Enquiries, SEO")
public class AdminCmsController {

    private final CmsService cmsService;

    // — Settings —
    @PutMapping("/settings")
    @Operation(summary = "Update website settings key-value map")
    public ResponseEntity<ApiResponse<Map<String, String>>> updateSettings(@RequestBody Map<String, String> settings) {
        cmsService.updateSettings(settings);
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllSettingsMap(), "Settings updated successfully"));
    }

    // — Social Links —
    @GetMapping("/social-links")
    public ResponseEntity<ApiResponse<List<SocialLink>>> getAllSocialLinks() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllSocialLinks()));
    }

    @PostMapping("/social-links")
    public ResponseEntity<ApiResponse<SocialLink>> saveSocialLink(@RequestBody SocialLink link) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.saveSocialLink(link)));
    }

    @DeleteMapping("/social-links/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSocialLink(@PathVariable Long id) {
        cmsService.deleteSocialLink(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted successfully"));
    }

    // — Navigation Menu —
    @GetMapping("/navigation-menu")
    public ResponseEntity<ApiResponse<List<NavigationMenu>>> getAllNavigation() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllNavigationMenus()));
    }

    @PostMapping("/navigation-menu")
    public ResponseEntity<ApiResponse<NavigationMenu>> saveNavigation(@RequestBody NavigationMenu menu) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.saveNavigationMenu(menu)));
    }

    @DeleteMapping("/navigation-menu/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNavigation(@PathVariable Long id) {
        cmsService.deleteNavigationMenu(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted successfully"));
    }

    // — Hero Slides —
    @GetMapping("/hero-slides")
    public ResponseEntity<ApiResponse<List<HeroSlide>>> getAllHeroSlides() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllHeroSlides()));
    }

    @PostMapping("/hero-slides")
    public ResponseEntity<ApiResponse<HeroSlide>> saveHeroSlide(@RequestBody HeroSlide slide) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.saveHeroSlide(slide)));
    }

    @DeleteMapping("/hero-slides/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHeroSlide(@PathVariable Long id) {
        cmsService.deleteHeroSlide(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted successfully"));
    }

    // — Blogs —
    @GetMapping("/blogs")
    public ResponseEntity<ApiResponse<Page<Blog>>> getAllBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllBlogs(pageable)));
    }

    @PostMapping("/blogs")
    public ResponseEntity<ApiResponse<Blog>> saveBlog(@Valid @RequestBody Blog blog) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.saveBlog(blog)));
    }

    @DeleteMapping("/blogs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(@PathVariable Long id) {
        cmsService.deleteBlog(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Blog deleted successfully"));
    }

    // — Gallery Albums & Photos —
    @GetMapping("/gallery")
    public ResponseEntity<ApiResponse<Page<GalleryAlbum>>> getAllAlbums(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllAlbums(pageable)));
    }

    @PostMapping("/gallery")
    public ResponseEntity<ApiResponse<GalleryAlbum>> saveAlbum(@Valid @RequestBody GalleryAlbum album) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.saveAlbum(album)));
    }

    @DeleteMapping("/gallery/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAlbum(@PathVariable Long id) {
        cmsService.deleteAlbum(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Album deleted successfully"));
    }

    @PostMapping("/gallery/{albumId}/photos")
    public ResponseEntity<ApiResponse<GalleryPhoto>> addPhotoToAlbum(@PathVariable Long albumId, @RequestBody GalleryPhoto photo) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.addPhotoToAlbum(albumId, photo)));
    }

    @DeleteMapping("/gallery/photos/{photoId}")
    public ResponseEntity<ApiResponse<Void>> deletePhoto(@PathVariable Long photoId) {
        cmsService.deletePhoto(photoId);
        return ResponseEntity.ok(ApiResponse.success(null, "Photo deleted successfully"));
    }

    // — Testimonials & Awards —
    @GetMapping("/testimonials")
    public ResponseEntity<ApiResponse<List<Testimonial>>> getAllTestimonials() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllTestimonials()));
    }

    @PostMapping("/testimonials")
    public ResponseEntity<ApiResponse<Testimonial>> saveTestimonial(@RequestBody Testimonial testimonial) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.saveTestimonial(testimonial)));
    }

    @DeleteMapping("/testimonials/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTestimonial(@PathVariable Long id) {
        cmsService.deleteTestimonial(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted successfully"));
    }

    @GetMapping("/awards")
    public ResponseEntity<ApiResponse<List<Award>>> getAllAwards() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllAwards()));
    }

    @PostMapping("/awards")
    public ResponseEntity<ApiResponse<Award>> saveAward(@RequestBody Award award) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.saveAward(award)));
    }

    @DeleteMapping("/awards/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAward(@PathVariable Long id) {
        cmsService.deleteAward(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted successfully"));
    }

    // — Services & Packages —
    @GetMapping("/services")
    public ResponseEntity<ApiResponse<List<ServiceItem>>> getAllServices() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllServices()));
    }

    @PostMapping("/services")
    public ResponseEntity<ApiResponse<ServiceItem>> saveService(@RequestBody ServiceItem item) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.saveService(item)));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id) {
        cmsService.deleteService(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted successfully"));
    }

    @GetMapping("/packages")
    public ResponseEntity<ApiResponse<List<PackageItem>>> getAllPackages() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllPackages()));
    }

    @PostMapping("/packages")
    public ResponseEntity<ApiResponse<PackageItem>> savePackage(@RequestBody PackageItem item) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.savePackage(item)));
    }

    @DeleteMapping("/packages/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePackage(@PathVariable Long id) {
        cmsService.deletePackage(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted successfully"));
    }

    // — FAQs —
    @GetMapping("/faqs")
    public ResponseEntity<ApiResponse<List<FaqItem>>> getAllFaqs() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllFaqs()));
    }

    @PostMapping("/faqs")
    public ResponseEntity<ApiResponse<FaqItem>> saveFaq(@RequestBody FaqItem item) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.saveFaq(item)));
    }

    @DeleteMapping("/faqs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFaq(@PathVariable Long id) {
        cmsService.deleteFaq(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted successfully"));
    }

    // — Contact Enquiries —
    @GetMapping("/enquiries")
    public ResponseEntity<ApiResponse<Page<ContactEnquiry>>> getEnquiries(
            @RequestParam(required = false) ContactEnquiry.EnquiryStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success(cmsService.getEnquiries(status, pageable)));
    }

    @PutMapping("/enquiries/{id}/status")
    public ResponseEntity<ApiResponse<ContactEnquiry>> updateEnquiryStatus(
            @PathVariable Long id,
            @RequestParam ContactEnquiry.EnquiryStatus status) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.updateEnquiryStatus(id, status)));
    }

    // — SEO Metadata —
    @GetMapping("/seo")
    public ResponseEntity<ApiResponse<List<SeoMetadata>>> getAllSeo() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllSeoMetadata()));
    }

    @PostMapping("/seo")
    public ResponseEntity<ApiResponse<SeoMetadata>> saveSeo(@RequestBody SeoMetadata seo) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.saveSeoMetadata(seo)));
    }
}
