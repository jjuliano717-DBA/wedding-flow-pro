
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Message {
    id: number;
    user: string;
    text: string;
}

interface AIPlanningBuddyProps {
    messages: Message[];
}

export function AIPlanningBuddy({ messages }: AIPlanningBuddyProps) {
    const [suggestion, setSuggestion] = useState<{
        text: string;
        link: string;
        linkText: string;
    } | null>(null);

    useEffect(() => {
        if (messages.length === 0) return;

        const lastMsg = messages[messages.length - 1];
        const text = lastMsg.text.toLowerCase();

        // Simple Keyword Matching Logic
        if (text.includes("budget") || text.includes("expensive") || text.includes("cost")) {
            setSuggestion({
                text: "Discussing budgets? I can help you verify if that quote is fair.",
                link: "/budget",
                linkText: "Open Budget Advisor"
            });
        } else if (text.includes("flower") || text.includes("florist") || text.includes("bouquet")) {
            setSuggestion({
                text: "Looking for florals? Check out our top-rated Florida florists.",
                link: "/vendors",
                linkText: "View Florists"
            });
        } else if (text.includes("stress") || text.includes("overwhelmed") || text.includes("panic")) {
            setSuggestion({
                text: "Sounds like high stress. Let's take a Vibe Check.",
                link: "/planner",
                linkText: "Do Vibe Check"
            });
        } else {
            setSuggestion(null);
        }
    }, [messages]);

    if (!suggestion) return null;

    return (
        <div className="absolute bottom-20 left-4 right-4 z-10 animate-in slide-in-from-bottom-2 fade-in">
            <Card className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-violet-200 shadow-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-violet-100 p-2 rounded-full">
                        <Sparkles className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-violet-900">Planning Buddy</p>
                        <p className="text-xs text-violet-700">{suggestion.text}</p>
                    </div>
                </div>
                <Link to={suggestion.link}>
                    <Button size="sm" variant="secondary" className="gap-2 bg-white hover:bg-violet-50 text-violet-700">
                        {suggestion.linkText} <ArrowRight className="w-3 h-3" />
                    </Button>
                </Link>
            </Card>
        </div>
    );
}
