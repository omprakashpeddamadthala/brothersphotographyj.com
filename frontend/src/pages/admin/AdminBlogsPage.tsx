import React, { useEffect, useState } from 'react';
import { apiFetch, uploadMedia } from '@/services/apiClient';
import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react';
import { ConfirmModal } from '@/components/common/AdminModal';
import { ToastContainer } from '@/components/common/Toast';
import type { ToastMessage } from '@/components/common/Toast';

interface BlogItem {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  metaTitle?: string;
  metaDescription?: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchBlogs = async () => {
    try {
      const res = await apiFetch<any>('/admin/blogs?size=50');
      setBlogs(res.content || []);
    } catch (err) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenCreate = () => {
    setEditingBlog({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImageUrl: 'https://picsum.photos/seed/new-blog/1600/1067',
      category: 'Wedding',
      status: 'PUBLISHED',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogItem) => {
    setEditingBlog({ ...blog });
    setModalOpen(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingBlog) return;

    try {
      setUploading(true);
      const res = await uploadMedia(file, 'blog-covers');
      setEditingBlog((prev) => (prev ? { ...prev, coverImageUrl: res.url } : null));
      addToast('success', 'Cover photo uploaded to Cloudinary!');
    } catch (err) {
      addToast('error', 'Cover photo upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    try {
      await apiFetch('/admin/blogs', {
        method: 'POST',
        body: JSON.stringify(editingBlog),
      });
      setModalOpen(false);
      addToast('success', 'Blog post saved successfully!');
      fetchBlogs();
    } catch (err: any) {
      addToast('error', 'Failed to save blog: ' + err.message);
    }
  };

  const handleConfirmDeleteBlog = async () => {
    if (!deleteBlogId) return;

    try {
      await apiFetch(`/admin/blogs/${deleteBlogId}`, { method: 'DELETE' });
      addToast('success', 'Blog post deleted successfully.');
      fetchBlogs();
    } catch (err: any) {
      addToast('error', 'Delete failed');
    } finally {
      setDeleteBlogId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmModal
        isOpen={deleteBlogId !== null}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete Post"
        isDanger
        onConfirm={handleConfirmDeleteBlog}
        onClose={() => setDeleteBlogId(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-100">
            Blog CMS Manager
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
            Articles, Cover Images & SEO Metadata
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-950 hover:bg-yellow-500 transition"
        >
          <Plus size={16} /> New Blog Post
        </button>
      </div>

      {/* Blog Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="border-b border-zinc-800 bg-zinc-950/50 uppercase tracking-wider text-zinc-500 font-medium">
            <tr>
              <th className="px-6 py-4">Cover</th>
              <th className="px-6 py-4">Title / Slug</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-zinc-800/30">
                <td className="px-6 py-4">
                  <img src={blog.coverImageUrl} alt={blog.title} className="h-12 w-16 object-cover rounded-md border border-zinc-800" />
                </td>
                <td className="px-6 py-4">
                  <p className="font-serif text-sm font-medium text-zinc-100">{blog.title}</p>
                  <p className="text-zinc-500 font-mono text-[11px]">{blog.slug}</p>
                </td>
                <td className="px-6 py-4">{blog.category || 'Wedding'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    blog.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button type="button" onClick={() => handleOpenEdit(blog)} className="p-2 text-zinc-400 hover:text-gold">
                    <Edit2 size={16} />
                  </button>
                  <button type="button" onClick={() => setDeleteBlogId(blog.id!)} className="p-2 text-red-400 hover:text-red-300">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {modalOpen && editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="font-serif text-2xl font-light text-zinc-100">
                {editingBlog.id ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 uppercase mb-1">Title *</label>
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-zinc-400 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={editingBlog.category || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase mb-1">Status</label>
                  <select
                    value={editingBlog.status}
                    onChange={(e) => setEditingBlog({ ...editingBlog, status: e.target.value as any })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold cursor-pointer"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase mb-1">Cover Image (Cloudinary Upload)</label>
                <div className="flex items-center gap-4">
                  <img src={editingBlog.coverImageUrl} alt="Cover" className="h-16 w-24 object-cover rounded border border-zinc-800" />
                  <label className="cursor-pointer rounded-lg bg-zinc-800 px-4 py-2 text-xs text-zinc-200 hover:bg-zinc-700 flex items-center gap-2">
                    <Upload size={14} />
                    {uploading ? 'Uploading…' : 'Upload Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase mb-1">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase mb-1">Full Content</label>
                <textarea
                  rows={5}
                  value={editingBlog.content || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-zinc-700 px-5 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-yellow-500 transition"
                >
                  Save Blog Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
