import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FactsSection from "@/components/sections/FactsSection";
import GallerySection from "@/components/sections/GallerySection";
import PetLawsSection from "@/components/sections/PetLawsSection";
import QuizSection from "@/components/sections/QuizSection";
import SoundboardSection from "@/components/sections/SoundboardSection";
import CapyWeekSection from "@/components/sections/CapyWeekSection";
import NewsSection from "@/components/sections/NewsSection";
import PhotoFilterSection from "@/components/sections/PhotoFilterSection";
import DedicationSection from "@/components/sections/DedicationSection";
import SupportSection from "@/components/sections/SupportSection";
import FooterSection from "@/components/sections/FooterSection";
import BackToTop from "@/components/BackToTop";
import CursorTrail from "@/components/CursorTrail";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FactsSection />
      <CapyWeekSection />
      <GallerySection />
      <PetLawsSection />
      <QuizSection />
      <SoundboardSection />
      <PhotoFilterSection />
      <NewsSection />
      <SupportSection />
      <DedicationSection />
      <FooterSection />
      <BackToTop />
      <CursorTrail />
    </div>
  );
}
