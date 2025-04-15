
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Clock, Check } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { events, userEvents, setFilter, bookEvent } = useEvents();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login?redirect=/dashboard");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  // Filter events for recommendations (excluding user's events)
  const recommendedEvents = events
    .filter((event) => {
      // For attendees, exclude events they're already attending
      if (user.role === "attendee") {
        return !event.attendees.includes(user.id);
      }
      // For organizers, exclude events they've created
      return event.organizerId !== user.id;
    })
    .slice(0, 3);

  // Get upcoming events for attendees (first 3)
  const upcomingEvents = userEvents
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.name}!
          </h1>
          <p className="mt-2 text-gray-500">
            {user.role === "attendee"
              ? "Discover events and manage your bookings"
              : "Create and manage your events"}
          </p>
        </div>

        {/* Organizer Create Event Button */}
        {user.role === "organizer" && (
          <div className="flex justify-end">
            <Button onClick={() => navigate("/create-event")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        )}

        {/* Dashboard Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  {user.role === "attendee" ? "Events Booked" : "Events Created"}
                </h3>
                <p className="text-2xl font-semibold">{userEvents.length}</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 text-secondary">
                <Clock className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Upcoming Events</h3>
                <p className="text-2xl font-semibold">{upcomingEvents.length}</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent">
                <Check className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  {user.role === "attendee" ? "Interests" : "Available Seats"}
                </h3>
                <p className="text-2xl font-semibold">
                  {user.role === "attendee"
                    ? user.interests?.length || 0
                    : userEvents.reduce(
                        (total, event) => total + (event.capacity - event.attendees.length),
                        0
                      )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Categories</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {EVENT_CATEGORIES.filter(cat => cat !== "All").map((category) => (
              <Button
                key={category}
                variant="outline"
                className="h-24 text-lg"
                onClick={() => {
                  setFilter({ category });
                  navigate("/explore");
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* User Events and Recommendations */}
        <Tabs defaultValue="upcoming" className="mt-8">
          <TabsList>
            <TabsTrigger value="upcoming">
              {user.role === "attendee" ? "My Bookings" : "My Events"}
            </TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-4">
            {upcomingEvents.length === 0 ? (
              <div className="p-12 text-center border rounded-lg">
                <h3 className="text-lg font-semibold">
                  {user.role === "attendee"
                    ? "No bookings yet"
                    : "No events created yet"}
                </h3>
                <p className="mt-2 text-gray-500">
                  {user.role === "attendee"
                    ? "Explore events and book your favorites"
                    : "Create your first event to get started"}
                </p>
                <Button className="mt-4" onClick={() => navigate(user.role === "attendee" ? "/explore" : "/create-event")}>
                  {user.role === "attendee" ? "Explore Events" : "Create Event"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isBooked={user.role === "attendee"}
                  />
                ))}
              </div>
            )}
            {upcomingEvents.length > 0 && (
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => navigate(user.role === "attendee" ? "/my-bookings" : "/my-events")}>
                  View All
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="recommended" className="mt-4">
            {recommendedEvents.length === 0 ? (
              <div className="p-12 text-center border rounded-lg">
                <h3 className="text-lg font-semibold">No recommendations yet</h3>
                <p className="mt-2 text-gray-500">
                  We'll show you personalized recommendations soon
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onBook={user.role === "attendee" ? bookEvent : undefined}
                  />
                ))}
              </div>
            )}
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => navigate("/explore")}>
                Explore All Events
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
