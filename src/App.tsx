import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BusinessProvider } from "./context/BusinessContext";
import { BusinessDashboardLayout } from "./components/BusinessDashboardLayout";
import { LayoutShell } from "./components/LayoutShell";
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
import Discover from "./pages/Discover";
import { GlobalAIAssistant } from "./components/GlobalAIAssistant";
import { StyleSwipe } from "./components/StyleSwipe";
import Planner from "./pages/Planner";
import BusinessDashboard from "./pages/BusinessDashboard";
import BusinessOnboarding from "./pages/BusinessOnboarding";
import { GamificationProvider } from "./context/GamificationContext";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import AdminDashboard from "./pages/AdminDashboard";
import Moodboard from "./pages/Moodboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";

// New Role-Based Pages
import Leads from "./pages/Leads";
import Calendar from "./pages/Calendar";
import Assets from "./pages/Assets";
import Clients from "./pages/Clients";
import ClientWorkspace from "./pages/ClientWorkspace";
import BlackBook from "./pages/BlackBook";
import Finance from "./pages/Finance";
import Checklist from "./pages/Checklist";
import Guests from "./pages/Guests";
import Contracts from "./pages/Contracts";
import CoupleWizard from "./pages/onboarding/CoupleWizard";
import ProNetwork from "./pages/ProNetwork";
import ProReferrals from "./pages/ProReferrals";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import Contact from "./pages/Contact";
import TermsOfService from "./pages/legal/TermsOfService";
import CookiePolicy from "./pages/legal/CookiePolicy";
import ClaimBusiness from "./pages/ClaimBusiness";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <BusinessProvider>
          <GamificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <LayoutShell>
                  <Routes>
                    {/* ... existing routes ... */}
                    <Route path="/" element={<Index />} />
                    <Route path="/discover" element={<Discover />} />
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
                    <Route path="/business/claim" element={<ClaimBusiness />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/partner" element={<Partner />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/cookies" element={<CookiePolicy />} />
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
                      <Route path="/checklist" element={<Checklist />} />
                      <Route path="/guests" element={<Guests />} />
                      <Route path="/moodboard" element={<Moodboard />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/onboarding/couple" element={
                        <div className="min-h-screen">
                          <CoupleWizard />
                        </div>
                      } />
                    </Route>

                    {/* BUSINESS & ADMIN ROUTES - Wrapped with BusinessDashboardLayout */}
                    <Route element={<ProtectedRoute allowedRoles={['vendor', 'planner', 'venue', 'admin']} />}>
                      <Route path="/business" element={
                        <BusinessDashboardLayout>
                          <BusinessDashboard />
                        </BusinessDashboardLayout>
                      } />
                      <Route path="/business/onboarding" element={
                        <BusinessDashboardLayout>
                          <BusinessOnboarding />
                        </BusinessDashboardLayout>
                      } />

                      {/* Isolated /pro group for operational workflows */}
                      <Route path="/pro">
                        <Route path="dashboard" element={
                          <BusinessDashboardLayout>
                            <BusinessDashboard />
                          </BusinessDashboardLayout>
                        } />
                        <Route path="leads" element={
                          <BusinessDashboardLayout>
                            <Leads />
                          </BusinessDashboardLayout>
                        } />
                        <Route path="calendar" element={
                          <BusinessDashboardLayout>
                            <Calendar />
                          </BusinessDashboardLayout>
                        } />
                        <Route path="assets" element={
                          <BusinessDashboardLayout>
                            <Assets />
                          </BusinessDashboardLayout>
                        } />
                        <Route path="finance" element={
                          <BusinessDashboardLayout>
                            <Finance />
                          </BusinessDashboardLayout>
                        } />
                        <Route path="contracts" element={
                          <BusinessDashboardLayout>
                            <Contracts />
                          </BusinessDashboardLayout>
                        } />
                        <Route path="network" element={
                          <BusinessDashboardLayout>
                            <ProNetwork />
                          </BusinessDashboardLayout>
                        } />
                        <Route path="referrals" element={
                          <BusinessDashboardLayout>
                            <ProReferrals />
                          </BusinessDashboardLayout>
                        } />
                      </Route>
                    </Route>

                    {/* PLANNER & ADMIN ROUTES */}
                    <Route element={<ProtectedRoute allowedRoles={['planner', 'admin']} />}>
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/clients/:clientId/workspace" element={<ClientWorkspace />} />
                      <Route path="/black-book" element={<BlackBook />} />
                    </Route>

                    {/* ADMIN ROUTES */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </LayoutShell>
                <GlobalAIAssistant />
              </BrowserRouter>
            </TooltipProvider>
          </GamificationProvider>
        </BusinessProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

