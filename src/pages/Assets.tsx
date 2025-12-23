import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload, LayoutGrid } from "lucide-react";

export default function Assets() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-brand-navy">Media & Assets</h1>
                    <p className="text-slate-500 mt-1">Manage your high-res photos, contracts, and floorplans.</p>
                </div>
                <Button disabled className="bg-slate-200 text-slate-400 cursor-not-allowed"><Upload className="w-4 h-4 mr-2" /> Upload New</Button>
            </div>

            <Card className="border-dashed border-2 bg-slate-50/50 py-20">
                <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center">
                        <LayoutGrid className="w-10 h-10 text-indigo-400" />
                    </div>
                    <div className="max-w-md space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-brand-navy">Media Manager Coming Soon</h2>
                        <p className="text-slate-500">
                            We're building a powerful new way to organize your venue's portfolio, floorplans, and contract templates.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" disabled>Notify Me</Button>
                        <Button variant="ghost" className="text-brand-navy hover:bg-indigo-50">View Roadmap &rarr;</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
