
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, Hash, Send, Trophy, Heart, Reply, ArrowLeft, Clock } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { AIPlanningBuddy } from "@/components/AIPlanningBuddy";
import { ProjectRoom } from "@/components/ProjectRoom";
import { CatchUpSummary } from "@/components/CatchUpSummary";
import { Progress } from "@/components/ui/progress";

// Types for Forum Data Structure
type ReplyType = {
    id: number;
    user: string;
    text: string;
    time: string;
    avatar: string;
};

type ThreadType = {
    id: number;
    title: string;
    note: string;
    user: string;
    daysAgo: number;
    likes: number;
    replies: ReplyType[];
    avatar: string;
    category: string;
};

// Dummy Data
const INITIAL_THREADS: ThreadType[] = [
    {
        id: 1,
        title: "Vizcaya Booking Window?",
        note: "Has anyone booked Vizcaya for 2026 yet? I heard they are opening dates soon but I can't get a hold of them.",
        user: "Sarah J.",
        daysAgo: 0, // Today
        likes: 12,
        avatar: "S",
        category: "Venue Reviews",
        replies: [
            { id: 101, user: "Mike D.", text: "Just toured it yesterday! They are filling up fast.", time: "10:05 AM", avatar: "M" }
        ]
    },
    {
        id: 2,
        title: "Floral Budget in Miami",
        note: "I'm struggling with floral budgets. Everything seems to be over $5k for simple greenery. Any recommendations?",
        user: "Jessica W.",
        daysAgo: 8,
        likes: 24,
        avatar: "J",
        category: "Budget Hacks",
        replies: [
            { id: 201, user: "Elena R.", text: "Try 'Tropical Stems'. They did my arch for $3k!", time: "2 days ago", avatar: "E" }
        ]
    }
];

export default function Community() {
    const { level, xp, levelTitle, nextLevelXP, addXP } = useGamification();
    const [activeView, setActiveView] = useState<'feed' | 'projects'>('feed');
    const [threads, setThreads] = useState<ThreadType[]>(() => {
        const saved = localStorage.getItem("wedding_community_threads");
        return saved ? JSON.parse(saved) : INITIAL_THREADS;
    });

    // Persist threads whenever they change
    useEffect(() => {
        localStorage.setItem("wedding_community_threads", JSON.stringify(threads));
    }, [threads]);

    // Thread View State
    const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);

    // New Post State
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostNote, setNewPostNote] = useState("");

    // Reply State
    const [replyText, setReplyText] = useState("");

    const selectedThread = threads.find(t => t.id === selectedThreadId);

    // AI Buddy Integration: Flatten current context for the AI
    // If in feed: empty. If in thread: messages + title/note.
    const aiMessages = selectedThread
        ? [
            { id: 0, user: selectedThread.user, text: `${selectedThread.title} ${selectedThread.note}` },
            ...selectedThread.replies
        ]
        : [];

    const handleCreateThread = () => {
        if (!newPostTitle.trim() || !newPostNote.trim()) return;

        const newThread: ThreadType = {
            id: Date.now(),
            title: newPostTitle,
            note: newPostNote,
            user: "Me", // Ideally this comes from Auth Context
            daysAgo: 0,
            likes: 0,
            avatar: "ME",
            category: "General Chat",
            replies: []
        };

        setThreads([newThread, ...threads]);
        setNewPostTitle("");
        setNewPostNote("");
        addXP(20, "Created New Thread");
    };

    const handleReply = () => {
        if (!replyText.trim() || !selectedThread) return;

        const newReply: ReplyType = {
            id: Date.now(),
            user: "Me",
            text: replyText,
            time: "Just now",
            avatar: "ME"
        };

        const updatedThreads = threads.map(t => {
            if (t.id === selectedThread.id) {
                return { ...t, replies: [...t.replies, newReply] };
            }
            return t;
        });

        setThreads(updatedThreads);
        setReplyText("");
        addXP(10, "Replied to Thread");
    };

    const handleLike = (threadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedThreads = threads.map(t => {
            if (t.id === threadId) return { ...t, likes: t.likes + 1 };
            return t;
        });
        setThreads(updatedThreads);
        addXP(5, "Liked a Post");
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl min-h-[calc(100vh-100px)]">
            <div className="grid grid-cols-12 gap-6">

                {/* LEFT SIDEBAR */}
                <div className="col-span-12 md:col-span-3 flex flex-col gap-6">
                    {/* ... Component contents ... */}
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
                                        {threads.map(thread => (
                                            <Card
                                                key={thread.id}
                                                className="cursor-pointer hover:border-purple-300 transition-colors"
                                                onClick={() => setSelectedThreadId(thread.id)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex gap-2 text-xs text-muted-foreground items-center">
                                                            <Avatar className="w-6 h-6">
                                                                <AvatarFallback className="text-[10px]">{thread.avatar}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-semibold text-slate-700">{thread.user}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {thread.daysAgo === 0 ? 'Today' : `${thread.daysAgo} days ago`}
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
                                                        <Button variant="ghost" size="sm" className="h-8 gap-2 hover:text-blue-500 hover:bg-blue-50" onClick={(e) => { e.stopPropagation(); setSelectedThreadId(thread.id); }}>
                                                            <MessageSquare className="w-4 h-4" />
                                                            {thread.replies.length} Replies
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
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
                                            <Avatar className="w-6 h-6"><AvatarFallback>{selectedThread?.avatar}</AvatarFallback></Avatar>
                                            <span>{selectedThread?.user}</span>
                                            <span>•</span>
                                            <span>{selectedThread?.daysAgo === 0 ? 'Today' : `${selectedThread?.daysAgo} days ago`}</span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex-1 overflow-y-auto p-0 bg-slate-50/50">
                                        <div className="p-6 bg-white border-b mb-4">
                                            <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedThread?.note}</p>
                                        </div>

                                        {/* AI Buddy Overlay In Thread */}
                                        <div className="relative">
                                            <AIPlanningBuddy messages={aiMessages} />
                                        </div>

                                        <div className="px-4 pb-4 space-y-4">
                                            <h4 className="text-sm font-bold text-muted-foreground uppercase px-2">Replies</h4>
                                            {selectedThread?.replies.map((reply) => (
                                                <div key={reply.id} className="flex gap-3">
                                                    <Avatar className="h-8 w-8 mt-1">
                                                        <AvatarFallback>{reply.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 bg-white p-3 rounded-lg border shadow-sm">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold text-sm">{reply.user}</span>
                                                            <span className="text-xs text-muted-foreground">{reply.time}</span>
                                                        </div>
                                                        <p className="text-sm text-slate-700">{reply.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {selectedThread?.replies.length === 0 && (
                                                <div className="text-center py-8 text-muted-foreground italic">
                                                    No replies yet. Be the first to help!
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>

                                    <div className="p-4 bg-white border-t flex flex-col gap-2">
                                        <Textarea
                                            placeholder={`Reply to ${selectedThread?.user}... (Suggest 'budget' or 'florist' to trigger AI buddy)`}
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            className="min-h-[80px]"
                                        />
                                        <div className="flex justify-end">
                                            <Button onClick={handleReply} className="gap-2 bg-purple-600 hover:bg-purple-700">
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
