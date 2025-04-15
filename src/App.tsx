import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Providers
import { AuthProvider } from "@/lib/auth-context";
import { EventProvider } from "@/lib/event-context";

// Pages
import Index from "./pages/index";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ExplorePage from "./pages/explore";
import DashboardPage from "./pages/dashboard";
import ProfilePage from "./pages/profile";
import MyBookingsPage from "./pages/my-bookings";
import MyEventsPage from "./pages/my-events";
import EventDetailPage from "./pages/events/[id]";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <EventProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/my-events" element={<MyEventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </EventProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
