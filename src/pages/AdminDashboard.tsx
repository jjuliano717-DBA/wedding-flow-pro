import React, { useState, useEffect } from "react";
import {
    Users,
    Store,
    MapPin,
    TrendingUp,
    Search,
    Filter,
    MoreVertical,
    Shield,
    UserCheck,
    Mail,
    Loader2,
    Plus,
    Edit,
    Trash2,
    Heart,
    Star,
    Camera,
    FileText,
    Calendar,
    ShieldCheck,
    Check,
    DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Types (Matching DB Schema) ---
type UserRole = 'couple' | 'vendor' | 'planner' | 'venue' | 'admin';

interface AdminUser {
    id: string;
    full_name: string;
    email: string;
    role: UserRole;
    status: string; // derived
}

interface Venue {
    id: string;
    name: string;
    description: string;
    type: string;
    location: string;
    capacity: string;
    capacity_num: number;
    price: string;
    google_rating: number;
    google_reviews: number;
    heart_rating: number;
    exclusive: boolean;
    featured: boolean;
    indoor: boolean;
    outdoor: boolean;
    image_url: string;
    website: string;
    google_business_url: string;
    contact_email: string;
    phone: string;
    amenities: string[];
    images: string[];
}

interface Vendor {
    id: string;
    name: string;
    description: string;
    type: string;
    location: string;
    website: string;
    google_business_url: string;
    service_zipcodes: string[];
    google_rating: number;
    google_reviews: number;
    heart_rating: number;
    exclusive: boolean;
    featured: boolean;
    image_url: string;
}

interface RealWedding {
    id: string;
    couple_names: string;
    location: string;
    style: string;
    season: string;
    featuring: string; // Keep for backward compat or single highlight
    vendors: string[]; // List of vendors
    exclusive: boolean;
    image_url: string;
}

interface PlanningTip {
    id: string;
    title: string;
    content: string;
    tags: string[];
    author: string;
    read_time: string;
    image_url: string;
    publish: boolean;
    exclusive: boolean;
}

type EditorType = 'vendor' | 'venue' | 'wedding' | 'tip' | 'user';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('vendors');
    const [loading, setLoading] = useState(true);

    // Data States
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [weddings, setWeddings] = useState<RealWedding[]>([]);
    const [tips, setTips] = useState<PlanningTip[]>([]);

    // Editor State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editorType, setEditorType] = useState<EditorType>('vendor');
    const [editingId, setEditingId] = useState<string | null>(null); // Null means create mode
    const [formData, setFormData] = useState<any>({}); // Flexible state for forms

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [usersRes, venuesRes, vendorsRes, weddingsRes, tipsRes] = await Promise.all([
                supabase.from('users').select('*'),
                supabase.from('venues').select('*'),
                supabase.from('vendors').select('*'),
                supabase.from('real_weddings').select('*'),
                supabase.from('planning_tips').select('*')
            ]);

            if (usersRes.data) setUsers(usersRes.data);
            if (venuesRes.data) setVenues(venuesRes.data);
            if (vendorsRes.data) setVendors(vendorsRes.data);
            if (weddingsRes.data) setWeddings(weddingsRes.data);
            if (tipsRes.data) setTips(tipsRes.data);

        } catch (e) {
            console.error("Error loading admin data", e);
            toast.error("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---

    const handleDelete = async (id: string, type: EditorType) => {
        if (!confirm("Are you sure? This strictly deletes the record from the database.")) return;

        const tableMap = {
            'vendor': 'vendors',
            'venue': 'venues',
            'wedding': 'real_weddings',
            'tip': 'planning_tips',
            'user': 'users'
        };

        try {
            const { error } = await supabase.from(tableMap[type]).delete().eq('id', id);
            if (error) throw error;

            toast.success("Deleted successfully");
            // Optimistic update
            if (type === 'vendor') setVendors(prev => prev.filter(i => i.id !== id));
            if (type === 'venue') setVenues(prev => prev.filter(i => i.id !== id));
            if (type === 'wedding') setWeddings(prev => prev.filter(i => i.id !== id));
            if (type === 'tip') setTips(prev => prev.filter(i => i.id !== id));
            if (type === 'user') setUsers(prev => prev.filter(i => i.id !== id));

        } catch (error) {
            console.error(error);
            toast.error("Delete failed");
        }
    };

    const handleSetPassword = async (userId: string, email: string) => {
        const newPassword = prompt(`Enter new password for ${email}:`);
        if (!newPassword) return;

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            // Use Supabase RPC to update password
            // Note: This requires a database function to be set up
            const { error } = await supabase.rpc('admin_set_user_password', {
                user_id: userId,
                new_password: newPassword
            });

            if (error) throw error;

            toast.success("Password updated successfully!", {
                description: `New password set for ${email}`,
            });
        } catch (error: any) {
            console.error(error);
            toast.error("Password update failed", {
                description: "You may need to set up the admin_set_user_password function in Supabase.",
            });
        }
    };

    const handleOpenEditor = (type: EditorType, item?: any) => {
        setEditorType(type);
        setEditingId(item ? item.id : null);

        // Initialize form data based on type
        if (item) {
            setFormData({ ...item });
        } else {
            // Default values for new items
            if (type === 'vendor') setFormData({ name: '', type: 'Photographer', description: '', location: '', google_rating: 0, google_reviews: 0, heart_rating: 0, exclusive: false, featured: false, image_url: '', website: '', google_business_url: '', service_zipcodes: [] });
            if (type === 'venue') setFormData({ name: '', type: 'Ballroom', description: '', location: '', capacity: '50-300', capacity_num: 100, price: '$$$', google_rating: 0, google_reviews: 0, heart_rating: 0, exclusive: false, featured: false, indoor: true, outdoor: true, image_url: '', website: '', google_business_url: '', contact_email: '', phone: '', amenities: [], images: [] });
            if (type === 'wedding') setFormData({ couple_names: '', location: '', style: 'Classic', season: 'Spring', featuring: '', vendors: [], exclusive: false, image_url: '' });
            if (type === 'tip') setFormData({ title: '', category: 'Planning', content: '', image_url: '', author: '', read_time: '', tags: [], publish: true, exclusive: false });
            if (type === 'user') setFormData({ full_name: '', email: '', role: 'couple', status: 'active' });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        const tableMap = {
            'vendor': 'vendors',
            'venue': 'venues',
            'wedding': 'real_weddings',
            'tip': 'planning_tips',
            'user': 'users'
        };

        const table = tableMap[editorType];

        try {
            let res;
            // Clean up formData to remove immutable fields or extra properties
            const { id, created_at, ...rawCleanData } = formData;

            let cleanData = rawCleanData;

            // Special handling for users
            if (editorType === 'user') {
                // Remove fields that are typically managed by Auth or are derived
                const { status, email, updated_at, ...userOnlyData } = rawCleanData;
                cleanData = {
                    ...userOnlyData,
                    updated_at: new Date().toISOString()
                };
            }

            if (editingId) {
                // Update
                console.log(`Updating ${editorType} [${editingId}] with:`, cleanData);
                res = await supabase.from(table).update(cleanData).eq('id', editingId).select();
            } else {
                // Create
                console.log(`Creating ${editorType} with:`, cleanData);
                res = await supabase.from(table).insert([{ ...cleanData, id: undefined }]).select();
            }


            if (res.error) {
                console.error(`Supabase error saving ${editorType}:`, res.error);
                // Explicitly show the database error to the user
                toast.error(`Database Error: ${res.error.message}`, {
                    description: `Code: ${res.error.code}. Check console for details.`,
                    duration: 10000,
                });
                throw res.error;
            }

            console.log(`Saved ${editorType} successfully:`, res.data);

            const savedItem = res.data[0];

            // Update local state immediately
            if (editorType === 'vendor') {
                setVendors(prev => editingId ? prev.map(i => i.id === editingId ? savedItem : i) : [...prev, savedItem]);
            } else if (editorType === 'venue') {
                setVenues(prev => editingId ? prev.map(i => i.id === editingId ? savedItem : i) : [...prev, savedItem]);
            } else if (editorType === 'wedding') {
                setWeddings(prev => editingId ? prev.map(i => i.id === editingId ? savedItem : i) : [...prev, savedItem]);
            } else if (editorType === 'tip') {
                setTips(prev => editingId ? prev.map(i => i.id === editingId ? savedItem : i) : [...prev, savedItem]);
            } else if (editorType === 'user') {
                setUsers(prev => editingId ? prev.map(i => i.id === editingId ? savedItem : i) : [...prev, savedItem]);
            }

            toast.success("Saved successfully!");
            setIsDialogOpen(false);
            fetchAllData(); // Background refresh
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Save failed");
        }
    };

    // --- Render Helpers ---

    const renderEditorContent = () => {
        if (editorType === 'vendor') {
            return (
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Name</Label><Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Type</Label>
                            <Select value={formData.type || 'Photographer'} onValueChange={v => setFormData({ ...formData, type: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['Photographer', 'Florist', 'DJ/Band', 'Caterer', 'Cake Designer', 'Planner', 'Hair & Makeup', 'Videographer', 'Pest Control'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Image URL (Photo)</Label><Input value={formData.image_url || ''} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://example.com/photo.jpg" /></div>
                        <div className="space-y-2"><Label>Website</Label><Input value={formData.website || ''} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://example.com" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Location</Label><Input value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Service Zipcodes (comma separated)</Label><Input value={Array.isArray(formData.service_zipcodes) ? formData.service_zipcodes.join(', ') : (formData.service_zipcodes || '')} onChange={e => setFormData({ ...formData, service_zipcodes: e.target.value.split(',').map((t: string) => t.trim()) })} placeholder="33602, 33603" /></div>
                    </div>
                    <div className="space-y-2"><Label>Google Business URL</Label><Input value={formData.google_business_url || ''} onChange={e => setFormData({ ...formData, google_business_url: e.target.value })} placeholder="https://g.page/..." /></div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2"><Label>Google Rating</Label><Input type="number" step="0.1" value={formData.google_rating || 0} onChange={e => setFormData({ ...formData, google_rating: parseFloat(e.target.value) })} /></div>
                        <div className="space-y-2"><Label>Reviews</Label><Input type="number" value={formData.google_reviews || 0} onChange={e => setFormData({ ...formData, google_reviews: parseInt(e.target.value) })} /></div>
                        <div className="space-y-2"><Label>Heart Rating</Label><Input type="number" step="0.1" value={formData.heart_rating || 0} onChange={e => setFormData({ ...formData, heart_rating: parseFloat(e.target.value) })} /></div>
                    </div>
                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center space-x-2">
                            <Switch id="exclusive" checked={formData.exclusive || false} onCheckedChange={c => setFormData({ ...formData, exclusive: c })} />
                            <Label htmlFor="exclusive">Exclusive Vendor?</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="featured" checked={formData.featured || false} onCheckedChange={c => setFormData({ ...formData, featured: c })} />
                            <Label htmlFor="featured">Featured?</Label>
                        </div>
                    </div>
                </div>
            )
        }
        if (editorType === 'venue') {
            return (
                <div className="grid gap-4 py-4 h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Name</Label><Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Type</Label>
                            <Select value={formData.type || 'Ballroom'} onValueChange={v => setFormData({ ...formData, type: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['Ballroom', 'Garden & Estate', 'Rustic Barn', 'Waterfront', 'Historic', 'Mountain', 'Loft/Industrial', 'Winery'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Main Image URL</Label><Input value={formData.image_url || ''} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." /></div>
                        <div className="space-y-2"><Label>Website</Label><Input value={formData.website || ''} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://..." /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Contact Email</Label><Input value={formData.contact_email || ''} onChange={e => setFormData({ ...formData, contact_email: e.target.value })} placeholder="info@venue.com" /></div>
                        <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="(555) 555-5555" /></div>
                    </div>

                    <div className="space-y-2"><Label>Google Business URL</Label><Input value={formData.google_business_url || ''} onChange={e => setFormData({ ...formData, google_business_url: e.target.value })} placeholder="https://g.page/..." /></div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Location</Label><Input value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Guests</Label><Input type="number" value={formData.guests || 0} onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) })} /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Capacity (Text)</Label><Input value={formData.capacity || ''} onChange={e => setFormData({ ...formData, capacity: e.target.value })} placeholder="e.g. 50-300" /></div>
                        <div className="space-y-2"><Label>Max Capacity (Num)</Label><Input type="number" value={formData.capacity_num || 0} onChange={e => setFormData({ ...formData, capacity_num: parseInt(e.target.value) })} /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Price Range</Label>
                            <Select value={formData.price || '$$$'} onValueChange={v => setFormData({ ...formData, price: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['$', '$$', '$$$', '$$$$'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2"><Label>Amenities (comma separated)</Label><Textarea value={Array.isArray(formData.amenities) ? formData.amenities.join(', ') : (formData.amenities || '')} onChange={e => setFormData({ ...formData, amenities: e.target.value.split(',').map((t: string) => t.trim()) })} placeholder="Parking, WiFi, Catering Kitchen..." /></div>

                    <div className="space-y-2"><Label>Gallery Images (comma separated URLs)</Label><Textarea value={Array.isArray(formData.images) ? formData.images.join(',\n') : (formData.images || '')} onChange={e => setFormData({ ...formData, images: e.target.value.split(/[,\n]/).map((t: string) => t.trim()).filter(Boolean) })} placeholder="https://..., https://..." className="min-h-[100px] font-mono text-xs" /></div>

                    <div className="flex gap-6 py-2">
                        <div className="flex items-center space-x-2">
                            <Switch id="indoor" checked={formData.indoor || false} onCheckedChange={c => setFormData({ ...formData, indoor: c })} />
                            <Label htmlFor="indoor">Indoor</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="outdoor" checked={formData.outdoor || false} onCheckedChange={c => setFormData({ ...formData, outdoor: c })} />
                            <Label htmlFor="outdoor">Outdoor</Label>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2"><Label>Google Rating</Label><Input type="number" step="0.1" value={formData.google_rating || 0} onChange={e => setFormData({ ...formData, google_rating: parseFloat(e.target.value) })} /></div>
                        <div className="space-y-2"><Label>Reviews</Label><Input type="number" value={formData.google_reviews || 0} onChange={e => setFormData({ ...formData, google_reviews: parseInt(e.target.value) })} /></div>
                        <div className="space-y-2"><Label>Heart Rating</Label><Input type="number" step="0.1" value={formData.heart_rating || 0} onChange={e => setFormData({ ...formData, heart_rating: parseFloat(e.target.value) })} /></div>
                    </div>
                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center space-x-2">
                            <Switch id="exclusive" checked={formData.exclusive || false} onCheckedChange={c => setFormData({ ...formData, exclusive: c })} />
                            <Label htmlFor="exclusive">Exclusive Venue?</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="featured" checked={formData.featured || false} onCheckedChange={c => setFormData({ ...formData, featured: c })} />
                            <Label htmlFor="featured">Featured?</Label>
                        </div>
                    </div>
                </div>
            )
        }
        if (editorType === 'wedding') {
            return (
                <div className="grid gap-4 py-4">
                    <div className="space-y-2"><Label>Couple Names</Label><Input value={formData.couple_names || ''} onChange={e => setFormData({ ...formData, couple_names: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Style</Label>
                            <Select value={formData.style || 'Classic'} onValueChange={v => setFormData({ ...formData, style: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {[
                                        'Minimalist', 'Boho', 'Classic', 'Moody', 'Whimsical', // From Style Matcher
                                        'Garden Romance', 'Classic Elegance', 'Rustic Chic', 'Destination Beach', 'Southern Charm' // Existing Real Weddings
                                    ].sort().map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2"><Label>Season</Label><Input value={formData.season || ''} onChange={e => setFormData({ ...formData, season: e.target.value })} /></div>
                    </div>
                    <div className="space-y-2"><Label>Location</Label><Input value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Image URL (Photo)</Label><Input value={formData.image_url || ''} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." /></div>
                    <div className="space-y-2"><Label>Featuring (Text Highlight)</Label><Input value={formData.featuring || ''} onChange={e => setFormData({ ...formData, featuring: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Vendors List (comma separated)</Label><Textarea value={Array.isArray(formData.vendors) ? formData.vendors.join(', ') : (formData.vendors || '')} onChange={e => setFormData({ ...formData, vendors: e.target.value.split(',').map((t: string) => t.trim()) })} placeholder="Photographer: Click Chics, Florist: Petals..." /></div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Switch id="exclusive" checked={formData.exclusive || false} onCheckedChange={c => setFormData({ ...formData, exclusive: c })} />
                        <Label htmlFor="exclusive">Exclusive Wedding?</Label>
                    </div>
                </div>
            );
        }
        if (editorType === 'tip') {
            return (
                <div className="grid gap-4 py-4">
                    <div className="space-y-2"><Label>Title</Label><Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Category</Label>
                            <Select value={formData.category || 'Planning'} onValueChange={v => setFormData({ ...formData, category: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['Planning', 'Budget', 'Vendors', 'Decor', 'Fashion', 'Etiquette'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2"><Label>Author</Label><Input value={formData.author || ''} onChange={e => setFormData({ ...formData, author: e.target.value })} /></div>
                    </div>
                    <div className="space-y-2"><Label>Image URL</Label><Input value={formData.image_url || ''} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." /></div>
                    <div className="space-y-2"><Label>Content</Label><Textarea className="min-h-[150px]" value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Read Time</Label><Input value={formData.read_time || ''} onChange={e => setFormData({ ...formData, read_time: e.target.value })} placeholder="e.g. 5 min read" /></div>
                        <div className="space-y-2"><Label>Tags (comma separated)</Label><Input value={Array.isArray(formData.tags) ? formData.tags.join(', ') : (formData.tags || '')} onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map((t: string) => t.trim()) })} /></div>
                    </div>
                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center space-x-2">
                            <Switch id="publish" checked={formData.publish || false} onCheckedChange={c => setFormData({ ...formData, publish: c })} />
                            <Label htmlFor="publish">Published</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="exclusive" checked={formData.exclusive || false} onCheckedChange={c => setFormData({ ...formData, exclusive: c })} />
                            <Label htmlFor="exclusive">Exclusive?</Label>
                        </div>
                    </div>
                </div>
            )
        }
        if (editorType === 'user') {
            return (
                <div className="grid gap-4 py-4">
                    <div className="space-y-2"><Label>Full Name</Label><Input value={formData.full_name || ''} onChange={e => setFormData({ ...formData, full_name: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Email</Label><Input value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={!!editingId} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Role</Label>
                            <Select value={formData.role || 'couple'} onValueChange={v => setFormData({ ...formData, role: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['couple', 'vendor', 'planner', 'venue', 'admin'].map(r => <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2"><Label>Status</Label>
                            <Select value={formData.status || 'active'} onValueChange={v => setFormData({ ...formData, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['active', 'inactive', 'banned'].map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )
        }
    }

    if (loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] text-rose-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <span className="text-muted-foreground font-serif">Loading Admin Dashboard...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl min-h-[calc(100vh-100px)] flex flex-col animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 font-serif">
                        <ShieldCheck className="w-8 h-8 text-rose-gold" />
                        Admin Command Center
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage platform data, users, and exclusives.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={fetchAllData}>Refresh Data</Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start mb-6 overflow-x-auto bg-slate-100 p-1">
                    <TabsTrigger value="vendors">Vendors</TabsTrigger>
                    <TabsTrigger value="venues">Venues</TabsTrigger>
                    <TabsTrigger value="weddings">Real Weddings</TabsTrigger>
                    <TabsTrigger value="tips">Planning Tips</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="metrics">Platform Metrics</TabsTrigger>
                    <TabsTrigger value="disputes">Dispute Resolution</TabsTrigger>
                </TabsList>

                {/* --- METRICS TAB --- */}
                <TabsContent value="metrics" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: "Total Revenue", value: "$428.5k", icon: DollarSign, trend: "+12.4%", color: "text-green-600" },
                            { label: "Monthly Growth", value: "24.8%", icon: TrendingUp, trend: "+2.1%", color: "text-blue-600" },
                            { label: "Active Subscriptions", value: "1,240", icon: UserCheck, trend: "+85", color: "text-rose-gold" },
                            { label: "Platform Trust Score", value: "98.2%", icon: ShieldCheck, trend: "+0.2%", color: "text-emerald-600" },
                        ].map((stat) => (
                            <Card key={stat.label} className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <Badge variant="outline" className="text-xs font-bold text-green-600">
                                        {stat.trend}
                                    </Badge>
                                </div>
                                <h4 className="text-sm font-medium text-slate-500">{stat.label}</h4>
                                <p className="text-2xl font-bold text-brand-navy mt-1">{stat.value}</p>
                            </Card>
                        ))}
                    </div>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-serif font-bold">Transaction History</h3>
                            <Button variant="outline" size="sm">Export CSV</Button>
                        </div>
                        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed text-slate-400 font-serif italic">
                            Platform Revenue Visualization (Coming Soon)
                        </div>
                    </Card>
                </TabsContent>

                {/* --- DISPUTES TAB --- */}
                <TabsContent value="disputes" className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-serif font-bold">Pending Disputes</h3>
                        <Badge variant="secondary" className="bg-rose-100 text-rose-600">4 Active Cases</Badge>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Case ID</TableHead>
                                    <TableHead>Reporter</TableHead>
                                    <TableHead>Respondent</TableHead>
                                    <TableHead>Issue</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { id: "DIS-9421", reporter: "Sarah M.", respondent: "Beachside Bliss", issue: "Deposit Refund", status: "Open" },
                                    { id: "DIS-9382", reporter: "Elegant Blooms", respondent: "The Grand Villa", issue: "Access Dispute", status: "In Progress" },
                                    { id: "DIS-9210", reporter: "Mike & Jane", respondent: "Snap Happy Pros", issue: "Cancellation", status: "Under Review" },
                                ].map((d) => (
                                    <TableRow key={d.id}>
                                        <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                        <TableCell className="font-medium">{d.reporter}</TableCell>
                                        <TableCell>{d.respondent}</TableCell>
                                        <TableCell>{d.issue}</TableCell>
                                        <TableCell><Badge variant="secondary" className="bg-amber-100 text-amber-700">{d.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="text-rose-gold font-bold">Review Case</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* --- DIALOG --- */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit' : 'Add New'} {editorType.charAt(0).toUpperCase() + editorType.slice(1)}</DialogTitle>
                            <DialogDescription>Make changes to the database record here. Click save when done.</DialogDescription>
                        </DialogHeader>
                        {renderEditorContent()}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="bg-rose-gold hover:bg-rose-600" onClick={handleSave}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* --- VENDORS TAB --- */}
                <TabsContent value="vendors">
                    <div className="flex justify-end mb-4">
                        <Button className="gap-2 bg-rose-gold hover:bg-rose-600" onClick={() => handleOpenEditor('vendor')}><Plus className="w-4 h-4" /> Add Vendor</Button>
                    </div>
                    <Card><div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Vendor Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Google Rating</TableHead>
                                    <TableHead>Heart Rating</TableHead>
                                    <TableHead>Exclusive</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendors.length === 0 ? <TableRow><TableCell colSpan={8} className="text-center p-4">No Vendors Found</TableCell></TableRow> :
                                    vendors.map((v) => (
                                        <TableRow key={v.id}>
                                            <TableCell className="font-mono text-xs text-muted-foreground">{v.id.slice(0, 8)}...</TableCell>
                                            <TableCell className="font-medium">{v.name}</TableCell>
                                            <TableCell><Badge variant="outline">{v.type}</Badge></TableCell>
                                            <TableCell>{v.location}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    {v.google_rating} <span className="text-xs text-muted-foreground">({v.google_reviews})</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                                                    {v.heart_rating}
                                                </div>
                                            </TableCell>
                                            <TableCell>{v.exclusive ? <Badge className="bg-rose-100 text-rose-600">Yes</Badge> : "No"}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditor('vendor', v)}><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(v.id, 'vendor')}><Trash2 className="w-4 h-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div></Card>
                </TabsContent>

                {/* --- VENUES TAB --- */}
                <TabsContent value="venues">
                    <div className="flex justify-end mb-4">
                        <Button className="gap-2 bg-rose-gold hover:bg-rose-600" onClick={() => handleOpenEditor('venue')}><Plus className="w-4 h-4" /> Add Venue</Button>
                    </div>
                    <Card><div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Venue Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Guests</TableHead>
                                    <TableHead>Google Rating</TableHead>
                                    <TableHead>Heart Rating</TableHead>
                                    <TableHead>Exclusive</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {venues.length === 0 ? <TableRow><TableCell colSpan={8} className="text-center p-4">No Venues Found</TableCell></TableRow> :
                                    venues.map((v) => (
                                        <TableRow key={v.id}>
                                            <TableCell className="font-medium">{v.name}</TableCell>
                                            <TableCell><Badge variant="outline">{v.type}</Badge></TableCell>
                                            <TableCell>{v.location}</TableCell>
                                            <TableCell>{v.capacity}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    {v.google_rating} <span className="text-xs text-muted-foreground">({v.google_reviews})</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                                                    {v.heart_rating}
                                                </div>
                                            </TableCell>
                                            <TableCell>{v.exclusive ? <Badge className="bg-rose-100 text-rose-600">Yes</Badge> : "No"}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditor('venue', v)}><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(v.id, 'venue')}><Trash2 className="w-4 h-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div></Card>
                </TabsContent>

                {/* --- WEDDINGS TAB --- */}
                <TabsContent value="weddings">
                    <div className="flex justify-end mb-4">
                        <Button className="gap-2 bg-rose-gold hover:bg-rose-600" onClick={() => handleOpenEditor('wedding')}><Plus className="w-4 h-4" /> Add Wedding</Button>
                    </div>
                    <Card><div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Couple Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Style</TableHead>
                                    <TableHead>Season</TableHead>
                                    <TableHead>Featuring</TableHead>
                                    <TableHead>Exclusive</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {weddings.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center p-4">No Weddings Found</TableCell></TableRow> :
                                    weddings.map((w) => (
                                        <TableRow key={w.id}>
                                            <TableCell className="font-medium">{w.couple_names}</TableCell>
                                            <TableCell>{w.location}</TableCell>
                                            <TableCell><Badge variant="secondary">{w.style}</Badge></TableCell>
                                            <TableCell>{w.season}</TableCell>
                                            <TableCell>{w.featuring}</TableCell>
                                            <TableCell>{w.exclusive ? <Badge className="bg-rose-100 text-rose-600">Yes</Badge> : "No"}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditor('wedding', w)}><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(w.id, 'wedding')}><Trash2 className="w-4 h-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div></Card>
                </TabsContent>

                {/* --- TIPS TAB --- */}
                <TabsContent value="tips">
                    <div className="flex justify-end mb-4">
                        <Button className="gap-2 bg-rose-gold hover:bg-rose-600" onClick={() => handleOpenEditor('tip')}><Plus className="w-4 h-4" /> Add Tip</Button>
                    </div>
                    <Card><div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Preview</TableHead>
                                    <TableHead>Tags</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Exclusive</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tips.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center p-4">No Tips Found</TableCell></TableRow> :
                                    tips.map((t) => (
                                        <TableRow key={t.id}>
                                            <TableCell className="font-medium">{t.title}</TableCell>
                                            <TableCell className="max-w-xs truncate text-muted-foreground">{t.content}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {t.tags && t.tags.length > 0 ? t.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>) : '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell>{t.publish ? <span className="text-green-600 font-bold text-xs uppercase">Published</span> : <span className="text-slate-400 text-xs uppercase">Draft</span>}</TableCell>
                                            <TableCell>{t.exclusive ? <Badge className="bg-rose-100 text-rose-600">Yes</Badge> : "No"}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditor('tip', t)}><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(t.id, 'tip')}><Trash2 className="w-4 h-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div></Card>
                </TabsContent>

                {/* --- USERS TAB --- */}
                <TabsContent value="users">
                    <div className="flex justify-end mb-4">
                        <Button className="gap-2 bg-rose-gold hover:bg-rose-600" onClick={() => handleOpenEditor('user')}><Plus className="w-4 h-4" /> Add User</Button>
                    </div>
                    <Card><div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center p-4">No Users</TableCell></TableRow> :
                                    users.map((u) => (
                                        <TableRow key={u.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Avatar className="w-6 h-6"><AvatarFallback>{u.full_name ? u.full_name[0] : 'U'}</AvatarFallback></Avatar>
                                                {u.full_name}
                                            </TableCell>
                                            <TableCell><Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role}</Badge></TableCell>
                                            <TableCell>{u.email}</TableCell>
                                            <TableCell><span className="text-green-600 text-xs font-bold uppercase">Active</span></TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditor('user', u)}><Edit className="w-4 h-4" /></Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-blue-600 hover:text-blue-700"
                                                    onClick={() => handleSetPassword(u.id, u.email)}
                                                    title="Set new password"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(u.id, 'user')}><Trash2 className="w-4 h-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div></Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;

