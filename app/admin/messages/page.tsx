"use client";

import { useState, useEffect } from "react";

import { Mail, Phone, Calendar, User, CheckCircle2, Send, X, MessageSquareReply, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

type Message = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  projectType: string | null;
  message: string;
  status: "new" | "read" | "responded";
  createdAt: string;
};

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<{id: number, name: string} | null>(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.ok) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: "new" | "read" | "responded") => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        // Adjust pagination if the current page becomes empty
        const totalPages = Math.ceil((messages.length - 1) / ITEMS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
      } else {
        alert("Failed to delete message");
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleSendReply = async (msg: Message) => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch("/api/admin/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: msg.id,
          clientEmail: msg.email,
          clientName: msg.name,
          replyText,
        }),
      });
      if (res.ok) {
        setReplyingTo(null);
        setReplyText("");
        fetchMessages(); // refresh the list to show updated status
      } else {
        alert("Failed to send reply");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending reply");
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-[#AFDDE5]">Loading messages...</div>;
  }

  const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMessages = messages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 pb-28 md:pb-20">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Inbox Messages</h1>
        <p className="text-sm md:text-base text-[#AFDDE5]/70">Manage contact inquiries from the website.</p>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="bg-[#02393e]/30 border border-[#0FA4AF]/20 rounded-xl p-8 text-center text-[#AFDDE5]">
            No messages found.
          </div>
        ) : (
          currentMessages.map((msg) => (
            <div key={msg.id} className="bg-[#02393e]/50 border border-[#0FA4AF]/20 rounded-xl p-4 md:p-6 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-4 min-w-0 flex-1">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0FA4AF]/20 text-[#00F0FF]">
                      <User size={20} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-white">{msg.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[#AFDDE5]/70">
                        <span className="flex items-center gap-1"><Mail size={14} /> {msg.email}</span>
                        {msg.phone && <span className="flex items-center gap-1"><Phone size={14} /> {msg.phone}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#001f22]/50 p-3 md:p-4 rounded-lg border border-white/5 overflow-hidden">
                    {msg.projectType && (
                      <span className="inline-block px-2 py-1 bg-[#0FA4AF]/20 text-[#00F0FF] text-xs font-semibold rounded mb-3">
                        {msg.projectType}
                      </span>
                    )}
                    <p className="text-sm text-[#AFDDE5] whitespace-pre-wrap break-words">{msg.message}</p>
                  </div>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-3 lg:min-w-[140px] pt-2 lg:pt-0 border-t border-white/5 lg:border-t-0">
                  <span className="text-xs text-[#AFDDE5]/50 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(msg.createdAt))}
                  </span>

                  <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    {msg.status === "new" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(msg.id, "read")} className="border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10 text-xs">
                        Mark Read
                      </Button>
                    )}
                    {msg.status !== "responded" && replyingTo !== msg.id && (
                      <Button size="sm" variant="primary" onClick={() => setReplyingTo(msg.id)} className="text-xs flex items-center gap-1.5">
                        <MessageSquareReply size={14} /> Respond
                      </Button>
                    )}
                    {msg.status !== "responded" && replyingTo !== msg.id && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(msg.id, "responded")} className="border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs">
                        Mark Responded
                      </Button>
                    )}
                    {msg.status === "responded" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
                        <CheckCircle2 size={14} /> Responded
                      </span>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setItemToDelete({ id: msg.id, name: msg.name })} className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs px-2">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Inline Reply Box */}
              {replyingTo === msg.id && (
                <div className="mt-4 border-t border-[#0FA4AF]/20 pt-4 animate-in fade-in slide-in-from-top-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-[#AFDDE5] flex items-center gap-2">
                      <Send size={14} /> Reply to {msg.name} ({msg.email})
                    </label>
                    <button onClick={() => { setReplyingTo(null); setReplyText(""); }} className="text-[#AFDDE5]/60 hover:text-red-400 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response here..."
                    className="w-full bg-[#001f22]/80 border border-[#0FA4AF]/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#00F0FF] transition-colors resize-none mb-3"
                    rows={4}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setReplyingTo(null); setReplyText(""); }} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleSendReply(msg)} disabled={sendingReply || !replyText.trim()} className="min-w-[120px]">
                      {sendingReply ? "Sending..." : "Send Reply Email"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-[#02393e]/50 border border-[#0FA4AF]/20 rounded-xl p-4 mt-6">
          <p className="text-sm text-[#AFDDE5]/70">
            Showing <span className="text-white font-medium">{startIndex + 1}</span> to <span className="text-white font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, messages.length)}</span> of <span className="text-white font-medium">{messages.length}</span> results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-[#0FA4AF]/30 text-[#AFDDE5] hover:bg-[#0FA4AF]/10 disabled:opacity-50 disabled:cursor-not-allowed px-3"
            >
              <ChevronLeft size={16} /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-[#0FA4AF]/30 text-[#AFDDE5] hover:bg-[#0FA4AF]/10 disabled:opacity-50 disabled:cursor-not-allowed px-3"
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      <DeleteConfirmModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => itemToDelete && handleDelete(itemToDelete.id)}
        itemName={itemToDelete?.name}
        message="Are you sure you want to delete this message? The client will not be notified, but you will lose this record permanently."
      />
    </div>
  );
}
