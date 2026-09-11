"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState<Testimonial | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, author: string} | null>(null);

  // Form State
  const [form, setForm] = useState({ quote: "", author: "", role: "", status: "approved" });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (data.ok) setTestimonials(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = !!isEditing;
    const url = isUpdate ? `/api/admin/testimonials/${isEditing.id}` : "/api/admin/testimonials";
    const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setIsAdding(false);
        setIsEditing(null);
        setForm({ quote: "", author: "", role: "", status: "approved" });
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
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

  return (
    <div className="p-4 md:p-8 pb-28">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Testimonials</h1>
          <p className="text-sm md:text-base text-[#AFDDE5]/70 mt-1">Manage public reviews and feedback</p>
        </div>
        <Button onClick={() => { setIsAdding(true); setIsEditing(null); setForm({ quote: "", author: "", role: "", status: "approved" }); }} variant="primary" className="gap-2 w-full sm:w-auto justify-center">
          <Plus size={18} /> Add Manually
        </Button>
      </div>

      {(isAdding || isEditing) && (
        <div className="mb-8 p-6 bg-[#02393e]/50 border border-[#0FA4AF]/30 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4">{isEditing ? "Edit Testimonial" : "New Testimonial"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-[#AFDDE5] mb-1">Author Name</label>
              <input required value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full bg-[#001f22] border border-[#0FA4AF]/30 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label className="block text-sm text-[#AFDDE5] mb-1">Role / School (Optional)</label>
              <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-[#001f22] border border-[#0FA4AF]/30 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label className="block text-sm text-[#AFDDE5] mb-1">Review / Quote</label>
              <textarea required value={form.quote} onChange={e => setForm({...form, quote: e.target.value})} rows={3} className="w-full bg-[#001f22] border border-[#0FA4AF]/30 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label className="block text-sm text-[#AFDDE5] mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-[#001f22] border border-[#0FA4AF]/30 rounded-lg p-2.5 text-white">
                <option value="approved">Approved (Visible)</option>
                <option value="pending">Pending (Hidden)</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary">Save</Button>
              <Button type="button" variant="secondary" onClick={() => { setIsAdding(false); setIsEditing(null); }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#002b2e]/60 rounded-2xl border border-[#0FA4AF]/20 overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-[#0FA4AF]/10 border-b border-[#0FA4AF]/20">
            <tr>
              <th className="p-4 font-semibold text-[#0FA4AF]">Status</th>
              <th className="p-4 font-semibold text-[#0FA4AF]">Author</th>
              <th className="p-4 font-semibold text-[#0FA4AF]">Quote</th>
              <th className="p-4 font-semibold text-[#0FA4AF] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0FA4AF]/10">
            {testimonials.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-[#AFDDE5]/50">No testimonials found.</td></tr>
            ) : (
              testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-[#0FA4AF]/5 transition-colors">
                  <td className="p-4">
                    <button onClick={() => handleApproveToggle(t)} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                      {t.status === "approved" ? (
                        <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={16} /> Approved</span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1"><XCircle size={16} /> Pending</span>
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white">{t.author}</p>
                    <p className="text-xs text-[#AFDDE5]/70">{t.role}</p>
                  </td>
                  <td className="p-4 text-sm text-[#AFDDE5]/80 max-w-md truncate" title={t.quote}>
                    "{t.quote}"
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setIsEditing(t); setForm({ quote: t.quote, author: t.author, role: t.role || "", status: t.status }); }} className="p-2 text-[#AFDDE5]/70 hover:text-white bg-white/5 hover:bg-[#0FA4AF]/20 rounded-lg transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setItemToDelete({ id: t.id, author: t.author })} className="p-2 text-red-400 hover:text-red-300 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => itemToDelete && handleDelete(itemToDelete.id)}
        itemName={itemToDelete?.author}
        message="Are you sure you want to delete this testimonial review?"
      />
    </div>
  );
}
