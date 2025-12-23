/**
 * AI Client (Groq API)
 * Provides context-aware AI assistant functionality for wedding planning
 * Using Groq's fast inference with Llama 3
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface UserContext {
    fullName?: string;
    weddingDate?: string;
    guestCount?: number;
    budgetTier?: '$' | '$$' | '$$$' | '$$$$';
    stressLevel?: number;
    location?: string;
    stylePreferences?: {
        primaryArchetype?: string;
        secondaryArchetype?: string;
    };
    planningPace?: 'relaxed' | 'moderate' | 'aggressive';
    role?: 'couple' | 'vendor' | 'planner' | 'venue' | 'admin';
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface AssistantResponse {
    message: string;
    suggestedActions?: {
        label: string;
        link: string;
    }[];
}

/**
 * Build the system prompt with user context
 */
function buildSystemPrompt(context: UserContext): string {
    const monthsUntilWedding = context.weddingDate
        ? Math.max(0, Math.round((new Date(context.weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)))
        : null;

    // Budget tier mapping in dollars (per category)
    const budgetMapping: Record<string, string> = {
        '$': '$0-$5,000',
        '$$': '$5,000-$15,000',
        '$$$': '$15,000-$30,000',
        '$$$$': '$30,000+'
    };

    const parts = [
        `You are a friendly, supportive wedding planning assistant for 2PlanAWedding, a Florida-focused wedding planning platform.`,
        `Your name is "Planning Buddy".`,
        ``,
        `## User Profile:`,
        context.fullName ? `- Name: ${context.fullName.split(' ')[0]}` : null,
        context.role ? `- Role: ${context.role}` : null,
        context.weddingDate ? `- Wedding Date: ${context.weddingDate} (${monthsUntilWedding} months away)` : `- Wedding Date: Not set yet`,
        context.guestCount ? `- Guest Count: ${context.guestCount} guests` : null,
        context.budgetTier ? `- Budget Tier: ${context.budgetTier} (${budgetMapping[context.budgetTier]} per category)` : null,
        context.location ? `- Location: ${context.location}` : null,
        context.stylePreferences?.primaryArchetype
            ? `- Style: ${context.stylePreferences.primaryArchetype}${context.stylePreferences.secondaryArchetype ? ' + ' + context.stylePreferences.secondaryArchetype : ''}`
            : null,
        context.stressLevel !== undefined
            ? `- Current Stress Level: ${context.stressLevel}/10 ${context.stressLevel > 7 ? '(High - be extra gentle and supportive)' : context.stressLevel < 4 ? '(Low - can suggest more tasks)' : '(Moderate)'}`
            : null,
        context.planningPace ? `- Planning Pace Preference: ${context.planningPace}` : null,
        ``,
        `## Role-Based Communication Style:`,
        context.role === 'planner'
            ? `- USER IS A PLANNER: Be terse, data-driven, and professional. Focus on metrics, timelines, and vendor performance. Assume high expertise.`
            : `- USER IS A COUPLE: Be warm, encouraging, supportive, and inspiring. Use empathetic language and celebrate milestones.`,
        ``,
        `## Availability-First Rules (CRITICAL):`,
        `- When recommending vendors, ALWAYS mention that availability should be checked first`,
        `- Remind users that vendors marked as 'BOOKED' for their wedding date should be excluded`,
        `- Prioritize available vendors in all recommendations`,
        `- If user asks for vendor suggestions, ask for their wedding date first if not already set`,
        ``,
        `## Budget Reality Checks:`,
        `- When suggesting vendors, compare pricing against the user's budget tier (${context.budgetTier ? budgetMapping[context.budgetTier] : 'not set'})`,
        `- Warn if a vendor's typical pricing exceeds the user's budget tier by more than 10%`,
        `- Suggest budget-friendly alternatives when appropriate`,
        `- Be honest about cost realities without being discouraging`,
        ``,
        `## Style Matching:`,
        context.stylePreferences?.primaryArchetype
            ? `- User's primary style is ${context.stylePreferences.primaryArchetype}. Prioritize vendors with matching aesthetic tags.`
            : `- User hasn't completed Style Matcher yet. Encourage them to discover their style at /style-matcher`,
        ``,
        `## General Guidelines:`,
        `- Tailor advice based on the user's wedding date timeline`,
        `- Be mindful of their stress level - if high, suggest small wins; if low, suggest bigger tasks`,
        `- Respect their budget tier when making vendor/venue suggestions`,
        `- For Florida weddings, consider weather (hurricane season June-November, summer heat)`,
        `- Avoid rigid deadlines - adapt to their pace`,
        `- If they haven't set a wedding date, gently encourage them to do so`,
        `- Suggest visiting relevant pages on the platform when appropriate (e.g., /budget, /vendors, /venues, /style-matcher)`,
        `- Keep responses concise but warm - aim for 2-3 short paragraphs max`,
        `- If they seem overwhelmed, validate their feelings first before offering solutions`,
        `- Support non-traditional weddings (elopements, destination, multi-cultural) without judgment`,
    ].filter(Boolean);

    return parts.join('\n');
}

/**
 * Send a chat message to Groq API with user context
 */
export async function chat(
    userMessage: string,
    context: UserContext,
    conversationHistory: ChatMessage[] = []
): Promise<AssistantResponse> {
    if (!GROQ_API_KEY) {
        console.error('Groq API key not configured');
        return {
            message: "I'm sorry, I'm having trouble connecting right now. Please try again later!",
        };
    }

    try {
        const systemPrompt = buildSystemPrompt(context);

        // Build conversation history for context (OpenAI format)
        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            { role: 'user', content: userMessage }
        ];

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
                top_p: 0.9,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', response.status, errorText);
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices?.[0]?.message?.content ||
            "I'm having trouble thinking right now. Could you try rephrasing that?";

        // Extract suggested actions from the response
        const suggestedActions = extractSuggestedActions(assistantMessage, context);

        return {
            message: cleanResponse(assistantMessage),
            suggestedActions
        };
    } catch (error) {
        console.error('Error calling Groq API:', error);
        return {
            message: "Oops! I hit a small snag. Let me try again - could you repeat what you were saying?",
        };
    }
}

/**
 * Clean up the response text
 */
function cleanResponse(text: string): string {
    // Remove any markdown links we'll handle via suggestedActions
    return text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links but keep text
        .trim();
}

/**
 * Extract suggested actions based on response content and context
 */
function extractSuggestedActions(
    message: string,
    context: UserContext
): { label: string; link: string }[] {
    const actions: { label: string; link: string }[] = [];
    const lowerMessage = message.toLowerCase();

    // Suggest budget page if discussing costs
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
        actions.push({ label: 'Open Budget Advisor', link: '/budget' });
    }

    // Suggest vendors if discussing vendors
    if (lowerMessage.includes('vendor') || lowerMessage.includes('photographer') ||
        lowerMessage.includes('florist') || lowerMessage.includes('caterer')) {
        actions.push({ label: 'Browse Vendors', link: '/vendors' });
    }

    // Suggest venues if discussing venues
    if (lowerMessage.includes('venue') || lowerMessage.includes('location') ||
        lowerMessage.includes('ceremony') || lowerMessage.includes('reception')) {
        actions.push({ label: 'Explore Venues', link: '/venues' });
    }

    // Suggest style matcher if no style set or discussing style
    if (!context.stylePreferences?.primaryArchetype &&
        (lowerMessage.includes('style') || lowerMessage.includes('vibe') || lowerMessage.includes('theme'))) {
        actions.push({ label: 'Discover Your Style', link: '/style-matcher' });
    }

    // Limit to 2 actions max
    return actions.slice(0, 2);
}

/**
 * Generate a greeting message based on user context
 */
export function generateGreeting(context: UserContext): string {
    const name = context.fullName?.split(' ')[0] || 'there';
    const time = new Date().getHours();

    let timeGreeting = 'Hello';
    if (time < 12) timeGreeting = 'Good morning';
    else if (time < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    if (context.weddingDate) {
        const monthsAway = Math.max(0, Math.round(
            (new Date(context.weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
        ));

        if (monthsAway <= 1) {
            return `${timeGreeting}, ${name}! 🎉 The big day is almost here! How can I help with those final touches?`;
        } else if (monthsAway <= 3) {
            return `${timeGreeting}, ${name}! With ${monthsAway} months to go, things are getting exciting! What's on your mind today?`;
        } else {
            return `${timeGreeting}, ${name}! You've got ${monthsAway} months to create something beautiful. What would you like to work on?`;
        }
    }

    if (context.stressLevel && context.stressLevel > 7) {
        return `${timeGreeting}, ${name}. I noticed things might feel a bit overwhelming right now. Take a deep breath – I'm here to help make this easier. 💜`;
    }

    return `${timeGreeting}, ${name}! I'm your Planning Buddy. How can I help make your wedding planning journey smoother today?`;
}

/**
 * Get quick action suggestions based on context
 */
export function getQuickActions(context: UserContext): { label: string; prompt: string }[] {
    const actions: { label: string; prompt: string }[] = [];

    if (!context.weddingDate) {
        actions.push({
            label: '📅 Set wedding date',
            prompt: "I need help picking a wedding date"
        });
    }

    if (!context.stylePreferences?.primaryArchetype) {
        actions.push({
            label: '✨ Find my style',
            prompt: "Help me figure out my wedding style"
        });
    }

    if (!context.budgetTier) {
        actions.push({
            label: '💰 Set budget',
            prompt: "I need help with my wedding budget"
        });
    }

    // Add timeline-based actions if we have a wedding date
    if (context.weddingDate) {
        const monthsAway = Math.round(
            (new Date(context.weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
        );

        if (monthsAway > 6) {
            actions.push({
                label: '🏛️ Find venues',
                prompt: "Help me find venues in Florida"
            });
        } else if (monthsAway > 3) {
            actions.push({
                label: '📸 Find vendors',
                prompt: "What vendors should I be booking now?"
            });
        } else {
            actions.push({
                label: '✅ Final checklist',
                prompt: "What should I focus on in the final months?"
            });
        }
    }

    // Add stress-based action
    if (context.stressLevel && context.stressLevel > 6) {
        actions.push({
            label: '😌 Reduce stress',
            prompt: "I'm feeling overwhelmed with planning"
        });
    }

    return actions.slice(0, 4);
}
