
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Users, Utensils, CheckCircle, XCircle, Mail } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Guest {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    rsvp_status: 'pending' | 'attending' | 'declined';
    dietary_notes: string;
    plus_one: boolean;
    table_number?: string;
}

export default function Guests() {
    const { user } = useAuth();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");

    // Stats
    const totalGuests = guests.length;
    const attending = guests.filter(g => g.rsvp_status === 'attending').length + guests.filter(g => g.rsvp_status === 'attending' && g.plus_one).length;
    const pending = guests.filter(g => g.rsvp_status === 'pending').length;
    const declined = guests.filter(g => g.rsvp_status === 'declined').length;
    const dietaryCount = guests.filter(g => g.dietary_notes).length;

    useEffect(() => {
        if (user) fetchGuests();
    }, [user]);

    const fetchGuests = async () => {
        try {
            const { data, error } = await supabase
                .from('guests')
                .select('*')
                .eq('user_id', user!.id)
                .order('last_name', { ascending: true });

            if (error) throw error;
            setGuests(data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load guests.");
        } finally {
            setLoading(false);
        }
    };

    const addGuest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const guestData = {
            user_id: user!.id,
            first_name: formData.get('firstName'),
            last_name: formData.get('lastName'),
            email: formData.get('email'),
            role: formData.get('role'),
            dietary_notes: formData.get('dietary'),
            plus_one: formData.get('plusOne') === 'on'
        };

        try {
            const { data, error } = await supabase
                .from('guests')
                .insert(guestData)
                .select()
                .single();

            if (error) throw error;
            setGuests([...guests, data]);
            setIsAddOpen(false);
            toast.success("Guest added!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add guest.");
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            // Optimistic
            setGuests(guests.map(g => g.id === id ? { ...g, rsvp_status: status as any } : g));

            await supabase.from('guests').update({ rsvp_status: status }).eq('id', id);
            toast.success("RSVP updated");
        } catch (e) {
            toast.error("Update failed");
            fetchGuests();
        }
    };

    const filteredGuests = guests.filter(g => {
        const matchesSearch = (g.first_name + ' ' + g.last_name).toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filterStatus === 'all' || g.rsvp_status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Guest Manager</h1>
                    <p className="text-slate-500">Manage your inner circle, RSVPs, and meal preferences.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200"><Plus className="w-4 h-4 mr-2" /> Add Guest</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Guest</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={addGuest} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input name="firstName" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input name="lastName" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email (Optional)</Label>
                                <Input name="email" type="email" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Relationship</Label>
                                    <Select name="role" defaultValue="Friend">
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Bride Family">Bride Family</SelectItem>
                                            <SelectItem value="Groom Family">Groom Family</SelectItem>
                                            <SelectItem value="Wedding Party">Wedding Party</SelectItem>
                                            <SelectItem value="Friend">Friend</SelectItem>
                                            <SelectItem value="Colleague">Colleague</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-2 pt-8">
                                    <Input name="plusOne" type="checkbox" className="w-4 h-4" />
                                    <Label>Allowed Plus One?</Label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Dietary Requirements</Label>
                                <Input name="dietary" placeholder="e.g. Vegetarian, Nut Allergy" />
                            </div>
                            <Button type="submit" className="w-full bg-rose-600">Add to List</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-white shadow-sm border-slate-200">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Total Invited</p>
                            <h3 className="text-3xl font-serif font-bold text-slate-900 mt-1">{totalGuests}</h3>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                            <Users className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-sm border-slate-200">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold text-green-600">Attending</p>
                            <h3 className="text-3xl font-serif font-bold text-slate-900 mt-1">{attending}</h3>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-sm border-slate-200">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold text-amber-600">Pending</p>
                            <h3 className="text-3xl font-serif font-bold text-slate-900 mt-1">{pending}</h3>
                        </div>
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                            <Mail className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-sm border-slate-200">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold text-purple-600">Dietary Needs</p>
                            <h3 className="text-3xl font-serif font-bold text-slate-900 mt-1">{dietaryCount}</h3>
                        </div>
                        <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                            <Utensils className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Guest List</CardTitle>
                    <div className="flex gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search guests..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="attending">Attending</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="declined">Declined</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dietary</TableHead>
                                <TableHead>Plus One</TableHead>
                                <TableHead className="text-right">RSVP</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredGuests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                                        No guests found. Invite some people to the party!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredGuests.map(guest => (
                                    <TableRow key={guest.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 bg-slate-100">
                                                    <AvatarFallback className="text-xs">{guest.first_name[0]}{guest.last_name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    {guest.first_name} {guest.last_name}
                                                    {guest.email && <div className="text-xs text-slate-400 font-normal">{guest.email}</div>}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><Badge variant="outline" className="font-normal">{guest.role}</Badge></TableCell>
                                        <TableCell>
                                            <Badge className={
                                                guest.rsvp_status === 'attending' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                                    guest.rsvp_status === 'declined' ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' :
                                                        'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                            }>
                                                {guest.rsvp_status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {guest.dietary_notes && (
                                                <div className="flex items-center text-xs text-slate-600 bg-purple-50 px-2 py-1 rounded max-w-[150px] truncate">
                                                    <Utensils className="w-3 h-3 mr-1 shrink-0" /> {guest.dietary_notes}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{guest.plus_one ? <CheckCircle className="w-4 h-4 text-slate-400" /> : <span className="text-slate-200">-</span>}</TableCell>
                                        <TableCell className="text-right">
                                            <Select defaultValue={guest.rsvp_status} onValueChange={(v) => updateStatus(guest.id, v)}>
                                                <SelectTrigger className="w-[110px] h-8 text-xs ml-auto">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="attending">Accept</SelectItem>
                                                    <SelectItem value="declined">Decline</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
