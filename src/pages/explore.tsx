
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { EventFilterBar } from "@/components/events/event-filter";
import { EventCard } from "@/components/events/event-card";
import { useEvents } from "@/lib/event-context";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function ExplorePage() {
  const { filteredEvents, filter, setFilter, bookEvent } = useEvents();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBooking, setIsBooking] = useState(false);

  // Extract category from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setFilter({ category: categoryParam as any });
    }
  }, [setFilter]);

  const handleBookEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login or register to book events",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      await bookEvent(eventId);
      toast({
        title: "Booking successful",
        description: "You have successfully booked this event!",
      });
    } catch (error) {
      toast({
        title: "Booking failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Events</h1>
          <p className="mt-2 text-gray-500">
            Discover and book events that match your interests
          </p>
        </div>

        <EventFilterBar filter={filter} onChange={setFilter} />

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center border rounded-lg">
            <h3 className="text-lg font-semibold">No events found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your filters or search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onBook={handleBookEvent}
                isBooked={
                  user ? event.attendees.includes(user.id) : false
                }
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
