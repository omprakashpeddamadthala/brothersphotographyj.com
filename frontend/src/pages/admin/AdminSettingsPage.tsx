import React, { useEffect, useState } from 'react';
import { apiFetch, uploadMedia } from '@/services/apiClient';
import { useCms } from '@/context/CmsContext';
import { Upload, Save, Check, Image as ImageIcon } from 'lucide-react';
import { ToastContainer } from '@/components/common/Toast';
import type { ToastMessage } from '@/components/common/Toast';
import { MediaLibraryModal } from '@/components/common/MediaLibraryModal';

export default function AdminSettingsPage() {
  const { siteSettings, refetchSettings } = useCms();
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    email: '',
    phone: '',
    address: '',
    logoUrl: '',
    copyright: '',
    instagram: '',
    facebook: '',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const handleSelectLogo = (url: string) => {
    setForm((prev) => ({ ...prev, logoUrl: url }));
    addToast('success', 'Logo selected from media library.');
  };

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    setForm({
      name: siteSettings.name || '',
      tagline: siteSettings.tagline || '',
      email: siteSettings.email || '',
      phone: siteSettings.phone || '',
      address: siteSettings.address || '',
      logoUrl: siteSettings.logoUrl || '',
      copyright: siteSettings.copyright || '',
      instagram: siteSettings.instagram || '',
      facebook: siteSettings.facebook || '',
    });
  }, [siteSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingLogo(true);
      addToast('info', 'Uploading logo to Cloudinary…');
      const res = await uploadMedia(file, 'branding');
      setForm((prev) => ({ ...prev, logoUrl: res.url }));
      addToast('success', 'Logo uploaded successfully!');
    } catch (err) {
      addToast('error', 'Logo upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await apiFetch('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      await refetchSettings();
      setSaved(true);
      addToast('success', 'Website settings saved & cache evicted!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      addToast('error', 'Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 font-sans">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div>
        <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-100">
          Website Settings
        </h1>
        <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
          Manage Branding, Contact Info & Copy
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
        {/* Logo Section */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
            Website Logo (Cloudinary Upload)
          </label>
          <div className="flex items-center gap-6">
            {form.logoUrl ? (
              <img src={form.logoUrl} alt="Logo" className="h-12 w-auto max-w-[180px] object-contain rounded bg-zinc-950 p-2 border border-zinc-800" />
            ) : (
              <div className="h-12 w-32 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500">
                No Logo
              </div>
            )}
            <div className="flex gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-200 hover:bg-zinc-700 transition">
                <Upload size={16} />
                {uploadingLogo ? 'Uploading to Cloudinary…' : 'Upload New Logo'}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-200 hover:bg-zinc-700 transition"
              >
                <ImageIcon size={16} />
                Choose from Library
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">Studio Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">Contact Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">Instagram URL</label>
            <input
              type="text"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">Facebook URL</label>
            <input
              type="text"
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">Footer Copyright Text</label>
          <input
            type="text"
            name="copyright"
            value={form.copyright}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-gold px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-950 hover:bg-yellow-500 transition disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving to Database…' : 'Save Website Settings'}
          </button>

          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Check size={16} /> Saved & Cache Evicted!
            </span>
          )}
        </div>
      </form>

      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleSelectLogo}
      />
    </div>
  );
}
