
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
        <header className="h-20 bg-[#0F172A] border-b border-slate-800 sticky top-0 z-40 px-8 flex items-center justify-between text-white">
            <div className="flex items-center gap-8">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Client</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent flex items-center gap-2 group">
                                <span className="text-lg font-serif font-bold text-white group-hover:text-rose-400 transition-colors">
                                    {activeProject ? (activeProject.name || `Project ${activeProject.id.slice(0, 4)}`) : "Select Client"}
                                </span>
                                <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-rose-400 transition-colors" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64 bg-slate-900 border-slate-700 text-white">
                            <DropdownMenuLabel className="text-slate-500 text-[10px] uppercase font-bold">Managed Weddings</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            {projects.map((p) => (
                                <DropdownMenuItem
                                    key={p.id}
                                    onClick={() => setActiveProject(p)}
                                    className="focus:bg-slate-800 focus:text-white cursor-pointer py-3"
                                >
                                    {p.name || `Project ${p.id.slice(0, 4)}`}
                                </DropdownMenuItem>
                            ))}
                            {projects.length === 0 && (
                                <div className="p-4 text-sm text-slate-500 italic">No active clients</div>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl w-96 ring-offset-[#0F172A] focus-within:ring-1 focus-within:ring-rose-500 transition-all">
                    <Search className="w-4 h-4 text-slate-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search leads, vendors, or tasks..."
                        className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-300 placeholder:text-slate-600"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-slate-800">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-600 rounded-full border-2 border-[#0F172A]" />
                </Button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white">{user?.fullName}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Senior Planner</p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Avatar" className="object-cover w-full h-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-rose-600/10 text-rose-500 font-bold uppercase">
                                        {user?.fullName?.charAt(0) || "P"}
                                    </div>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-700 text-white">
                            <DropdownMenuLabel className="text-slate-500 text-[10px] uppercase font-bold">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white">
                                <Link to="/profile" className="cursor-pointer flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-400 focus:bg-slate-800">
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
