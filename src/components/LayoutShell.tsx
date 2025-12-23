

import React from "react";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CoupleNav } from "./CoupleNav";
import { ProSidebar } from "./ProSidebar";
import { PlannerSidebar } from "./PlannerSidebar";
import { PlannerHeader } from "./PlannerHeader";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutShellProps {
    children: React.ReactNode;
}

export const LayoutShell = ({ children }: LayoutShellProps) => {
    const { user, isAuthenticated, logout } = useAuth();

    // Determine user role (default to couple for public/anon)
    const role = user?.role || 'couple';

    // 1. Couple View (Standard Header/Footer + Bottom Nav on Mobile)
    if (role === 'couple') {
        return (
            <div className="relative w-full min-h-screen flex flex-col bg-background overflow-x-hidden">
                <Header />
                <main className="flex-1 pt-16 md:pt-20 w-full mb-16 md:mb-0">
                    {children}
                </main>
                <CoupleNav />
                <Footer />
            </div>
        );
    }

    // 2. Pro View (Sidebar Layout)
    if (role === 'vendor' || role === 'venue' || role === 'admin') {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                <ProSidebar />
                <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
                    {/* Minimal Pro Header */}
                    <header className="h-16 md:h-20 bg-white border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-end">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-brand-navy hidden sm:block">
                                {role === 'admin' ? 'Admin Panel' : 'Business Dashboard'}
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer" />
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
                    </header>
                    <main className="flex-1 p-6 md:p-10">
                        {children}
                    </main>
                </div>
            </div>
        );
    }

    // 3. Planner View (Agency Layout)
    if (role === 'planner') {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                <PlannerSidebar />
                <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
                    <PlannerHeader />
                    <main className="flex-1 p-6 md:p-10">
                        {children}
                    </main>
                </div>
            </div>
        );
    }

    // Default Fallback
    return (
        <div className="relative w-full min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 pt-16 md:pt-20 w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
};
