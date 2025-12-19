
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface User {
    fullName: string;
    email: string;
    password?: string;
    location?: string;
    avatarUrl?: string; // URL to profile photo
    timeZone?: string;
    aboutMe?: string;
    website?: string;
    phone?: string;
    social?: {
        facebook?: string;
        instagram?: string;
    };
    // Architecture Fields
    budgetTier?: '$' | '$$' | '$$$' | '$$$$';
    stylePreferences?: Record<string, number>; // Weighted tags
    stressLevel?: number; // 1-10 scale

    // Role & Business Fields
    role: 'couple' | 'business' | 'admin';
    businessProfile?: {
        serviceCategory: string;
        priceRange: '$' | '$$' | '$$$' | '$$$$';
        zipCodes: string[];
        isAvailable: boolean;
    };
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    updateProfile: (updatedData: Partial<User>) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // Lazy initialization: Check storage synchronousy on mount
    const [user, setUser] = useState<User | null>(() => {
        try {
            const stored = localStorage.getItem("wedding_app_user");
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error("Failed to parse user data", e);
            localStorage.removeItem("wedding_app_user");
            return null;
        }
    });

    const [isLoading, setIsLoading] = useState(false); // Can be kept for verify calls if needed, but simple auth is resolved

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("wedding_app_user", JSON.stringify(userData));
        toast.success(`Welcome, ${userData.fullName.split(" ")[0]}!`);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("wedding_app_user");
        toast.info("You have been logged out.");
    };

    const updateProfile = (updatedData: Partial<User>) => {
        if (!user) return;
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem("wedding_app_user", JSON.stringify(newUser));
        toast.success("Profile updated successfully!");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                updateProfile,
                isAuthenticated: !!user,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
