
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Search, Filter, Plus, ArrowRight, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";

interface ClientProject {
    id: string;
    client_name: string;
    wedding_date: string;
    budget_total: number;
    status: string; // planning, finalizing, completed
    // Computed fields for UI
    progress: number;
    budget_display: string;
}

export default function Clients() {
    const { user } = useAuth();
    const [clients, setClients] = useState<ClientProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('wedding_date', { ascending: true });

                if (error) throw error;

                // Map data to UI model
                const mappedClients = (data || []).map(project => ({
                    id: project.id,
                    client_name: project.name || 'Unnamed Client', // Schema uses 'name'
                    wedding_date: project.wedding_date ? format(new Date(project.wedding_date), 'MMM d, yyyy') : 'TBD',
                    budget_total: project.budget_total || 0,
                    status: project.status || 'Active', // Fallback status
                    progress: Math.floor(Math.random() * 40) + 20, // Mock progress for now as we don't have tasks linked yet
                    budget_display: project.budget_total ? `$${project.budget_total.toLocaleString()}` : 'TBD'
                }));

                setClients(mappedClients);
            } catch (error) {
                console.error("Error fetching clients:", error);
                toast.error("Failed to load client directory");
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [user]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-navy">Client Directory</h1>
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
                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading clients...</div>
                ) : clients.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-lg font-medium text-slate-900 mb-2">No clients yet</p>
                        <p className="text-slate-500 mb-6">Add your first client project to get started.</p>
                        <Button className="bg-brand-navy text-white"><Plus className="w-4 h-4 mr-2" /> Add First Client</Button>
                    </div>
                ) : clients.map((client) => (
                    <Card key={client.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center font-serif text-xl font-bold text-slate-400">
                                            {client.client_name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-brand-navy">{client.client_name}</h3>
                                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">{client.status}</Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Wedding Date</span>
                                            <span className="font-bold text-brand-navy">{client.wedding_date}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Budget</span>
                                            <span className="font-bold text-brand-navy">{client.budget_display}</span>
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
