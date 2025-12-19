
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Users, AlertCircle, Search,
    Trash2, Edit, ShieldCheck, Star, Plus
} from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Type Definitions
type UserRole = 'couple' | 'business' | 'admin';
type ContentType = 'Venue' | 'Vendor';

interface AdminUser {
    id: number;
    name: string;
    role: UserRole;
    email: string;
    status: string;
}

interface AdminContent {
    id: number;
    name: string;
    type: ContentType;
    location: string;
    rating: number;
    exclusive: boolean;
}

// Initial Mock Data
const INITIAL_USERS: AdminUser[] = [
    { id: 1, name: "Jason M.", role: "couple", email: "jason@example.com", status: "Active" },
    { id: 2, name: "Sarah J.", role: "business", email: "sarah@florals.com", status: "Verified" },
    { id: 3, name: "Mike D.", role: "couple", email: "mike@test.com", status: "Active" },
    { id: 4, name: "Vizcaya Admin", role: "business", email: "admin@vizcaya.org", status: "Verified" },
];

const INITIAL_VENUES: AdminContent[] = [
    { id: 1, name: "Vizcaya Museum", type: "Venue", location: "Miami", rating: 4.9, exclusive: true },
    { id: 2, name: "The Ancient Spanish Monastery", type: "Venue", location: "North Miami", rating: 4.7, exclusive: false },
    { id: 3, name: "Tropical Stems", type: "Vendor", location: "Miami", rating: 4.8, exclusive: false },
];

export default function AdminDashboard() {
    const [searchTerm, setSearchTerm] = useState("");

    // State for Lists
    const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
    const [content, setContent] = useState<AdminContent[]>(INITIAL_VENUES);

    // State for Forms
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isAddContentOpen, setIsAddContentOpen] = useState(false);

    // New User State
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "couple" as UserRole });
    // New Content State
    const [newContent, setNewContent] = useState({ name: "", type: "Venue" as ContentType, location: "" });

    const [activeTab, setActiveTab] = useState("users");

    // USER ACTIONS
    const handleDeleteUser = (id: number) => {
        setUsers(users.filter(u => u.id !== id));
        toast.success(`User #${id} deleted successfully.`);
    };

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email) return toast.error("Please fill in all fields");
        const id = Math.max(...users.map(u => u.id)) + 1;
        setUsers([...users, { ...newUser, id, status: "Active" }]);
        setIsAddUserOpen(false);
        setNewUser({ name: "", email: "", role: "couple" });
        toast.success("User created successfully");
    };

    // CONTENT ACTIONS
    const handleToggleExclusive = (id: number) => {
        setContent(content.map(item =>
            item.id === id ? { ...item, exclusive: !item.exclusive } : item
        ));
        toast.success(`Exclusive status updated.`);
    };

    const handleDeleteContent = (id: number) => {
        setContent(content.filter(c => c.id !== id));
        toast.success(`Item #${id} deleted successfully.`);
    };

    const handleAddContent = () => {
        if (!newContent.name || !newContent.location) return toast.error("Please fill in all fields");
        const id = Math.max(...content.map(c => c.id)) + 1;
        setContent([...content, { ...newContent, id, rating: 5.0, exclusive: false }]);
        setIsAddContentOpen(false);
        setNewContent({ name: "", type: "Venue", location: "" });
        toast.success("Content added successfully");
    };

    // EDIT STATE
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);

    const [editingContent, setEditingContent] = useState<AdminContent | null>(null);
    const [isEditContentOpen, setIsEditContentOpen] = useState(false);

    // EDIT HANDLERS (USER)
    const openEditUser = (user: AdminUser) => {
        setEditingUser(user);
        setIsEditUserOpen(true);
    };

    const handleUpdateUser = () => {
        if (!editingUser) return;
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        setIsEditUserOpen(false);
        setEditingUser(null);
        toast.success("User updated successfully");
    };

    // EDIT HANDLERS (CONTENT)
    const openEditContent = (item: AdminContent) => {
        setEditingContent(item);
        setIsEditContentOpen(true);
    };

    const handleUpdateContent = () => {
        if (!editingContent) return;
        setContent(content.map(c => c.id === editingContent.id ? editingContent : c));
        setIsEditContentOpen(false);
        setEditingContent(null);
        toast.success("Content updated successfully");
    };

    // DASHBOARD ACTIONS
    const handleStatClick = (tab: string, search: string = "") => {
        setActiveTab(tab);
        setSearchTerm(search);
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl min-h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-purple-600" />
                        Admin Command Center
                    </h1>
                    <p className="text-muted-foreground">Manage users, content, and exclusive drops.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline">Export Reports</Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleStatClick("users", "")}
                >
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{users.length}</div></CardContent>
                </Card>
                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleStatClick("users", "business")}
                >
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active Vendors</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{users.filter(u => u.role === 'business').length}</div></CardContent>
                </Card>
                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleStatClick("content")}
                >
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Content Items</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{content.length}</div></CardContent>
                </Card>
                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleStatClick("users", "Pending")} // Mocking a status filter by search
                >
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Verifications</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-orange-500 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> 12</div></CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="w-full max-w-md mb-4 bg-slate-100">
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="content">Content & Exclusives</TabsTrigger>
                    <TabsTrigger value="settings">System Settings</TabsTrigger>
                </TabsList>

                {/* USERS TAB */}
                <TabsContent value="users" className="flex-1 bg-white rounded-lg border shadow-sm p-0 overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                                    <Plus className="w-4 h-4" /> Add User
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New User</DialogTitle>
                                    <DialogDescription>Add a new user to the platform manually.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <Select value={newUser.role} onValueChange={(v: UserRole) => setNewUser({ ...newUser, role: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="couple">Couple</SelectItem>
                                                <SelectItem value="business">Business</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddUser}>Create User</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* EDIT USER DIALOG */}
                        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit User</DialogTitle>
                                </DialogHeader>
                                {editingUser && (
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Role</Label>
                                            <Select value={editingUser.role} onValueChange={(v: UserRole) => setEditingUser({ ...editingUser, role: v })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="couple">Couple</SelectItem>
                                                    <SelectItem value="business">Business</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Status</Label>
                                            <Select value={editingUser.status} onValueChange={(v) => setEditingUser({ ...editingUser, status: v })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Verified">Verified</SelectItem>
                                                    <SelectItem value="Suspended">Suspended</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button onClick={handleUpdateUser}>Save Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.filter(u =>
                                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                u.role.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8"><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar>
                                            <div>
                                                <div className="text-sm font-bold">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'business' ? 'secondary' : 'outline'} className="capitalize">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${user.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {user.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-slate-900" onClick={() => openEditUser(user)}><Edit className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50" onClick={() => handleDeleteUser(user.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                {/* CONTENT TAB */}
                <TabsContent value="content" className="flex-1 bg-white rounded-lg border shadow-sm p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Venues & Vendors Database</h3>
                        <Dialog open={isAddContentOpen} onOpenChange={setIsAddContentOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                                    <Plus className="w-4 h-4" /> Add Content
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Content</DialogTitle>
                                    <DialogDescription>Add a new Venue or Vendor to the directory.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input value={newContent.name} onChange={(e) => setNewContent({ ...newContent, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select value={newContent.type} onValueChange={(v: ContentType) => setNewContent({ ...newContent, type: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Venue">Venue</SelectItem>
                                                <SelectItem value="Vendor">Vendor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input value={newContent.location} onChange={(e) => setNewContent({ ...newContent, location: e.target.value })} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddContent}>Add Item</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* EDIT CONTENT DIALOG */}
                        <Dialog open={isEditContentOpen} onOpenChange={setIsEditContentOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Content</DialogTitle>
                                </DialogHeader>
                                {editingContent && (
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Name</Label>
                                            <Input value={editingContent.name} onChange={(e) => setEditingContent({ ...editingContent, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Select value={editingContent.type} onValueChange={(v: ContentType) => setEditingContent({ ...editingContent, type: v })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Venue">Venue</SelectItem>
                                                    <SelectItem value="Vendor">Vendor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input value={editingContent.location} onChange={(e) => setEditingContent({ ...editingContent, location: e.target.value })} />
                                        </div>
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button onClick={handleUpdateContent}>Save Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Content Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Exclusive?</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {content.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-bold">{item.name}</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>⭐ {item.rating}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={item.exclusive ? "text-yellow-600 bg-yellow-50" : "text-muted-foreground"}
                                            onClick={() => handleToggleExclusive(item.id)}
                                        >
                                            <Star className={`w-4 h-4 mr-1 ${item.exclusive ? "fill-yellow-600" : ""}`} />
                                            {item.exclusive ? "Exclusive" : "Standard"}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-slate-900" onClick={() => openEditContent(item)}><Edit className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50" onClick={() => handleDeleteContent(item.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </div>
    );
}
