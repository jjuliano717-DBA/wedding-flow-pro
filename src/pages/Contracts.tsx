
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Plus, Search, Filter, Clock, CheckCircle2, MoreVertical, Send, Eye, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useBusiness } from "@/context/BusinessContext";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface Contract {
    id: string;
    quote_id: string;
    status: 'DRAFT' | 'SENT' | 'SIGNED' | 'EXPIRED';
    contract_text: string;
    created_at: string;
    signed_at: string | null;
    user_id: string;
    user: {
        full_name: string;
    } | any;
}

export default function Contracts() {
    const { businessProfile, isLoading: businessLoading } = useBusiness();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (businessProfile?.id) {
            fetchContracts();
        }
    }, [businessProfile?.id]);

    const fetchContracts = async () => {
        setLoading(true);
        try {
            // Note: In a real app, join with profiles to get client name
            const { data, error } = await supabase
                .from('contracts')
                .select(`
                    *,
                    profiles:user_id ( full_name )
                `)
                .eq('vendor_id', businessProfile!.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setContracts(data || []);
        } catch (error) {
            console.error("Error fetching contracts:", error);
            // Don't toast error if table doesn't exist yet (migration not run)
            if ((error as any).code !== 'PGRST116' && (error as any).code !== '42P01') {
                toast.error("Failed to load contracts");
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredContracts = contracts.filter(c =>
        (c.profiles?.full_name || "Client").toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: Contract['status']) => {
        switch (status) {
            case 'SIGNED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'SENT': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'EXPIRED': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    if (businessLoading || (loading && contracts.length === 0)) {
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
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-900">Legal Contracts</h1>
                    <p className="text-slate-600 mt-1">Draft, send, and manage your wedding service agreements.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-slate-300">
                        <FileText className="w-4 h-4 mr-2" /> Templates
                    </Button>
                    <Button className="bg-rose-600 hover:bg-rose-700">
                        <Plus className="w-4 h-4 mr-2" /> New Contract
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white border border-slate-200 p-2 rounded-xl">
                <Search className="w-5 h-5 text-slate-500 ml-2" />
                <Input
                    className="border-none bg-transparent focus-visible:ring-0 text-slate-900 placeholder:text-slate-500"
                    placeholder="Search by client or contract ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                    <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
            </div>

            {contracts.length === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 bg-white border-slate-200 min-h-[400px] flex flex-col items-center justify-center text-center p-20">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                            <Shield className="w-10 h-10 text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold mb-2 text-slate-900">Secure Agreements</h2>
                        <p className="text-slate-600 max-w-sm">
                            Generate legally binding contracts automatically from your quotes and track signatures in real-time.
                        </p>
                        <div className="flex gap-3 mt-8">
                            <Button variant="outline" className="border-slate-300">Learn More</Button>
                            <Button className="bg-rose-600 hover:bg-rose-700">Get Started</Button>
                        </div>
                    </Card>

                    <Card className="bg-white border-slate-200 p-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Quick Insights</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/10 rounded-lg">
                                        <Clock className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <span className="text-sm text-slate-900">Pending Signature</span>
                                </div>
                                <span className="font-bold text-slate-900">0</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <span className="text-sm text-slate-900">Signed This Month</span>
                                </div>
                                <span className="font-bold text-slate-900">0</span>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredContracts.map((contract) => (
                        <Card key={contract.id} className="bg-white border-slate-200 overflow-hidden group hover:border-slate-300 transition-all">
                            <CardContent className="p-0">
                                <div className="flex items-center justify-between p-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-rose-500">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900">{contract.profiles?.full_name || "Wedding Service Contract"}</h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                                <span>ID: {contract.id.slice(0, 8)}</span>
                                                <span>•</span>
                                                <span>Created {format(parseISO(contract.created_at), 'MMM d, yyyy')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <Badge variant="outline" className={`${getStatusColor(contract.status)} border px-3 py-1`}>
                                            {contract.status}
                                        </Badge>

                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            {contract.status === 'DRAFT' && (
                                                <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-slate-100">
                                                    <Send className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-slate-500">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-white border-slate-200">
                                                    <DropdownMenuItem className="hover:bg-slate-100 focus:bg-slate-100">Edit Draft</DropdownMenuItem>
                                                    <DropdownMenuItem className="hover:bg-slate-100 focus:bg-slate-100">Download PDF</DropdownMenuItem>
                                                    <DropdownMenuItem className="hover:bg-slate-100 focus:bg-slate-100 text-rose-500">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Card className="bg-indigo-600 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                    <Shield className="w-24 h-24" />
                </div>
                <div className="max-w-2xl">
                    <h4 className="font-serif text-2xl font-bold mb-2">Legal Template Library</h4>
                    <p className="text-indigo-100 mb-6">Protect your business with attorney-reviewed templates for floral, catering, and venue services.</p>
                    <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-8 py-4 rounded-xl">
                        Browse Full Library
                    </Button>
                </div>
            </Card>
        </div>
    );
}
