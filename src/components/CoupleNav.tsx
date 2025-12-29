
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Wallet, MessageSquare, User, Heart } from "lucide-react";

export const CoupleNav = () => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: "Home", href: "/planner" },
        { icon: Search, label: "Search", href: "/discover" },
        { icon: Wallet, label: "Budget", href: "/budget" },
        { icon: MessageSquare, label: "Chat", href: "/community" },
        { icon: User, label: "Profile", href: "/profile" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 flex items-center justify-around h-16 px-2 md:hidden">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                    <Link
                        key={item.label}
                        to={item.href}
                        className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${isActive ? "text-rose-gold" : "text-slate-400"
                            }`}
                    >
                        <Icon className={`w-6 h-6 ${isActive ? "fill-rose-gold/10" : ""}`} />
                        <span className="text-[10px] font-medium leading-none">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};
