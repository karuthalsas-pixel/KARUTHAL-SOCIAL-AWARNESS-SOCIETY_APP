"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon, Save, X, Loader2, Star } from "lucide-react";
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
  const [itemToDelete, setItemToDelete] = useState<{id: number, title: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
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

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.ok) {
        setItems(data.items);
      }
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
      setFormData({
        title: "",
        category: "",
        location: "",
        year: new Date().getFullYear(),
        description: "",
        featured: false,
        order: 0,
        imageUrl: "",
      });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.2, // Compress to max 200KB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        // It returns a Blob, we can pass it as a File to state since FormData accepts Blobs
        setSelectedFile(compressedFile as File);
        setPreviewUrl(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Compression error:", error);
        // Fallback to original if compression fails
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Check if image exists either locally or selected
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
    
    if (selectedFile) {
      data.append("image", selectedFile);
    }
    if (formData.imageUrl) {
      data.append("imageUrl", formData.imageUrl); // preserve existing
    }

    try {
      const url = editingId ? `/api/gallery/${editingId}` : "/api/gallery";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        body: data,
      });
      
      if (res.ok) {
        await fetchItems();
        closeModal();
      } else {
        alert("Failed to save gallery item");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      <div className="p-8 font-sans max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Event Gallery</h1>
            <p className="text-[#0FA4AF] mt-1">Manage the photos displayed in the Event Gallery section.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-[#001f22] font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <Plus size={20} />
            Add Photo
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#024950]/30 border border-[#00F0FF]/20 rounded-xl overflow-hidden backdrop-blur-sm">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="animate-spin text-[#00F0FF]" size={40} />
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-24 h-16 rounded-md object-cover border border-[#00F0FF]/30" />
                        ) : (
                          <div className="w-24 h-16 rounded-md bg-[#002b2e] flex items-center justify-center border border-[#00F0FF]/30">
                            <ImageIcon size={20} className="text-[#0FA4AF]" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-medium text-white">{item.title}</td>
                      <td className="p-4">
                        <span className="bg-[#0FA4AF]/20 text-[#00F0FF] px-2 py-1 rounded text-xs border border-[#0FA4AF]/30">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
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
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#0FA4AF]">
                        No gallery items found. Add some to display on the website!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#002b2e] border border-[#00F0FF]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="sticky top-0 bg-[#002b2e]/90 backdrop-blur-md border-b border-[#00F0FF]/20 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-white">
                {editingId ? "Edit Gallery Item" : "Add New Gallery Item"}
              </h2>
              <button onClick={closeModal} className="text-[#0FA4AF] hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0FA4AF]">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#024950]/50 border border-[#00F0FF]/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all" placeholder="E.g. Interactive Puppet Shows" />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0FA4AF]">Category *</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#024950]/50 border border-[#00F0FF]/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all" placeholder="E.g. Visual Arts" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0FA4AF]">Location</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#024950]/50 border border-[#00F0FF]/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all" placeholder="E.g. Kerala Schools" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0FA4AF]">Year</label>
                  <input type="number" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})} className="w-full bg-[#024950]/50 border border-[#00F0FF]/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all" />
                </div>
                
                <div className="space-y-2 flex flex-col justify-end">
                   <label className="flex items-center gap-2 cursor-pointer p-2 rounded border border-[#0FA4AF]/30 bg-[#024950]/20 hover:bg-[#024950]/50 transition">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 rounded text-[#00F0FF] focus:ring-[#00F0FF] focus:ring-offset-[#001f22] bg-[#001f22] border-[#0FA4AF]" />
                    <span className="text-sm font-medium text-white">Featured Item (Larger display)</span>
                  </label>
                </div>
                
                <div className="space-y-2 flex flex-col justify-end">
                  <label className="block text-sm font-medium text-[#0FA4AF]">Display Order (1 is first)</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full bg-[#024950]/50 border border-[#00F0FF]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-[#0FA4AF]">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-[#024950]/50 border border-[#00F0FF]/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all resize-none" placeholder="A brief description of the event..." />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="block text-sm font-medium text-[#0FA4AF]">Gallery Image *</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#024950]/30 p-4 rounded-xl border border-[#0FA4AF]/20">
                    <div className="shrink-0 w-full sm:w-auto">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full sm:w-48 h-32 object-cover rounded-xl border-2 border-[#00F0FF]/50" />
                      ) : (
                        <div className="w-full sm:w-48 h-32 rounded-xl bg-[#024950]/50 border-2 border-dashed border-[#0FA4AF] flex flex-col items-center justify-center text-[#0FA4AF]">
                          <ImageIcon size={28} />
                          <span className="text-xs mt-2">No image selected</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full text-center sm:text-left">
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="gallery-image-upload" />
                      <label htmlFor="gallery-image-upload" className="inline-block bg-[#024950] hover:bg-[#0FA4AF]/40 border border-[#00F0FF]/40 text-[#AFDDE5] px-6 py-2.5 rounded-lg cursor-pointer transition-colors text-sm font-medium w-full sm:w-auto text-center">
                        Choose Image...
                      </label>
                      <p className="text-xs text-[#0FA4AF] mt-3">Recommended: Landscape format (4:3 or 16:9), max 3MB. JPG, PNG or WebP.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#00F0FF]/20 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-lg border border-[#0FA4AF]/50 text-[#AFDDE5] hover:bg-[#0FA4AF]/10 transition-colors font-medium w-full sm:w-auto">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-[#00F0FF] text-[#001f22] font-bold hover:bg-[#00F0FF]/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 w-full sm:w-auto">
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
