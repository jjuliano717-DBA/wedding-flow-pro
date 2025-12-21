
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Users, Hash, Send, Trophy, Heart, Reply, ArrowLeft, Clock, Loader2 } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";

import { ProjectRoom } from "@/components/ProjectRoom";
import { CatchUpSummary } from "@/components/CatchUpSummary";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// Types matching Supabase Schema
type ReplyType = {
    id: number;
    thread_id: number;
    user_id: string;
    text: string;
    created_at: string;
    // Joined data
    user_name?: string; // We'll fetch this
};

type ThreadType = {
    id: number;
    title: string;
    note: string;
    user_id: string;
    category: string;
    likes: number;
    created_at: string;
    user_name?: string; // We'll fetch this
    replies?: ReplyType[]; // Joined manually or via query
};

export default function Community() {
    const { user } = useAuth();
    const { level, xp, levelTitle, nextLevelXP, addXP } = useGamification();
    const [activeView, setActiveView] = useState<'feed' | 'projects'>('feed');

    // Data State
    const [threads, setThreads] = useState<ThreadType[]>([]);
    const [loading, setLoading] = useState(true);

    // Thread View State
    const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
    const [replies, setReplies] = useState<ReplyType[]>([]);
    const [loadingReplies, setLoadingReplies] = useState(false);

    // New Post State
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostNote, setNewPostNote] = useState("");

    // Reply State
    const [replyText, setReplyText] = useState("");

    const selectedThread = threads.find(t => t.id === selectedThreadId);

    // Initial Fetch
    useEffect(() => {
        fetchThreads();
    }, []);

    // Fetch Replies when thread is selected
    useEffect(() => {
        if (selectedThreadId) {
            fetchReplies(selectedThreadId);
        } else {
            setReplies([]);
        }
    }, [selectedThreadId]);

    const fetchThreads = async () => {
        setLoading(true);
        try {
            // Fetch threads with user data (if we had a relation set up strictly, we could join. 
            // For now, simpler to just fetch threads and basic info. 
            // We'll rely on our 'users' table lookup if needed or just store display names if we want simple.)
            // Actually, let's join users table.

            const { data, error } = await supabase
                .from('threads')
                .select(`
                    *,
                    users ( full_name )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formatted: ThreadType[] = (data || []).map((t: any) => ({
                id: t.id,
                title: t.title,
                note: t.note,
                user_id: t.user_id,
                category: t.category,
                likes: t.likes,
                created_at: t.created_at,
                user_name: t.users?.full_name || 'Anonymous'
            }));
            setThreads(formatted);
        } catch (error) {
            console.error("Error fetching threads:", error);
            toast.error("Could not load community feed.");
        } finally {
            setLoading(false);
        }
    };

    const fetchReplies = async (threadId: number) => {
        setLoadingReplies(true);
        try {
            const { data, error } = await supabase
                .from('replies')
                .select(`
                    *,
                    users ( full_name )
                `)
                .eq('thread_id', threadId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const formatted: ReplyType[] = (data || []).map((r: any) => ({
                id: r.id,
                thread_id: r.thread_id,
                user_id: r.user_id,
                text: r.text,
                created_at: r.created_at,
                user_name: r.users?.full_name || 'Anonymous'
            }));
            setReplies(formatted);
        } catch (error) {
            console.error("Error fetching replies", error);
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleCreateThread = async () => {
        if (!newPostTitle.trim() || !newPostNote.trim() || !user) {
            if (!user) toast.error("Please sign in to post.");
            else toast.error("Title and message are required.");
            return;
        }

        try {
            const newThread = {
                title: newPostTitle,
                note: newPostNote,
                user_id: user.id,
                category: "General Chat"
            };

            const { data, error } = await supabase
                .from('threads')
                .insert(newThread)
                .select(`*, users ( full_name )`)
                .single();

            if (error) throw error;

            const formatted: ThreadType = {
                id: data.id,
                title: data.title,
                note: data.note,
                user_id: data.user_id,
                category: data.category,
                likes: data.likes,
                created_at: data.created_at,
                user_name: data.users?.full_name || user.fullName
            };

            setThreads([formatted, ...threads]);
            setNewPostTitle("");
            setNewPostNote("");
            addXP(20, "Created New Thread");
            toast.success("Discussion started!");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to post thread.");
        }
    };

    const handleReply = async () => {
        if (!replyText.trim() || !selectedThread || !user) return;

        try {
            const newReply = {
                thread_id: selectedThread.id,
                user_id: user.id,
                text: replyText
            };

            const { data, error } = await supabase
                .from('replies')
                .insert(newReply)
                .select(`*, users ( full_name )`)
                .single();

            if (error) throw error;

            const formatted: ReplyType = {
                id: data.id,
                thread_id: data.thread_id,
                user_id: data.user_id,
                text: data.text,
                created_at: data.created_at,
                user_name: data.users?.full_name || user.fullName
            };

            setReplies([...replies, formatted]);
            setReplyText("");
            addXP(10, "Replied to Thread");
            toast.success("Reply posted!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to post reply.");
        }
    };



    const handleLike = (threadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        // Optimistic update - in real app would hit DB
        // For simplicity, we just update local state since we lack a 'likes' table join
        const updatedThreads = threads.map(t => {
            if (t.id === threadId) return { ...t, likes: t.likes + 1 };
            return t;
        });
        setThreads(updatedThreads);
        addXP(5, "Liked a Post");
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        return `${diffDays} days ago`;
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl min-h-[calc(100vh-100px)]">
            <div className="grid grid-cols-12 gap-6">

                {/* LEFT SIDEBAR */}
                <div className="col-span-12 md:col-span-3 flex flex-col gap-6">
                    <Card className="border-t-4 border-t-purple-500">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">My Status</CardTitle>
                                <Trophy className="w-5 h-5 text-yellow-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-2 border-2 border-white shadow-sm">
                                    <span className="text-2xl font-bold">{level}</span>
                                </div>
                                <h3 className="font-bold text-lg">{levelTitle}</h3>
                                <p className="text-xs text-muted-foreground">Road to the Aisle</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>XP: {xp}</span>
                                    <span>Next: {nextLevelXP}</span>
                                </div>
                                <Progress value={(xp / nextLevelXP) * 100} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex-1">
                        <CardContent className="p-4 space-y-2">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2 px-2">Menu</h4>
                            <Button
                                variant={activeView === 'feed' ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => setActiveView('feed')}
                            >
                                <Hash className="w-4 h-4 mr-2" /> Community Forum
                            </Button>
                            <Button
                                variant={activeView === 'projects' ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => setActiveView('projects')}
                            >
                                <Users className="w-4 h-4 mr-2" /> Project Rooms
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="col-span-12 md:col-span-6 flex flex-col">
                    {activeView === 'feed' ? (
                        <>
                            {selectedThreadId === null ? (
                                /* FEED LIST VIEW */
                                <div className="flex flex-col gap-4">
                                    {/* Create New Post Card */}
                                    <Card className="shrink-0 bg-slate-50 border-dashed">
                                        <CardContent className="p-4 space-y-3">
                                            <h3 className="font-semibold text-sm text-muted-foreground">Start a new discussion</h3>
                                            <Input
                                                placeholder="Thread Title (e.g. Help with Venue...)"
                                                value={newPostTitle}
                                                onChange={e => setNewPostTitle(e.target.value)}
                                                className="bg-white"
                                            />
                                            <Textarea
                                                placeholder="What's on your mind? Add details..."
                                                value={newPostNote}
                                                onChange={e => setNewPostNote(e.target.value)}
                                                className="bg-white min-h-[80px]"
                                            />
                                            <div className="flex justify-end">
                                                <Button size="sm" onClick={handleCreateThread} disabled={!newPostTitle || !newPostNote}>
                                                    <Send className="w-4 h-4 mr-2" /> Post Thread
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Thread List */}
                                    <div className="space-y-4">
                                        {loading ? (
                                            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-purple-600" /></div>
                                        ) : threads.length === 0 ? (
                                            <div className="text-center py-10 text-muted-foreground">No discussions yet. Start one!</div>
                                        ) : (
                                            threads.map(thread => (
                                                <Card
                                                    key={thread.id}
                                                    className="cursor-pointer hover:border-purple-300 transition-colors"
                                                    onClick={() => setSelectedThreadId(thread.id)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex gap-2 text-xs text-muted-foreground items-center">
                                                                <Avatar className="w-6 h-6">
                                                                    <AvatarFallback className="text-[10px] bg-purple-100 text-purple-700">
                                                                        {thread.user_name?.charAt(0).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="font-semibold text-slate-700">{thread.user_name}</span>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {formatTimeAgo(thread.created_at)}
                                                                </span>
                                                            </div>
                                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold">
                                                                {thread.category}
                                                            </span>
                                                        </div>

                                                        <h3 className="font-bold text-lg mb-1 text-slate-900">{thread.title}</h3>
                                                        <p className="text-sm text-slate-600 line-clamp-2">{thread.note}</p>

                                                        <div className="mt-4 flex gap-4 text-muted-foreground">
                                                            <Button variant="ghost" size="sm" className="h-8 gap-2 hover:text-rose-500 hover:bg-rose-50" onClick={(e) => handleLike(thread.id, e)}>
                                                                <Heart className={`w-4 h-4 ${thread.likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                                                                {thread.likes} Love
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="h-8 gap-2 hover:text-blue-500 hover:bg-blue-50">
                                                                <MessageSquare className="w-4 h-4" />
                                                                Reply
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* THREAD DETAIL VIEW */
                                <Card className="h-full flex flex-col shadow-md relative overflow-hidden">
                                    <CardHeader className="border-b bg-white z-10 py-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedThreadId(null)}>
                                                <ArrowLeft className="w-4 h-4" />
                                            </Button>
                                            <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Back to Feed</span>
                                        </div>
                                        <CardTitle className="text-xl">{selectedThread?.title}</CardTitle>
                                        <div className="flex gap-2 text-sm text-muted-foreground items-center mt-1">
                                            <Avatar className="w-6 h-6">
                                                <AvatarFallback>{selectedThread?.user_name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>{selectedThread?.user_name}</span>
                                            <span>•</span>
                                            <span>{selectedThread ? formatTimeAgo(selectedThread.created_at) : ''}</span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex-1 overflow-y-auto p-0 bg-slate-50/50">
                                        <div className="p-6 bg-white border-b mb-4">
                                            <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedThread?.note}</p>
                                        </div>



                                        <div className="px-4 pb-4 space-y-4">
                                            <h4 className="text-sm font-bold text-muted-foreground uppercase px-2">Replies</h4>
                                            {loadingReplies ? (
                                                <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                                            ) : replies.map((reply) => (
                                                <div key={reply.id} className="flex gap-3">
                                                    <Avatar className="h-8 w-8 mt-1">
                                                        <AvatarFallback>{reply.user_name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 bg-white p-3 rounded-lg border shadow-sm">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold text-sm">{reply.user_name}</span>
                                                            <span className="text-xs text-muted-foreground">{formatTimeAgo(reply.created_at)}</span>
                                                        </div>
                                                        <p className="text-sm text-slate-700">{reply.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {!loadingReplies && replies.length === 0 && (
                                                <div className="text-center py-8 text-muted-foreground italic">
                                                    No replies yet. Be the first to help!
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>

                                    <div className="p-4 bg-white border-t flex flex-col gap-2">
                                        <Textarea
                                            placeholder={`Reply to ${selectedThread?.user_name}...`}
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            className="min-h-[80px]"
                                        />
                                        <div className="flex justify-end">
                                            <Button onClick={handleReply} className="gap-2 bg-purple-600 hover:bg-purple-700" disabled={!replyText.trim()}>
                                                <Reply className="w-4 h-4" /> Post Reply
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </>
                    ) : (
                        <ProjectRoom />
                    )}
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="col-span-12 md:col-span-3">
                    <CatchUpSummary />
                </div>
            </div>
        </div>
    );
}
