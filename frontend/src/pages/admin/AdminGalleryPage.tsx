import { useEffect, useState } from 'react';
import { apiFetch, uploadMedia } from '@/services/apiClient';
import { Trash2, Upload, FolderPlus } from 'lucide-react';
import { ConfirmModal, InputModal } from '@/components/common/AdminModal';
import { ToastContainer } from '@/components/common/Toast';
import type { ToastMessage } from '@/components/common/Toast';

interface AlbumItem {
  id: number;
  title: string;
  slug: string;
  couple?: string;
  location?: string;
  coverImageUrl?: string;
  photos: Array<{ id: number; imageUrl: string; altText?: string }>;
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumItem | null>(null);
  const [uploading, setUploading] = useState(false);

  // Modals & Toast
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletePhotoId, setDeletePhotoId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchAlbums = async () => {
    try {
      const res = await apiFetch<any>('/admin/gallery?size=50');
      const list = res.content || [];
      setAlbums(list);
      if (list.length > 0 && !selectedAlbum) {
        setSelectedAlbum(list[0]);
      }
    } catch (err) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleCreateAlbumSubmit = async (title: string) => {
    try {
      const newAlbum = await apiFetch<AlbumItem>('/admin/gallery', {
        method: 'POST',
        body: JSON.stringify({
          title,
          slug: title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-'),
          coverImageUrl: 'https://picsum.photos/seed/new-album/1600/2000',
          published: true,
          featured: true,
        }),
      });
      addToast('success', `Album "${title}" created successfully!`);
      fetchAlbums();
      setSelectedAlbum(newAlbum);
    } catch (err: any) {
      addToast('error', 'Failed to create album: ' + err.message);
    }
  };

  const handleMultiPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedAlbum) return;

    setUploading(true);
    addToast('info', `Uploading ${files.length} photos to Cloudinary…`);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadMedia(file, `gallery-${selectedAlbum.slug}`);
        await apiFetch(`/admin/gallery/${selectedAlbum.id}/photos`, {
          method: 'POST',
          body: JSON.stringify({
            imageUrl: res.url,
            cloudinaryPublicId: res.publicId,
            altText: `${selectedAlbum.title} photograph ${i + 1}`,
            orderIndex: (selectedAlbum.photos?.length || 0) + i,
          }),
        });
      }
      addToast('success', `Successfully uploaded ${files.length} photos!`);
      fetchAlbums();
    } catch (err: any) {
      addToast('error', 'Photo upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmDeletePhoto = async () => {
    if (!deletePhotoId) return;
    try {
      await apiFetch(`/admin/gallery/photos/${deletePhotoId}`, { method: 'DELETE' });
      addToast('success', 'Photo deleted successfully.');
      fetchAlbums();
    } catch (err: any) {
      addToast('error', 'Failed to delete photo.');
    } finally {
      setDeletePhotoId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Input Modal for Album Creation */}
      <InputModal
        isOpen={showCreateModal}
        title="Create New Portfolio Album"
        label="Album Name"
        placeholder="e.g. Aisha & Rohan Wedding, Udaipur"
        confirmText="Create Album"
        onConfirm={handleCreateAlbumSubmit}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Delete Photo Confirmation Modal */}
      <ConfirmModal
        isOpen={deletePhotoId !== null}
        title="Delete Photograph"
        message="Are you sure you want to remove this photo from the album? This action cannot be undone."
        confirmText="Delete Photo"
        isDanger
        onConfirm={handleConfirmDeletePhoto}
        onClose={() => setDeletePhotoId(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-100">
            Gallery & Albums Manager
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
            Multi-photo Uploads to Cloudinary & Portfolio Albums
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-950 hover:bg-yellow-500 transition"
        >
          <FolderPlus size={16} /> New Album
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Album List */}
        <div className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3 px-2">Albums ({albums.length})</p>
          {albums.map((album) => (
            <button
              key={album.id}
              type="button"
              onClick={() => setSelectedAlbum(album)}
              className={`w-full text-left rounded-xl p-3 text-xs transition ${
                selectedAlbum?.id === album.id ? 'bg-gold/15 text-gold font-bold border border-gold/40' : 'text-zinc-300 hover:bg-zinc-800/60'
              }`}
            >
              <p className="font-serif text-sm truncate">{album.title}</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{album.photos?.length || 0} photos</p>
            </button>
          ))}
        </div>

        {/* Selected Album Photos Grid */}
        <div className="md:col-span-3 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          {selectedAlbum ? (
            <>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-light text-zinc-100">{selectedAlbum.title}</h2>
                  <p className="text-xs text-zinc-400 font-mono mt-1">/stories/{selectedAlbum.slug}</p>
                </div>

                <label className="cursor-pointer rounded-lg bg-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-yellow-500 flex items-center gap-2 transition">
                  <Upload size={16} />
                  {uploading ? 'Uploading to Cloudinary…' : 'Upload Multiple Photos'}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleMultiPhotoUpload} />
                </label>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {selectedAlbum.photos?.map((photo) => (
                  <div key={photo.id} className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800">
                    <img src={photo.imageUrl} alt={photo.altText} className="h-full w-full object-cover transition group-hover:scale-105" />
                    <button
                      type="button"
                      onClick={() => setDeletePhotoId(photo.id)}
                      className="absolute top-2 right-2 rounded-lg bg-red-600/80 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-zinc-500">Select an album to manage photos</div>
          )}
        </div>
      </div>
    </div>
  );
}
