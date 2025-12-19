
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Smile, Frown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const VibeCheck = () => {
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

    const isAddMode = (user?.stressLevel || 0) > 7;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="bg-white border shadow-xl rounded-2xl p-4 w-64 mb-2"
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="icon"
                className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${isAddMode ? 'bg-indigo-600 hover:bg-indigo-700 animate-pulse' : 'bg-white hover:bg-slate-50 text-slate-800 border'
                    }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isAddMode ? (
                    <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                ) : (
                    <Smile className="w-8 h-8 text-rose-gold" />
                )}
            </Button>

            {isAddMode && (
                <div className="absolute top-0 right-16 bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
                    Focus Mode On
                </div>
            )}
        </div>
    );
};
