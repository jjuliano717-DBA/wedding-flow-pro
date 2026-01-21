
import { Link, useLocation } from "react-router-dom";
import {
    Briefcase,
    Users,
    Calendar,
    BookOpen,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Search
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";

export const PlannerSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { icon: Briefcase, label: "Agency Overview", href: "/business" },
        { icon: Users, label: "Client List", href: "/clients" },
        { icon: Calendar, label: "Master Schedule", href: "/calendar" },
        { icon: BookOpen, label: "Black Book", href: "/black-book" },
        { icon: Settings, label: "Agency Settings", href: "/profile" },
    ];

    return (
        <aside
            className={`hidden md:flex flex-col h-screen bg-brand-navy text-white transition-all duration-300 border-r border-slate-800 ${isCollapsed ? "w-20" : "w-64"
                } fixed left-0 top-0 z-50`}
        >
            {/* Sidebar Header */}
            <div className="h-20 flex items-center px-6 border-b border-slate-800">
                <div className="flex items-center gap-2 h-8 brightness-0 invert">
                    <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
                        <circle cx="35" cy="30" r="25" stroke="#0F172A" strokeWidth="6" className="transition-colors duration-300"></circle>
                        <circle cx="65" cy="30" r="25" stroke="#DCA1A1" strokeWidth="6" className="transition-colors duration-300"></circle>
                        <path d="M51.5 13.5C54.8 17.5 56.8 23.5 56.8 30C56.8 36.5 54.8 42.5 51.5 46.5" stroke="#0F172A" strokeWidth="6" strokeLinecap="round"></path>
                    </svg>
                    {!isCollapsed && <span className="font-serif text-xl font-bold tracking-tight text-brand-navy flex items-baseline">
                        2Plan<span className="text-dusty-rose">A</span>Wedding
                    </span>}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 space-y-1 px-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                        <Link
                            key={item.label}
                            to={item.href}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${isActive
                                ? "bg-rose-gold text-white font-semibold"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "group-hover:text-white"}`} />
                            {!isCollapsed && <span className="text-sm">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Support / User Section */}
            <div className="p-4 border-t border-slate-800 space-y-2">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 gap-3 px-3"
                    onClick={logout}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="text-sm">Log Out</span>}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-24 bg-rose-600 hover:bg-rose-gold rounded-full h-6 w-6 border-2 border-brand-navy"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>
        </aside>
    );
};
