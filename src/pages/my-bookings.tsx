
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { EventCard } from "@/components/events/event-card";
import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function MyBookingsPage() {
  const { user, isLoading } = useAuth();
  const { userEvents, cancelBooking } = useEvents();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not logged in or not an attendee
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "attendee")) {
      navigate("/login?redirect=/my-bookings");
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

  const handleCancelBooking = async (eventId: string) => {
    try {
      await cancelBooking(eventId);
      toast({
        title: "Booking cancelled",
        description: "You have successfully cancelled your booking",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="mt-2 text-gray-500">
            Manage all your booked events
          </p>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-6">
            {upcomingEvents.length === 0 ? (
              <div className="p-12 text-center border rounded-lg">
                <h3 className="text-lg font-semibold">No upcoming bookings</h3>
                <p className="mt-2 text-gray-500">
                  You haven't booked any upcoming events yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isBooked={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="past" className="mt-6">
            {pastEvents.length === 0 ? (
              <div className="p-12 text-center border rounded-lg">
                <h3 className="text-lg font-semibold">No past bookings</h3>
                <p className="mt-2 text-gray-500">
                  You haven't attended any events yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isBooked={true}
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
