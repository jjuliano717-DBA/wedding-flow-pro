
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, MessageSquare, ListTodo, DollarSign, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export function ProjectRoom() {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Finalize Guest List", status: "todo" },
        { id: 2, title: "Book Photographer", status: "done" },
        { id: 3, title: "Tasting Menu Selection", status: "in-progress" }
    ]);

    const handleInvite = () => {
        toast.success("Invitation link copied! Send it to your bridesmaid.");
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        🌸 Bridesmaid Squad
                        <span className="text-xs font-normal text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">Private Room</span>
                    </h2>
                    <p className="text-muted-foreground">Workspace for Jess, Sarah, and Mike</p>
                </div>
                <Button onClick={handleInvite} variant="outline" className="gap-2">
                    <UserPlus className="w-4 h-4" /> Invite Member
                </Button>
            </div>

            <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 max-w-md mb-4">
                    <TabsTrigger value="chat"><MessageSquare className="w-4 h-4 mr-2" /> Chat</TabsTrigger>
                    <TabsTrigger value="kanban"><ListTodo className="w-4 h-4 mr-2" /> Tasks</TabsTrigger>
                    <TabsTrigger value="budget"><DollarSign className="w-4 h-4 mr-2" /> Expenses</TabsTrigger>
                </TabsList>

                {/* CHAT TAB */}
                <TabsContent value="chat" className="flex-1 border rounded-lg p-4 bg-slate-50/50 relative">
                    <div className="flex flex-col h-[400px]">
                        <div className="flex-1 space-y-4 overflow-y-auto">
                            <div className="flex gap-3">
                                <Avatar><AvatarFallback>J</AvatarFallback></Avatar>
                                <div className="bg-white p-3 rounded-r-lg rounded-bl-lg shadow-sm text-sm">
                                    <p className="font-bold mb-1">Jessica (Bride)</p>
                                    <p>Hey girls! Can we look at dress colors today?</p>
                                </div>
                            </div>
                            <div className="flex gap-3 flex-row-reverse">
                                <Avatar><AvatarFallback>S</AvatarFallback></Avatar>
                                <div className="bg-rose-100 p-3 rounded-l-lg rounded-br-lg shadow-sm text-sm">
                                    <p className="font-bold mb-1 text-right">Sarah (MOH)</p>
                                    <p>I love the sage green idea! 🌿</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Input placeholder="Type a message..." />
                            <Button size="icon"><MessageSquare className="w-4 h-4" /></Button>
                        </div>
                    </div>
                </TabsContent>

                {/* KANBAN TAB */}
                <TabsContent value="kanban" className="flex-1">
                    <div className="grid grid-cols-3 gap-4 h-full">
                        {['todo', 'in-progress', 'done'].map(status => (
                            <div key={status} className="bg-slate-100 p-3 rounded-lg h-fit min-h-[200px]">
                                <h4 className="font-semibold capitalize mb-3 text-slate-600 flex justify-between">
                                    {status.replace('-', ' ')}
                                    <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="w-4 h-4" /></Button>
                                </h4>
                                <div className="space-y-2">
                                    {tasks.filter(t => t.status === status).map(task => (
                                        <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                            <CardContent className="p-3 text-sm font-medium">
                                                {task.title}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
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
