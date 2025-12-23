
import { useState, useEffect } from "react";
import { ChevronDown, Search, Bell, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const PlannerHeader = () => {
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [activeProject, setActiveProject] = useState<any>(null);

    useEffect(() => {
        if (user?.id) {
            fetchClientProjects();
        }
    }, [user?.id]);

    const fetchClientProjects = async () => {
        // Fetch projects managed by this planner
        // For now, mapping to projects where user_id matches or 
        // in a real scenario, where a 'planner_id' column exists.
        // Assuming 'projects' table has a 'planner_id' or similar for agency mode.
        // Let's just fetch all projects for demonstration if we don't have the column yet.
        const { data, error } = await supabase
            .from('projects')
            .select('*');

        if (data && data.length > 0) {
            setProjects(data);
            setActiveProject(data[0]); // Default to first for now
        }
    };

    return (
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Client</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent flex items-center gap-2 group">
                                <span className="text-lg font-serif font-bold text-brand-navy">
                                    {activeProject ? (activeProject.name || `Project ${activeProject.id.slice(0, 4)}`) : "Select Client"}
                                </span>
                                <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-brand-navy transition-colors" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64">
                            <DropdownMenuLabel>Managed Weddings</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {projects.map((p) => (
                                <DropdownMenuItem key={p.id} onClick={() => setActiveProject(p)}>
                                    {p.name || `Project ${p.id.slice(0, 4)}`}
                                </DropdownMenuItem>
                            ))}
                            {projects.length === 0 && (
                                <div className="p-2 text-sm text-slate-400 italic">No active clients</div>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-full w-96">
                    <Search className="w-4 h-4 text-slate-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search leads, vendors, or tasks..."
                        className="bg-transparent border-none focus:outline-none text-sm w-full"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-brand-navy">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-gold rounded-full border-2 border-white" />
                </Button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-brand-navy">{user?.fullName}</p>
                        <p className="text-xs text-slate-400 italic">Senior Planner</p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-slate-100 hover:border-slate-300 transition-colors cursor-pointer">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Avatar" className="object-cover w-full h-full" />
                                ) : (
                                    <User className="w-6 h-6 text-slate-400" />
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to="/profile" className="cursor-pointer">
                                    <User className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-600">
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};
