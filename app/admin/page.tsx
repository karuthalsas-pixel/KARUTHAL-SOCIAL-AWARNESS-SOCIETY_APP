import Link from "next/link";
import { Users, Image as ImageIcon, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, Admin</h1>
        <p className="text-[#0FA4AF] mt-2">Manage the content and settings for the Karuthal website from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employees Card */}
        <Link href="/admin/employees" className="group block bg-[#024950]/30 border border-[#0FA4AF]/30 p-8 rounded-2xl hover:bg-[#024950]/50 hover:border-[#00F0FF]/50 transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0FA4AF]/20 flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Manage Employees</h2>
          </div>
          <p className="text-[#AFDDE5]/80 mb-6 line-clamp-2">
            Update the executive members displayed in the "Our Team" section on the About page. Add photos, roles, and contact info.
          </p>
          <div className="flex items-center text-[#00F0FF] text-sm font-semibold group-hover:translate-x-1 transition-transform">
            Go to Employees <ArrowRight size={16} className="ml-2" />
          </div>
        </Link>

        {/* Gallery Card */}
        <Link href="/admin/gallery" className="group block bg-[#024950]/30 border border-[#0FA4AF]/30 p-8 rounded-2xl hover:bg-[#024950]/50 hover:border-[#00F0FF]/50 transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0FA4AF]/20 flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform">
              <ImageIcon size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Event Gallery</h2>
          </div>
          <p className="text-[#AFDDE5]/80 mb-6 line-clamp-2">
            Upload new photos from School Mission sessions. Manage titles, categories, and select featured images.
          </p>
          <div className="flex items-center text-[#00F0FF] text-sm font-semibold group-hover:translate-x-1 transition-transform">
            Go to Gallery <ArrowRight size={16} className="ml-2" />
          </div>
        </Link>
      </div>
    </div>
  );
}
