package com.brothersphotography.service;

import com.brothersphotography.dto.AlbumSummaryDto;
import com.brothersphotography.dto.BlogSummaryDto;
import com.brothersphotography.dto.PublicContentViews.AlbumDetailView;
import com.brothersphotography.dto.PublicContentViews.BlogDetailView;
import com.brothersphotography.dto.PublicContentViews.BlogImageView;
import com.brothersphotography.dto.PublicContentViews.GalleryPhotoView;
import com.brothersphotography.dto.PublicContentViews.HeroSlideView;
import com.brothersphotography.entity.*;
import com.brothersphotography.exception.ResourceNotFoundException;
import com.brothersphotography.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CmsService {

    private final WebsiteSettingRepository settingRepository;
    private final SocialLinkRepository socialLinkRepository;
    private final NavigationMenuRepository navigationMenuRepository;
    private final HeroSlideRepository heroSlideRepository;
    private final GalleryAlbumRepository albumRepository;
    private final GalleryPhotoRepository photoRepository;
    private final BlogRepository blogRepository;
    private final BlogImageRepository blogImageRepository;
    private final TestimonialRepository testimonialRepository;
    private final AwardRepository awardRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final PackageItemRepository packageItemRepository;
    private final FaqItemRepository faqItemRepository;
    private final ContactEnquiryRepository enquiryRepository;
    private final SeoMetadataRepository seoMetadataRepository;

    // ——— Website Settings ———

    @Cacheable(value = "siteSettings")
    public Map<String, String> getAllSettingsMap() {
        log.info("Fetching all website settings from DB (cache miss)");
        List<WebsiteSetting> settings = settingRepository.findAll();
        Map<String, String> map = new HashMap<>();
        for (WebsiteSetting setting : settings) {
            map.put(setting.getKey(), setting.getValue());
        }
        return map;
    }

    @Transactional
    @CacheEvict(value = {"siteSettings", "homepageData"}, allEntries = true)
    public void updateSettings(Map<String, String> settingsMap) {
        log.info("Updating website settings and evicting cache");
        for (Map.Entry<String, String> entry : settingsMap.entrySet()) {
            WebsiteSetting setting = settingRepository.findByKey(entry.getKey())
                    .orElseGet(() -> WebsiteSetting.builder().key(entry.getKey()).build());
            setting.setValue(entry.getValue());
            settingRepository.save(setting);
        }
    }

    // ——— Social Links ———

    @Cacheable(value = "socialLinks")
    public List<SocialLink> getActiveSocialLinks() {
        return socialLinkRepository.findByActiveTrueOrderByOrderIndexAsc();
    }

    public List<SocialLink> getAllSocialLinks() {
        return socialLinkRepository.findAllByOrderByOrderIndexAsc();
    }

    @Transactional
    @CacheEvict(value = {"socialLinks", "homepageData"}, allEntries = true)
    public SocialLink saveSocialLink(SocialLink socialLink) {
        return socialLinkRepository.save(socialLink);
    }

    @Transactional
    @CacheEvict(value = {"socialLinks", "homepageData"}, allEntries = true)
    public void deleteSocialLink(Long id) {
        socialLinkRepository.deleteById(id);
    }

    // ——— Navigation Menu ———

    @Cacheable(value = "navigationMenus")
    public List<NavigationMenu> getActiveNavigationMenus() {
        return navigationMenuRepository.findByActiveTrueOrderByOrderIndexAsc();
    }

    public List<NavigationMenu> getAllNavigationMenus() {
        return navigationMenuRepository.findAllByOrderByOrderIndexAsc();
    }

    @Transactional
    @CacheEvict(value = {"navigationMenus", "homepageData"}, allEntries = true)
    public NavigationMenu saveNavigationMenu(NavigationMenu menu) {
        return navigationMenuRepository.save(menu);
    }

    @Transactional
    @CacheEvict(value = {"navigationMenus", "homepageData"}, allEntries = true)
    public void deleteNavigationMenu(Long id) {
        navigationMenuRepository.deleteById(id);
    }

    // ——— Hero Slides ———

    @Cacheable(value = "heroSlides")
    public List<HeroSlide> getActiveHeroSlides() {
        return heroSlideRepository.findByActiveTrueOrderByOrderIndexAsc();
    }

    @Cacheable(value = "heroSlideMetadata")
    @Transactional(readOnly = true)
    public List<HeroSlideView> getActiveHeroSlideMetadata() {
        return heroSlideRepository.findActiveMetadataByOrderIndexAsc();
    }

    public List<HeroSlide> getAllHeroSlides() {
        return heroSlideRepository.findAllByOrderByOrderIndexAsc();
    }

    @Transactional(readOnly = true)
    public String getHeroImageUrl(Long id) {
        return heroSlideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hero slide not found with id: " + id))
                .getImageUrl();
    }

    @Transactional
    @CacheEvict(value = {"heroSlides", "heroSlideMetadata", "homepageData"}, allEntries = true)
    public HeroSlide saveHeroSlide(HeroSlide slide) {
        return heroSlideRepository.save(slide);
    }

    @Transactional
    @CacheEvict(value = {"heroSlides", "heroSlideMetadata", "homepageData"}, allEntries = true)
    public void deleteHeroSlide(Long id) {
        heroSlideRepository.deleteById(id);
    }

    // ——— Gallery & Albums ———

    @Transactional(readOnly = true)
    public Page<AlbumSummaryDto> getPublishedAlbums(Pageable pageable) {
        return albumRepository.findByPublishedTrue(pageable).map(AlbumSummaryDto::from);
    }

    @Transactional(readOnly = true)
    public Page<AlbumSummaryDto> getPublishedAlbumMetadata(Pageable pageable) {
        return albumRepository.findPublishedMetadata(pageable).map(AlbumSummaryDto::from);
    }

    @Transactional(readOnly = true)
    public AlbumDetailView getPublishedAlbumMetadataBySlug(String slug) {
        return albumRepository.findPublishedMetadataBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with slug: " + slug));
    }

    @Transactional(readOnly = true)
    public List<GalleryPhotoView> getGalleryPhotoMetadata(Long albumId) {
        return photoRepository.findMetadataByAlbumIdOrderByOrderIndexAsc(albumId);
    }

    @Cacheable(value = "galleryDetail", key = "#slug")
    @Transactional(readOnly = true)
    public GalleryAlbum getAlbumBySlug(String slug) {
        return albumRepository.findBySlugWithPhotos(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with slug: " + slug));
    }

    public Page<GalleryAlbum> getAllAlbums(Pageable pageable) {
        return albumRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public String getAlbumCoverImageUrl(Long id) {
        return albumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id: " + id))
                .getCoverImageUrl();
    }

    @Transactional(readOnly = true)
    public String getAlbumPhotoImageUrl(Long id) {
        return photoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Album photo not found with id: " + id))
                .getImageUrl();
    }

    @Transactional
    @CacheEvict(value = {"galleryAlbums", "galleryDetail", "homepageData"}, allEntries = true)
    public GalleryAlbum saveAlbum(GalleryAlbum album) {
        if (album.getSlug() == null || album.getSlug().isBlank()) {
            album.setSlug(album.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        return albumRepository.save(album);
    }

    @Transactional
    @CacheEvict(value = {"galleryAlbums", "galleryDetail", "homepageData"}, allEntries = true)
    public void deleteAlbum(Long id) {
        albumRepository.deleteById(id);
    }

    @Transactional
    @CacheEvict(value = {"galleryAlbums", "galleryDetail"}, allEntries = true)
    public GalleryPhoto addPhotoToAlbum(Long albumId, GalleryPhoto photo) {
        GalleryAlbum album = albumRepository.findById(albumId)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id: " + albumId));
        photo.setAlbum(album);
        return photoRepository.save(photo);
    }

    @Transactional
    @CacheEvict(value = {"galleryAlbums", "galleryDetail"}, allEntries = true)
    public void deletePhoto(Long photoId) {
        photoRepository.deleteById(photoId);
    }

    // ——— Blogs ———

    @Transactional(readOnly = true)
    public Page<BlogSummaryDto> getPublishedBlogs(Pageable pageable) {
        return blogRepository.findByStatus(Blog.Status.PUBLISHED, pageable).map(BlogSummaryDto::from);
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryDto> getPublishedBlogMetadata(Pageable pageable) {
        return blogRepository.findPublishedMetadata(pageable).map(BlogSummaryDto::from);
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryDto> searchPublishedBlogMetadata(String query, Pageable pageable) {
        return blogRepository.searchPublishedMetadata(query, pageable).map(BlogSummaryDto::from);
    }

    @Transactional(readOnly = true)
    public BlogDetailView getPublishedBlogMetadataBySlug(String slug) {
        return blogRepository.findPublishedMetadataBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with slug: " + slug));
    }

    @Transactional(readOnly = true)
    public List<BlogImageView> getBlogImageMetadata(Long blogId) {
        return blogImageRepository.findMetadataByBlogIdOrderByOrderIndexAsc(blogId);
    }

    @Cacheable(value = "blogDetail", key = "#slug")
    @Transactional(readOnly = true)
    public Blog getBlogBySlug(String slug) {
        return blogRepository.findBySlugWithImages(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with slug: " + slug));
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryDto> searchBlogs(String query, Pageable pageable) {
        return blogRepository.searchPublishedBlogs(query, pageable).map(BlogSummaryDto::from);
    }

    public Page<Blog> getAllBlogs(Pageable pageable) {
        return blogRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public String getBlogCoverImageUrl(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id))
                .getCoverImageUrl();
    }

    @Transactional(readOnly = true)
    public String getBlogImageUrl(Long id) {
        return blogImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog image not found with id: " + id))
                .getImageUrl();
    }

    @Transactional
    @CacheEvict(value = {"blogs", "blogDetail", "homepageData"}, allEntries = true)
    public Blog saveBlog(Blog blog) {
        if (blog.getSlug() == null || blog.getSlug().isBlank()) {
            blog.setSlug(blog.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        if (blog.getStatus() == Blog.Status.PUBLISHED && blog.getPublishedAt() == null) {
            blog.setPublishedAt(LocalDateTime.now());
        }
        return blogRepository.save(blog);
    }

    @Transactional
    @CacheEvict(value = {"blogs", "blogDetail", "homepageData"}, allEntries = true)
    public void deleteBlog(Long id) {
        blogRepository.deleteById(id);
    }

    // ——— Testimonials & Awards ———

    @Cacheable(value = "testimonials")
    public List<Testimonial> getActiveTestimonials() {
        return testimonialRepository.findByActiveTrueOrderByOrderIndexAsc();
    }

    public List<Testimonial> getAllTestimonials() {
        return testimonialRepository.findAllByOrderByOrderIndexAsc();
    }

    @Transactional
    @CacheEvict(value = {"testimonials", "homepageData"}, allEntries = true)
    public Testimonial saveTestimonial(Testimonial testimonial) {
        return testimonialRepository.save(testimonial);
    }

    @Transactional
    @CacheEvict(value = {"testimonials", "homepageData"}, allEntries = true)
    public void deleteTestimonial(Long id) {
        testimonialRepository.deleteById(id);
    }

    @Cacheable(value = "awards")
    public List<Award> getActiveAwards() {
        return awardRepository.findByActiveTrueOrderByOrderIndexAsc();
    }

    public List<Award> getAllAwards() {
        return awardRepository.findAllByOrderByOrderIndexAsc();
    }

    @Transactional
    @CacheEvict(value = {"awards", "homepageData"}, allEntries = true)
    public Award saveAward(Award award) {
        return awardRepository.save(award);
    }

    @Transactional
    @CacheEvict(value = {"awards", "homepageData"}, allEntries = true)
    public void deleteAward(Long id) {
        awardRepository.deleteById(id);
    }

    // ——— Services & Packages ———

    @Cacheable(value = "services")
    public List<ServiceItem> getActiveServices() {
        return serviceItemRepository.findByActiveTrueOrderByOrderIndexAsc();
    }

    public List<ServiceItem> getAllServices() {
        return serviceItemRepository.findAllByOrderByOrderIndexAsc();
    }

    @Transactional
    @CacheEvict(value = {"services", "homepageData"}, allEntries = true)
    public ServiceItem saveService(ServiceItem item) {
        if (item.getSlug() == null || item.getSlug().isBlank()) {
            item.setSlug(item.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        return serviceItemRepository.save(item);
    }

    @Transactional
    @CacheEvict(value = {"services", "homepageData"}, allEntries = true)
    public void deleteService(Long id) {
        serviceItemRepository.deleteById(id);
    }

    @Cacheable(value = "packages")
    public List<PackageItem> getActivePackages() {
        return packageItemRepository.findByActiveTrueOrderByOrderIndexAsc();
    }

    public List<PackageItem> getAllPackages() {
        return packageItemRepository.findAllByOrderByOrderIndexAsc();
    }

    @Transactional
    @CacheEvict(value = {"packages", "homepageData"}, allEntries = true)
    public PackageItem savePackage(PackageItem item) {
        return packageItemRepository.save(item);
    }

    @Transactional
    @CacheEvict(value = {"packages", "homepageData"}, allEntries = true)
    public void deletePackage(Long id) {
        packageItemRepository.deleteById(id);
    }

    // ——— FAQs ———

    @Cacheable(value = "faqs")
    public List<FaqItem> getActiveFaqs() {
        return faqItemRepository.findByActiveTrueOrderByOrderIndexAsc();
    }

    public List<FaqItem> getAllFaqs() {
        return faqItemRepository.findAllByOrderByOrderIndexAsc();
    }

    @Transactional
    @CacheEvict(value = "faqs", allEntries = true)
    public FaqItem saveFaq(FaqItem item) {
        return faqItemRepository.save(item);
    }

    @Transactional
    @CacheEvict(value = "faqs", allEntries = true)
    public void deleteFaq(Long id) {
        faqItemRepository.deleteById(id);
    }

    // ——— Contact Enquiries ———

    @Transactional
    public ContactEnquiry submitEnquiry(ContactEnquiry enquiry) {
        enquiry.setStatus(ContactEnquiry.EnquiryStatus.NEW);
        log.info("Received new contact enquiry from: {}", enquiry.getEmail());
        return enquiryRepository.save(enquiry);
    }

    public Page<ContactEnquiry> getEnquiries(ContactEnquiry.EnquiryStatus status, Pageable pageable) {
        if (status != null) {
            return enquiryRepository.findByStatus(status, pageable);
        }
        return enquiryRepository.findAll(pageable);
    }

    @Transactional
    public ContactEnquiry updateEnquiryStatus(Long id, ContactEnquiry.EnquiryStatus status) {
        ContactEnquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));
        enquiry.setStatus(status);
        return enquiryRepository.save(enquiry);
    }

    // ——— SEO Metadata ———

    @Cacheable(value = "seoMetadata", key = "#route")
    public SeoMetadata getSeoByRoute(String route) {
        return seoMetadataRepository.findByPageRoute(route).orElse(null);
    }

    public List<SeoMetadata> getAllSeoMetadata() {
        return seoMetadataRepository.findAll();
    }

    @Transactional
    @CacheEvict(value = "seoMetadata", allEntries = true)
    public SeoMetadata saveSeoMetadata(SeoMetadata seo) {
        return seoMetadataRepository.save(seo);
    }
}
