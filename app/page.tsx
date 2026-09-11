import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Gallery } from "@/components/sections/Gallery";
import { Contact } from "@/components/sections/Contact";
import { Testimonials } from "@/components/sections/Testimonials";
import { Volunteer } from "@/components/sections/Volunteer";
import { CarouselSection } from "@/components/sections/CarouselSection";
import { ToastProvider } from "@/components/ui/Toast";
import { getGalleryItems } from "@/lib/gallery-data";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const galleryItems = await getGalleryItems();
  const session = await getSession();

  return (
    <ToastProvider>
      <Navbar isAuthenticated={!!session} role={session?.role as string | undefined} />
      <main>
        <Hero />
        <CarouselSection />
        <About />
        <Services />
        <Testimonials />
        <Volunteer />
        <Gallery items={galleryItems} />
        <Contact />
      </main>
      <Footer />
    </ToastProvider>
  );
}
