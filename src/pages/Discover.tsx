import { AssetDiscovery } from "@/components/AssetDiscovery";

const Discover = () => {
    return (
        <div className="min-h-screen bg-wedding-silk pb-20">
            <div className="max-w-7xl mx-auto px-4 pt-12 text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-4">
                    Discover Your Wedding
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Swipe through curated inspirations. When you find something you love, we'll calculate the real cost based on your guest count and taxes.
                </p>
            </div>

            <div className="container mx-auto">
                <AssetDiscovery />
            </div>
        </div>
    );
};

export default Discover;
