import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import RealWeddings from "./pages/RealWeddings";
import VendorsDirectory from "./pages/VendorsDirectory";
import VenuesDirectory from "./pages/VenuesDirectory";
import VendorDetail from "./pages/VendorDetail";
import VenueDetail from "./pages/VenueDetail";
import PlanningTips from "./pages/PlanningTips";
import PlanningTipDetail from "./pages/PlanningTipDetail";
import Auth from "./pages/Auth";
import ListVenue from "./pages/ListVenue";
import ListBusiness from "./pages/ListBusiness";
import Partner from "./pages/Partner";
import Profile from "./pages/Profile";
import Budget from "./pages/Budget";
import { GlobalAIAssistant } from "./components/GlobalAIAssistant";
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
                <Route path="/vendors/:id" element={<VendorDetail />} />
                <Route path="/venues/:id" element={<VenueDetail />} />
                <Route path="/tips" element={<PlanningTips />} />
                <Route path="/tips/:id" element={<PlanningTipDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/list-venue" element={<ListVenue />} />
                <Route path="/join-vendor" element={<ListBusiness />} />
                <Route path="/partner" element={<Partner />} />
                <Route path="/style-matcher" element={
                  <div className="container mx-auto py-20">
                    <StyleSwipe />
                  </div>
                } />

                {/* PRIVATE ROUTES */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* COUPLE & ADMIN ROUTES */}
                <Route element={<ProtectedRoute allowedRoles={['couple', 'admin']} />}>
                  <Route path="/budget" element={<Budget />} />
                  <Route path="/planner" element={<Planner />} />
                  <Route path="/community" element={<Community />} />
                </Route>

                {/* BUSINESS & ADMIN ROUTES */}
                <Route element={<ProtectedRoute allowedRoles={['business', 'admin']} />}>
                  <Route path="/business" element={<BusinessDashboard />} />
                </Route>

                {/* ADMIN ROUTES */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <GlobalAIAssistant />
          </BrowserRouter>
        </TooltipProvider>
      </GamificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
