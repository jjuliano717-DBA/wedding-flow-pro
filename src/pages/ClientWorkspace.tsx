
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, DollarSign, ListTodo, Users, Sparkles, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import Budget from "@/pages/Budget";
import { ProjectRoom } from "@/components/ProjectRoom";
import { toast } from "sonner";

export default function ClientWorkspace() {
    const { clientId } = useParams<{ clientId: string }>();
    const { user } = useAuth();
    const [clientInfo, setClientInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (clientId) fetchClientDetails();
    }, [clientId]);

    const fetchClientDetails = async () => {
        try {
            // 1. Fetch project details
            const { data: project, error: projError } = await supabase
                .from('projects')
                .select('id, name, wedding_date, client_id, client_status')
                .eq('client_id', clientId) // Ensure we find the project for this client
                .eq('user_id', user?.id)   // Ensure we are the planner owner
                .single();

            if (projError) throw projError;

            // 2. Fetch client profile
            let clientProfile = null;
            if (project.client_id) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, email, style_preferences')
                    .eq('id', project.client_id)
                    .single();
                clientProfile = profile;
            }

            setClientInfo({
                ...project,
                client: clientProfile
            });
        } catch (error) {
            console.error("Error fetching client workspace:", error);
            toast.error("Could not load client workspace. You may not have access.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading workspace...</div>;

    if (!clientInfo) {
        return (
            <div className="p-20 text-center">
                <h2 className="text-xl font-bold text-red-600">Access Denied or Client Not Found</h2>
                <Link to="/clients"><Button variant="link">Return to Directory</Button></Link>
            </div>
        );
    }

    const clientName = clientInfo.client?.full_name || clientInfo.name.replace('Wedding for ', '');

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in">
            {/* Header */}
            <div className="mb-8">
                <Link to="/clients" className="inline-flex items-center text-slate-500 hover:text-slate-800 mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-serif font-bold text-brand-navy">{clientName}'s Workspace</h1>
                            <Badge className={clientInfo.client_status === 'connected' ? "bg-green-100 text-green-800 border-green-200" : "bg-slate-100 text-slate-700"}>
                                {clientInfo.client_status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-slate-500">
                            <span className="flex items-center text-sm"><Calendar className="w-4 h-4 mr-2" /> {clientInfo.wedding_date ? format(new Date(clientInfo.wedding_date), 'MMMM d, yyyy') : 'Date TBD'}</span>
                            <span className="flex items-center text-sm"><Users className="w-4 h-4 mr-2" /> Planner View</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workspace Tabs */}
            <Tabs defaultValue="budget" className="space-y-6">
                <TabsList className="w-full justify-start bg-slate-100/50 p-1 border-b rounded-none h-auto flex-wrap gap-2">
                    <TabsTrigger value="budget" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-3"><DollarSign className="w-4 h-4 mr-2" /> Budget Advisor</TabsTrigger>
                    <TabsTrigger value="tasks" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-3"><ListTodo className="w-4 h-4 mr-2" /> Project Room</TabsTrigger>
                    <TabsTrigger value="checklist" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-3"><CheckSquare className="w-4 h-4 mr-2" /> Checklist</TabsTrigger>
                    <TabsTrigger value="guests" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-3"><Users className="w-4 h-4 mr-2" /> Guest List</TabsTrigger>
                    <TabsTrigger value="style" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-3"><Sparkles className="w-4 h-4 mr-2" /> Style Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="budget" className="min-h-[500px]">
                    <Budget userId={clientId} />
                </TabsContent>

                <TabsContent value="tasks" className="min-h-[500px]">
                    <div className="bg-white rounded-xl shadow-sm border p-6 h-full">
                        <ProjectRoom userId={clientId} />
                    </div>
                </TabsContent>

                <TabsContent value="checklist">
                    <Card>
                        <CardContent className="py-20 text-center text-slate-500 bg-slate-50/50">
                            <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <h3 className="text-lg font-medium mb-2">Checklist Feature Coming Soon</h3>
                            <p>Full checklist management for clients is under development.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="guests">
                    <Card>
                        <CardContent className="py-20 text-center text-slate-500 bg-slate-50/50">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <h3 className="text-lg font-medium mb-2">Guest List Manager Coming Soon</h3>
                            <p>Collaborative guest list tracking is arriving next sprint.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="style">
                    {clientInfo.client?.style_preferences?.primaryArchetype ? (
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
                            <Card className="overflow-hidden border-none shadow-xl relative aspect-[3/4]">
                                <img
                                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop"
                                    alt="Style Result"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                    <p className="tracking-widest uppercase text-sm font-medium opacity-90 mb-2">Primary Match</p>
                                    <h3 className="text-4xl font-serif font-bold text-white mb-4">{clientInfo.client.style_preferences.primaryArchetype}</h3>
                                    {clientInfo.client.style_preferences.secondaryArchetype && (
                                        <div className="flex items-center gap-2 text-rose-200">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-lg">with {clientInfo.client.style_preferences.secondaryArchetype} influences</span>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <div className="space-y-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <h4 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-rose-500" />
                                            Style Breakdown
                                        </h4>
                                        <p className="text-slate-600 mb-6">
                                            Based on {clientInfo.client.full_name}'s choices, they lean towards a <span className="font-bold text-rose-600">{clientInfo.client.style_preferences.primaryArchetype}</span> aesthetic.
                                        </p>
                                        <div className="space-y-3">
                                            {Object.entries(clientInfo.client.style_preferences.scoreBreakdown || {})
                                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                                .slice(0, 5)
                                                .map(([style, score]) => (
                                                    <div key={style} className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-700">{style}</span>
                                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">{score as number} pts</Badge>
                                                    </div>
                                                ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-20 text-center text-slate-500 bg-slate-50/50">
                                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <h3 className="text-lg font-medium mb-2">No Style Profile Yet</h3>
                                <p>The client hasn't completed the Style Matcher quiz.</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
