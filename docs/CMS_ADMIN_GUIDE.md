# CMS Admin Panel User Guide

This guide explains how to manage content, imagery, pricing, blogs, portfolio albums, and website settings using the **CMS Admin Panel** (`/admin`).

---

## 🔐 Accessing the Admin Panel

1. Go to `http://localhost:5173/admin/login` (or your production URL `/admin/login`).
2. Log in using your admin credentials or Google OAuth 2.0.
3. Upon successful login, you will be redirected to the **CMS Dashboard**.

---

## 🛠️ CMS Management Modules

### 1. Dashboard (`/admin`)
- View system overview metrics: Total Booking Enquiries, Published Blogs, Gallery Albums, Awards, Hero Slides.
- Inspect system integration health checks for Spring Boot Backend, Cloudinary Storage, and Spring Cache.

### 2. Website Settings & Branding (`/admin/settings`)
- **Studio Information**: Edit Studio Name, Tagline, Contact Email, Phone Number, Address.
- **Logo Uploader**: Upload your custom website logo directly to Cloudinary.
- **Social Links**: Configure Instagram and Facebook profile URLs.
- **Copyright**: Edit footer copyright notice.

### 3. Hero Slideshow Manager (`/admin/hero`)
- Manage homepage Ken Burns background carousel slides.
- **Upload Backgrounds**: Upload high-resolution images directly to Cloudinary.
- **Copy & CTAs**: Edit slide Title, Subtitle, CTA Button Text, and Destination URL.
- **Active State**: Toggle individual slides on or off without deleting them.

### 4. Blog CMS Manager (`/admin/blogs`)
- **Create & Edit Posts**: Add full blog posts with title, slug, summary excerpt, category tags, and main body copy.
- **Cover Image**: Upload cover photos to Cloudinary.
- **Status Filter**: Toggle posts between `PUBLISHED`, `DRAFT`, and `ARCHIVED`.

### 5. Gallery & Albums Manager (`/admin/gallery`)
- **Album Creator**: Create wedding portfolio albums (e.g. *Aisha & Rohan Wedding*).
- **Bulk Multi-Photo Uploader**: Select multiple photo files at once to upload directly to Cloudinary folders.
- **Photo Deletion**: Remove photos with automatic database and Cloudinary cleanup.

### 6. Services & Packages Manager (`/admin/services`)
- **Pricing Tiers**: Manage wedding coverage packages, pricing starting rates, and duration (e.g. *10 Hours Coverage*).
- **Features List**: Edit comma-separated feature lists (e.g. *Lead Photographer, Second Shooter, High-Res Digital Gallery*).

### 7. Awards & Testimonials Manager (`/admin/testimonials`)
- **Client Reviews**: Edit client quotes, couple names, and wedding locations.
- **Award Badges**: Manage industry awards, awarding organisations, and award years.

### 8. SEO Metadata Manager (`/admin/seo`)
- Manage page-level SEO settings for routes (`/`, `/blog`, `/contact`, `/portrait-shoots`, `/stories`).
- **Meta Fields**: Meta Title, Meta Description, Keywords, Canonical URL.
- **OpenGraph Card**: Upload custom Cloudinary social share cards.

### 9. Booking Enquiries Manager (`/admin/enquiries`)
- View all client inquiry form submissions received from the public website.
- Filter inquiries by status (`NEW`, `READ`, `REPLIED`, `ARCHIVED`).
- Inspect client names, email, phone, wedding date, venue location, source, and message.

### 10. Cloudinary Media Library (`/admin/media`)
- Directly upload files to Cloudinary.
- One-click copy Cloudinary image URLs.
- Delete Cloudinary assets by public ID.
