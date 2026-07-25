import { useEffect, useState } from 'react';
import { apiFetch } from '@/services/apiClient';
import { Plus, Trash2, Save } from 'lucide-react';
import { ConfirmModal } from '@/components/common/AdminModal';
import { ToastContainer } from '@/components/common/Toast';
import type { ToastMessage } from '@/components/common/Toast';

interface FaqItem {
  id?: number;
  question: string;
  answer: string;
  category: string;
  active: boolean;
}

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [deleteFaqId, setDeleteFaqId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchFaqs = async () => {
    try {
      const data = await apiFetch<FaqItem[]>('/admin/faqs');
      setFaqs(data);
    } catch (err) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAddFaq = () => {
    setFaqs([
      ...faqs,
      {
        question: 'How far in advance should we book?',
        answer: 'We recommend booking 6 to 12 months in advance for destination weddings.',
        category: 'General',
        active: true,
      },
    ]);
  };

  const handleSaveFaq = async (faq: FaqItem) => {
    try {
      await apiFetch('/admin/faqs', {
        method: 'POST',
        body: JSON.stringify(faq),
      });
      addToast('success', 'FAQ saved successfully!');
      fetchFaqs();
    } catch (err: any) {
      addToast('error', 'Save failed: ' + err.message);
    }
  };

  const handleConfirmDeleteFaq = async () => {
    if (!deleteFaqId) return;
    try {
      await apiFetch(`/admin/faqs/${deleteFaqId}`, { method: 'DELETE' });
      addToast('success', 'FAQ deleted.');
      fetchFaqs();
    } catch (err) {
      addToast('error', 'Delete failed');
    } finally {
      setDeleteFaqId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmModal
        isOpen={deleteFaqId !== null}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ item?"
        confirmText="Delete FAQ"
        isDanger
        onConfirm={handleConfirmDeleteFaq}
        onClose={() => setDeleteFaqId(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-100">
            FAQ Manager
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
            Frequently Asked Questions & Answers
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddFaq}
          className="flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-950 hover:bg-yellow-500 transition"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={faq.id || idx} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
            <div>
              <label className="block text-xs uppercase text-zinc-400 mb-1">Question</label>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => {
                  const copy = [...faqs];
                  copy[idx].question = e.target.value;
                  setFaqs(copy);
                }}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold font-medium"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-zinc-400 mb-1">Answer</label>
              <textarea
                rows={3}
                value={faq.answer}
                onChange={(e) => {
                  const copy = [...faqs];
                  copy[idx].answer = e.target.value;
                  setFaqs(copy);
                }}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-gold"
              />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={faq.active}
                  onChange={(e) => {
                    const copy = [...faqs];
                    copy[idx].active = e.target.checked;
                    setFaqs(copy);
                  }}
                  className="rounded border-zinc-700 bg-zinc-950 text-gold focus:ring-gold"
                />
                Active FAQ
              </label>

              <div className="flex items-center gap-2">
                {faq.id && (
                  <button type="button" onClick={() => setDeleteFaqId(faq.id!)} className="p-2 text-red-400 hover:text-red-300 transition">
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleSaveFaq(faq)}
                  className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-yellow-500 transition"
                >
                  <Save size={14} /> Save FAQ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
