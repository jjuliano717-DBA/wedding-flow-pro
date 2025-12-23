
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, Calendar, Clock, Filter, SlidersHorizontal, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Leads() {
    // Mock Data - In a real app, fetch from Supabase 'leads' or 'inquiries' table
    // For now, we simulate leads for this specific venue
    const leads = [
        { id: 1, name: "Sarah & Mike", type: "Ceremony + Reception", date: "Oct 12, 2024", guests: 120, status: "New", color: "bg-rose-500", budget: "$15k - $20k" },
        { id: 2, name: "Jessica L.", type: "Reception Only", date: "Dec 1, 2024", guests: 85, status: "Pending", color: "bg-amber-500", budget: "$10k" },
        { id: 3, name: "The Millers", type: "Full Weekend Buyout", date: "June 15, 2025", guests: 200, status: "Replied", color: "bg-blue-500", budget: "$45k+" },
        { id: 4, name: "David & Tom", type: "Ceremony + Reception", date: "Feb 14, 2025", guests: 150, status: "New", color: "bg-purple-500", budget: "$25k" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-brand-navy">Inquiries & Leads</h1>
                    <p className="text-slate-500 mt-1">Manage incoming requests and potential bookings.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" /> Filter</Button>
                    <Button className="bg-brand-navy text-white">Export CSV</Button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-2 rounded-lg border shadow-sm">
                <Search className="w-5 h-5 text-slate-400 ml-2" />
                <Input className="border-none shadow-none focus-visible:ring-0" placeholder="Search by name, date, or status..." />
            </div>

            <div className="grid gap-4">
                {leads.map((lead) => (
                    <Card key={lead.id} className="border-none shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-l-4 hover:border-l-rose-gold">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${lead.color}`}>
                                        {lead.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-brand-navy flex items-center gap-2">
                                            {lead.name}
                                            {lead.status === 'New' && <Badge className="bg-rose-500 h-5 px-1.5 text-[10px]">NEW</Badge>}
                                        </h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                            <Calendar className="w-3.5 h-3.5" /> {lead.date}
                                            <span className="text-slate-300">|</span>
                                            <User className="w-3.5 h-3.5" /> {lead.guests} Guests
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                                    <div className="text-left sm:text-right">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Budget</p>
                                        <p className="font-medium text-brand-navy">{lead.budget}</p>
                                    </div>
                                    <div className="text-left sm:text-right hidden sm:block">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</p>
                                        <Badge variant="outline" className={`mt-1 border-slate-200 ${lead.status === 'New' ? 'text-rose-500 bg-rose-50' : 'text-slate-600'}`}>
                                            {lead.status}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" className="text-slate-400 hover:text-brand-navy hover:bg-slate-100"><MessageSquare className="w-5 h-5" /></Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-dashed border-2 bg-slate-50/50">
                <CardContent className="p-12 text-center">
                    <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-serif font-bold text-slate-600">Looking for more leads?</h3>
                    <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2">
                        Optimize your venue profile with high-quality photos and detailed amenities to rank higher in search results.
                    </p>
                    <Button variant="link" className="text-rose-gold mt-2" onClick={() => window.location.href = '/business'}>
                        Update Profile &rarr;
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
