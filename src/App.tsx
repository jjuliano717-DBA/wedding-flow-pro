import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import RealWeddings from "./pages/RealWeddings";
import VendorsDirectory from "./pages/VendorsDirectory";
import VenuesDirectory from "./pages/VenuesDirectory";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Budget from "./pages/Budget";
import { VibeCheck } from "./components/VibeCheck";
import { StyleSwipe } from "./components/StyleSwipe";
import Planner from "./pages/Planner";
import BusinessDashboard from "./pages/BusinessDashboard";
import { GamificationProvider } from "./context/GamificationContext";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import AdminDashboard from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GamificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Index />} />
                <Route path="/weddings" element={<RealWeddings />} />
                <Route path="/vendors" element={<VendorsDirectory />} />
                <Route path="/venues" element={<VenuesDirectory />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/style-matcher" element={
                  <div className="container mx-auto py-20">
                    <StyleSwipe onComplete={() => window.location.href = '/'} />
                  </div>
                } />

                {/* PRIVATE ROUTES (Require Login) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/budget" element={<Budget />} />
                  <Route path="/planner" element={<Planner />} />
                  <Route path="/business" element={<BusinessDashboard />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <VibeCheck />
          </BrowserRouter>
        </TooltipProvider>
      </GamificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
