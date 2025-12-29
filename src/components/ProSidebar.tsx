
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    UserPlus,
    Calendar,
    Image as ImageIcon,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    CheckSquare,
    Palette,
    Users,
    BookOpen,
    Search,
    MapPin,
    Camera,
    Heart,
    MessageSquare,
    Shield,
    Sparkles,
    Briefcase
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";

export const ProSidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isAdmin = user?.role === 'admin';

    // Section header component
    const SectionHeader = ({ label }: { label: string }) => (
        <div className={`px-3 pt-4 pb-2 ${isCollapsed ? 'text-center' : ''}`}>
            <div className={`text-xs font-semibold text-slate-400 uppercase tracking-wider ${isCollapsed ? 'text-center' : ''}`}>
                {isCollapsed ? '━' : `━━━ ${label} ━━━`}
            </div>
        </div>
    );

    // Only show full navigation if admin
    const navigationGroups = isAdmin ? [
        {
            title: "ADMIN",
            items: [
                { icon: Shield, label: "Admin Panel", href: "/admin" },
                { icon: Users, label: "User Management", href: "/admin/users" },
                { icon: Heart, label: "Platform Metrics", href: "/admin/metrics" },
            ]
        },
        {
            title: "ALL ACCESS",
            items: [
                { icon: Settings, label: "Settings", href: "/profile" },
            ]
        },
        {
            title: "COUPLE PREVIEW",
            items: [
                { icon: Palette, label: "Moodboard", href: "/moodboard" },
                { icon: DollarSign, label: "Budget Advisor", href: "/budget" },
                { icon: Sparkles, label: "Style Matcher", href: "/style-matcher" },
            ]
        }
    ] : [
        {
            title: "DASHBOARD",
            items: [
                { icon: LayoutDashboard, label: "Overview", href: "/business" },
                { icon: UserPlus, label: "Active Leads", href: "/pro/leads" },
            ]
        },
        {
            title: "OPERATIONS",
            items: [
                { icon: Calendar, label: user?.role === 'venue' ? "Tour Scheduler" : "Calendar", href: "/pro/calendar" },
                { icon: MessageSquare, label: "Inquiry Inbox", href: "/pro/leads" },
                { icon: DollarSign, label: "Payments & Invoices", href: "/pro/finance" },
                { icon: CheckSquare, label: "Legal Contracts", href: "/pro/contracts" },
            ]
        },
        {
            title: "CONTENT",
            items: [
                { icon: ImageIcon, label: "My Assets", href: "/pro/assets" },
                { icon: Settings, label: "Profile", href: "/profile" },
            ]
        }
    ];

    return (
        <aside
            className={`hidden md:flex flex-col h-screen bg-brand-navy text-white transition-all duration-300 border-r border-slate-800 ${isCollapsed ? "w-20" : "w-64"
                } fixed left-0 top-0 z-50`}
        >
            {/* Sidebar Header */}
            <div className="h-20 flex items-center px-6 border-b border-slate-800">
                <Logo className={isCollapsed ? "h-8" : "h-8 brightness-0 invert"} simplified={isCollapsed} />
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto scrollbar-hide">
                {navigationGroups.map((group, groupIndex) => (
                    <div key={group.title || groupIndex}>
                        {group.title && <SectionHeader label={group.title} />}
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;

                            return (
                                <Link
                                    key={item.label + item.href}
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
                    </div>
                ))}
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
