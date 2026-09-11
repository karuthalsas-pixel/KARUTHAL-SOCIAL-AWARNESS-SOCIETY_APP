"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, Send } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { contactFormSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { z } from "zod";

type ContactState = { name: string; email: string; phone: string; projectType: string; message: string; company: string; };
const initialContact: ContactState = { name: "", email: "", phone: "", projectType: "", message: "", company: "" };

type ReviewState = { author: string; role: string; quote: string; company: string; };
const initialReview: ReviewState = { author: "", role: "", quote: "", company: "" };

const reviewSchema = z.object({
  author: z.string().min(2, "Name is required").max(120),
  role: z.string().max(120).optional(),
  quote: z.string().min(10, "Review must be at least 10 characters long").max(1000),
});

export function Contact() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"contact" | "review">("contact");
  
  // Contact Form State
  const [form, setForm] = useState<ContactState>(initialContact);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  // Review Form State
  const [reviewForm, setReviewForm] = useState<ReviewState>(initialReview);
  const [reviewErrors, setReviewErrors] = useState<Partial<Record<keyof ReviewState, string>>>({});
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const handleChange = (field: keyof ContactState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleReviewChange = (field: keyof ReviewState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReviewForm(prev => ({ ...prev, [field]: e.target.value }));
    if (reviewErrors[field]) setReviewErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactFormSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: any = {};
      const flat = parsed.error.flatten().fieldErrors;
      Object.keys(flat).forEach(key => fieldErrors[key] = flat[key as keyof typeof flat]?.[0]);
      setErrors(fieldErrors);
      showToast("Please check the highlighted fields.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        showToast(data.message || "Something went wrong.", "error");
        return;
      }
      showToast(data.message || "Message sent — we'll be in touch soon.", "success");
      setForm(initialContact);
    } catch (err) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reviewSchema.safeParse(reviewForm);
    if (!parsed.success) {
      const fieldErrors: any = {};
      const flat = parsed.error.flatten().fieldErrors;
      Object.keys(flat).forEach(key => fieldErrors[key] = flat[key as keyof typeof flat]?.[0]);
      setReviewErrors(fieldErrors);
      showToast("Please check the highlighted fields.", "error");
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        showToast(data.message || "Something went wrong.", "error");
        return;
      }
      showToast("Review submitted successfully! It will appear once approved.", "success");
      setReviewForm(initialReview);
    } catch (err) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/10 bg-[#001f22] py-28 sm:py-36 text-[#AFDDE5]">
      <div className="pointer-events-none absolute left-10 top-1/4 h-[600px] w-[600px] rounded-full bg-[#00F0FF]/50 blur-[100px]" />
      <div className="pointer-events-none absolute right-10 bottom-1/4 h-[600px] w-[600px] rounded-full bg-[#FBBF24]/40 blur-[100px]" />
      
      <div className="container-page relative z-10">
        <div className="grid gap-14 lg:grid-cols-12">
          
          {/* Left Column */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#964734]/50 bg-[#964734]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#AFDDE5]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#964734]" />
                Get in Touch
              </p>
              <h2 className="mt-4 font-display text-display-md text-balance text-white font-medium">
                Connect with Us.
              </h2>
              <p className="mt-5 max-w-prose text-[#AFDDE5]/85 leading-relaxed">
                Whether you want to book a school mission session or share your experience about our programs, we are here to listen.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 space-y-5">
                <a href="mailto:karuthalsas@gmail.com" className="flex items-center gap-3 text-sm text-[#AFDDE5] transition hover:text-[#0FA4AF] font-medium group">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-500/50 bg-fuchsia-500/20 text-fuchsia-400 backdrop-blur-md">
                    <Mail className="h-4 w-4" />
                  </span>
                  karuthalsas@gmail.com
                </a>
                <a href="tel:+919745647909" className="flex items-center gap-3 text-sm text-[#AFDDE5] transition hover:text-[#0FA4AF] font-medium group">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/50 bg-emerald-500/20 text-emerald-400 backdrop-blur-md">
                    <Phone className="h-4 w-4" />
                  </span>
                  +91 9745647909 / +91 9656217909
                </a>
                <p className="flex items-start gap-3 text-sm text-[#AFDDE5] font-medium">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/50 bg-amber-500/20 text-amber-400 backdrop-blur-md">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="pt-1">
                    P.B. No. 22, Kuttapuzha P.O.,<br />
                    Thiruvalla - 689103, Kerala, India<br />
                    <span className="text-xs text-[#0FA4AF] mt-1 inline-block">Reg No: PTM/TC/15/2023</span>
                  </span>
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right Column (Tabs + Forms) */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setActiveTab("contact")} 
                className={cn("flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all", activeTab === "contact" ? "bg-[#0FA4AF] text-white shadow-[0_0_20px_rgba(15,164,175,0.4)]" : "bg-[#024950]/50 text-[#AFDDE5] hover:bg-[#024950]")}
              >
                <Send size={16} /> Contact Us
              </button>
              <button 
                onClick={() => setActiveTab("review")} 
                className={cn("flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all", activeTab === "review" ? "bg-[#00F0FF] text-[#001f22] shadow-[0_0_20px_rgba(0,240,255,0.4)]" : "bg-[#024950]/50 text-[#AFDDE5] hover:bg-[#024950]")}
              >
                <MessageSquare size={16} /> Write a Review
              </button>
            </div>

            {activeTab === "contact" ? (
              <form onSubmit={handleContactSubmit} className="space-y-5 animate-in fade-in duration-300">
                <input type="text" name="company" value={form.company} onChange={handleChange("company")} className="absolute -left-[9999px] opacity-0" tabIndex={-1} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" id="name" value={form.name} onChange={handleChange("name")} error={errors.name} required />
                  <Field label="Email address" id="email" type="email" value={form.email} onChange={handleChange("email")} error={errors.email} required />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone / WhatsApp" id="phone" type="tel" value={form.phone} onChange={handleChange("phone")} error={errors.phone} />
                  <div>
                    <label htmlFor="projectType" className="mb-2 block text-sm font-medium text-[#AFDDE5]">Program interest</label>
                    <select id="projectType" value={form.projectType} onChange={handleChange("projectType")} className="w-full rounded-xl border border-white/20 bg-[#024950]/60 px-4 py-3 text-sm text-white outline-none focus:border-[#0FA4AF] backdrop-blur-md">
                      <option value="">Select a program</option>
                      <option value="School Mission">School Mission</option>
                      <option value="Child Protection">Child Protection</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#AFDDE5]">Message details</label>
                  <textarea id="message" rows={5} value={form.message} onChange={handleChange("message")} className="w-full rounded-xl border border-white/20 bg-[#024950]/60 px-4 py-3 text-sm text-white outline-none focus:border-[#0FA4AF] backdrop-blur-md resize-none" placeholder="How can we help?" />
                  {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
                </div>
                <Button type="submit" size="lg" loading={submitting}>Submit Inquiry</Button>
              </form>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-5 animate-in fade-in duration-300">
                <input type="text" name="company" value={reviewForm.company} onChange={handleReviewChange("company")} className="absolute -left-[9999px] opacity-0" tabIndex={-1} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your Name" id="review-author" value={reviewForm.author} onChange={handleReviewChange("author")} error={reviewErrors.author} required placeholder="E.g. Mr. Rakesh Menon" />
                  <Field label="Role / School Name (Optional)" id="review-role" value={reviewForm.role} onChange={handleReviewChange("role")} error={reviewErrors.role} placeholder="E.g. Principal, ABC School" />
                </div>
                <div>
                  <label htmlFor="review-quote" className="mb-2 block text-sm font-medium text-[#AFDDE5]">Your Review</label>
                  <textarea id="review-quote" rows={5} value={reviewForm.quote} onChange={handleReviewChange("quote")} className="w-full rounded-xl border border-white/20 bg-[#024950]/60 px-4 py-3 text-sm text-white outline-none focus:border-[#0FA4AF] backdrop-blur-md resize-none" placeholder="Share your experience with our programs..." />
                  {reviewErrors.quote && <p className="mt-1.5 text-xs text-red-400">{reviewErrors.quote}</p>}
                </div>
                <Button type="submit" size="lg" loading={reviewSubmitting} className="bg-[#00F0FF] text-[#001f22] hover:bg-[#00F0FF]/90">Submit Review</Button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, id, value, onChange, error, type = "text", required, placeholder }: any) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[#AFDDE5]">{label}</label>
      <input id={id} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} className={cn("w-full rounded-xl border bg-[#024950]/60 px-4 py-3 text-sm text-white outline-none transition focus:border-[#0FA4AF] backdrop-blur-md placeholder-[#AFDDE5]/40", error ? "border-red-500/70" : "border-white/20")} />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
