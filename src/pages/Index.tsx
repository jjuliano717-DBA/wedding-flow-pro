
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

        {/* Quick Access for New Features */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/budget" className="bg-rose-100 text-rose-800 px-6 py-3 rounded-full font-serif font-bold hover:bg-rose-200 transition">
              💰 Budget Advisor
            </a>
            <a href="/style-matcher" className="bg-teal-100 text-teal-800 px-6 py-3 rounded-full font-serif font-bold hover:bg-teal-200 transition">
              🎨 Style Swipe
            </a>
          </div>
        </section>

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
