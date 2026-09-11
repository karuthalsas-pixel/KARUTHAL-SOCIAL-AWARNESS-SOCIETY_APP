"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Link as LinkIcon, Image as ImageIcon, Save, X, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/Button";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

type ProgramItem = {
  id: number;
  imageUrl: string;
  title: string | null;
  description: string | null;
  order: number;
  createdAt: string;
};

export default function AdminPrograms() {
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<ProgramItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, title: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [form, setForm] = useState({ imageUrl: "", title: "", description: "", order: 0 });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/programs");
      const data = await res.json();
      if (data.ok) setItems(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        setSelectedFile(compressedFile as File);
        setPreviewUrl(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Compression error:", error);
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.imageUrl && !selectedFile) {
      alert("Please provide an Image URL or select an image to upload.");
      return;
    }

    const isUpdate = !!isEditing;
    const url = isUpdate ? `/api/admin/programs/${isEditing.id}` : "/api/admin/programs";
    const method = isUpdate ? "PUT" : "POST";

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("order", form.order.toString());
    
    if (selectedFile) {
      data.append("image", selectedFile);
    }
    if (form.imageUrl) {
      data.append("imageUrl", form.imageUrl);
    }

    try {
      const res = await fetch(url, {
        method,
        body: data
      });
      if (res.ok) {
        setIsAdding(false);
        setIsEditing(null);
        setForm({ imageUrl: "", title: "", description: "", order: 0 });
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const openAdd = () => {
    setIsAdding(true); 
    setIsEditing(null); 
    setForm({ imageUrl: "", title: "", description: "", order: 0 });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const openEdit = (item: ProgramItem) => {
    setIsEditing(item); 
    setForm({ imageUrl: item.imageUrl, title: item.title || "", description: item.description || "", order: item.order });
    setSelectedFile(null);
    setPreviewUrl(item.imageUrl);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Awareness Programs</h1>
          <p className="text-[#AFDDE5]/70 mt-1">Manage the masonry image grid for the Awareness Programs section</p>
        </div>
        <Button onClick={openAdd} variant="primary" className="gap-2">
          <Plus size={18} /> Add Program Image
        </Button>
      </div>

      {(isAdding || isEditing) && (
        <div className="mb-8 p-6 bg-[#02393e]/50 border border-[#0FA4AF]/30 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4">{isEditing ? "Edit Program Image" : "New Program Image"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Image Selection Area */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="col-span-full">
                <label className="block text-sm font-medium text-[#AFDDE5] mb-2">Program Image *</label>
                <div className="flex flex-col sm:flex-row gap-6 bg-[#001f22] p-4 rounded-xl border border-[#0FA4AF]/30 items-center">
                  <div className="shrink-0">
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewUrl} alt="Preview" className="w-48 h-32 object-cover rounded-xl border border-[#0FA4AF]" />
                    ) : (
                      <div className="w-48 h-32 rounded-xl bg-[#024950]/50 border border-dashed border-[#0FA4AF] flex flex-col items-center justify-center text-[#AFDDE5]/50">
                        <ImageIcon size={24} />
                        <span className="text-xs mt-2">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <p className="text-sm text-white mb-2">Option 1: Upload a File</p>
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="program-upload" />
                      <label htmlFor="program-upload" className="inline-block bg-[#024950] hover:bg-[#0FA4AF]/40 border border-[#00F0FF]/40 text-[#AFDDE5] px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium w-full text-center sm:w-auto">
                        Choose File...
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-px bg-[#0FA4AF]/30 flex-1"></div>
                      <span className="text-xs text-[#AFDDE5]/50 uppercase tracking-widest">OR</span>
                      <div className="h-px bg-[#0FA4AF]/30 flex-1"></div>
                    </div>
                    <div>
                      <p className="text-sm text-white mb-2">Option 2: Provide an Image Link</p>
                      <div className="flex relative">
                        <div className="absolute left-3 top-3 text-[#AFDDE5]/50"><LinkIcon size={16} /></div>
                        <input value={form.imageUrl} onChange={e => { setForm({...form, imageUrl: e.target.value}); setPreviewUrl(e.target.value); }} className="w-full bg-[#024950] border border-[#0FA4AF]/30 rounded-lg p-2.5 pl-10 text-white" placeholder="https://..." />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#AFDDE5] mb-1">Title (Optional)</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-[#001f22] border border-[#0FA4AF]/30 rounded-lg p-2.5 text-white" placeholder="Leave blank if you just want to show the image" />
              </div>
              
              <div>
                <label className="block text-sm text-[#AFDDE5] mb-1">Display Order</label>
                <input type="number" required value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} className="w-full bg-[#001f22] border border-[#0FA4AF]/30 rounded-lg p-2.5 text-white" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-[#AFDDE5] mb-1">Description (Optional)</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full bg-[#001f22] border border-[#0FA4AF]/30 rounded-lg p-2.5 text-white" placeholder="Leave blank if you just want to show the image" />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary">Save Item</Button>
              <Button type="button" variant="secondary" onClick={() => { setIsAdding(false); setIsEditing(null); }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.length === 0 ? (
          <div className="col-span-full p-8 text-center text-[#AFDDE5]/50 border border-[#0FA4AF]/20 border-dashed rounded-2xl break-inside-avoid">
            No program images found. Add some to build the masonry grid!
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-[#002b2e]/60 rounded-2xl border border-[#0FA4AF]/20 overflow-hidden flex flex-col group break-inside-avoid shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="w-full bg-[#001f22] relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.title || "Program image"} className="w-full h-auto object-cover transition-transform group-hover:scale-105" />
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-xs font-mono text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  Order: {item.order}
                </div>
              </div>
              <div className="p-4 flex flex-col">
                {item.title && <h3 className="font-bold text-white mb-1 truncate">{item.title}</h3>}
                {item.description && <p className="text-sm text-[#AFDDE5]/70 line-clamp-2 mb-4">{item.description}</p>}
                {(!item.title && !item.description) && <p className="text-xs text-[#AFDDE5]/30 italic mb-4">No text overlay (Image only)</p>}
                
                <div className="flex justify-end gap-2 mt-auto pt-2 border-t border-[#0FA4AF]/10">
                  <button onClick={() => openEdit(item)} className="flex-1 flex justify-center items-center gap-2 p-2 text-[#AFDDE5]/70 hover:text-white bg-white/5 hover:bg-[#0FA4AF]/20 rounded-lg transition-colors text-sm">
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => setItemToDelete({ id: item.id, title: item.title || "Program Image" })} className="flex-1 flex justify-center items-center gap-2 p-2 text-red-400 hover:text-red-300 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors text-sm">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteConfirmModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => itemToDelete && handleDelete(itemToDelete.id)}
        itemName={itemToDelete?.title}
        message="Are you sure you want to delete this program item from the grid?"
      />
    </div>
  );
}
