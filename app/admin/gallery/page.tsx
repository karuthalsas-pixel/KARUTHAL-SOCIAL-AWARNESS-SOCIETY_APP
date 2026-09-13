"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon, Save, X, Loader2, Star, MapPin, Calendar, Hash } from "lucide-react";
import imageCompression from "browser-image-compression";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

type GalleryItem = {
  id: number;
  title: string;
  category: string;
  location: string | null;
  year: number | null;
  imageUrl: string;
  description: string | null;
  featured: boolean;
  order: number;
};

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; title: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    year: new Date().getFullYear(),
    description: "",
    featured: false,
    order: 0,
    imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.ok) setItems(data.items);
    } catch (error) {
      console.error("Failed to fetch gallery items", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: GalleryItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        category: item.category,
        location: item.location || "",
        year: item.year || new Date().getFullYear(),
        description: item.description || "",
        featured: item.featured,
        order: item.order,
        imageUrl: item.imageUrl,
      });
      setPreviewUrl(item.imageUrl);
    } else {
      setEditingId(null);
      setFormData({ title: "", category: "", location: "", year: new Date().getFullYear(), description: "", featured: false, order: 0, imageUrl: "" });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await imageCompression(file, { maxSizeMB: 0.2, maxWidthOrHeight: 1920, useWebWorker: true });
        setSelectedFile(compressedFile as File);
        setPreviewUrl(URL.createObjectURL(compressedFile));
      } catch {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (!formData.imageUrl && !selectedFile) {
      alert("Please select an image");
      setSaving(false);
      return;
    }
    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("year", formData.year.toString());
    data.append("description", formData.description);
    data.append("featured", formData.featured.toString());
    data.append("order", formData.order.toString());
    if (selectedFile) data.append("image", selectedFile);
    if (formData.imageUrl) data.append("imageUrl", formData.imageUrl);
    try {
      const url = editingId ? `/api/gallery/${editingId}` : "/api/gallery";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, body: data });
      if (res.ok) { await fetchItems(); closeModal(); }
      else alert("Failed to save gallery item");
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) setItems(items.filter(e => e.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const inputClass = "w-full bg-[#024950]/50 border border-[#00F0FF]/30 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all placeholder:text-white/30";

  return (
    <>
      <div className="p-4 sm:p-8 font-sans max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Event Gallery</h1>
            <p className="text-[#0FA4AF] mt-1 text-sm sm:text-base">Manage photos displayed in the Event Gallery section.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-[#001f22] font-semibold py-3 px-5 rounded-lg transition-colors shadow-[0_0_15px_rgba(0,240,255,0.4)] w-full sm:w-auto"
          >
            <Plus size={20} /> Add Photo
          </button>
        </div>

        {/* Content */}
        <div className="bg-[#024950]/30 border border-[#00F0FF]/20 rounded-xl overflow-hidden backdrop-blur-sm">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="animate-spin text-[#00F0FF]" size={40} />
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-[#0FA4AF]">
              <ImageIcon size={40} className="mx-auto mb-3 opacity-40" />
              No gallery items found. Add some to display on the website!
            </div>
          ) : (
            <>
              {/* ── MOBILE CARD VIEW (< sm) ── */}
              <div className="sm:hidden divide-y divide-[#00F0FF]/10">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-3">
                    {/* Thumbnail */}
                    <div className="shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-20 h-14 rounded-lg object-cover border border-[#00F0FF]/30"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-1">
                        {item.featured && <Star size={12} className="text-yellow-400 fill-yellow-400 shrink-0 mt-1" />}
                        <p className="font-bold text-white text-sm leading-snug truncate">{item.title}</p>
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#0FA4AF]/20 text-[#00F0FF] text-[10px] font-semibold rounded border border-[#0FA4AF]/30">
                        {item.category}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {item.location && (
                          <p className="text-[#AFDDE5]/60 text-xs flex items-center gap-1">
                            <MapPin size={10} className="shrink-0" /> {item.location}
                          </p>
                        )}
                        {item.year && (
                          <p className="text-[#AFDDE5]/60 text-xs flex items-center gap-1">
                            <Calendar size={10} className="shrink-0" /> {item.year}
                          </p>
                        )}
                        <p className="text-[#AFDDE5]/50 text-xs flex items-center gap-1">
                          <Hash size={10} className="shrink-0" /> Order: {item.order}
                        </p>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="shrink-0 flex flex-col gap-2 justify-center">
                      <button onClick={() => openModal(item)} className="p-2 rounded-lg bg-[#0FA4AF]/20 text-[#0FA4AF] hover:text-[#00F0FF] transition-colors" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setItemToDelete({ id: item.id, title: item.title })} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:text-red-300 transition-colors" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── DESKTOP TABLE VIEW (≥ sm) ── */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#002b2e]/80 border-b border-[#00F0FF]/20">
                      <th className="p-4 font-semibold text-white">Image</th>
                      <th className="p-4 font-semibold text-white">Title</th>
                      <th className="p-4 font-semibold text-white">Category</th>
                      <th className="p-4 font-semibold text-white">Details</th>
                      <th className="p-4 font-semibold text-white text-center">Featured</th>
                      <th className="p-4 font-semibold text-white text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#00F0FF]/10">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#0FA4AF]/10 transition-colors">
                        <td className="p-4">
                          <img src={item.imageUrl} alt={item.title} className="w-24 h-16 rounded-md object-cover border border-[#00F0FF]/30" />
                        </td>
                        <td className="p-4 font-medium text-white">{item.title}</td>
                        <td className="p-4">
                          <span className="bg-[#0FA4AF]/20 text-[#00F0FF] px-2 py-1 rounded text-xs border border-[#0FA4AF]/30">{item.category}</span>
                        </td>
                        <td className="p-4 text-sm text-[#AFDDE5]">
                          {item.location && <div>📍 {item.location}</div>}
                          {item.year && <div className="text-[#0FA4AF]">📅 {item.year}</div>}
                        </td>
                        <td className="p-4 text-center">
                          {item.featured && <Star size={16} className="text-yellow-400 inline fill-yellow-400" />}
                        </td>
                        <td className="p-4 text-right space-x-3">
                          <button onClick={() => openModal(item)} className="text-[#0FA4AF] hover:text-[#00F0FF] transition-colors" title="Edit">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => setItemToDelete({ id: item.id, title: item.title })} className="text-red-400 hover:text-red-300 transition-colors" title="Delete">
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
          <div className="bg-[#002b2e] border border-[#00F0FF]/30 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#002b2e]/95 backdrop-blur-md border-b border-[#00F0FF]/20 px-5 py-4 flex justify-between items-center z-10">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {editingId ? "Edit Gallery Item" : "Add New Gallery Item"}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-[#0FA4AF] hover:text-white hover:bg-white/10 transition-colors">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#0FA4AF]">Title *</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="E.g. Interactive Puppet Shows" />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#0FA4AF]">Category *</label>
                <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputClass} placeholder="E.g. Awareness Program" />
              </div>

              {/* Location + Year side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#0FA4AF]">Location</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={inputClass} placeholder="School / City" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#0FA4AF]">Year</label>
                  <input type="number" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})} className={inputClass} />
                </div>
              </div>

              {/* Order + Featured side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#0FA4AF]">Display Order</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className={inputClass} />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-[#0FA4AF]/30 bg-[#024950]/20 hover:bg-[#024950]/50 transition h-[50px]">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 rounded text-[#00F0FF] focus:ring-[#00F0FF] bg-[#001f22] border-[#0FA4AF]" />
                    <span className="text-sm font-medium text-white flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400" /> Featured</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#0FA4AF]">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className={`${inputClass} resize-none`} placeholder="A brief description of the event..." />
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#0FA4AF]">Gallery Image *</label>
                <div className="bg-[#024950]/30 p-4 rounded-xl border border-[#0FA4AF]/20 space-y-3">
                  {/* Preview */}
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg border-2 border-[#00F0FF]/50" />
                  ) : (
                    <div className="w-full h-32 rounded-lg bg-[#024950]/50 border-2 border-dashed border-[#0FA4AF] flex flex-col items-center justify-center text-[#0FA4AF]">
                      <ImageIcon size={28} />
                      <span className="text-xs mt-2">No image selected</span>
                    </div>
                  )}
                  {/* Upload button */}
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="gallery-image-upload" />
                  <label htmlFor="gallery-image-upload" className="flex items-center justify-center gap-2 bg-[#024950] hover:bg-[#0FA4AF]/40 border border-[#00F0FF]/40 text-[#AFDDE5] px-4 py-3 rounded-lg cursor-pointer transition-colors text-sm font-medium w-full">
                    <ImageIcon size={16} /> {previewUrl ? "Change Image..." : "Choose Image..."}
                  </label>
                  <p className="text-xs text-[#0FA4AF]">Landscape (4:3 or 16:9), max 3MB. JPG, PNG or WebP.</p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#00F0FF]/20 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button type="button" onClick={closeModal} className="w-full sm:w-auto px-5 py-3 rounded-lg border border-[#0FA4AF]/50 text-[#AFDDE5] hover:bg-[#0FA4AF]/10 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#00F0FF] text-[#001f22] font-bold hover:bg-[#00F0FF]/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? "Saving..." : "Save Photo"}
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
        itemName={itemToDelete?.title}
        message="Are you sure you want to delete this photo from the gallery?"
      />
    </>
  );
}
