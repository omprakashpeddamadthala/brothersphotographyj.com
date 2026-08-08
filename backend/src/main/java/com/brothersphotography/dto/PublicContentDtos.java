package com.brothersphotography.dto;

import com.brothersphotography.entity.Blog;
import com.brothersphotography.entity.BlogImage;
import com.brothersphotography.entity.GalleryAlbum;
import com.brothersphotography.entity.GalleryPhoto;
import com.brothersphotography.entity.HeroSlide;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Function;

/** Public, image-safe response shapes for the website. */
public final class PublicContentDtos {

    private PublicContentDtos() {
    }

    public record HeroSlideDto(
            Long id,
            String imageUrl,
            String title,
            String subtitle,
            String ctaText,
            String ctaUrl,
            Integer orderIndex,
            Boolean active
    ) {
        public static HeroSlideDto from(HeroSlide slide, String imageUrl) {
            return new HeroSlideDto(
                    slide.getId(), imageUrl, slide.getTitle(), slide.getSubtitle(), slide.getCtaText(),
                    slide.getCtaUrl(), slide.getOrderIndex(), slide.getActive()
            );
        }
    }

    public record GalleryPhotoDto(Long id, String imageUrl, String altText, Integer width, Integer height) {
        public static GalleryPhotoDto from(GalleryPhoto photo, String imageUrl) {
            return new GalleryPhotoDto(
                    photo.getId(), imageUrl, photo.getAltText(), photo.getWidth(), photo.getHeight()
            );
        }
    }

    public record GalleryAlbumDetailDto(
            Long id,
            String title,
            String slug,
            String couple,
            String location,
            String eventDate,
            String excerpt,
            String coverImageUrl,
            String category,
            List<GalleryPhotoDto> photos
    ) {
        public static GalleryAlbumDetailDto from(
                GalleryAlbum album,
                String coverImageUrl,
                Function<GalleryPhoto, String> imageUrlFactory
        ) {
            List<GalleryPhotoDto> photos = album.getPhotos().stream()
                    .map(photo -> GalleryPhotoDto.from(photo, imageUrlFactory.apply(photo)))
                    .toList();
            return new GalleryAlbumDetailDto(
                    album.getId(), album.getTitle(), album.getSlug(), album.getCouple(), album.getLocation(),
                    album.getEventDate(), album.getExcerpt(), coverImageUrl, album.getCategory(), photos
            );
        }
    }

    public record BlogImageDto(Long id, String imageUrl, String caption, Integer width, Integer height) {
        public static BlogImageDto from(BlogImage image, String imageUrl) {
            return new BlogImageDto(
                    image.getId(), imageUrl, image.getCaption(), image.getWidth(), image.getHeight()
            );
        }
    }

    public record BlogDetailDto(
            Long id,
            String title,
            String slug,
            String excerpt,
            String content,
            String coverImageUrl,
            String category,
            LocalDateTime publishedAt,
            List<BlogImageDto> images
    ) {
        public static BlogDetailDto from(
                Blog blog,
                String coverImageUrl,
                Function<BlogImage, String> imageUrlFactory
        ) {
            List<BlogImageDto> images = blog.getImages().stream()
                    .map(image -> BlogImageDto.from(image, imageUrlFactory.apply(image)))
                    .toList();
            return new BlogDetailDto(
                    blog.getId(), blog.getTitle(), blog.getSlug(), blog.getExcerpt(), blog.getContent(),
                    coverImageUrl, blog.getCategory(), blog.getPublishedAt(), images
            );
        }
    }
}
