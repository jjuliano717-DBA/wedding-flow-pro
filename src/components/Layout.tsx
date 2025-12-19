
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="relative w-full min-h-screen flex flex-col bg-background overflow-x-hidden">
            <Header />
            <main className="flex-1 pt-16 md:pt-20 w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
};
