import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ImageIcon,
    Upload,
    LayoutGrid,
    Plus,
    Trash2,
    DollarSign,
    Tag,
    Info,
    Loader2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useBusiness } from "@/context/BusinessContext";

interface InspirationAsset {
    id: string;
    image_url: string;
    category_tag: 'Floral' | 'Rentals' | 'Venue' | 'Catering';
    cost_model: 'per_guest' | 'flat_fee' | 'per_hour';
    base_cost_low: number;
    base_cost_high: number;
    min_service_fee_pct: number;
}

export default function Assets() {
    const { businessProfile, isLoading: businessLoading } = useBusiness();
    const [assets, setAssets] = useState<InspirationAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        image_url: "",
        category_tag: "Floral",
        cost_model: "flat_fee",
        base_cost: "",
        min_service_fee_pct: "20"
    });

    useEffect(() => {
        if (businessProfile?.id) {
            fetchAssets();
        }
    }, [businessProfile?.id]);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inspiration_assets')
                .select('*')
                .eq('vendor_id', businessProfile!.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAssets(data || []);
        } catch (error) {
            console.error("Error fetching assets:", error);
            toast.error("Failed to load assets");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAsset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessProfile?.id) return;

        const baseCostCents = Math.round(parseFloat(formData.base_cost) * 100);
        const serviceFeePct = parseFloat(formData.min_service_fee_pct) / 100;

        try {
            const { error } = await supabase
                .from('inspiration_assets')
                .insert([{
                    vendor_id: businessProfile.id,
                    image_url: formData.image_url,
                    category_tag: formData.category_tag,
                    cost_model: formData.cost_model,
                    base_cost_low: baseCostCents,
                    base_cost_high: baseCostCents, // Simplified for now
                    min_service_fee_pct: serviceFeePct
                }]);

            if (error) throw error;

            toast.success("Asset added to portfolio!");
            setIsDialogOpen(false);
            setFormData({
                image_url: "",
                category_tag: "Floral",
                cost_model: "flat_fee",
                base_cost: "",
                min_service_fee_pct: "20"
            });
            fetchAssets();
        } catch (error: any) {
            console.error("Error creating asset:", error);
            toast.error(error.message || "Failed to create asset");
        }
    };

    const handleDeleteAsset = async (id: string) => {
        if (!confirm("Are you sure you want to remove this asset from your portfolio?")) return;

        try {
            const { error } = await supabase
                .from('inspiration_assets')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success("Asset removed");
            setAssets(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error("Error deleting asset:", error);
            toast.error("Failed to delete asset");
        }
    };

    if (businessLoading || (loading && assets.length === 0)) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-900">Portfolio & Smart Assets</h1>
                    <p className="text-slate-600 mt-1">Manage your inspiration gallery and linked pricing models.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6 py-6 transition-all hover:scale-105">
                            <Plus className="w-4 h-4 mr-2" /> Add New Asset
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-slate-200 max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif">Add Smart Asset</DialogTitle>
                            <DialogDescription className="text-slate-400">
                                Connect an image to your pricing engine to enable "Real Cost" swipes.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateAsset} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="image_url">Image URL</Label>
                                <Input
                                    id="image_url"
                                    placeholder="https://images.unsplash.com/..."
                                    className="bg-white border-slate-300"
                                    value={formData.image_url}
                                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={formData.category_tag}
                                        onValueChange={v => setFormData({ ...formData, category_tag: v })}
                                    >
                                        <SelectTrigger className="bg-white border-slate-300">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200">
                                            <SelectItem value="Floral">Floral</SelectItem>
                                            <SelectItem value="Rentals">Rentals</SelectItem>
                                            <SelectItem value="Venue">Venue</SelectItem>
                                            <SelectItem value="Catering">Catering</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Cost Model</Label>
                                    <Select
                                        value={formData.cost_model}
                                        onValueChange={v => setFormData({ ...formData, cost_model: v })}
                                    >
                                        <SelectTrigger className="bg-white border-slate-300">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200">
                                            <SelectItem value="flat_fee">Flat Fee</SelectItem>
                                            <SelectItem value="per_guest">Per Guest</SelectItem>
                                            <SelectItem value="per_hour">Per Hour</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Base Cost ($)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input
                                            type="number"
                                            placeholder="1500"
                                            className="pl-9 bg-slate-800 border-slate-700"
                                            value={formData.base_cost}
                                            onChange={e => setFormData({ ...formData, base_cost: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Service Fee (%)</Label>
                                    <Input
                                        type="number"
                                        placeholder="20"
                                        className="bg-white border-slate-300"
                                        value={formData.min_service_fee_pct}
                                        onChange={e => setFormData({ ...formData, min_service_fee_pct: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-start gap-3">
                                <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-600">
                                    This data is used to calculate <strong>Real Cost</strong> estimates when a couple swipes right. Total = (Base × Model Factor) + Service Fee + Estimated Tax.
                                </p>
                            </div>

                            <DialogFooter>
                                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 py-6 text-lg font-bold">
                                    Save to Portfolio
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {assets.length === 0 ? (
                <Card className="bg-white border-slate-200 border-dashed border-2 py-20 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                        <ImageIcon className="w-10 h-10 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Build Your Portfolio</h2>
                    <p className="text-slate-600 max-w-sm text-center mb-8">
                        Upload your best work and define smart pricing points to reach the right couples.
                    </p>
                    <Button variant="outline" className="border-slate-300" onClick={() => setIsDialogOpen(true)}>
                        Create First Asset
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {assets.map((asset) => (
                        <Card key={asset.id} className="group relative bg-slate-900 border-slate-800 overflow-hidden rounded-2xl transition-all hover:border-rose-500/50">
                            <div className="aspect-[4/5] overflow-hidden relative">
                                <img
                                    src={asset.image_url}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt="Portfolio asset"
                                />
                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                    <Badge className="bg-slate-900/80 backdrop-blur-md border-slate-700 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1">
                                        {asset.category_tag}
                                    </Badge>
                                </div>
                                <button
                                    onClick={() => handleDeleteAsset(asset.id)}
                                    className="absolute top-3 right-3 p-2 bg-red-600/20 backdrop-blur-md text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:text-white"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                            </div>
                            <CardContent className="p-4 space-y-3 relative">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Tag className="w-3.5 h-3.5" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{asset.cost_model.replace('_', ' ')}</span>
                                    </div>
                                    <div className="text-rose-400 font-bold">
                                        ${(asset.base_cost_low / 100).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                    Min Fee: {Math.round(asset.min_service_fee_pct * 100)}%
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
