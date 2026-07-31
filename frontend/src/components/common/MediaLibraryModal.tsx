import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, RefreshCw, Check } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';
import { optimizedImageUrl } from '@/utils/cloudinary';

interface MediaItem {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, publicId: string) => void;
  onSelectMultiple?: (items: MediaItem[]) => void;
  isMultiSelect?: boolean;
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  onSelectMultiple,
  isMultiSelect = false,
}: MediaLibraryModalProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const items = await apiFetch<MediaItem[]>('/admin/media');
      setMediaItems(items || []);
    } catch (err) {
      console.error('Error fetching media library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedUrls([]);
      setSelectedItems([]);
    }
  }, [isOpen]);

  const handleItemClick = (item: MediaItem) => {
    if (isMultiSelect) {
      if (selectedUrls.includes(item.url)) {
        setSelectedUrls((prev) => prev.filter((u) => u !== item.url));
        setSelectedItems((prev) => prev.filter((i) => i.url !== item.url));
      } else {
        setSelectedUrls((prev) => [...prev, item.url]);
        setSelectedItems((prev) => [...prev, item]);
      }
    } else {
      setSelectedUrls([item.url]);
      setSelectedItems([item]);
    }
  };

  const handleConfirm = () => {
    if (isMultiSelect) {
      if (onSelectMultiple) {
        onSelectMultiple(selectedItems);
      }
    } else if (selectedItems.length > 0) {
      onSelect(selectedItems[0].url, selectedItems[0].publicId);
    }
    onClose();
  };

  const filteredItems = mediaItems.filter((item) =>
    item.publicId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl flex flex-col font-sans text-zinc-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 p-6">
              <div>
                <h3 className="font-serif text-2xl font-light text-zinc-100">Media Library</h3>
                <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">
                  Select from already uploaded photos on Cloudinary
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Controls */}
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/40 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="text"
                  placeholder="Search by ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 pl-10 pr-4 py-2 text-xs text-zinc-100 outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={fetchMedia}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <span className="text-xs text-zinc-400 font-mono">
                  {selectedUrls.length} selected
                </span>
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-2">
                  <RefreshCw size={24} className="animate-spin text-gold" />
                  <span className="text-xs">Loading media assets...</span>
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {filteredItems.map((item) => {
                    const isSelected = selectedUrls.includes(item.url);
                    return (
                      <div
                        key={item.publicId}
                        onClick={() => handleItemClick(item)}
                        className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border transition ${
                          isSelected
                            ? 'border-gold ring-2 ring-gold/20'
                            : 'border-zinc-800 hover:border-zinc-700'
                        } bg-zinc-950`}
                      >
                        <img
                          src={optimizedImageUrl(item.url, { width: 300, height: 300, crop: 'fill' })}
                          alt={item.publicId}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className={`absolute inset-0 bg-black/40 transition opacity-0 group-hover:opacity-100 flex flex-col justify-end p-2`}>
                          <p className="text-[9px] font-mono text-zinc-300 truncate">{item.publicId.split('/').pop()}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 rounded-full bg-gold p-1 text-zinc-950 shadow">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center py-20 text-xs text-zinc-500">
                  No images found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-800 p-6 bg-zinc-900/40">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-700 px-5 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={selectedUrls.length === 0}
                className="rounded-lg bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-yellow-500 transition disabled:opacity-50"
              >
                Confirm Selection
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
