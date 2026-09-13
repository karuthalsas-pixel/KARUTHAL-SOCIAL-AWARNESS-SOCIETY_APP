"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, UserCircle, Save, X, Loader2, Image as ImageIcon, Phone, MapPin, Hash } from "lucide-react";
import imageCompression from "browser-image-compression";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

type Employee = {
  id: number;
  name: string;
  role: string;
  address: string | null;
  phone: string | null;
  imageUrl: string | null;
  order: number;
};

export default function EmployeesAdmin() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, name: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    address: "",
    phone: "",
    order: 0,
    imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      if (data.ok) setEmployees(data.items);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (employee?: Employee) => {
    if (employee) {
      setEditingId(employee.id);
      setFormData({
        name: employee.name,
        role: employee.role,
        address: employee.address || "",
        phone: employee.phone || "",
        order: employee.order,
        imageUrl: employee.imageUrl || "",
      });
      setPreviewUrl(employee.imageUrl);
    } else {
      setEditingId(null);
      setFormData({ name: "", role: "", address: "", phone: "", order: 0, imageUrl: "" });
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
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        });
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
    const data = new FormData();
    data.append("name", formData.name);
    data.append("role", formData.role);
    data.append("address", formData.address);
    data.append("phone", formData.phone);
    data.append("order", formData.order.toString());
    if (selectedFile) data.append("image", selectedFile);
    if (formData.imageUrl) data.append("imageUrl", formData.imageUrl);

    try {
      const url = editingId ? `/api/employees/${editingId}` : "/api/employees";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        await fetchEmployees();
        closeModal();
      } else {
        alert("Failed to save employee");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (res.ok) setEmployees(employees.filter(e => e.id !== id));
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Employee Directory</h1>
            <p className="text-[#0FA4AF] mt-1 text-sm sm:text-base">Manage staff members displayed on the About page.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-[#001f22] font-semibold py-3 px-5 rounded-lg transition-colors shadow-[0_0_15px_rgba(0,240,255,0.4)] w-full sm:w-auto"
          >
            <Plus size={20} />
            Add Employee
          </button>
        </div>

        {/* Content */}
        <div className="bg-[#024950]/30 border border-[#00F0FF]/20 rounded-xl overflow-hidden backdrop-blur-sm">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="animate-spin text-[#00F0FF]" size={40} />
            </div>
          ) : employees.length === 0 ? (
            <div className="p-8 text-center text-[#0FA4AF]">
              No employees found. Add some to display on the website!
            </div>
          ) : (
            <>
              {/* ── MOBILE CARD VIEW (< sm) ── */}
              <div className="sm:hidden divide-y divide-[#00F0FF]/10">
                {employees.map((emp) => (
                  <div key={emp.id} className="p-4 flex gap-4">
                    {/* Avatar */}
                    <div className="shrink-0">
                      {emp.imageUrl ? (
                        <img src={emp.imageUrl} alt={emp.name} className="w-14 h-14 rounded-full object-cover border border-[#00F0FF]/40" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#002b2e] flex items-center justify-center border border-[#00F0FF]/30">
                          <ImageIcon size={22} className="text-[#0FA4AF]" />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{emp.name}</p>
                      <p className="text-[#00F0FF] text-sm font-medium">{emp.role}</p>
                      {emp.phone && (
                        <p className="text-[#AFDDE5]/70 text-xs mt-1 flex items-center gap-1">
                          <Phone size={11} /> {emp.phone}
                        </p>
                      )}
                      <p className="text-[#AFDDE5]/50 text-xs mt-0.5 flex items-center gap-1">
                        <Hash size={11} /> Order: {emp.order}
                      </p>
                    </div>
                    {/* Actions */}
                    <div className="shrink-0 flex flex-col gap-3 justify-center">
                      <button onClick={() => openModal(emp)} className="p-2 rounded-lg bg-[#0FA4AF]/20 text-[#0FA4AF] hover:text-[#00F0FF] transition-colors" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setItemToDelete({ id: emp.id, name: emp.name })} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:text-red-300 transition-colors" title="Delete">
                        <Trash2 size={16} />
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
                      <th className="p-4 font-semibold text-white">Name</th>
                      <th className="p-4 font-semibold text-white">Role</th>
                      <th className="p-4 font-semibold text-white">Phone</th>
                      <th className="p-4 font-semibold text-white">Order</th>
                      <th className="p-4 font-semibold text-white text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#00F0FF]/10">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-[#0FA4AF]/10 transition-colors">
                        <td className="p-4">
                          {emp.imageUrl ? (
                            <img src={emp.imageUrl} alt={emp.name} className="w-12 h-12 rounded-full object-cover border border-[#00F0FF]/30" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#002b2e] flex items-center justify-center border border-[#00F0FF]/30">
                              <ImageIcon size={20} className="text-[#0FA4AF]" />
                            </div>
                          )}
                        </td>
                        <td className="p-4 font-medium text-white">{emp.name}</td>
                        <td className="p-4 text-[#AFDDE5]">{emp.role}</td>
                        <td className="p-4 text-[#AFDDE5]">{emp.phone || '-'}</td>
                        <td className="p-4 text-[#AFDDE5]">{emp.order}</td>
                        <td className="p-4 text-right space-x-3">
                          <button onClick={() => openModal(emp)} className="text-[#0FA4AF] hover:text-[#00F0FF] transition-colors" title="Edit">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => setItemToDelete({ id: emp.id, name: emp.name })} className="text-red-400 hover:text-red-300 transition-colors" title="Delete">
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
                {editingId ? "Edit Employee" : "Add New Employee"}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-[#0FA4AF] hover:text-white hover:bg-white/10 transition-colors">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#0FA4AF]">Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} placeholder="Full name" />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#0FA4AF]">Role / Position *</label>
                <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className={inputClass} placeholder="e.g. President, Secretary" />
              </div>

              {/* Phone + Order side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#0FA4AF]">Phone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#0FA4AF]">Display Order</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className={inputClass} />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#0FA4AF]">Address</label>
                <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} className={`${inputClass} resize-none`} placeholder="Full address..." />
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#0FA4AF]">Profile Image</label>
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-[#00F0FF]/50" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-[#024950]/50 border-2 border-dashed border-[#0FA4AF] flex flex-col items-center justify-center text-[#0FA4AF]">
                        <ImageIcon size={24} />
                        <span className="text-[10px] mt-1">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="flex items-center justify-center gap-2 bg-[#024950] hover:bg-[#0FA4AF]/40 border border-[#00F0FF]/40 text-[#AFDDE5] px-4 py-3 rounded-lg cursor-pointer transition-colors text-sm font-medium w-full">
                      <ImageIcon size={16} /> Choose Image...
                    </label>
                    <p className="text-xs text-[#0FA4AF] mt-2">Square (1:1), max 2MB. JPG or PNG.</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#00F0FF]/20 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button type="button" onClick={closeModal} className="w-full sm:w-auto px-5 py-3 rounded-lg border border-[#0FA4AF]/50 text-[#AFDDE5] hover:bg-[#0FA4AF]/10 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#00F0FF] text-[#001f22] font-bold hover:bg-[#00F0FF]/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? "Saving..." : "Save Employee"}
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
        itemName={itemToDelete?.name}
        message="Are you sure you want to remove this employee from the directory?"
      />
    </>
  );
}
