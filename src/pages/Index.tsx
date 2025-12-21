import { HeroSection } from "@/components/HeroSection";
import { FeaturedWeddings } from "@/components/FeaturedWeddings";
import { VendorCategories } from "@/components/VendorCategories";
import { VenueShowcase } from "@/components/VenueShowcase";
import { UserTypeSection } from "@/components/UserTypeSection";
import { TipsSection } from "@/components/TipsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />



        <FeaturedWeddings />
        <VendorCategories />
        <VenueShowcase />
        <UserTypeSection />
        <TipsSection />
      </main>
    </div>
  );
};

export default Index;
