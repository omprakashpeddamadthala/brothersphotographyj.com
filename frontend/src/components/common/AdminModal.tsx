import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-6 font-sans text-zinc-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {isDanger && (
                  <div className="rounded-full bg-red-500/10 p-2 text-red-400">
                    <AlertTriangle size={20} />
                  </div>
                )}
                <h3 className="font-serif text-xl font-medium">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs leading-relaxed text-zinc-300">{message}</p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition ${
                  isDanger
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-gold text-zinc-950 hover:bg-yellow-500'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface InputModalProps {
  isOpen: boolean;
  title: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
}

export function InputModal({
  isOpen,
  title,
  label = 'Enter details:',
  placeholder = '',
  defaultValue = '',
  confirmText = 'Create',
  onConfirm,
  onClose,
}: InputModalProps) {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onConfirm(value.trim());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-6 font-sans text-zinc-100"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-medium">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-yellow-500"
                >
                  {confirmText}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
