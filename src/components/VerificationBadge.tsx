import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { TrustScore } from "@/lib/googlePlaces";

interface VerificationBadgeProps {
    trustScore: TrustScore;
    showScore?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const tierConfig = {
    gold: {
        icon: ShieldCheck,
        label: 'Gold Verified',
        description: 'Highly trusted vendor with excellent reviews',
        className: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 border-amber-300',
        iconClassName: 'text-amber-950'
    },
    silver: {
        icon: ShieldCheck,
        label: 'Silver Verified',
        description: 'Trusted vendor with good reviews',
        className: 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800 border-slate-300',
        iconClassName: 'text-slate-800'
    },
    bronze: {
        icon: Shield,
        label: 'Bronze Verified',
        description: 'Verified vendor building reputation',
        className: 'bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900 border-orange-300',
        iconClassName: 'text-orange-900'
    },
    unverified: {
        icon: ShieldQuestion,
        label: 'Not Verified',
        description: 'This vendor has not been verified via Google',
        className: 'bg-slate-100 text-slate-500 border-slate-200',
        iconClassName: 'text-slate-400'
    }
};

const sizeConfig = {
    sm: {
        badge: 'text-xs px-2 py-0.5',
        icon: 'w-3 h-3'
    },
    md: {
        badge: 'text-sm px-3 py-1',
        icon: 'w-4 h-4'
    },
    lg: {
        badge: 'text-base px-4 py-1.5',
        icon: 'w-5 h-5'
    }
};

export function VerificationBadge({
    trustScore,
    showScore = false,
    size = 'md',
    className = ''
}: VerificationBadgeProps) {
    const config = tierConfig[trustScore.tier];
    const sizeStyles = sizeConfig[size];
    const Icon = config.icon;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge
                    variant="outline"
                    className={`${config.className} ${sizeStyles.badge} ${className} cursor-help flex items-center gap-1.5 font-medium shadow-sm`}
                >
                    <Icon className={`${sizeStyles.icon} ${config.iconClassName}`} />
                    <span>{config.label}</span>
                    {showScore && trustScore.tier !== 'unverified' && (
                        <span className="opacity-80">({trustScore.score})</span>
                    )}
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-2">
                    <p className="font-medium">{config.description}</p>
                    {trustScore.tier !== 'unverified' && (
                        <div className="text-xs space-y-1 pt-1 border-t">
                            <div className="flex justify-between">
                                <span>Rating Score:</span>
                                <span>{trustScore.breakdown.ratingScore}/40</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Review Volume:</span>
                                <span>{trustScore.breakdown.reviewCountScore}/40</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Business Status:</span>
                                <span>{trustScore.breakdown.statusScore}/20</span>
                            </div>
                            <div className="flex justify-between font-medium pt-1 border-t">
                                <span>Total:</span>
                                <span>{trustScore.score}/100</span>
                            </div>
                        </div>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    );
}

// Compact version for list views
export function VerificationBadgeCompact({ trustScore }: { trustScore: TrustScore }) {
    const config = tierConfig[trustScore.tier];
    const Icon = config.icon;

    if (trustScore.tier === 'unverified') {
        return null; // Don't show anything for unverified
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${config.className}`}>
                    <Icon className="w-3 h-3" />
                </div>
            </TooltipTrigger>
            <TooltipContent side="top">
                <span>{config.label} - Trust Score: {trustScore.score}/100</span>
            </TooltipContent>
        </Tooltip>
    );
}
