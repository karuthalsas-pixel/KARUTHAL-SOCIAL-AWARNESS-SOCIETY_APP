import Link from "next/link";
import { Users, Image as ImageIcon, ArrowRight, Inbox, Heart, MessageSquare, Images } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, Admin</h1>
        <p className="text-[#AFDDE5]/80 mt-2">Manage the content and settings for the Karuthal website from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Inbox Card - Violet */}
        <Link href="/portal-karuthal-secure/messages" className="group block bg-[#001f22]/50 border border-violet-500/20 p-6 rounded-2xl hover:bg-violet-500/10 hover:border-violet-500/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-violet-500/20 transition-colors" />
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Inbox size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Inbox Messages</h2>
          </div>
          <p className="text-[#AFDDE5]/70 mb-6 line-clamp-2 text-sm relative z-10">
            View messages from visitors sent through the contact form.
          </p>
          <div className="flex items-center text-violet-400 text-sm font-semibold group-hover:translate-x-1 transition-transform relative z-10">
            Go to Inbox <ArrowRight size={16} className="ml-2" />
          </div>
        </Link>

        {/* Employees Card - Indigo */}
        <Link href="/portal-karuthal-secure/employees" className="group block bg-[#001f22]/50 border border-indigo-500/20 p-6 rounded-2xl hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-colors" />
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Users size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Manage Employees</h2>
          </div>
          <p className="text-[#AFDDE5]/70 mb-6 line-clamp-2 text-sm relative z-10">
            Update the executive members displayed in the "Our Team" section. Add photos and contact info.
          </p>
          <div className="flex items-center text-indigo-400 text-sm font-semibold group-hover:translate-x-1 transition-transform relative z-10">
            Go to Employees <ArrowRight size={16} className="ml-2" />
          </div>
        </Link>

        {/* Programs Card - Rose */}
        <Link href="/portal-karuthal-secure/programs" className="group block bg-[#001f22]/50 border border-rose-500/20 p-6 rounded-2xl hover:bg-rose-500/10 hover:border-rose-500/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(244,63,94,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-rose-500/20 transition-colors" />
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <Heart size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Awareness Programs</h2>
          </div>
          <p className="text-[#AFDDE5]/70 mb-6 line-clamp-2 text-sm relative z-10">
            Manage your awareness initiatives, sessions, and impact details.
          </p>
          <div className="flex items-center text-rose-400 text-sm font-semibold group-hover:translate-x-1 transition-transform relative z-10">
            Go to Programs <ArrowRight size={16} className="ml-2" />
          </div>
        </Link>

        {/* Gallery Card - Pink */}
        <Link href="/portal-karuthal-secure/gallery" className="group block bg-[#001f22]/50 border border-pink-500/20 p-6 rounded-2xl hover:bg-pink-500/10 hover:border-pink-500/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(236,72,153,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-pink-500/20 transition-colors" />
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              <ImageIcon size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Event Gallery</h2>
          </div>
          <p className="text-[#AFDDE5]/70 mb-6 line-clamp-2 text-sm relative z-10">
            Upload new photos from School Mission sessions. Manage titles and featured images.
          </p>
          <div className="flex items-center text-pink-400 text-sm font-semibold group-hover:translate-x-1 transition-transform relative z-10">
            Go to Gallery <ArrowRight size={16} className="ml-2" />
          </div>
        </Link>

        {/* Testimonials Card - Amber */}
        <Link href="/portal-karuthal-secure/testimonials" className="group block bg-[#001f22]/50 border border-amber-500/20 p-6 rounded-2xl hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-colors" />
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <MessageSquare size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Testimonials</h2>
          </div>
          <p className="text-[#AFDDE5]/70 mb-6 line-clamp-2 text-sm relative z-10">
            Review and publish feedback from teachers, parents, and students.
          </p>
          <div className="flex items-center text-amber-400 text-sm font-semibold group-hover:translate-x-1 transition-transform relative z-10">
            Go to Testimonials <ArrowRight size={16} className="ml-2" />
          </div>
        </Link>

        {/* Carousel Card - Sky */}
        <Link href="/portal-karuthal-secure/carousel" className="group block bg-[#001f22]/50 border border-sky-500/20 p-6 rounded-2xl hover:bg-sky-500/10 hover:border-sky-500/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(14,165,233,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-sky-500/20 transition-colors" />
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(14,165,233,0.2)]">
              <Images size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Home Carousel</h2>
          </div>
          <p className="text-[#AFDDE5]/70 mb-6 line-clamp-2 text-sm relative z-10">
            Update the sliding images and captions in the "Our Journey" section.
          </p>
          <div className="flex items-center text-sky-400 text-sm font-semibold group-hover:translate-x-1 transition-transform relative z-10">
            Go to Carousel <ArrowRight size={16} className="ml-2" />
          </div>
        </Link>
        
      </div>
    </div>
  );
}
