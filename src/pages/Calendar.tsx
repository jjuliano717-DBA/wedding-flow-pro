import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Calendar as CalendarIcon,
    Filter,
    Plus,
    Loader2,
    Info,
    CheckCircle2,
    XCircle,
    Clock,
    CalendarDays
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useBusiness } from "@/context/BusinessContext";
import { format, isSameDay, parseISO } from "date-fns";

interface AvailabilityEntry {
    id: string;
    blocked_date: string;
    reason: 'BOOKED' | 'UNAVAILABLE';
    notes: string | null;
    start_time?: string | null;
    end_time?: string | null;
    is_all_day?: boolean;
}

export default function AvailabilityManager() {
    const { businessProfile, isLoading: businessLoading } = useBusiness();
    const [availability, setAvailability] = useState<AvailabilityEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Dialog state for new/editing entry
    const [reason, setReason] = useState<'BOOKED' | 'UNAVAILABLE'>('BOOKED');
    const [notes, setNotes] = useState("");
    const [isAllDay, setIsAllDay] = useState(true);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (businessProfile?.id) {
            fetchAvailability();
        }
    }, [businessProfile?.id]);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('vendor_availability')
                .select('*')
                .eq('vendor_id', businessProfile!.id);

            if (error) throw error;
            setAvailability(data || []);
        } catch (error) {
            console.error("Error fetching availability:", error);
            toast.error("Failed to load schedule");
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) return;
        setSelectedDate(date);

        // Check if date is already blocked
        const existing = availability.find(a => isSameDay(parseISO(a.blocked_date), date));
        if (existing) {
            setReason(existing.reason);
            setNotes(existing.notes || "");
            setIsAllDay(existing.is_all_day ?? true);
            setStartTime(existing.start_time || "09:00");
            setEndTime(existing.end_time || "17:00");
        } else {
            setReason('BOOKED');
            setNotes("");
            setIsAllDay(true);
            setStartTime("09:00");
            setEndTime("17:00");
        }
        setIsDialogOpen(true);
    };

    const handleSaveAvailability = async () => {
        if (!selectedDate || !businessProfile?.id) return;
        setSubmitting(true);

        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const existing = availability.find(a => a.blocked_date === dateStr);

        try {
            if (existing) {
                // Update or Delete (if we want to unblock, but let's just update for now)
                const { error } = await supabase
                    .from('vendor_availability')
                    .update({
                        reason,
                        notes,
                        is_all_day: isAllDay,
                        start_time: isAllDay ? null : startTime,
                        end_time: isAllDay ? null : endTime
                    })
                    .eq('id', existing.id);
                if (error) throw error;
                toast.success("Schedule updated");
            } else {
                // Insert new block
                const { error } = await supabase
                    .from('vendor_availability')
                    .insert([{
                        vendor_id: businessProfile.id,
                        blocked_date: dateStr,
                        reason,
                        notes,
                        is_all_day: isAllDay,
                        start_time: isAllDay ? null : startTime,
                        end_time: isAllDay ? null : endTime
                    }]);
                if (error) throw error;
                toast.success("Date blocked");
            }
            fetchAvailability();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error saving availability:", error);
            toast.error("Failed to update schedule");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUnblock = async () => {
        if (!selectedDate || !businessProfile?.id) return;
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const existing = availability.find(a => a.blocked_date === dateStr);
        if (!existing) return;

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('vendor_availability')
                .delete()
                .eq('id', existing.id);

            if (error) throw error;
            toast.success("Date unblocked");
            fetchAvailability();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error deleting availability:", error);
            toast.error("Failed to unblock date");
        } finally {
            setSubmitting(false);
        }
    };

    // Helper to stylize days
    const blockedDates = availability.map(a => parseISO(a.blocked_date));
    const bookedDates = availability.filter(a => a.reason === 'BOOKED').map(a => parseISO(a.blocked_date));
    const unavailableDates = availability.filter(a => a.reason === 'UNAVAILABLE').map(a => parseISO(a.blocked_date));

    if (businessLoading || (loading && availability.length === 0)) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-900">Availability & Master Schedule</h1>
                    <p className="text-slate-600 mt-1">Block dates for bookings, events, or personal time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
                        <CheckCircle2 className="w-3 h-3 mr-2" /> Booking Enabled
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar View */}
                <Card className="lg:col-span-2 bg-white border-slate-200 rounded-2xl overflow-hidden shadow-lg">
                    <CardHeader className="border-b border-slate-200 pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl font-serif text-slate-900">
                            <CalendarDays className="w-5 h-5 text-rose-400" />
                            Booking Calendar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            className="w-full flex justify-center"
                            classNames={{
                                day_today: "bg-slate-100 text-slate-900 border border-rose-500",
                                day_selected: "bg-rose-600 text-white hover:bg-rose-700 focus:bg-rose-600",
                                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-12 sm:space-y-0 w-full justify-center",
                                month: "space-y-6 w-full",
                                table: "w-full border-collapse space-y-1",
                                head_cell: "text-slate-500 rounded-md w-12 font-bold text-xs uppercase tracking-tighter",
                                cell: "h-14 w-12 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-800/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-14 w-12 p-0 font-medium aria-selected:opacity-100 hover:bg-slate-100 transition-colors rounded-lg text-slate-900",
                            }}
                            modifiers={{
                                booked: bookedDates,
                                unavailable: unavailableDates
                            }}
                            modifiersClassNames={{
                                booked: "before:content-[''] before:absolute before:bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-1.5 before:h-1.5 before:bg-rose-500 before:rounded-full",
                                unavailable: "after:content-[''] after:absolute after:top-2 after:right-2 after:w-1.5 after:h-1.5 after:bg-slate-500 after:rounded-full"
                            }}
                        />
                        <div className="mt-8 flex flex-wrap gap-6 justify-center border-t border-slate-200 pt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-rose-500 rounded-full" />
                                <span className="text-xs text-slate-600 font-bold uppercase tracking-widest">Booked Event</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-500 rounded-full" />
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Unavailable / Vacation</span>
                            </div>
                            <div className="flex items-center gap-2 text-rose-400">
                                <Info className="w-4 h-4" />
                                <span className="text-xs font-medium">Click a date to manage status</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Metrics */}
                <div className="space-y-6">
                    <Card className="bg-white border-slate-200 rounded-2xl p-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Availability Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-500/10 rounded-lg">
                                        <Clock className="w-4 h-4 text-rose-500" />
                                    </div>
                                    <span className="text-sm text-slate-900">Days Blocked</span>
                                </div>
                                <span className="font-bold">{availability.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                        <Info className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <span className="text-sm">Pending Tours</span>
                                </div>
                                <span className="font-bold text-slate-400">0</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-rose-600 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                            <CalendarDays className="w-16 h-16" />
                        </div>
                        <h4 className="font-serif text-xl font-bold mb-2">Sync Calendar</h4>
                        <p className="text-xs text-rose-100 mb-4">Connect your Google or iCal to automatically sync availability.</p>
                        <Button className="w-full bg-white text-rose-600 hover:bg-rose-50 font-bold rounded-xl py-6">
                            Connect Now
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Manage Date Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-serif">
                            {selectedDate && format(selectedDate, 'MMMM do, yyyy')}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Update availability status for this date.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={reason} onValueChange={(v: any) => setReason(v)}>
                                <SelectTrigger className="bg-slate-800 border-slate-700 py-6">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                    <SelectItem value="BOOKED">Booked Event</SelectItem>
                                    <SelectItem value="UNAVAILABLE">Unavailable / Blocked</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isAllDay"
                                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-rose-600 focus:ring-rose-500"
                                checked={isAllDay}
                                onChange={e => setIsAllDay(e.target.checked)}
                            />
                            <Label htmlFor="isAllDay" className="cursor-pointer">All Day Event</Label>
                        </div>

                        {!isAllDay && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <Label>Start Time</Label>
                                    <Input
                                        type="time"
                                        value={startTime}
                                        onChange={e => setStartTime(e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time</Label>
                                    <Input
                                        type="time"
                                        value={endTime}
                                        onChange={e => setEndTime(e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Internal Notes (Optional)</Label>
                            <Textarea
                                placeholder="Add customer name, event title, or reason for blocking..."
                                className="bg-slate-800 border-slate-700 min-h-[100px]"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                        {availability.some(a => isSameDay(parseISO(a.blocked_date), selectedDate!)) && (
                            <Button
                                variant="outline"
                                className="flex-1 bg-transparent border-slate-700 text-slate-400 hover:bg-red-900/20 hover:text-red-400"
                                onClick={handleUnblock}
                                disabled={submitting}
                            >
                                <XCircle className="w-4 h-4 mr-2" /> Unblock Date
                            </Button>
                        )}
                        <Button
                            className="flex-1 bg-rose-600 hover:bg-rose-700 py-6 font-bold"
                            onClick={handleSaveAvailability}
                            disabled={submitting}
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            Save Schedule
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
