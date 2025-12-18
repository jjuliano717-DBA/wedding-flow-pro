import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedWeddings } from "@/components/FeaturedWeddings";
import { VendorCategories } from "@/components/VendorCategories";
import { VenueShowcase } from "@/components/VenueShowcase";
import { UserTypeSection } from "@/components/UserTypeSection";
import { TipsSection } from "@/components/TipsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedWeddings />
        <VendorCategories />
        <VenueShowcase />
        <UserTypeSection />
        <TipsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
