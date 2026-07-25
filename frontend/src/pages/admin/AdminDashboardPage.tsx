import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  BookOpen,
  FolderKanban,
  Award,
  Image as ImageIcon,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { apiFetch } from '@/services/apiClient';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    enquiries: 0,
    blogs: 0,
    albums: 0,
    awards: 0,
    heroSlides: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const blogs = await apiFetch<any>('/admin/blogs?size=1').catch(() => ({ totalElements: 0 }));
        const albums = await apiFetch<any>('/admin/gallery?size=1').catch(() => ({ totalElements: 0 }));
        const enquiries = await apiFetch<any>('/admin/enquiries?size=1').catch(() => ({ totalElements: 0 }));
        const awards = await apiFetch<any[]>('/admin/awards').catch(() => []);
        const slides = await apiFetch<any[]>('/admin/hero-slides').catch(() => []);

        setStats({
          enquiries: enquiries.totalElements || 0,
          blogs: blogs.totalElements || 0,
          albums: albums.totalElements || 0,
          awards: awards.length || 0,
          heroSlides: slides.length || 0,
        });
      } catch (e) {
        // Fallback
      }
    };
    loadStats();
  }, []);

  const cards = [
    { label: 'Booking Enquiries', value: stats.enquiries, icon: MessageSquare, color: 'text-amber-400 bg-amber-400/10', to: '/admin/enquiries' },
    { label: 'Published Blogs', value: stats.blogs, icon: BookOpen, color: 'text-blue-400 bg-blue-400/10', to: '/admin/blogs' },
    { label: 'Gallery Albums', value: stats.albums, icon: FolderKanban, color: 'text-purple-400 bg-purple-400/10', to: '/admin/gallery' },
    { label: 'Awards & Recognitions', value: stats.awards, icon: Award, color: 'text-emerald-400 bg-emerald-400/10', to: '/admin/testimonials' },
    { label: 'Hero Slides', value: stats.heroSlides, icon: ImageIcon, color: 'text-pink-400 bg-pink-400/10', to: '/admin/hero' },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-100">
          CMS Dashboard
        </h1>
        <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
          Overview & System Metrics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-gold/50 hover:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${card.color}`}>
                  <Icon size={24} />
                </div>
                <TrendingUp size={16} className="text-zinc-500 transition group-hover:text-gold" />
              </div>
              <p className="mt-6 font-serif text-3xl font-bold text-zinc-100">{card.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-zinc-400">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {/* System Status & Architecture Info */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <h2 className="font-serif text-xl font-light text-zinc-200">System Integration Status</h2>
        <div className="grid gap-4 sm:grid-cols-3 text-xs">
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <div>
              <p className="font-semibold text-zinc-200">Backend API</p>
              <p className="text-zinc-500">Java 17 Spring Boot 3</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <div>
              <p className="font-semibold text-zinc-200">Media Provider</p>
              <p className="text-zinc-500">Cloudinary SDK Storage</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <div>
              <p className="font-semibold text-zinc-200">Caching System</p>
              <p className="text-zinc-500">Spring Cache (In-Memory)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
