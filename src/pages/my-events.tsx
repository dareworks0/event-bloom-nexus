
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { EventCard } from "@/components/events/event-card";
import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function MyEventsPage() {
  const { user, isLoading } = useAuth();
  const { userEvents } = useEvents();
  const navigate = useNavigate();

  // Redirect if not logged in or not an organizer
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "organizer")) {
      navigate("/login?redirect=/my-events");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  // Split events into upcoming and past
  const today = new Date();
  const upcomingEvents = userEvents.filter(
    (event) => new Date(event.date) >= today
  );
  const pastEvents = userEvents.filter((event) => new Date(event.date) < today);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
            <p className="mt-2 text-gray-500">
              Manage all your created events
            </p>
          </div>
          <Button onClick={() => navigate("/create-event")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-6">
            {upcomingEvents.length === 0 ? (
              <div className="p-12 text-center border rounded-lg">
                <h3 className="text-lg font-semibold">No upcoming events</h3>
                <p className="mt-2 text-gray-500">
                  You haven't created any upcoming events yet
                </p>
                <Button className="mt-4" onClick={() => navigate("/create-event")}>
                  Create Your First Event
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="past" className="mt-6">
            {pastEvents.length === 0 ? (
              <div className="p-12 text-center border rounded-lg">
                <h3 className="text-lg font-semibold">No past events</h3>
                <p className="mt-2 text-gray-500">
                  You haven't hosted any events yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
