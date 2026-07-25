import React, { useState } from 'react';
import { uploadMedia, apiFetch } from '@/services/apiClient';
import { Upload, Trash2, Copy, Check } from 'lucide-react';
import { ConfirmModal } from '@/components/common/AdminModal';
import { ToastContainer } from '@/components/common/Toast';
import type { ToastMessage } from '@/components/common/Toast';

interface MediaItem {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

export default function AdminMediaPage() {
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [publicIdToDelete, setPublicIdToDelete] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    addToast('info', `Uploading ${files.length} images to Cloudinary…`);
    try {
      const results: MediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadMedia(file, 'media-library');
        results.push(res);
      }
      setUploadedMedia((prev) => [...results, ...prev]);
      addToast('success', `Successfully uploaded ${files.length} assets!`);
    } catch (err: any) {
      addToast('error', 'Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await apiFetch(`/admin/media/delete?publicId=${encodeURIComponent(deleteTargetId)}`, {
        method: 'DELETE',
      });
      setUploadedMedia((prev) => prev.filter((m) => m.publicId !== deleteTargetId));
      addToast('success', 'Image deleted from Cloudinary.');
      if (publicIdToDelete === deleteTargetId) {
        setPublicIdToDelete('');
      }
    } catch (err: any) {
      addToast('error', 'Delete failed: ' + err.message);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addToast('info', 'Cloudinary URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Cloudinary Asset"
        message={`Are you sure you want to permanently delete image "${deleteTargetId}" from Cloudinary storage?`}
        confirmText="Delete Asset"
        isDanger
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTargetId(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-100">
            Cloudinary Media Manager
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
            Direct Cloud Storage Uploads, Replacements & Deletions
          </p>
        </div>

        <label className="cursor-pointer rounded-lg bg-gold px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-950 hover:bg-yellow-500 transition flex items-center gap-2">
          <Upload size={16} />
          {uploading ? 'Uploading to Cloudinary…' : 'Upload Files to Cloudinary'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {/* Manual Delete by Public ID */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3">
        <h3 className="font-serif text-lg text-zinc-200">Delete by Cloudinary Public ID</h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="e.g. brothersphotography/hero-slides/sample-id"
            value={publicIdToDelete}
            onChange={(e) => setPublicIdToDelete(e.target.value)}
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-100 outline-none focus:border-gold font-mono"
          />
          <button
            type="button"
            onClick={() => {
              if (publicIdToDelete) setDeleteTargetId(publicIdToDelete);
            }}
            className="rounded-lg bg-red-600/80 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-600 transition"
          >
            Delete Asset
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-light text-zinc-200">Session Uploads ({uploadedMedia.length})</h2>
        {uploadedMedia.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {uploadedMedia.map((media, idx) => (
              <div key={media.publicId || idx} className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                <img src={media.url} alt={media.publicId} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/60 p-3 opacity-0 transition group-hover:opacity-100 flex flex-col justify-between">
                  <p className="text-[10px] text-zinc-300 font-mono truncate">{media.publicId}</p>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(media.url, media.publicId)}
                      className="rounded bg-zinc-800 p-2 text-zinc-200 hover:bg-gold hover:text-zinc-950 transition"
                      title="Copy URL"
                    >
                      {copiedId === media.publicId ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(media.publicId)}
                      className="rounded bg-red-600 p-2 text-white hover:bg-red-500 transition"
                      title="Delete from Cloudinary"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-16 text-center text-xs text-zinc-500">
            Upload images above to inspect Cloudinary URLs and public IDs.
          </div>
        )}
      </div>
    </div>
  );
}
