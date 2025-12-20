
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export type UserRole = 'couple' | 'business' | 'admin';

export interface User {
    id?: string; // Add ID for Supabase
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
    stressLevel?: number;
    stylePreferences?: any; // Record<string, any> for complex profiles

    // Role & Business Fields
    role: UserRole;
    businessProfile?: {
        serviceCategory: string;
        priceRange: '$' | '$$' | '$$$' | '$$$$';
        zipCodes: string[];
        isAvailable: boolean;
    };
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => Promise<void>; // Kept signature similar but async
    signUp: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (updatedData: Partial<User>) => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Session Check & Subscription
    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchUserProfile(session);
            } else {
                setIsLoading(false);
            }
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchUserProfile(session);
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (session: Session) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error("Error fetching user profile:", error);
                // Fallback to metadata if persistent profile fetch fails
                setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    fullName: session.user.user_metadata.full_name || "User",
                    role: session.user.user_metadata.role || "couple",
                });
            } else {
                // Map DB snake_case to CamelCase if needed, but our helper mapped it one-to-one mostly
                // Depending on SQL definition, columns are snake_case.
                // We defined SQL as: full_name, role, etc.
                setUser({
                    ...data,
                    fullName: data.full_name, // Map SQL field to Typescript
                    avatarUrl: data.avatar_url,
                    budgetTier: data.budget_tier,
                    stressLevel: data.stress_level,
                    stylePreferences: data.style_preferences
                });
            }
        } catch (e) {
            console.error("Fetch profile exception", e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData: User) => {
        try {
            if (!userData.email || !userData.password) throw new Error("Email and password required");

            const { error } = await supabase.auth.signInWithPassword({
                email: userData.email,
                password: userData.password,
            });

            if (error) throw error;
            toast.success(`Welcome back!`);
        } catch (error: any) {
            console.error("Login failed:", error);
            toast.error(error.message || "Login failed");
            throw error;
        }
    };

    const signUp = async (userData: User) => {
        try {
            if (!userData.email || !userData.password) throw new Error("Email and password required");

            const { error } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        full_name: userData.fullName,
                        role: userData.role,
                        location: userData.location
                    }
                }
            });

            if (error) throw error;
            toast.success("Account created! Please check your email to verify.");
        } catch (error: any) {
            console.error("Signup failed:", error);
            toast.error(error.message || "Signup failed");
            throw error;
        }
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) toast.error("Error signing out");
        else toast.info("Signed out successfully");
        setUser(null);
    };

    const updateProfile = async (updatedData: Partial<User>) => {
        if (!user || !user.id) return;

        try {
            // Optimistic Update
            setUser({ ...user, ...updatedData });

            const updates: any = {
                id: user.id,
                updated_at: new Date(),
            };
            if (updatedData.fullName) updates.full_name = updatedData.fullName;
            if (updatedData.role) updates.role = updatedData.role;
            if (updatedData.location) updates.location = updatedData.location;
            if (updatedData.budgetTier) updates.budget_tier = updatedData.budgetTier;
            if (updatedData.stressLevel) updates.stress_level = updatedData.stressLevel;
            if (updatedData.stylePreferences) updates.style_preferences = updatedData.stylePreferences;

            const { error } = await supabase.from('users').upsert(updates);

            if (error) throw error;
            toast.success("Profile updated");
        } catch (error) {
            toast.error("Error updating profile");
            console.error(error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signUp,
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
