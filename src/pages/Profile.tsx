
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useAuth, User } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

// Schema for profile editing 
const profileSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    timeZone: z.string().min(1, "Time zone is required"),
    aboutMe: z.string().max(50, "About me cannot exceed 50 characters").optional(),
    location: z.string().optional(),
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    phone: z.string().optional(),
    facebookUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    instagramUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    avatarUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
    const { user, updateProfile, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, navigate]);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.fullName || "",
            email: user?.email || "",
            password: user?.password || "",
            confirmPassword: user?.password || "",
            timeZone: user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            aboutMe: user?.aboutMe || "",
            location: user?.location || "",
            website: user?.website || "",
            phone: user?.phone || "",
            facebookUrl: user?.social?.facebook || "",
            instagramUrl: user?.social?.instagram || "",
            avatarUrl: user?.avatarUrl || "",
        },
    });

    // Update form default values when user context changes (e.g. on load)
    useEffect(() => {
        if (user) {
            form.reset({
                fullName: user.fullName,
                email: user.email,
                password: user.password || "",
                confirmPassword: user.password || "",
                timeZone: user.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                aboutMe: user.aboutMe || "",
                location: user.location || "",
                website: user.website || "",
                phone: user.phone || "",
                facebookUrl: user.social?.facebook || "",
                instagramUrl: user.social?.instagram || "",
                avatarUrl: user.avatarUrl || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
            });
        }
    }, [user, form]);

    function onSubmit(data: ProfileFormValues) {
        updateProfile({
            fullName: data.fullName,
            email: data.email,
            password: data.password,
            location: data.location,
            timeZone: data.timeZone,
            aboutMe: data.aboutMe,
            website: data.website,
            phone: data.phone,
            avatarUrl: data.avatarUrl,
            social: {
                facebook: data.facebookUrl,
                instagram: data.instagramUrl,
            },
        });
        setIsEditing(false);
    }

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8 mt-20 max-w-4xl">
            <Card className="border-rose-100 shadow-md">
                <CardHeader className="border-b border-rose-50 bg-rose-50/30">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <Avatar className="w-24 h-24 border-4 border-white shadow-sm">
                                <AvatarImage src={user.avatarUrl} alt={user.fullName} className="object-cover" />
                                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <div className="absolute bottom-0 right-0 bg-rose-gold p-1.5 rounded-full text-white cursor-pointer hover:bg-rose-600 transition-colors">
                                    <Camera size={14} />
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <CardTitle className="text-3xl font-serif text-foreground">{user.fullName}</CardTitle>
                            <CardDescription className="text-lg">{user.location || "No location set"}</CardDescription>
                            {user.aboutMe && <p className="mt-2 text-muted-foreground italic">"{user.aboutMe}"</p>}
                        </div>
                        <div className="ml-auto">
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)} variant="outline">Edit Profile</Button>
                            ) : (
                                <Button onClick={() => setIsEditing(false)} variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">Cancel</Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {isEditing ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Personal Info */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-rose-gold border-b border-rose-100 pb-2">Personal Information</h3>
                                        <FormField control={form.control} name="fullName" render={({ field }) => (
                                            <FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem><FormLabel>Email *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="phone" render={({ field }) => (
                                            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="location" render={({ field }) => (
                                            <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="City, State" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="timeZone" render={({ field }) => (
                                            <FormItem><FormLabel>Time Zone *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>

                                    {/* Online Presence & Details */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-rose-gold border-b border-rose-100 pb-2">Profile Details</h3>
                                        <FormField control={form.control} name="aboutMe" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>About Me (Max 50 chars)</FormLabel>
                                                <FormControl><Textarea className="resize-none" maxLength={50} {...field} /></FormControl>
                                                <FormDescription className="text-xs text-right">{field.value?.length || 0}/50 characters</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="website" render={({ field }) => (
                                            <FormItem><FormLabel>Website</FormLabel><FormControl><Input placeholder="https://" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="avatarUrl" render={({ field }) => (
                                            <FormItem><FormLabel>Profile Photo URL</FormLabel><FormControl><Input placeholder="https://" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                </div>

                                {/* Social Media */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg text-rose-gold border-b border-rose-100 pb-2">Social Media</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="facebookUrl" render={({ field }) => (
                                            <FormItem><FormLabel>Facebook URL</FormLabel><FormControl><Input placeholder="https://facebook.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="instagramUrl" render={({ field }) => (
                                            <FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input placeholder="https://instagram.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                </div>

                                {/* Security */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg text-rose-gold border-b border-rose-100 pb-2">Security</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="password" render={({ field }) => (
                                            <FormItem><FormLabel>New Password *</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                            <FormItem><FormLabel>Confirm New Password *</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-rose-100">
                                    <Button type="submit" className="bg-rose-gold hover:bg-rose-600 w-full md:w-auto">Save Changes</Button>
                                </div>
                            </form>
                        </Form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Read-only view */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-rose-gold uppercase tracking-wider text-sm">Contact Info</h3>
                                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="font-medium">{user.email}</span>
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span className="font-medium">{user.phone || "-"}</span>
                                    <span className="text-muted-foreground">Location:</span>
                                    <span className="font-medium">{user.location || "-"}</span>
                                    <span className="text-muted-foreground">Time Zone:</span>
                                    <span className="font-medium">{user.timeZone || "-"}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-rose-gold uppercase tracking-wider text-sm">Online Presence</h3>
                                <div className="flex flex-col gap-2 text-sm">
                                    {user.website && <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">Website</a>}
                                    {user.social?.facebook && <a href={user.social.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">Facebook</a>}
                                    {user.social?.instagram && <a href={user.social.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">Instagram</a>}
                                    {!user.website && !user.social?.facebook && !user.social?.instagram && <span className="text-muted-foreground">No links added.</span>}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
