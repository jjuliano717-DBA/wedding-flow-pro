import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, ArrowRight, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
    chat,
    generateGreeting,
    getQuickActions,
    ChatMessage,
    UserContext
} from '@/lib/geminiClient';

interface AIAssistantChatProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AIAssistantChat({ isOpen, onClose }: AIAssistantChatProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Build user context from auth context
    const userContext: UserContext = {
        fullName: user?.fullName,
        weddingDate: user?.weddingDate ? new Date(user.weddingDate).toISOString().split('T')[0] : undefined,
        guestCount: user?.guestCount,
        budgetTier: user?.budgetTier,
        stressLevel: user?.stressLevel,
        location: user?.location,
        stylePreferences: user?.stylePreferences,
        planningPace: user?.planningPace,
    };

    // Initialize with greeting when opened
    useEffect(() => {
        if (isOpen && !isInitialized) {
            const greeting = generateGreeting(userContext);
            setMessages([{
                role: 'assistant',
                content: greeting,
                timestamp: new Date()
            }]);
            setIsInitialized(true);
        }
    }, [isOpen, isInitialized, userContext]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (message?: string) => {
        const textToSend = message || inputValue.trim();
        if (!textToSend || isLoading) return;

        // Add user message
        const userMessage: ChatMessage = {
            role: 'user',
            content: textToSend,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await chat(textToSend, userContext, messages);

            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: response.message,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);

            // If there are suggested actions, we could show them in the UI
            // For now they're embedded in the message display
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having a moment – let me try that again. What were you asking about?",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickActions = getQuickActions(userContext);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Chat Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[calc(100vw-2rem)] md:w-[420px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-rose-100"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Planning Buddy</h3>
                                    <p className="text-xs text-white/80">Your AI wedding assistant</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-white hover:bg-white/20 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                            <div className="space-y-4">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.role === 'user'
                                                    ? 'bg-violet-500 text-white rounded-br-sm'
                                                    : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                {msg.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
                                            <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Quick Actions */}
                        {messages.length <= 1 && quickActions.length > 0 && (
                            <div className="px-4 py-2 border-t border-slate-100">
                                <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickActions.map((action, i) => (
                                        <Button
                                            key={i}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSend(action.prompt)}
                                            className="text-xs rounded-full"
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t border-slate-100">
                            <div className="flex gap-2">
                                <Input
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask me anything about your wedding..."
                                    className="flex-1 rounded-full border-slate-200"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={() => handleSend()}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="rounded-full bg-violet-500 hover:bg-violet-600 w-10 h-10 p-0"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Floating Action Button component
export function AIAssistantFAB({ onClick }: { onClick: () => void }) {
    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg hover:shadow-xl flex items-center justify-center z-40 group"
        >
            <MessageCircle className="w-6 h-6 group-hover:hidden" />
            <Sparkles className="w-6 h-6 hidden group-hover:block" />

            {/* Tooltip */}
            <div className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Chat with Planning Buddy
            </div>
        </motion.button>
    );
}
