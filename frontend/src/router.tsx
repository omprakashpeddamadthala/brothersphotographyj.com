import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const StoriesPage = lazy(() => import('@/pages/StoriesPage'));
const StoryDetailPage = lazy(() => import('@/pages/StoryDetailPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PortraitShootsPage = lazy(() => import('@/pages/PortraitShootsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Admin pages
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'));
const AdminHeroPage = lazy(() => import('@/pages/admin/AdminHeroPage'));
const AdminBlogsPage = lazy(() => import('@/pages/admin/AdminBlogsPage'));
const AdminGalleryPage = lazy(() => import('@/pages/admin/AdminGalleryPage'));
const AdminServicesPage = lazy(() => import('@/pages/admin/AdminServicesPage'));
const AdminTestimonialsPage = lazy(() => import('@/pages/admin/AdminTestimonialsPage'));
const AdminSeoPage = lazy(() => import('@/pages/admin/AdminSeoPage'));
const AdminFaqsPage = lazy(() => import('@/pages/admin/AdminFaqsPage'));
const AdminEnquiriesPage = lazy(() => import('@/pages/admin/AdminEnquiriesPage'));
const AdminMediaPage = lazy(() => import('@/pages/admin/AdminMediaPage'));

export const router = createBrowserRouter([
  // Public Website Routes
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/stories', element: <StoriesPage /> },
      { path: '/stories/:slug', element: <StoryDetailPage /> },
      { path: '/blog', element: <BlogPage /> },
      { path: '/blog/:slug', element: <BlogPostPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/my-story', element: <Navigate to="/contact" replace /> },
      { path: '/portrait-shoots', element: <PortraitShootsPage /> },
      { path: '/love-by-stories', element: <Navigate to="/portrait-shoots" replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  // Admin CMS Routes
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: 'hero', element: <AdminHeroPage /> },
      { path: 'blogs', element: <AdminBlogsPage /> },
      { path: 'gallery', element: <AdminGalleryPage /> },
      { path: 'services', element: <AdminServicesPage /> },
      { path: 'testimonials', element: <AdminTestimonialsPage /> },
      { path: 'seo', element: <AdminSeoPage /> },
      { path: 'faqs', element: <AdminFaqsPage /> },
      { path: 'enquiries', element: <AdminEnquiriesPage /> },
      { path: 'media', element: <AdminMediaPage /> },
    ],
  },
]);
