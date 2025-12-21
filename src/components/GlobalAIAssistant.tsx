/**
 * Global AI Assistant - Available on all pages for authenticated users
 */

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AIAssistantChat, AIAssistantFAB } from "@/components/AIAssistantChat";

export function GlobalAIAssistant() {
    const { isAuthenticated, user } = useAuth();
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Only show for authenticated couples and admins
    const showAssistant = isAuthenticated && user?.role && ['couple', 'admin'].includes(user.role);

    if (!showAssistant) return null;

    return (
        <>
            <AIAssistantFAB onClick={() => setIsChatOpen(true)} />
            <AIAssistantChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    );
}
