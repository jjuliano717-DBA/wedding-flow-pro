
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Search, Filter, Plus, ArrowRight, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Clients() {
    const clients = [
        { id: 1, name: "The Goldmans", weddingDate: "May 20, 2025", progress: 65, status: "Active", budget: "$85,000" },
        { id: 2, name: "Elena & David", weddingDate: "Aug 15, 2025", progress: 30, status: "Planning", budget: "$120,000" },
        { id: 3, name: "Marcus & Joi", weddingDate: "Nov 2, 2024", progress: 95, status: "Finalizing", budget: "$45,000" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-brand-navy">Client Directory</h1>
                    <p className="text-slate-500 mt-1">Manage your active booking portfolio and client progress.</p>
                </div>
                <Button className="bg-brand-navy text-white"><Plus className="w-4 h-4 mr-2" /> Add New Client</Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search clients by name or date..." className="pl-9 bg-white" />
                </div>
                <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            </div>

            <div className="grid gap-6">
                {clients.map((client) => (
                    <Card key={client.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center font-serif text-xl font-bold text-slate-400">
                                            {client.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-brand-navy">{client.name}</h3>
                                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">{client.status}</Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Wedding Date</span>
                                            <span className="font-bold text-brand-navy">{client.weddingDate}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Budget</span>
                                            <span className="font-bold text-brand-navy">{client.budget}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Planning Progress</span>
                                        <span className="text-sm font-bold text-rose-gold">{client.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-rose-gold transition-all duration-500"
                                            style={{ width: `${client.progress}%` }}
                                        />
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <Button size="sm" variant="outline" className="flex-1"><MessageSquare className="w-4 h-4 mr-2" /> Message</Button>
                                        <Button size="sm" className="flex-1 bg-slate-100 text-brand-navy hover:bg-slate-200 shadow-none">View Workspace <ArrowRight className="w-4 h-4 ml-2" /></Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
