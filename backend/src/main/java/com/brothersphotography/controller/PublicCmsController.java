package com.brothersphotography.controller;

import com.brothersphotography.dto.AlbumSummaryDto;
import com.brothersphotography.dto.ApiResponse;
import com.brothersphotography.dto.BlogSummaryDto;
import com.brothersphotography.dto.PublicContentDtos.BlogDetailDto;
import com.brothersphotography.dto.PublicContentDtos.BlogImageDto;
import com.brothersphotography.dto.PublicContentDtos.GalleryAlbumDetailDto;
import com.brothersphotography.dto.PublicContentDtos.GalleryPhotoDto;
import com.brothersphotography.dto.PublicContentDtos.HeroSlideDto;
import com.brothersphotography.entity.Award;
import com.brothersphotography.entity.ContactEnquiry;
import com.brothersphotography.entity.FaqItem;
import com.brothersphotography.entity.NavigationMenu;
import com.brothersphotography.entity.PackageItem;
import com.brothersphotography.entity.SeoMetadata;
import com.brothersphotography.entity.ServiceItem;
import com.brothersphotography.entity.SocialLink;
import com.brothersphotography.entity.Testimonial;
import com.brothersphotography.exception.ResourceNotFoundException;
import com.brothersphotography.service.CmsService;
import com.brothersphotography.service.DataUriImageService;
import com.brothersphotography.service.MediaCacheService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Public CMS & Content", description = "Public endpoints for fetching website settings, hero slides, blogs, gallery albums, services, awards, testimonials, and submitting contact enquiries")
public class PublicCmsController {

    private final CmsService cmsService;
    private final DataUriImageService dataUriImageService;
    private final MediaCacheService mediaCacheService;

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
    public ResponseEntity<ApiResponse<List<HeroSlideDto>>> getHeroSlides() {
        List<HeroSlideDto> slides = cmsService.getActiveHeroSlideMetadata().stream()
                .map(slide -> new HeroSlideDto(
                        slide.getId(), publicMediaUrl("hero", slide.getId()), slide.getTitle(), slide.getSubtitle(),
                        slide.getCtaText(), slide.getCtaUrl(), slide.getOrderIndex(), slide.getActive()
                ))
                .toList();
        return ResponseEntity.ok(ApiResponse.success(slides));
    }

    @GetMapping("/public/homepage")
    @Operation(summary = "Aggregated homepage bundle for ultra-fast initial load")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHomepageData() {
        Map<String, Object> data = new HashMap<>();
        data.put("settings", cmsService.getAllSettingsMap());
        data.put("heroSlides", cmsService.getActiveHeroSlideMetadata().stream()
                .map(slide -> new HeroSlideDto(
                        slide.getId(), publicMediaUrl("hero", slide.getId()), slide.getTitle(), slide.getSubtitle(),
                        slide.getCtaText(), slide.getCtaUrl(), slide.getOrderIndex(), slide.getActive()
                ))
                .toList());
        data.put("awards", cmsService.getActiveAwards());
        data.put("testimonials", cmsService.getActiveTestimonials());
        data.put("services", cmsService.getActiveServices());
        data.put("packages", cmsService.getActivePackages());
        data.put("blogs", cmsService.getPublishedBlogMetadata(PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "createdAt")))
                .map(this::withPublicBlogCover));
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/public/blogs")
    @Operation(summary = "Get published blog posts with pagination and search")
    public ResponseEntity<ApiResponse<Page<BlogSummaryDto>>> getBlogs(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        Page<BlogSummaryDto> blogs = search != null && !search.isBlank()
                ? cmsService.searchPublishedBlogMetadata(search, pageable)
                : cmsService.getPublishedBlogMetadata(pageable);
        return ResponseEntity.ok(ApiResponse.success(blogs.map(this::withPublicBlogCover)));
    }

    @GetMapping("/public/blogs/{slug}")
    @Operation(summary = "Get single published blog post by slug with gallery images")
    public ResponseEntity<ApiResponse<BlogDetailDto>> getBlogBySlug(@PathVariable String slug) {
        var blog = cmsService.getPublishedBlogMetadataBySlug(slug);
        List<BlogImageDto> images = cmsService.getBlogImageMetadata(blog.getId()).stream()
                .map(image -> new BlogImageDto(
                        image.getId(), publicMediaUrl("blog-image", image.getId()), image.getCaption(),
                        image.getWidth(), image.getHeight()
                ))
                .toList();
        BlogDetailDto response = new BlogDetailDto(
                blog.getId(), blog.getTitle(), blog.getSlug(), blog.getExcerpt(), blog.getContent(),
                publicMediaUrl("blog-cover", blog.getId()), blog.getCategory(), blog.getPublishedAt(), images
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/public/gallery")
    @Operation(summary = "Get published gallery albums with pagination")
    public ResponseEntity<ApiResponse<Page<AlbumSummaryDto>>> getGallery(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success(
                cmsService.getPublishedAlbumMetadata(pageable).map(this::withPublicAlbumCover)
        ));
    }

    @GetMapping("/public/gallery/{slug}")
    @Operation(summary = "Get single gallery album by slug with photos")
    public ResponseEntity<ApiResponse<GalleryAlbumDetailDto>> getAlbumBySlug(@PathVariable String slug) {
        var album = cmsService.getPublishedAlbumMetadataBySlug(slug);
        List<GalleryPhotoDto> photos = cmsService.getGalleryPhotoMetadata(album.getId()).stream()
                .map(photo -> new GalleryPhotoDto(
                        photo.getId(), publicMediaUrl("album-photo", photo.getId()), photo.getAltText(),
                        photo.getWidth(), photo.getHeight()
                ))
                .toList();
        GalleryAlbumDetailDto response = new GalleryAlbumDetailDto(
                album.getId(), album.getTitle(), album.getSlug(), album.getCouple(), album.getLocation(),
                album.getEventDate(), album.getExcerpt(), publicMediaUrl("album-cover", album.getId()),
                album.getCategory(), photos
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/public/media/{kind}/{id}")
    @Operation(summary = "Serve legacy database image data as a cacheable, browser-native image resource")
    public ResponseEntity<?> getStoredMedia(
            @PathVariable String kind,
            @PathVariable Long id,
            @RequestParam(required = false) Integer width) {
        var cached = mediaCacheService.find(kind, id, width);
        if (cached.isPresent()) {
            MediaCacheService.CachedMedia image = cached.get();
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(image.contentType()))
                    .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic().immutable())
                    .body(image.content());
        }

        String dataUrl = switch (kind) {
            case "hero" -> cmsService.getHeroImageUrl(id);
            case "album-cover" -> cmsService.getAlbumCoverImageUrl(id);
            case "album-photo" -> cmsService.getAlbumPhotoImageUrl(id);
            case "blog-cover" -> cmsService.getBlogCoverImageUrl(id);
            case "blog-image" -> cmsService.getBlogImageUrl(id);
            default -> throw new ResourceNotFoundException("Media resource not found");
        };

        if (!dataUriImageService.isImageDataUrl(dataUrl)) {
            if (dataUrl == null || dataUrl.isBlank()) {
                throw new ResourceNotFoundException("Media resource not found");
            }
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(dataUrl))
                    .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic().immutable())
                    .build();
        }

        DataUriImageService.ProcessedImage image = dataUriImageService.forWeb(dataUrl, width);
        return ResponseEntity.ok()
                .contentType(image.mediaType())
                .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic().immutable())
                .body(image.body());
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

    private BlogSummaryDto withPublicBlogCover(BlogSummaryDto blog) {
        blog.setCoverImageUrl(publicMediaUrl("blog-cover", blog.getId()));
        return blog;
    }

    private AlbumSummaryDto withPublicAlbumCover(AlbumSummaryDto album) {
        album.setCoverImageUrl(publicMediaUrl("album-cover", album.getId()));
        return album;
    }

    private String publicMediaUrl(String kind, Long id) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/public/media/{kind}/{id}")
                .buildAndExpand(kind, id)
                .toUriString();
    }
}
