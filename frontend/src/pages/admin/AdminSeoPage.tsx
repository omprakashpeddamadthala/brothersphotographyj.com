import React, { useEffect, useState } from 'react';
import { apiFetch, uploadMedia } from '@/services/apiClient';
import { Save, Upload, Check, Globe } from 'lucide-react';
import { ToastContainer } from '@/components/common/Toast';
import type { ToastMessage } from '@/components/common/Toast';

interface SeoItem {
  id?: number;
  pageRoute: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImageUrl: string;
  canonicalUrl: string;
}

const defaultRoutes = [
  { label: 'Home Page', route: '/' },
  { label: 'Blog Journal', route: '/blog' },
  { label: 'Booking Inquiry', route: '/contact' },
  { label: 'Portrait Shoots', route: '/portrait-shoots' },
  { label: 'Stories Portfolio', route: '/stories' },
  { label: 'About Studio', route: '/about' },
];

export default function AdminSeoPage() {
  const [selectedRoute, setSelectedRoute] = useState('/');
  const [seoForm, setSeoForm] = useState<SeoItem>({
    pageRoute: '/',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogImageUrl: '',
    canonicalUrl: '',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchSeoForRoute = async (route: string) => {
    try {
      const data = await apiFetch<SeoItem>(`/public/seo?route=${encodeURIComponent(route)}`);
      if (data) {
        setSeoForm(data);
      } else {
        setSeoForm({
          pageRoute: route,
          metaTitle: 'Stories by Joseph Radhik — Wedding Photography',
          metaDescription: 'Award-winning wedding photography told like timeless stories.',
          keywords: 'wedding photography, candid photos, destination wedding, India',
          ogImageUrl: 'https://picsum.photos/seed/og-image/1200/630',
          canonicalUrl: `https://storiesbyjosephradhik.com${route === '/' ? '' : route}`,
        });
      }
    } catch (err) {
      // Default fallback
      setSeoForm({
        pageRoute: route,
        metaTitle: 'Stories by Joseph Radhik — Wedding Photography',
        metaDescription: 'Award-winning wedding photography told like timeless stories.',
        keywords: 'wedding photography, candid photos, destination wedding',
        ogImageUrl: 'https://picsum.photos/seed/og-image/1200/630',
        canonicalUrl: `https://storiesbyjosephradhik.com${route === '/' ? '' : route}`,
      });
    }
  };

  useEffect(() => {
    fetchSeoForRoute(selectedRoute);
  }, [selectedRoute]);

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingOg(true);
      addToast('info', 'Uploading OpenGraph social card to Cloudinary…');
      const res = await uploadMedia(file, 'seo-og');
      setSeoForm((prev) => ({ ...prev, ogImageUrl: res.url }));
      addToast('success', 'Social card image uploaded successfully!');
    } catch (err) {
      addToast('error', 'OpenGraph image upload failed');
    } finally {
      setUploadingOg(false);
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await apiFetch('/admin/seo', {
        method: 'POST',
        body: JSON.stringify(seoForm),
      });
      setSaved(true);
      addToast('success', `SEO Metadata saved for ${seoForm.pageRoute}!`);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      addToast('error', 'Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div>
        <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-100">
          SEO & OpenGraph Metadata Manager
        </h1>
        <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
          Route-Level Title Tags, Descriptions & Cloudinary Social Cards
        </p>
      </div>

      {/* Page Route Selector */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
        {defaultRoutes.map((item) => (
          <button
            key={item.route}
            type="button"
            onClick={() => setSelectedRoute(item.route)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              selectedRoute === item.route ? 'bg-gold text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
            }`}
          >
            <Globe size={14} />
            {item.label} <span className="font-mono text-[10px] opacity-60">({item.route})</span>
          </button>
        ))}
      </div>

      {/* SEO Form */}
      <form onSubmit={handleSaveSeo} className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">Target Page Route</label>
          <input
            type="text"
            value={seoForm.pageRoute}
            readOnly
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-gold font-mono cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">Meta Title</label>
          <input
            type="text"
            value={seoForm.metaTitle || ''}
            onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">Meta Description</label>
          <textarea
            rows={3}
            value={seoForm.metaDescription || ''}
            onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">Keywords</label>
            <input
              type="text"
              value={seoForm.keywords || ''}
              onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">Canonical URL</label>
            <input
              type="text"
              value={seoForm.canonicalUrl || ''}
              onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* OpenGraph Image */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">OpenGraph Social Share Card (Cloudinary Upload)</label>
          <div className="flex items-center gap-6">
            {seoForm.ogImageUrl ? (
              <img src={seoForm.ogImageUrl} alt="OG Card" className="h-20 w-36 object-cover rounded-lg border border-zinc-800 bg-zinc-950" />
            ) : (
              <div className="h-20 w-36 rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center text-xs text-zinc-500">
                No Card
              </div>
            )}
            <label className="cursor-pointer rounded-lg bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition flex items-center gap-2">
              <Upload size={16} />
              {uploadingOg ? 'Uploading…' : 'Upload Card Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleOgUpload} />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-gold px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-950 hover:bg-yellow-500 transition disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving to Database…' : 'Save SEO Metadata'}
          </button>

          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Check size={16} /> Saved & Cache Evicted!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
