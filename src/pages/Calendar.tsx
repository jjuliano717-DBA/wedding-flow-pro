import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Filter, Plus } from "lucide-react";

export default function Calendar() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-brand-navy">Master Schedule</h1>
                    <p className="text-slate-500 mt-1">Manage tours, bookings, and important deadlines.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled className="hidden sm:flex text-slate-400"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
                    <Button disabled className="bg-slate-200 text-slate-400 cursor-not-allowed"><Plus className="w-4 h-4 mr-2" /> New Event</Button>
                </div>
            </div>

            <Card className="border-dashed border-2 bg-slate-50/50 flex-1 flex flex-col items-center justify-center p-20 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                    <CalendarIcon className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="max-w-md space-y-2">
                    <h2 className="text-2xl font-serif font-bold text-brand-navy">Smart Calendar Coming Soon</h2>
                    <p className="text-slate-500">
                        Sync your external calendars, manage team availability, and let couples book tours directly.
                    </p>
                </div>
                <div className="flex gap-2 mt-6">
                    <Button variant="outline" disabled>Notify Me</Button>
                    <Button variant="ghost" className="text-brand-navy hover:bg-emerald-50">View Roadmap &rarr;</Button>
                </div>
            </Card>
        </div>
    );
}
