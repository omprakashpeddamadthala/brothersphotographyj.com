import { useEffect, useState } from 'react';
import { apiFetch } from '@/services/apiClient';
import { Plus, Trash2, Save } from 'lucide-react';
import { ConfirmModal } from '@/components/common/AdminModal';
import { ToastContainer } from '@/components/common/Toast';
import type { ToastMessage } from '@/components/common/Toast';

interface PackageItem {
  id?: number;
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  featuresJson: string;
  active: boolean;
}

export default function AdminServicesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [deletePackageId, setDeletePackageId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchPackages = async () => {
    try {
      const data = await apiFetch<PackageItem[]>('/admin/packages');
      setPackages(data);
    } catch (err) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleAddPackage = () => {
    setPackages([
      ...packages,
      {
        title: 'New Wedding Package',
        subtitle: 'Full Day Coverage',
        price: '$3,500',
        duration: '10 Hours',
        featuresJson: 'Lead Photographer, Second Shooter, High-Res Digital Gallery, Drone Footage',
        active: true,
      },
    ]);
  };

  const handleSavePackage = async (pkg: PackageItem) => {
    try {
      await apiFetch('/admin/packages', {
        method: 'POST',
        body: JSON.stringify(pkg),
      });
      addToast('success', 'Package tier saved successfully!');
      fetchPackages();
    } catch (err: any) {
      addToast('error', 'Save failed: ' + err.message);
    }
  };

  const handleConfirmDeletePackage = async () => {
    if (!deletePackageId) return;
    try {
      await apiFetch(`/admin/packages/${deletePackageId}`, { method: 'DELETE' });
      addToast('success', 'Package deleted successfully.');
      fetchPackages();
    } catch (err) {
      addToast('error', 'Delete failed');
    } finally {
      setDeletePackageId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmModal
        isOpen={deletePackageId !== null}
        title="Delete Package Tier"
        message="Are you sure you want to delete this pricing package tier?"
        confirmText="Delete Package"
        isDanger
        onConfirm={handleConfirmDeletePackage}
        onClose={() => setDeletePackageId(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-100">
            Services & Packages Manager
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
            Pricing Tiers & Coverage Features
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddPackage}
          className="flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-950 hover:bg-yellow-500 transition"
        >
          <Plus size={16} /> Add Package Tier
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {packages.map((pkg, idx) => (
          <div key={pkg.id || idx} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs uppercase text-zinc-400 mb-1">Package Title</label>
                <input
                  type="text"
                  value={pkg.title}
                  onChange={(e) => {
                    const copy = [...packages];
                    copy[idx].title = e.target.value;
                    setPackages(copy);
                  }}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-zinc-400 mb-1">Price</label>
                  <input
                    type="text"
                    value={pkg.price || ''}
                    onChange={(e) => {
                      const copy = [...packages];
                      copy[idx].price = e.target.value;
                      setPackages(copy);
                    }}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-zinc-400 mb-1">Duration</label>
                  <input
                    type="text"
                    value={pkg.duration || ''}
                    onChange={(e) => {
                      const copy = [...packages];
                      copy[idx].duration = e.target.value;
                      setPackages(copy);
                    }}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-zinc-400 mb-1">Features (Comma Separated)</label>
                <textarea
                  rows={3}
                  value={pkg.featuresJson || ''}
                  onChange={(e) => {
                    const copy = [...packages];
                    copy[idx].featuresJson = e.target.value;
                    setPackages(copy);
                  }}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pkg.active}
                  onChange={(e) => {
                    const copy = [...packages];
                    copy[idx].active = e.target.checked;
                    setPackages(copy);
                  }}
                  className="rounded border-zinc-700 bg-zinc-950 text-gold focus:ring-gold"
                />
                Active
              </label>

              <div className="flex items-center gap-2">
                {pkg.id && (
                  <button type="button" onClick={() => setDeletePackageId(pkg.id!)} className="p-2 text-red-400 hover:text-red-300 transition">
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleSavePackage(pkg)}
                  className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-yellow-500 transition"
                >
                  <Save size={14} /> Save Package
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
