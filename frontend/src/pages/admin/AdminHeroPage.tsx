import React, { useEffect, useState } from 'react';
import { apiFetch, uploadMedia } from '@/services/apiClient';
import { Plus, Trash2, Upload, Save, Image as ImageIcon } from 'lucide-react';
import { ConfirmModal } from '@/components/common/AdminModal';
import { ToastContainer } from '@/components/common/Toast';
import type { ToastMessage } from '@/components/common/Toast';
import { MediaLibraryModal } from '@/components/common/MediaLibraryModal';

interface HeroSlideItem {
  id?: number;
  imageUrl: string;
  cloudinaryPublicId?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  orderIndex: number;
  active: boolean;
}

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [deleteSlideId, setDeleteSlideId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeSlideIndexForMedia, setActiveSlideIndexForMedia] = useState<number | null>(null);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchSlides = async () => {
    try {
      const data = await apiFetch<HeroSlideItem[]>('/admin/hero-slides');
      setSlides(data);
    } catch (err) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleAddSlide = () => {
    setSlides([
      ...slides,
      {
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop',
        title: 'New Slide Title',
        subtitle: 'Wedding Photography & Films',
        ctaText: 'Explore Story',
        ctaUrl: '/blog',
        orderIndex: slides.length,
        active: true,
      },
    ]);
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      addToast('info', 'Uploading hero background image to Cloudinary…');
      const res = await uploadMedia(file, 'hero-slides');
      const updated = [...slides];
      updated[index].imageUrl = res.url;
      updated[index].cloudinaryPublicId = res.publicId;
      setSlides(updated);
      addToast('success', 'Hero image uploaded successfully!');
    } catch (err) {
      addToast('error', 'Image upload failed');
    }
  };

  const handleOpenMediaLibrary = (index: number) => {
    setActiveSlideIndexForMedia(index);
    setIsMediaModalOpen(true);
  };

  const handleSelectFromLibrary = (url: string, publicId: string) => {
    if (activeSlideIndexForMedia === null) return;
    const updated = [...slides];
    updated[activeSlideIndexForMedia].imageUrl = url;
    updated[activeSlideIndexForMedia].cloudinaryPublicId = publicId;
    setSlides(updated);
    addToast('success', 'Selected image from media library.');
  };

  const handleSaveSlide = async (slide: HeroSlideItem) => {
    try {
      await apiFetch('/admin/hero-slides', {
        method: 'POST',
        body: JSON.stringify(slide),
      });
      addToast('success', 'Hero slide saved successfully!');
      fetchSlides();
    } catch (err: any) {
      addToast('error', 'Error saving slide: ' + err.message);
    }
  };

  const handleConfirmDeleteSlide = async () => {
    if (!deleteSlideId) return;

    try {
      await apiFetch(`/admin/hero-slides/${deleteSlideId}`, { method: 'DELETE' });
      addToast('success', 'Hero slide deleted successfully.');
      fetchSlides();
    } catch (err: any) {
      addToast('error', 'Delete failed');
    } finally {
      setDeleteSlideId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmModal
        isOpen={deleteSlideId !== null}
        title="Delete Hero Slide"
        message="Are you sure you want to remove this hero slide from the homepage carousel?"
        confirmText="Delete Slide"
        isDanger
        onConfirm={handleConfirmDeleteSlide}
        onClose={() => setDeleteSlideId(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-100">
            Hero Slideshow Manager
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
            Ken Burns Carousel & Cloudinary Images
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddSlide}
          className="flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-950 hover:bg-yellow-500 transition"
        >
          <Plus size={16} /> Add Hero Slide
        </button>
      </div>

      <div className="space-y-6">
        {slides.map((slide, idx) => (
          <div key={slide.id || idx} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
            <div className="grid gap-6 md:grid-cols-3 items-center">
              {/* Preview */}
              <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800">
                <img src={slide.imageUrl} alt={slide.title} className="h-full w-full object-cover" />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <label className="flex cursor-pointer items-center gap-1.5 rounded-md bg-zinc-900/90 px-3 py-1.5 text-[11px] font-semibold text-zinc-200 backdrop-blur hover:bg-zinc-800">
                    <Upload size={14} /> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(idx, e)} />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenMediaLibrary(idx)}
                    className="flex items-center gap-1.5 rounded-md bg-zinc-900/90 px-3 py-1.5 text-[11px] font-semibold text-zinc-200 backdrop-blur hover:bg-zinc-800"
                  >
                    <ImageIcon size={14} /> Library
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs uppercase text-zinc-400 mb-1">Slide Title</label>
                    <input
                      type="text"
                      value={slide.title || ''}
                      onChange={(e) => {
                        const updated = [...slides];
                        updated[idx].title = e.target.value;
                        setSlides(updated);
                      }}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-zinc-400 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={slide.subtitle || ''}
                      onChange={(e) => {
                        const updated = [...slides];
                        updated[idx].subtitle = e.target.value;
                        setSlides(updated);
                      }}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slide.active}
                      onChange={(e) => {
                        const updated = [...slides];
                        updated[idx].active = e.target.checked;
                        setSlides(updated);
                      }}
                      className="rounded border-zinc-700 bg-zinc-950 text-gold focus:ring-gold"
                    />
                    Active Slide
                  </label>

                  <div className="flex items-center gap-3">
                    {slide.id && (
                      <button
                        type="button"
                        onClick={() => setDeleteSlideId(slide.id!)}
                        className="p-2 text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSaveSlide(slide)}
                      className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-gold hover:text-zinc-950 transition"
                    >
                      <Save size={14} /> Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleSelectFromLibrary}
      />
    </div>
  );
}
