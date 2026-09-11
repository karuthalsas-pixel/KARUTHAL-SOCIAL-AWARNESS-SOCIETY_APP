import { X, AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string | null;
}

export function DeleteConfirmModal({ 
  isOpen, onClose, onConfirm, 
  title = "Confirm Deletion", 
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName 
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#002b2e] border border-red-500/30 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
              <AlertTriangle className="text-red-400" size={24} />
            </div>
            <div className="pt-1">
              <h2 className="text-xl font-bold text-white leading-tight">{title}</h2>
              <p className="text-sm text-[#AFDDE5]/70 mt-1">Deletion is permanent.</p>
            </div>
          </div>
          
          <div className="bg-[#001f22] rounded-xl p-4 border border-red-500/10 mb-6">
            <p className="text-[#AFDDE5] text-sm leading-relaxed">
              {message}
            </p>
            {itemName && (
              <p className="font-bold text-white block mt-2 px-3 py-2 bg-red-500/5 rounded-lg border border-red-500/10 text-sm">
                "{itemName}"
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#AFDDE5] hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
