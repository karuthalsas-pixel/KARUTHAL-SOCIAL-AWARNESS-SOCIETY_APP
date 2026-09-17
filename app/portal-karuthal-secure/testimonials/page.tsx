"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Save, X, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

type Testimonial = {
  id: number;
  quote: string;
  author: string;
  role: string | null;
  status: string;
  createdAt: string;
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; author: string } | null>(null);

  // Form State
  const [form, setForm] = useState({ quote: "", author: "", role: "", status: "approved" });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/portal-karuthal-secure/testimonials");
      const data = await res.json();
      if (data.ok) setTestimonials(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (t?: Testimonial) => {
    if (t) {
      setEditingId(t.id);
      setForm({ quote: t.quote, author: t.author, role: t.role || "", status: t.status });
    } else {
      setEditingId(null);
      setForm({ quote: "", author: "", role: "", status: "approved" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const isUpdate = !!editingId;
    const url = isUpdate ? `/api/admin/testimonials/${editingId}` : "/api/portal-karuthal-secure/testimonials";
    const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        closeModal();
        fetchTestimonials();
      } else {
        alert("Failed to save testimonial");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveToggle = async (t: Testimonial) => {
    const newStatus = t.status === "approved" ? "pending" : "approved";
    try {
      await fetch(`/api/admin/testimonials/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...t, status: newStatus })
      });
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass = "w-full bg-[#024950]/50 border border-[#0FA4AF]/30 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all placeholder:text-[#AFDDE5]/30";

  return (
    <>
      <div className="p-4 sm:p-8 font-sans max-w-6xl mx-auto space-y-6 pb-28 sm:pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight flex items-center gap-2">
              <MessageSquareQuote className="text-[#00F0FF]" /> Testimonials
            </h1>
            <p className="text-[#0FA4AF] mt-1 text-sm sm:text-base">Manage public reviews and feedback</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-[#001f22] font-semibold py-3 px-5 rounded-lg transition-colors shadow-[0_0_15px_rgba(0,240,255,0.4)] w-full sm:w-auto"
          >
            <Plus size={20} /> Add Manually
          </button>
        </div>

        {/* Content */}
        <div className="bg-[#024950]/30 border border-[#0FA4AF]/20 rounded-xl overflow-hidden backdrop-blur-sm">
          {loading ? (
            <div className="p-12 text-center text-[#AFDDE5]">Loading...</div>
          ) : testimonials.length === 0 ? (
            <div className="p-8 text-center text-[#0FA4AF]">
              <MessageSquareQuote size={40} className="mx-auto mb-3 opacity-40" />
              No testimonials found.
            </div>
          ) : (
            <>
              {/* ── MOBILE CARD VIEW (< sm) ── */}
              <div className="sm:hidden divide-y divide-[#0FA4AF]/10">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-white text-base truncate">{t.author}</p>
                        <p className="text-xs text-[#AFDDE5]/70 truncate">{t.role}</p>
                      </div>
                      <button onClick={() => handleApproveToggle(t)} className="shrink-0 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-black/20 px-2 py-1 rounded-md border border-white/5">
                        {t.status === "approved" ? (
                          <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={14} /> Approved</span>
                        ) : (
                          <span className="text-amber-400 flex items-center gap-1"><XCircle size={14} /> Pending</span>
                        )}
                      </button>
                    </div>
                    
                    <div className="bg-[#001f22]/50 p-3 rounded-lg border border-white/5 relative">
                      <MessageSquareQuote size={16} className="absolute top-2 right-2 text-[#0FA4AF]/20" />
                      <p className="text-sm text-[#AFDDE5]/90 italic leading-relaxed pr-6">"{t.quote}"</p>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-1">
                      <button onClick={() => openModal(t)} className="flex-1 flex justify-center items-center gap-2 p-2 rounded-lg bg-[#0FA4AF]/10 text-[#0FA4AF] hover:text-[#00F0FF] hover:bg-[#0FA4AF]/20 transition-colors text-sm font-medium">
                        <Pencil size={15} /> Edit
                      </button>
                      <button onClick={() => setItemToDelete({ id: t.id, author: t.author })} className="flex-1 flex justify-center items-center gap-2 p-2 rounded-lg bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors text-sm font-medium">
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── DESKTOP TABLE VIEW (≥ sm) ── */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-[#0FA4AF]/10 border-b border-[#0FA4AF]/20">
                      <th className="p-4 font-semibold text-[#0FA4AF]">Status</th>
                      <th className="p-4 font-semibold text-[#0FA4AF]">Author</th>
                      <th className="p-4 font-semibold text-[#0FA4AF]">Quote</th>
                      <th className="p-4 font-semibold text-[#0FA4AF] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0FA4AF]/10">
                    {testimonials.map((t) => (
                      <tr key={t.id} className="hover:bg-[#0FA4AF]/5 transition-colors">
                        <td className="p-4">
                          <button onClick={() => handleApproveToggle(t)} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-black/20 px-2.5 py-1.5 rounded-md border border-white/5 hover:border-[#0FA4AF]/30 transition-colors">
                            {t.status === "approved" ? (
                              <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={16} /> Approved</span>
                            ) : (
                              <span className="text-amber-400 flex items-center gap-1"><XCircle size={16} /> Pending</span>
                            )}
                          </button>
                        </td>
                        <td className="p-4 min-w-[150px]">
                          <p className="font-bold text-white">{t.author}</p>
                          <p className="text-xs text-[#AFDDE5]/70">{t.role}</p>
                        </td>
                        <td className="p-4 text-sm text-[#AFDDE5]/90 max-w-md truncate italic" title={t.quote}>
                          "{t.quote}"
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openModal(t)} className="p-2 text-[#0FA4AF] hover:text-[#00F0FF] hover:bg-[#0FA4AF]/10 rounded-lg transition-colors inline-block" title="Edit">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => setItemToDelete({ id: t.id, author: t.author })} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors inline-block" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── MODAL FORM ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#002b2e] border border-[#0FA4AF]/30 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl max-h-[92vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#002b2e]/95 backdrop-blur-md border-b border-[#0FA4AF]/20 px-5 py-4 flex justify-between items-center z-10">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-[#0FA4AF] hover:text-white hover:bg-white/10 transition-colors">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#0FA4AF]">Author Name *</label>
                <input required type="text" value={form.author} onChange={e => setForm({...form, author: e.target.value})} className={inputClass} placeholder="E.g. John Doe" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#0FA4AF]">Role / School (Optional)</label>
                <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className={inputClass} placeholder="E.g. Parent, ABC School" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#0FA4AF]">Review / Quote *</label>
                <textarea required value={form.quote} onChange={e => setForm({...form, quote: e.target.value})} rows={4} className={`${inputClass} resize-none leading-relaxed`} placeholder="Enter the testimonial text..." />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#0FA4AF]">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={inputClass}>
                  <option value="approved">Approved (Visible to public)</option>
                  <option value="pending">Pending (Hidden)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#0FA4AF]/20 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button type="button" onClick={closeModal} className="w-full sm:w-auto px-5 py-3 rounded-lg border border-[#0FA4AF]/50 text-[#AFDDE5] hover:bg-[#0FA4AF]/10 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#00F0FF] text-[#001f22] font-bold hover:bg-[#00F0FF]/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => itemToDelete && handleDelete(itemToDelete.id)}
        itemName={itemToDelete?.author}
        message="Are you sure you want to delete this testimonial review?"
      />
    </>
  );
}
