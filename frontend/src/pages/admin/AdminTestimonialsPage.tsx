import { useEffect, useState } from 'react';
import { apiFetch } from '@/services/apiClient';
import { Plus, Trash2, Save } from 'lucide-react';
import { ConfirmModal } from '@/components/common/AdminModal';
import { ToastContainer } from '@/components/common/Toast';
import type { ToastMessage } from '@/components/common/Toast';

interface TestimonialItem {
  id?: number;
  quote: string;
  author: string;
  event: string;
  location: string;
  active: boolean;
}

interface AwardItem {
  id?: number;
  title: string;
  organisation: string;
  year: number;
  active: boolean;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [deleteTestimonialId, setDeleteTestimonialId] = useState<number | null>(null);
  const [deleteAwardId, setDeleteAwardId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchData = async () => {
    try {
      const tData = await apiFetch<TestimonialItem[]>('/admin/testimonials');
      const aData = await apiFetch<AwardItem[]>('/admin/awards');
      setTestimonials(tData);
      setAwards(aData);
    } catch (err) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        quote: 'They captured our wedding like a dream!',
        author: 'Couple Name',
        event: 'Goa, 2026',
        location: 'Goa',
        active: true,
      },
    ]);
  };

  const handleSaveTestimonial = async (item: TestimonialItem) => {
    try {
      await apiFetch('/admin/testimonials', {
        method: 'POST',
        body: JSON.stringify(item),
      });
      addToast('success', 'Testimonial saved successfully!');
      fetchData();
    } catch (err: any) {
      addToast('error', 'Save failed: ' + err.message);
    }
  };

  const handleConfirmDeleteTestimonial = async () => {
    if (!deleteTestimonialId) return;
    try {
      await apiFetch(`/admin/testimonials/${deleteTestimonialId}`, { method: 'DELETE' });
      addToast('success', 'Testimonial deleted.');
      fetchData();
    } catch (err) {
      addToast('error', 'Delete failed');
    } finally {
      setDeleteTestimonialId(null);
    }
  };

  const handleAddAward = () => {
    setAwards([
      ...awards,
      {
        title: 'Wedding Photographer of the Year',
        organisation: 'Asia Wedding Guild',
        year: 2026,
        active: true,
      },
    ]);
  };

  const handleSaveAward = async (item: AwardItem) => {
    try {
      await apiFetch('/admin/awards', {
        method: 'POST',
        body: JSON.stringify(item),
      });
      addToast('success', 'Award saved successfully!');
      fetchData();
    } catch (err: any) {
      addToast('error', 'Save failed: ' + err.message);
    }
  };

  const handleConfirmDeleteAward = async () => {
    if (!deleteAwardId) return;
    try {
      await apiFetch(`/admin/awards/${deleteAwardId}`, { method: 'DELETE' });
      addToast('success', 'Award deleted.');
      fetchData();
    } catch (err) {
      addToast('error', 'Delete failed');
    } finally {
      setDeleteAwardId(null);
    }
  };

  return (
    <div className="space-y-12 font-sans max-w-5xl">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmModal
        isOpen={deleteTestimonialId !== null}
        title="Delete Testimonial"
        message="Are you sure you want to delete this client review?"
        confirmText="Delete Review"
        isDanger
        onConfirm={handleConfirmDeleteTestimonial}
        onClose={() => setDeleteTestimonialId(null)}
      />

      <ConfirmModal
        isOpen={deleteAwardId !== null}
        title="Delete Award Badge"
        message="Are you sure you want to delete this award recognition badge?"
        confirmText="Delete Award"
        isDanger
        onConfirm={handleConfirmDeleteAward}
        onClose={() => setDeleteAwardId(null)}
      />

      {/* Testimonials Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-100">
              Client Testimonials
            </h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
              Manage Client Quotes & Reviews
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddTestimonial}
            className="flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-950 hover:bg-yellow-500 transition"
          >
            <Plus size={16} /> Add Testimonial
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item, idx) => (
            <div key={item.id || idx} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase text-zinc-400 mb-1">Quote</label>
                <textarea
                  rows={3}
                  value={item.quote}
                  onChange={(e) => {
                    const copy = [...testimonials];
                    copy[idx].quote = e.target.value;
                    setTestimonials(copy);
                  }}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-zinc-400 mb-1">Author</label>
                  <input
                    type="text"
                    value={item.author}
                    onChange={(e) => {
                      const copy = [...testimonials];
                      copy[idx].author = e.target.value;
                      setTestimonials(copy);
                    }}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-zinc-400 mb-1">Event / Location</label>
                  <input
                    type="text"
                    value={item.event || ''}
                    onChange={(e) => {
                      const copy = [...testimonials];
                      copy[idx].event = e.target.value;
                      setTestimonials(copy);
                    }}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={(e) => {
                      const copy = [...testimonials];
                      copy[idx].active = e.target.checked;
                      setTestimonials(copy);
                    }}
                    className="rounded border-zinc-700 bg-zinc-950 text-gold focus:ring-gold"
                  />
                  Active
                </label>

                <div className="flex items-center gap-2">
                  {item.id && (
                    <button type="button" onClick={() => setDeleteTestimonialId(item.id!)} className="p-2 text-red-400 hover:text-red-300 transition">
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSaveTestimonial(item)}
                    className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-yellow-500 transition"
                  >
                    <Save size={14} /> Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Awards Section */}
      <div className="space-y-6 pt-6 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-light tracking-wide text-zinc-100">
              Awards & Recognition Badges
            </h2>
          </div>
          <button
            type="button"
            onClick={handleAddAward}
            className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-200 hover:bg-zinc-700 transition"
          >
            <Plus size={16} /> Add Award
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {awards.map((award, idx) => (
            <div key={award.id || idx} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
              <input
                type="text"
                value={award.title}
                onChange={(e) => {
                  const copy = [...awards];
                  copy[idx].title = e.target.value;
                  setAwards(copy);
                }}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-gold font-bold"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={award.organisation || ''}
                  onChange={(e) => {
                    const copy = [...awards];
                    copy[idx].organisation = e.target.value;
                    setAwards(copy);
                  }}
                  placeholder="Organisation"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 outline-none"
                />
                <input
                  type="number"
                  value={award.year || 2026}
                  onChange={(e) => {
                    const copy = [...awards];
                    copy[idx].year = parseInt(e.target.value, 10);
                    setAwards(copy);
                  }}
                  className="w-20 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-300 outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {award.id && (
                  <button type="button" onClick={() => setDeleteAwardId(award.id!)} className="text-red-400 hover:text-red-300 transition">
                    <Trash2 size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleSaveAward(award)}
                  className="ml-auto rounded-md bg-gold/20 px-3 py-1 text-[11px] font-semibold text-gold hover:bg-gold hover:text-zinc-950 transition"
                >
                  Save Award
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
