# REST API Documentation — Java 17 Spring Boot Backend

The backend exposes a full suite of enterprise RESTful APIs for public content consumption and protected CMS administration.

- **Base API URL**: `http://localhost:8080/api/v1` (or `https://api.brothersphotographyj.com/api/v1`)
- **Interactive Swagger 3 OpenAPI UI**: `http://localhost:8080/swagger-ui.html`

---

## 🔑 Authentication APIs (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Login via email & password, returns JWT token | None |
| `POST` | `/api/v1/auth/google` | Google OAuth2 token exchange login | None |

---

## 🌐 Public CMS APIs (`/api/v1/public`)

All public endpoints are cached via **Spring Cache** for high performance and fast load times.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/public/settings` | Get website settings (Name, Tagline, Phone, Address, Logo) |
| `GET` | `/api/v1/public/social-links` | Get active social media links |
| `GET` | `/api/v1/public/navigation-menu` | Get active navigation menu items |
| `GET` | `/api/v1/public/hero-slides` | Get active hero carousel slides |
| `GET` | `/api/v1/public/homepage` | Aggregated homepage bundle for fast initial load |
| `GET` | `/api/v1/public/blogs` | Get published blog posts (supports `page`, `size`, `search`) |
| `GET` | `/api/v1/public/blogs/{slug}` | Get single published blog post with gallery images |
| `GET` | `/api/v1/public/gallery` | Get published gallery albums |
| `GET` | `/api/v1/public/gallery/{slug}` | Get single gallery album with photos |
| `GET` | `/api/v1/public/testimonials` | Get active client testimonials |
| `GET` | `/api/v1/public/awards` | Get active awards and features |
| `GET` | `/api/v1/public/services` | Get active photography services |
| `GET` | `/api/v1/public/packages` | Get active packages and pricing tiers |
| `GET` | `/api/v1/public/faqs` | Get active FAQs |
| `GET` | `/api/v1/public/seo?route={route}` | Get page-level SEO metadata by page route |
| `POST` | `/api/v1/enquiries` | Submit client booking enquiry form |

---

## 🔒 Protected Admin CMS APIs (`/api/v1/admin`)

Requires HTTP Header: `Authorization: Bearer <JWT_TOKEN>` with `ROLE_ADMIN`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `PUT` | `/api/v1/admin/settings` | Update website settings key-value map |
| `GET/POST/DELETE` | `/api/v1/admin/social-links` | Manage social media links |
| `GET/POST/DELETE` | `/api/v1/admin/navigation-menu` | Manage navigation menu items |
| `GET/POST/DELETE` | `/api/v1/admin/hero-slides` | Manage hero carousel slides |
| `GET/POST/DELETE` | `/api/v1/admin/blogs` | Manage blog posts |
| `GET/POST/DELETE` | `/api/v1/admin/gallery` | Manage gallery albums |
| `POST` | `/api/v1/admin/gallery/{albumId}/photos` | Add photo to gallery album |
| `DELETE` | `/api/v1/admin/gallery/photos/{photoId}` | Delete photo from album |
| `GET/POST/DELETE` | `/api/v1/admin/testimonials` | Manage client testimonials |
| `GET/POST/DELETE` | `/api/v1/admin/awards` | Manage awards and features |
| `GET/POST/DELETE` | `/api/v1/admin/services` | Manage photography services |
| `GET/POST/DELETE` | `/api/v1/admin/packages` | Manage pricing packages |
| `GET/POST/DELETE` | `/api/v1/admin/faqs` | Manage FAQs |
| `GET/PUT` | `/api/v1/admin/enquiries` | View enquiries and update enquiry status |
| `GET/POST` | `/api/v1/admin/seo` | Manage SEO metadata |

---

## ☁️ Media Storage APIs (`/api/v1/admin/media`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/admin/media/upload` | Upload multipart image file directly to Cloudinary |
| `DELETE` | `/api/v1/admin/media/delete` | Delete image from Cloudinary by public ID |
| `POST` | `/api/v1/admin/media/replace` | Replace existing image on Cloudinary |
