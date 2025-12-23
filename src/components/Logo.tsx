import React from "react";

interface LogoProps {
    className?: string;
    simplified?: boolean; // When true, shows only the two rings
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8", simplified = false }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                viewBox="0 0 100 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-auto"
            >
                {/* Ring 1 - Brand Navy or White */}
                <circle
                    cx="35"
                    cy="30"
                    r="25"
                    stroke={simplified ? "#FFFFFF" : "#0F172A"}
                    strokeWidth="6"
                    className="transition-colors duration-300"
                />
                {/* Ring 2 - Dusty Rose or White */}
                <circle
                    cx="65"
                    cy="30"
                    r="25"
                    stroke={simplified ? "#FFFFFF" : "#DCA1A1"}
                    strokeWidth="6"
                    className="transition-colors duration-300"
                />
                {/* Intersection logic for "interlocking" feel - optional but adds elegance */}
                {!simplified && (
                    <path
                        d="M51.5 13.5C54.8 17.5 56.8 23.5 56.8 30C56.8 36.5 54.8 42.5 51.5 46.5"
                        stroke="#0F172A"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                )}
            </svg>
            {!simplified && (
                <span className="font-serif text-xl font-bold tracking-tight text-brand-navy flex items-baseline">
                    2Plan<span className="text-dusty-rose">A</span>Wedding
                </span>
            )}
        </div>
    );
};
