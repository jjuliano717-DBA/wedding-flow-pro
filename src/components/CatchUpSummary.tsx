import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Star, TrendingUp, CheckCircle2, Plus, X } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { toast } from "sonner";

type Task = {
    id: number;
    text: string;
    completed: boolean;
};

const INITIAL_TASKS: Task[] = [
    { id: 1, text: "Confirm Venue", completed: true },
    { id: 2, text: "Sign Florist Contract", completed: false },
    { id: 3, text: "Book Photographer", completed: false },
];

export function CatchUpSummary() {
    const { addXP } = useGamification();
    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem("wedding_tasks");
        return saved ? JSON.parse(saved) : INITIAL_TASKS;
    });
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        localStorage.setItem("wedding_tasks", JSON.stringify(tasks));
    }, [tasks]);

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const isCompleting = !t.completed;
                if (isCompleting) {
                    addXP(50, "Completed Task");
                    toast.success("Task Complete! +50 XP");
                }
                return { ...t, completed: isCompleting };
            }
            return t;
        }));
    };

    const addTask = () => {
        if (!newTask.trim()) return;
        const task: Task = { id: Date.now(), text: newTask, completed: false };
        setTasks([...tasks, task]);
        setNewTask("");
        toast.success("Task Added");
    };

    const deleteTask = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setTasks(tasks.filter(t => t.id !== id));
    };

    // Trending Logic
    const [trendingThread, setTrendingThread] = useState<{ title: string; count: number } | null>(null);

    useEffect(() => {
        try {
            const savedThreads = localStorage.getItem("wedding_community_threads");
            if (savedThreads) {
                const threads = JSON.parse(savedThreads);
                if (Array.isArray(threads) && threads.length > 0) {
                    // Find thread with max engagement (likes + replies)
                    const topThread = threads.reduce((prev, current) => {
                        const prevEngagement = (prev.likes || 0) + (prev.replies?.length || 0);
                        const currentEngagement = (current.likes || 0) + (current.replies?.length || 0);
                        return currentEngagement > prevEngagement ? current : prev;
                    });

                    const engagement = (topThread.likes || 0) + (topThread.replies?.length || 0);
                    setTrendingThread({
                        title: topThread.title,
                        count: engagement
                    });
                }
            }
        } catch (e) {
            console.error("Failed to load trending threads", e);
        }
    }, []);

    return (
        <div className="space-y-4">
            {/* Main Feed Activity */}
            <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-indigo-900 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-indigo-500" /> While you were away
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 text-sm">
                        <li className="flex gap-2 items-start">
                            <span className="bg-red-100 text-red-600 px-1.5 rounded text-xs font-bold mt-0.5">3</span>
                            <span>Direct mentions in <span className="font-semibold text-indigo-700">#floral-budgets</span></span>
                        </li>
                        <li className="flex gap-2 items-start">
                            <span className="bg-green-100 text-green-600 px-1.5 rounded text-xs font-bold mt-0.5">5</span>
                            <span>New Vendor Reviews in your area</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            {/* Trending Hack */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-rose-500" /> Trending Discussion
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm font-medium">"{trendingThread ? trendingThread.title : "Use Publix subs for your rehearsal dinner!"}"</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {trendingThread ? `${trendingThread.count} people are discussing this.` : "142 people saved this tip."}
                    </p>
                </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> My Wedding Tasks
                        </CardTitle>
                        <span className="text-xs text-muted-foreground">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add new task..."
                            className="h-8 text-sm"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        />
                        <Button size="sm" className="h-8 w-8 p-0" onClick={addTask}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="space-y-2">
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                className="flex items-center gap-2 text-sm group cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
                                onClick={() => toggleTask(task.id)}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                    {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                                    {task.text}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500"
                                    onClick={(e) => deleteTask(task.id, e)}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
