
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, CheckCircle, Circle, Plus, Filter, Sparkles, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChecklistItem {
    id: string;
    title: string;
    category: string;
    timeline_phase: string;
    is_completed: boolean;
    due_date: string | null;
}

const TIMELINE_PHASES = [
    { value: '12_months', label: '12+ Months Out', description: 'Big picture planning' },
    { value: '9_months', label: '9 Months Out', description: 'Locking in vendors' },
    { value: '6_months', label: '6 Months Out', description: 'Details & Attire' },
    { value: '3_months', label: '3 Months Out', description: 'Invites & Menu' },
    { value: '1_month', label: '1 Month Out', description: 'Final touches' },
    { value: 'week_of', label: 'Week Of', description: 'The final countdown' }
];

export default function Checklist() {
    const { user } = useAuth();
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterPhase, setFilterPhase] = useState<string>("all");
    const [isOpen, setIsOpen] = useState(false);

    // Form Stats
    const totalTasks = items.length;
    const completedTasks = items.filter(i => i.is_completed).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    useEffect(() => {
        if (user) fetchItems();
    }, [user]);

    const fetchItems = async () => {
        try {
            const { data, error } = await supabase
                .from('checklist_items')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load checklist.");
        } finally {
            setLoading(false);
        }
    };

    const toggleItem = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setItems(items.map(i => i.id === id ? { ...i, is_completed: !currentStatus } : i));

            const { error } = await supabase
                .from('checklist_items')
                .update({ is_completed: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            if (!currentStatus) toast.success("Task completed!");
        } catch (error) {
            console.error(error);
            toast.error("Could not update task.");
            fetchItems(); // Revert
        }
    };

    const addItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const phase = formData.get('phase') as string;
        const category = formData.get('category') as string;
        const date = formData.get('date') as string;

        try {
            const { data, error } = await supabase.from('checklist_items').insert({
                user_id: user!.id,
                title,
                timeline_phase: phase,
                category,
                due_date: date || null
            }).select().single();

            if (error) throw error;
            setItems([...items, data]);
            setIsOpen(false);
            toast.success("Task added to your roadmap!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add task.");
        }
    };

    const filteredItems = filterPhase === 'all'
        ? items
        : items.filter(i => i.timeline_phase === filterPhase);

    // Group by phase for display if 'all' is selected
    const groupedItems = TIMELINE_PHASES.map(phase => ({
        ...phase,
        items: filteredItems.filter(i => i.timeline_phase === phase.value)
    })).filter(group => filterPhase === 'all' || filterPhase === group.value);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Wedding Roadmap</h1>
                    <p className="text-slate-500">Your step-by-step guide to the big day.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex items-center gap-3">
                        <div className="text-right">
                            <span className="block text-xs text-slate-400 uppercase tracking-widest">Progress</span>
                            <span className="font-bold text-rose-600">{progress}% Done</span>
                        </div>
                        <div className="w-12 h-12 relative flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                <path className="text-rose-500 transition-all duration-1000 ease-out" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            </svg>
                        </div>
                    </div>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200"><Plus className="w-4 h-4 mr-2" /> Add Task</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Task</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={addItem} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Task Title</Label>
                                    <Input name="title" placeholder="e.g. Book Photographer" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Phase</Label>
                                        <Select name="phase" defaultValue="12_months">
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {TIMELINE_PHASES.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select name="category" defaultValue="General">
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="General">General</SelectItem>
                                                <SelectItem value="Venue">Venue</SelectItem>
                                                <SelectItem value="Vendors">Vendors</SelectItem>
                                                <SelectItem value="Attire">Attire</SelectItem>
                                                <SelectItem value="Decor">Decor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Due Date (Optional)</Label>
                                    <Input name="date" type="date" />
                                </div>
                                <Button type="submit" className="w-full bg-rose-600">Create Task</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8 overflow-x-auto pb-2">
                <Tabs defaultValue="all" onValueChange={setFilterPhase} className="w-full">
                    <TabsList className="bg-transparent h-auto p-0 gap-2">
                        <TabsTrigger value="all" className="rounded-full border bg-white data-[state=active]:bg-slate-900 data-[state=active]:text-white px-4 py-2">All Phases</TabsTrigger>
                        {TIMELINE_PHASES.map(p => (
                            <TabsTrigger key={p.value} value={p.value} className="rounded-full border bg-white data-[state=active]:bg-slate-900 data-[state=active]:text-white px-4 py-2 whitespace-nowrap">
                                {p.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* Checklist Groups */}
            <div className="space-y-8">
                {groupedItems.map(group => (
                    <div key={group.value} className="relative pl-8 border-l-2 border-slate-100 last:border-0 pb-8">
                        {/* Timeline Node */}
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-rose-100 border-2 border-rose-500"></div>

                        <div className="mb-4">
                            <h3 className="text-xl font-bold font-serif text-slate-800">{group.label}</h3>
                            <p className="text-sm text-slate-500">{group.description}</p>
                        </div>

                        {group.items.length === 0 ? (
                            <div className="text-sm text-slate-400 italic">No tasks in this phase yet.</div>
                        ) : (
                            <div className="grid gap-3">
                                {group.items.map(item => (
                                    <div key={item.id} className={`group flex items-start gap-3 p-4 rounded-xl border transition-all ${item.is_completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-rose-200 hover:shadow-sm'}`}>
                                        <Checkbox
                                            checked={item.is_completed}
                                            onCheckedChange={() => toggleItem(item.id, item.is_completed)}
                                            className="mt-1 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                                        />
                                        <div className="flex-1">
                                            <p className={`font-medium ${item.is_completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>{item.title}</p>
                                            <div className="flex items-center gap-3 mt-1 tex-xs text-slate-400">
                                                <Badge variant="outline" className="text-[10px] bg-slate-50 border-slate-100">{item.category}</Badge>
                                                {item.due_date && (
                                                    <span className={`text-xs flex items-center ${new Date(item.due_date) < new Date() && !item.is_completed ? 'text-red-500' : ''}`}>
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {format(new Date(item.due_date), 'MMM d')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {items.length === 0 && !loading && (
                    <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed">
                        <Sparkles className="w-12 h-12 text-rose-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-slate-900 mb-2">Start Your Journey</h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">Your roadmap is empty. Add your first task to get the ball rolling!</p>
                        <Button onClick={() => setIsOpen(true)} className="bg-rose-600">Create First Task</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
