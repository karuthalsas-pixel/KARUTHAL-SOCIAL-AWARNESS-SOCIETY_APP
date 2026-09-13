"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, User, CheckCircle2, Send, X, MessageSquareReply, Trash2, ChevronLeft, ChevronRight, Loader2, Inbox } from "lucide-react";
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

const statusColors: Record<string, string> = {
  new: "bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]/40",
  read: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  responded: "bg-green-500/20 text-green-400 border-green-500/40",
};

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.ok) setMessages(data.data);
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
      if (res.ok) fetchMessages();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        const totalPages = Math.ceil((messages.length - 1) / ITEMS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
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
        body: JSON.stringify({ messageId: msg.id, clientEmail: msg.email, clientName: msg.name, replyText }),
      });
      if (res.ok) {
        setReplyingTo(null);
        setReplyText("");
        fetchMessages();
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
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="animate-spin text-[#00F0FF]" size={40} />
      </div>
    );
  }

  const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMessages = messages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 pb-28 sm:pb-16 overflow-x-hidden w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1 flex items-center gap-2">
            <Inbox size={28} className="text-[#00F0FF]" /> Inbox
          </h1>
          <p className="text-sm text-[#AFDDE5]/70">
            {messages.length} message{messages.length !== 1 ? "s" : ""} in total
          </p>
        </div>
        <span className="shrink-0 px-3 py-1.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold">
          {messages.filter(m => m.status === "new").length} New
        </span>
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="bg-[#02393e]/30 border border-[#0FA4AF]/20 rounded-xl p-10 text-center text-[#AFDDE5]">
          <Inbox size={40} className="mx-auto mb-3 text-[#0FA4AF]/50" />
          No messages yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border shadow-lg transition-all overflow-hidden w-full ${
                msg.status === "new"
                  ? "bg-[#001d2b]/70 border-[#00F0FF]/30"
                  : "bg-[#02393e]/40 border-[#0FA4AF]/20"
              }`}
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  {/* Avatar + Name */}
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0FA4AF]/20 text-[#00F0FF]">
                      <User size={20} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-white text-base">{msg.name}</h3>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[msg.status]}`}>
                          {msg.status}
                        </span>
                      </div>
                      {/* Contact info — wraps cleanly on narrow screens */}
                      <div className="mt-1 space-y-0.5">
                        <p className="text-xs text-[#AFDDE5]/70 flex items-center gap-1 break-all">
                          <Mail size={11} className="shrink-0" /> {msg.email}
                        </p>
                        {msg.phone && (
                          <p className="text-xs text-[#AFDDE5]/70 flex items-center gap-1">
                            <Phone size={11} className="shrink-0" /> {msg.phone}
                          </p>
                        )}
                        <p className="text-xs text-[#AFDDE5]/50 flex items-center gap-1">
                          <Calendar size={11} className="shrink-0" />
                          {new Intl.DateTimeFormat("en-IN", {
                            month: "short", day: "numeric", year: "numeric",
                            hour: "numeric", minute: "numeric", hour12: true
                          }).format(new Date(msg.createdAt))}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delete button — top right corner */}
                  <button
                    onClick={() => setItemToDelete({ id: msg.id, name: msg.name })}
                    className="shrink-0 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Message body */}
                <div className="mt-3 bg-[#001f22]/50 rounded-lg border border-white/5 p-3 sm:p-4 overflow-hidden">
                  {msg.projectType && (
                    <span className="inline-block px-2 py-1 bg-[#0FA4AF]/20 text-[#00F0FF] text-xs font-semibold rounded mb-2">
                      {msg.projectType}
                    </span>
                  )}
                  <p className="text-sm text-[#AFDDE5] whitespace-pre-wrap break-all leading-relaxed">{msg.message}</p>
                </div>

                {/* Action buttons */}
                {replyingTo !== msg.id && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.status === "new" && (
                      <button
                        onClick={() => updateStatus(msg.id, "read")}
                        className="flex-1 sm:flex-none text-xs px-3 py-2 rounded-lg border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors font-medium"
                      >
                        Mark Read
                      </button>
                    )}
                    {msg.status !== "responded" && (
                      <>
                        <button
                          onClick={() => { setReplyingTo(msg.id); setReplyText(""); }}
                          className="flex-1 sm:flex-none text-xs px-3 py-2 rounded-lg bg-[#00F0FF] text-[#001f22] font-bold hover:bg-[#00F0FF]/80 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <MessageSquareReply size={13} /> Respond
                        </button>
                        <button
                          onClick={() => updateStatus(msg.id, "responded")}
                          className="flex-1 sm:flex-none text-xs px-3 py-2 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors font-medium"
                        >
                          Mark Responded
                        </button>
                      </>
                    )}
                    {msg.status === "responded" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-xs font-medium border border-green-500/30">
                        <CheckCircle2 size={13} /> Responded
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Inline Reply Box */}
              {replyingTo === msg.id && (
                <div className="border-t border-[#0FA4AF]/20 p-4 sm:p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-[#AFDDE5] flex items-center gap-2">
                      <Send size={14} className="text-[#00F0FF]" />
                      Replying to <span className="text-white font-semibold">{msg.name}</span>
                    </label>
                    <button
                      onClick={() => { setReplyingTo(null); setReplyText(""); }}
                      className="p-1.5 rounded-lg text-[#AFDDE5]/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-[#AFDDE5]/50 break-all">To: {msg.email}</p>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response here..."
                    className="w-full bg-[#001f22]/80 border border-[#0FA4AF]/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#00F0FF] transition-colors resize-none"
                    rows={4}
                  />
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                    <button
                      onClick={() => { setReplyingTo(null); setReplyText(""); }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(msg)}
                      disabled={sendingReply || !replyText.trim()}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#00F0FF] text-[#001f22] font-bold hover:bg-[#00F0FF]/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
                    >
                      {sendingReply ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                      {sendingReply ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#02393e]/50 border border-[#0FA4AF]/20 rounded-xl p-4">
          <p className="text-sm text-[#AFDDE5]/70 text-center sm:text-left">
            Showing <span className="text-white font-medium">{startIndex + 1}</span>–
            <span className="text-white font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, messages.length)}</span>{" "}
            of <span className="text-white font-medium">{messages.length}</span>
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 rounded-lg border border-[#0FA4AF]/30 text-[#AFDDE5] hover:bg-[#0FA4AF]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 rounded-lg border border-[#0FA4AF]/30 text-[#AFDDE5] hover:bg-[#0FA4AF]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => itemToDelete && handleDelete(itemToDelete.id)}
        itemName={itemToDelete?.name}
        message="Are you sure you want to delete this message? This action cannot be undone."
      />
    </div>
  );
}
