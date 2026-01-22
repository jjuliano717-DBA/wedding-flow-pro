import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, MessageSquare, ListTodo, DollarSign, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type Task = {
    id: number;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
};

const STORAGE_KEY = 'wedding_project_tasks';

// Load tasks from localStorage
const loadStoredTasks = (): Task[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// Save tasks to localStorage
const saveStoredTasks = (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};


export function ProjectRoom({ userId }: { userId?: string }) {
    const { user } = useAuth();
    const targetUserId = userId || user?.id; // Use passed userId or current user
    const isPlannerView = !!userId; // If userId is passed, we are likely a planner

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [useLocalStorage, setUseLocalStorage] = useState(false);

    useEffect(() => {
        if (targetUserId) {
            fetchTasks();
        } else if (!userId) {
            // Not logged in and no targetUserId - use localStorage (only for own view)
            setTasks(loadStoredTasks());
            setLoading(false);
            setUseLocalStorage(true);
        }
    }, [targetUserId]);

    // Sync to localStorage when using localStorage mode (only for self)
    useEffect(() => {
        if (useLocalStorage && !userId) {
            saveStoredTasks(tasks);
        }
    }, [tasks, useLocalStorage, userId]);

    const fetchTasks = async () => {
        if (!targetUserId) return;
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', targetUserId) // Fetch tasks for target user
                .order('created_at', { ascending: false });

            if (error) {
                // ... fallback logic (skipped for planner view to avoid local pollution)
                if (!isPlannerView) {
                    console.warn('Tasks table not available, using localStorage');
                    setTasks(loadStoredTasks());
                    setUseLocalStorage(true);
                } else {
                    console.error("Error fetching client tasks:", error);
                }
                return;
            }
            setTasks(data || []);
        } catch (error) {
            console.error(error);
            if (!isPlannerView) {
                setTasks(loadStoredTasks());
                setUseLocalStorage(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (status: 'todo' | 'in-progress' | 'done') => {
        const title = prompt("Enter task name:");
        if (!title) return;

        // Use localStorage mode (self only)
        if ((useLocalStorage || !targetUserId) && !isPlannerView) {
            const newTask: Task = {
                id: Date.now(),
                title,
                status
            };
            setTasks([newTask, ...tasks]);
            toast.success("Task added!");
            return;
        }

        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert({
                    user_id: targetUserId, // Insert for target user
                    title,
                    status
                })
                .select()
                .single();

            if (error) throw error;

            setTasks([data, ...tasks]);
            toast.success("Task added!");
        } catch (error) {
            console.error(error);
            if (!isPlannerView) {
                // Fall back to localStorage add
                const newTask: Task = {
                    id: Date.now(),
                    title,
                    status
                };
                setTasks([newTask, ...tasks]);
                setUseLocalStorage(true);
                toast.success("Task added (saved locally)");
            } else {
                toast.error("Failed to add task for client.");
            }
        }
    };

    const handleInvite = () => {
        toast.success("Invitation link copied! Send it to your bridesmaid.");
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        🌸 {isPlannerView ? "Client Project Room" : "Bridesmaid Squad"}
                        <span className="text-xs font-normal text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">Private Room</span>
                    </h2>
                    <p className="text-muted-foreground">Workspace for {isPlannerView ? 'Planning Team' : (user?.fullName?.split(' ')[0] || 'You') + ' and Friends'}</p>
                </div>
                {!isPlannerView && (
                    <Button onClick={handleInvite} variant="outline" className="gap-2">
                        <UserPlus className="w-4 h-4" /> Invite Member
                    </Button>
                )}
            </div>

            <Tabs defaultValue="kanban" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 max-w-md mb-4 bg-slate-100 p-1 rounded-lg">
                    <TabsTrigger value="kanban"><ListTodo className="w-4 h-4 mr-2" /> Tasks</TabsTrigger>
                    <TabsTrigger value="chat"><MessageSquare className="w-4 h-4 mr-2" /> Chat</TabsTrigger>
                    <TabsTrigger value="budget"><DollarSign className="w-4 h-4 mr-2" /> Expenses</TabsTrigger>
                </TabsList>

                {/* KANBAN TAB */}
                <TabsContent value="kanban" className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                        {(['todo', 'in-progress', 'done'] as const).map(status => (
                            <div key={status} className="bg-slate-50 border p-3 rounded-lg h-fit min-h-[200px]">
                                <h4 className="font-semibold capitalize mb-3 text-slate-600 flex justify-between items-center">
                                    {status.replace('-', ' ')}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 hover:bg-slate-200"
                                        onClick={() => handleAddTask(status)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </h4>
                                <div className="space-y-2">
                                    {tasks.filter(t => t.status === status).map(task => (
                                        <Card key={task.id} className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                                            <CardContent className="p-3 text-sm font-medium">
                                                {task.title}
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {tasks.filter(t => t.status === status).length === 0 && (
                                        <div className="text-center py-8 text-slate-300 text-xs italic">
                                            No tasks
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* CHAT TAB */}
                <TabsContent value="chat" className="flex-1 border rounded-lg p-4 bg-slate-50/50 relative">
                    <div className="flex flex-col h-[400px] justify-center items-center text-muted-foreground">
                        <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
                        <p>Chat feature coming soon!</p>
                    </div>
                </TabsContent>

                {/* BUDGET TAB */}
                <TabsContent value="budget" className="flex-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shared Expense Sheet</CardTitle>
                            <CardDescription>Track reimbursement for bachelorette & dresses.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                                <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p>No expenses tracked yet.</p>
                                <Button variant="link">Add Expense Row</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
