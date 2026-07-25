import { useEffect, useState } from 'react';
import { apiFetch } from '@/services/apiClient';
import { Mail, Phone, Calendar, MapPin } from 'lucide-react';

interface EnquiryItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  eventDate?: string;
  eventType?: string;
  numberOfEvents?: string;
  location?: string;
  heardAboutUs?: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchEnquiries = async () => {
    try {
      const statusParam = filterStatus !== 'ALL' ? `?status=${filterStatus}` : '';
      const res = await apiFetch<any>(`/admin/enquiries${statusParam}`);
      setEnquiries(res.content || []);
    } catch (err) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [filterStatus]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await apiFetch(`/admin/enquiries/${id}/status?status=${status}`, { method: 'PUT' });
      fetchEnquiries();
    } catch (err: any) {
      alert('Status update failed');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-100">
            Booking Enquiries Manager
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
            Client Form Submissions & Event Details
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-1 text-xs">
          {['ALL', 'NEW', 'READ', 'REPLIED', 'ARCHIVED'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                filterStatus === status ? 'bg-gold text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {enquiries.map((enquiry) => (
          <div key={enquiry.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-zinc-100">{enquiry.name}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Mail size={14} className="text-zinc-500" /> {enquiry.email}
                  </span>
                  {enquiry.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={14} className="text-zinc-500" /> {enquiry.phone}
                    </span>
                  )}
                  {enquiry.eventDate && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-zinc-500" /> {enquiry.eventDate}
                    </span>
                  )}
                  {enquiry.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-zinc-500" /> {enquiry.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Select */}
              <select
                value={enquiry.status}
                onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-200 outline-none cursor-pointer focus:border-gold"
              >
                <option value="NEW">NEW</option>
                <option value="READ">READ</option>
                <option value="REPLIED">REPLIED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-4 text-xs text-zinc-300 leading-relaxed">
              <p className="font-medium text-zinc-400 mb-1">Message:</p>
              {enquiry.message}
            </div>

            {(enquiry.eventType || enquiry.heardAboutUs) && (
              <div className="flex items-center gap-6 text-[11px] text-zinc-500">
                {enquiry.eventType && <span>Event Type: <strong className="text-zinc-300">{enquiry.eventType}</strong></span>}
                {enquiry.heardAboutUs && <span>Source: <strong className="text-zinc-300">{enquiry.heardAboutUs}</strong></span>}
              </div>
            )}
          </div>
        ))}

        {enquiries.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-16 text-center text-xs text-zinc-500">
            No enquiries found for status: {filterStatus}
          </div>
        )}
      </div>
    </div>
  );
}
