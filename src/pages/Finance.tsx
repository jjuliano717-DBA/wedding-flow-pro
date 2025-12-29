
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Clock, AlertCircle, ArrowUpRight, Receipt, Download, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useBusiness } from "@/context/BusinessContext";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Transaction {
    id: string;
    amount_cents: number;
    status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    payment_type: string;
    created_at: string;
    profiles: {
        full_name: string;
    } | any;
}

export default function Finance() {
    const { businessProfile, isLoading: businessLoading } = useBusiness();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        pending: 0,
        inReview: 0,
        conversionRate: 0
    });

    useEffect(() => {
        if (businessProfile?.id) {
            fetchFinancialData();
        }
    }, [businessProfile?.id]);

    const fetchFinancialData = async () => {
        setLoading(true);
        try {
            // Fetch Transactions (Payments)
            const { data: paymentsData, error: paymentsError } = await supabase
                .from('payments')
                .select(`
                    *,
                    profiles:user_id ( full_name )
                `)
                .eq('vendor_id', businessProfile!.id)
                .order('created_at', { ascending: false });

            if (paymentsError) throw paymentsError;
            setTransactions(paymentsData || []);

            // Calculate Stats
            const revenue = (paymentsData || [])
                .filter(p => p.status === 'PAID')
                .reduce((acc, curr) => acc + curr.amount_cents, 0);

            const pending = (paymentsData || [])
                .filter(p => p.status === 'PENDING')
                .reduce((acc, curr) => acc + curr.amount_cents, 0);

            setStats({
                totalRevenue: revenue / 100,
                pending: pending / 100,
                inReview: 0,
                conversionRate: 0 // Placeholder
            });

        } catch (error) {
            console.error("Error fetching financial data:", error);
            // Don't toast if tables missing
            if ((error as any).code !== '42P01') {
                toast.error("Failed to load financial metrics");
            }
        } finally {
            setLoading(false);
        }
    };

    if (businessLoading || (loading && transactions.length === 0)) {
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
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-900">Payments & Financials</h1>
                    <p className="text-slate-600 mt-1">Track your revenue, pending invoices, and payment history.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-slate-300">
                        <Download className="w-4 h-4 mr-2" /> Export Report
                    </Button>
                    <Button className="bg-rose-600 hover:bg-rose-700">
                        <Receipt className="w-4 h-4 mr-2" /> New Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-600">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">${stats.totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-500" /> +0% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.pending.toFixed(2)}</div>
                        <p className="text-xs text-slate-500 mt-1">{transactions.filter(t => t.status === 'PENDING').length} awaiting payment</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">In Review</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inReview}</div>
                        <p className="text-xs text-slate-500 mt-1">Disputes or adjustments</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0F172A] border-none text-white shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/70">Conversion Rate</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-white" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.conversionRate}%</div>
                        <p className="text-xs text-white/70 mt-1">Leads to booked contracts</p>
                    </CardContent>
                </Card>
            </div>

            {transactions.length === 0 ? (
                <Card className="bg-white border-slate-200 min-h-[400px] flex flex-col items-center justify-center text-center p-20">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                        <DollarSign className="w-10 h-10 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold mb-2 text-slate-900">No Transactions Yet</h2>
                    <p className="text-slate-600 max-w-sm">
                        Connect your Stripe account to start accepting deposits and tracking your wedding financials.
                    </p>
                    <Button className="mt-8 bg-[#0F172A] text-white hover:bg-[#1e293b] font-bold px-8 py-6 rounded-xl">
                        Connect Stripe
                    </Button>
                </Card>
            ) : (
                <Card className="bg-white border-slate-200 overflow-hidden">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="border-t border-slate-200">
                            {transactions.map((t) => (
                                <div key={t.id} className="flex items-center justify-between p-4 border-b border-slate-200 hover:bg-slate-50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${t.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                            <Receipt className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{t.profiles?.full_name || "Payment"}</p>
                                            <p className="text-xs text-slate-500 uppercase tracking-tighter">{t.payment_type} • {format(parseISO(t.created_at), 'MMM d, yyyy')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg text-slate-900">${(t.amount_cents / 100).toFixed(2)}</div>
                                        <Badge variant="outline" className={`text-[10px] uppercase font-black tracking-widest px-1.5 border-none ${t.status === 'PAID' ? 'text-emerald-500' :
                                            t.status === 'PENDING' ? 'text-amber-500' : 'text-rose-500'
                                            }`}>
                                            {t.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
