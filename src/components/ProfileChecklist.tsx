
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChecklistItem {
    id: string;
    label: string;
    completed: boolean;
    href: string;
}

export const ProfileChecklist = ({ role }: { role: string }) => {
    const commonItems: ChecklistItem[] = [
        { id: "1", label: "Upload high-res profile photo", completed: true, href: "/profile" },
        { id: "2", label: "Link your Instagram business account", completed: false, href: "/profile" },
    ];

    const venueItems: ChecklistItem[] = [
        { id: "3", label: "Upload floorplans and capacity charts", completed: false, href: "/assets" },
        { id: "4", label: "Sync your site tour calendar", completed: false, href: "/calendar" },
    ];

    const vendorItems: ChecklistItem[] = [
        { id: "5", label: "Set your per-guest base pricing", completed: false, href: "/assets" },
        { id: "6", label: "Define your service area zip codes", completed: true, href: "/profile" },
    ];

    const items = [...commonItems, ...(role === 'venue' ? venueItems : vendorItems)];
    const completedCount = items.filter(i => i.completed).length;

    return (
        <Card className="border-rose-gold/20 bg-rose-50/10">
            <CardHeader>
                <CardTitle className="text-lg font-serif">Profile Optimization</CardTitle>
                <CardDescription>
                    Complete these steps to increase your visibility to couples by 40%.
                </CardDescription>
                <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-rose-gold transition-all duration-500"
                        style={{ width: `${(completedCount / items.length) * 100}%` }}
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            {item.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                                <Circle className="w-5 h-5 text-slate-300" />
                            )}
                            <span className={`text-sm ${item.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
                                {item.label}
                            </span>
                        </div>
                        {!item.completed && (
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-gold">
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
