import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "couple" | "pro";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isProMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem("wedding-theme");
        return (saved as Theme) || "couple";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("pro-mode");
        if (theme === "pro") {
            root.classList.add("pro-mode");
        }
        localStorage.setItem("wedding-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "couple" ? "pro" : "couple"));
    };

    const isProMode = theme === "pro";

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isProMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
