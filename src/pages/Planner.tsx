import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Calendar,
    ChevronDown,
    LayoutDashboard,
    MessageSquare,
    Briefcase,
    Clock,
    TrendingUp,
    Plus,
    Search,
    ArrowRight
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

export default function Planner() {
    const { user } = useAuth();
    const [selectedProject, setSelectedProject] = useState({ id: "1", name: "Sarah & Mike" });
    const clients = [
        { id: "1", name: "Sarah & Mike", date: "June 15, 2025", status: "Planning" },
        { id: "2", name: "Jessica & Dan", date: "Sept 12, 2025", status: "Booking" },
        { id: "3", name: "Robert & Lisa", date: "Dec 05, 2025", status: "Discovery" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 bg-[#0F172A] text-white min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight">Agency Dashboard</h1>
                    <p className="text-slate-400">Managing {clients.length} active client projects.</p>
                </div>

                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white gap-2 px-4 py-6 rounded-xl">
                                <div className="text-left">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Active Project</p>
                                    <p className="text-sm font-bold">{selectedProject.name}</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 bg-slate-900 border-slate-700 text-white">
                            <DropdownMenuLabel className="text-slate-500 text-[10px] uppercase font-bold px-3">Your Projects</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            {clients.map((client) => (
                                <DropdownMenuItem
                                    key={client.id}
                                    onClick={() => setSelectedProject(client)}
                                    className="px-3 py-3 focus:bg-slate-800 focus:text-white cursor-pointer"
                                >
                                    <div className="flex-1">
                                        <p className="font-bold">{client.name}</p>
                                        <p className="text-[10px] text-slate-500">{client.date} • {client.status}</p>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem className="px-3 py-3 focus:bg-slate-800 text-rose-400 font-bold gap-2">
                                <Plus className="w-4 h-4" /> Create New Project
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-6 rounded-xl gap-2 transition-all">
                        <MessageSquare className="w-4 h-4" /> Client Chat
                    </Button>
                </div>
            </header>

            {/* Planner KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Active Clients", value: "8", icon: Users, color: "text-blue-400" },
                    { label: "Bookings This Month", value: "12", icon: Briefcase, color: "text-green-400" },
                    { label: "Client Inquiries", value: "24", icon: MessageSquare, color: "text-rose-400" },
                    { label: "Average Stress", value: "Low", icon: TrendingUp, color: "text-yellow-400" },
                ].map((kpi, i) => (
                    <Card key={i} className="bg-slate-900/50 border-slate-800 shadow-none hover:bg-slate-900 transition-colors">
                        <CardHeader className="pb-2 space-y-0">
                            <div className="flex items-center justify-between mb-2">
                                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                                <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500 font-bold uppercase">This Year</Badge>
                            </div>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{kpi.label}</CardDescription>
                            <CardTitle className="text-2xl font-bold font-serif">{kpi.value}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main: Global Calendar / Workflow */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-slate-900/50 border-slate-800 shadow-none text-white">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-serif">Global Master Calendar</CardTitle>
                                <CardDescription className="text-slate-500">Upcoming milestones across all your accounts.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white">Full Schedule</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { title: "Venue Tour: Sarah & Mike", date: "Tomorrow, 2:00 PM", type: "Visit", client: "Sarah & Mike" },
                                    { title: "Floral Proposal Review", date: "Wednesday, 10:00 AM", type: "Budget", client: "Jessica & Dan" },
                                    { title: "Final Tasting: Oceanfront", date: "Friday, 6:30 PM", type: "Food", client: "Robert & Lisa" }
                                ].map((event, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 group hover:border-slate-600 transition-all cursor-pointer">
                                        <div className="w-12 h-12 rounded-lg bg-slate-900 flex flex-col items-center justify-center border border-slate-800 shrink-0">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">{event.date.split(" ")[0].replace(",", "")}</p>
                                            <p className="text-xs font-bold font-serif">{event.date.includes("Tomorrow") ? "TM" : event.date.split(" ")[0].slice(0, 3)}</p>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm group-hover:text-rose-400 transition-colors">{event.title}</h4>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{event.client}</p>
                                        </div>
                                        <Badge variant="outline" className="border-slate-800 text-slate-500 text-[10px]">
                                            {event.type}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Private Notes / Tools */}
                <div className="space-y-8">
                    <Card className="bg-slate-900 border-slate-800 shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-600"></div>
                        <CardHeader className="pb-3">
                            <CardTitle className="font-serif text-lg">Black Book Access</CardTitle>
                            <CardDescription className="text-slate-500">Quickly find and invite elite Florida providers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search your network..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                                />
                            </div>
                            <Link to="/black-book">
                                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white gap-2 text-xs py-5">
                                    Open Black Book <ArrowRight className="w-3 h-3" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800 shadow-none text-white p-6">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 font-serif">Planner Reminders</h3>
                        <div className="space-y-6">
                            {[
                                { text: "Follow up on Sarah's catering contract", urgent: true },
                                { text: "Finalize moodboard for Jessica", urgent: false },
                                { text: "Call Oceanfront Venue re: Lighting", urgent: false }
                            ].map((note, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${note.urgent ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-slate-700'}`}></div>
                                    <p className="text-xs text-slate-300 font-medium leading-relaxed">{note.text}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
