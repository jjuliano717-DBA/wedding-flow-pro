
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Smile, Frown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface VibeCheckProps {
    variant?: 'floating' | 'header';
}

export const VibeCheck = ({ variant = 'floating' }: VibeCheckProps) => {
    const { user, updateProfile } = useAuth();
    const [stress, setStress] = useState(user?.stressLevel || 5);
    const [isOpen, setIsOpen] = useState(false);

    // Sync local state if user context updates
    useEffect(() => {
        if (user?.stressLevel) setStress(user.stressLevel);
    }, [user?.stressLevel]);

    const handleUpdate = (level: number) => {
        setStress(level);
        updateProfile({ stressLevel: level });
        // Close popover after selection
        setTimeout(() => setIsOpen(false), 800);
    };

    const isHighStress = (user?.stressLevel || 0) > 7;

    const getStressIcon = () => {
        if (stress <= 3) return <Smile className="w-5 h-5 text-green-500" />;
        if (stress <= 7) return <div className="w-5 h-5 flex items-center justify-center text-lg">😐</div>;
        return (
            <div className="relative">
                <Frown className="w-5 h-5 text-red-500" />
                <Zap className="w-3 h-3 absolute -top-1 -right-1 fill-yellow-400 text-yellow-500" />
            </div>
        );
    };

    const PopoverBody = (
        <div className="p-4 w-64">
            <h4 className="font-semibold text-center mb-3">Rate your Vibe</h4>
            <div className="flex justify-between items-center px-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`text-green-500 hover:text-green-600 hover:bg-green-50 flex flex-col h-auto p-2 gap-1 ${stress <= 3 ? 'bg-green-50 ring-1 ring-green-200' : ''}`}
                    onClick={() => handleUpdate(2)}
                >
                    <Smile className="w-8 h-8" />
                    <span className="text-[10px]">Chill</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 flex flex-col h-auto p-2 gap-1 ${stress > 3 && stress <= 7 ? 'bg-yellow-50 ring-1 ring-yellow-200' : ''}`}
                    onClick={() => handleUpdate(5)}
                >
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-xl">😐</div>
                    <span className="text-[10px]">Okay</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`text-red-500 hover:text-red-600 hover:bg-red-50 flex flex-col h-auto p-2 gap-1 ${stress > 7 ? 'bg-red-50 ring-1 ring-red-200' : ''}`}
                    onClick={() => handleUpdate(9)}
                >
                    <div className="relative">
                        <Frown className="w-8 h-8" />
                        <Zap className="w-4 h-4 absolute -top-1 -right-1 fill-yellow-400 text-yellow-500" />
                    </div>
                    <span className="text-[10px]">Stress!</span>
                </Button>
            </div>
            <div className="mt-3 text-center">
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={stress}
                    onChange={(e) => handleUpdate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-gold"
                />
                <span className="text-xs text-muted-foreground mt-1 block">{stress}/10</span>
            </div>
        </div>
    );

    // Header variant - compact inline button
    if (variant === 'header') {
        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`relative h-9 w-9 rounded-full transition-all ${isHighStress ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-100'
                            }`}
                    >
                        {getStressIcon()}
                        {isHighStress && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    {PopoverBody}
                </PopoverContent>
            </Popover>
        );
    }

    // Floating variant (legacy) - no longer used but kept for compatibility
    return null;
};
