
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export type UserLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlockedAt: Date;
}

interface GamificationContextType {
    level: UserLevel;
    xp: number;
    badges: Badge[];
    addXP: (amount: number, reason: string) => void;
    unlockBadge: (badgeId: string) => void;
    levelTitle: string;
    nextLevelXP: number;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const LEVEL_TITLES: Record<UserLevel, string> = {
    1: "The Newly Engaged",
    2: "Visionary",
    3: "Negotiator",
    4: "Lead Coordinator",
    5: "Tactical Pro",
    6: "The Alum"
};

const XP_THRESHOLDS: Record<UserLevel, number> = {
    1: 0,
    2: 100,  // Create Mood Board
    3: 300,  // Share Vendor Win
    4: 1000, // 10 Answers
    5: 5000, // 100+ interactions
    6: 10000 // Post-Wedding
};

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [xp, setXp] = useState(() => {
        const saved = localStorage.getItem("wedding_gamification_xp");
        return saved ? parseInt(saved) : 0;
    });

    // We can derive level from XP, or persist it too. Deriving is safer to keep sync.
    // However, the original code had distinct level state logic.
    // Let's persist level too for simplicity or calculate it on init.
    // Let's calculate it on init to be robust.
    const calculateLevel = (currentXp: number): UserLevel => {
        if (currentXp >= 10000) return 6;
        if (currentXp >= 5000) return 5;
        if (currentXp >= 1000) return 4;
        if (currentXp >= 300) return 3;
        if (currentXp >= 100) return 2;
        return 1;
    };

    const [level, setLevel] = useState<UserLevel>(() => calculateLevel(xp));
    const [badges, setBadges] = useState<Badge[]>([]);

    // Persist XP changes
    useEffect(() => {
        localStorage.setItem("wedding_gamification_xp", xp.toString());
        const newLevel = calculateLevel(xp);
        if (newLevel > level) {
            setLevel(newLevel);
            toast.success(`Leveled Up! You are now a "${LEVEL_TITLES[newLevel]}"`);
        }
    }, [xp]);

    // Note: Removed the old useEffect that calculated level to avoid double-firing
    // Merged logic into the persistence effect above.

    const addXP = (amount: number, reason: string) => {
        setXp(prev => prev + amount);
        console.log(`+${amount} XP: ${reason}`);
    };

    const unlockBadge = (badgeId: string) => {
        if (badges.some(b => b.id === badgeId)) return;

        // Mock definitions for badges
        const badgeDef = {
            id: badgeId,
            name: badgeId.replace('-', ' ').toUpperCase(),
            icon: '🏆',
            description: 'Awarded for community contribution.',
            unlockedAt: new Date()
        };

        setBadges(prev => [...prev, badgeDef]);
        toast.success(`Badge Unlocked: ${badgeDef.name}`);
    };

    return (
        <GamificationContext.Provider value={{
            level,
            xp,
            badges,
            addXP,
            unlockBadge,
            levelTitle: LEVEL_TITLES[level],
            nextLevelXP: XP_THRESHOLDS[(level + 1) as UserLevel] || 100000
        }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};
