
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Search, Filter, Plus, ArrowRight, MessageSquare, Mail, Link as LinkIcon, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface ClientProject {
    id: string;
    client_id?: string;
    client_name: string;
    client_email?: string;
    client_status?: 'pending' | 'invited' | 'active' | 'connected';
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

    // Add Client State
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [searchEmail, setSearchEmail] = useState("");
    const [searchResult, setSearchResult] = useState<any>(null); // { id, full_name, role }
    const [isSearching, setIsSearching] = useState(false);
    const [inviteName, setInviteName] = useState("");
    const [inviteDate, setInviteDate] = useState("");
    const [step, setStep] = useState<'search' | 'invite' | 'confirm'>('search');

    useEffect(() => {
        if (user) fetchClients();
    }, [user]);

    const fetchClients = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user!.id)
                .order('wedding_date', { ascending: true });

            if (error) throw error;

            const mappedClients = (data || []).map(project => ({
                id: project.id,
                client_id: project.client_id,
                client_name: project.name?.replace('Wedding for ', '') || 'Unnamed Client',
                client_email: project.client_email,
                client_status: project.client_status || 'active',
                wedding_date: project.wedding_date ? format(new Date(project.wedding_date), 'MMM d, yyyy') : 'TBD',
                budget_total: project.budget_total || 0,
                status: project.status || 'Active',
                progress: Math.floor(Math.random() * 40) + 20, // Mock progress
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

    const handleSearch = async () => {
        if (!searchEmail) return;
        setIsSearching(true);
        setSearchResult(null);

        try {
            // Call the RPC defined in migration
            const { data, error } = await supabase
                .rpc('search_profile_by_email', { search_email: searchEmail });

            if (error) throw error;

            if (data && data.length > 0) {
                setSearchResult(data[0]);
                setInviteName(data[0].full_name); // Pre-fill name
            } else {
                setSearchResult(null);
                setStep('invite'); // Move to invite form if not found
            }
        } catch (error) {
            console.error("Search error:", error);
            // If RPC fails (e.g. permission), fallback to invite manually
            setStep('invite');
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddClient = async () => {
        try {
            const isExistingProperties = searchResult ? {
                client_id: searchResult.id,
                client_status: 'connected',
                name: `Wedding for ${searchResult.full_name}`
            } : {
                client_email: searchEmail,
                client_status: 'invited',
                name: `Wedding for ${inviteName}`
            };

            const payload = {
                user_id: user!.id,
                wedding_date: inviteDate || null,
                ...isExistingProperties
            };

            const { error } = await supabase
                .from('projects')
                .insert([payload]);

            if (error) throw error;

            // Simulate Email Sending
            if (searchResult) {
                toast.success(`Connection request sent to ${searchResult.full_name}!`);
            } else {
                toast.success(`Invitation email sent to ${searchEmail}!`);
                // Use a toast description for the simulation feedback
                setTimeout(() => {
                    toast("📧 System Email Simulation", {
                        description: `To: ${searchEmail}\nSubject: Invitation from ${user?.fullName}\n\n"Come join me on 2PlanAWedding.com!"`
                    });
                }, 1000);
            }

            setIsAddDialogOpen(false);
            resetForm();
            fetchClients();

        } catch (error) {
            console.error("Error adding client:", error);
            toast.error("Failed to add client. Please try again.");
        }
    };

    const resetForm = () => {
        setSearchEmail("");
        setSearchResult(null);
        setStep('search');
        setInviteName("");
        setInviteDate("");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-navy">Client Directory</h1>
                    <p className="text-slate-500 mt-1">Manage your active booking portfolio and client progress.</p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-brand-navy text-white hover:bg-brand-navy/90">
                            <Plus className="w-4 h-4 mr-2" /> Add New Client
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Client</DialogTitle>
                            <DialogDescription>
                                Search for an existing couple or invite a new client by email.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {step === 'search' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Client Email</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="client@example.com"
                                                value={searchEmail}
                                                onChange={(e) => setSearchEmail(e.target.value)}
                                            />
                                            <Button onClick={handleSearch} disabled={isSearching || !searchEmail}>
                                                {isSearching ? "Searching..." : "Search"}
                                            </Button>
                                        </div>
                                    </div>

                                    {searchResult && (
                                        <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3 border border-green-100">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-green-900">Couple Found!</h4>
                                                <p className="text-sm text-green-700">{searchResult.full_name}</p>
                                                <p className="text-xs text-green-600 mt-1">Click Connect to send a collaboration request.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {(step === 'invite' || searchResult) && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                    {!searchResult && (
                                        <div className="bg-blue-50 p-3 rounded text-sm text-blue-700 mb-4">
                                            Client not found. Fill in details to create an account & send an invitation.
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Client Name</Label>
                                        <Input
                                            value={inviteName}
                                            onChange={(e) => setInviteName(e.target.value)}
                                            placeholder="Couple Name (e.g. Jane & John)"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Wedding Date (Optional)</Label>
                                        <Input
                                            type="date"
                                            value={inviteDate}
                                            onChange={(e) => setInviteDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            {searchResult ? (
                                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleAddClient}>
                                    <LinkIcon className="w-4 h-4 mr-2" /> Connect with Client
                                </Button>
                            ) : step === 'invite' ? (
                                <Button className="w-full" onClick={handleAddClient} disabled={!inviteName || !searchEmail}>
                                    <Mail className="w-4 h-4 mr-2" /> Create & Send Invite
                                </Button>
                            ) : null}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                        <Button className="bg-brand-navy text-white" onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Add First Client
                        </Button>
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
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">{client.status}</Badge>
                                                {client.client_status === 'invited' && <Badge className="bg-amber-100 text-amber-800 border-amber-200">Invited</Badge>}
                                                {client.client_status === 'connected' && <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>}
                                            </div>
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
                                        <Link to={`/clients/${client.client_id}/workspace`} className="flex-1">
                                            <Button size="sm" className="w-full bg-slate-100 text-brand-navy hover:bg-slate-200 shadow-none" disabled={!client.client_id}>
                                                View Workspace <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
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
