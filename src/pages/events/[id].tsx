
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarClock, MapPin, Users, DollarSign, ArrowLeft, User } from "lucide-react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/lib/event-context";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_USERS } from "@/lib/constants";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getEvent, bookEvent, cancelBooking } = useEvents();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const event = getEvent(id || "");
  
  // This would normally fetch the event from an API
  useEffect(() => {
    if (!event) {
      toast({
        title: "Event not found",
        description: "The event you're looking for doesn't exist",
        variant: "destructive",
      });
      navigate("/explore");
    }
  }, [event, navigate, toast]);

  if (!event) {
    return null;
  }

  const isAttendee = user?.role === "attendee";
  const isOrganizer = user?.role === "organizer";
  const isEventCreator = user?.id === event.organizerId;
  const isAttending = user ? event.attendees.includes(user.id) : false;
  const isEventFull = event.attendees.length >= event.capacity;
  const attendeesInfo = event.attendees.map(id => MOCK_USERS.find(user => user.id === id)).filter(Boolean);

  const handleBookEvent = async () => {
    if (!user) {
      navigate(`/login?redirect=/events/${id}`);
      return;
    }

    setIsLoading(true);
    try {
      await bookEvent(event.id);
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
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    setIsLoading(true);
    try {
      await cancelBooking(event.id);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Event Image and Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-lg overflow-hidden aspect-video">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <Badge
              className="absolute top-4 right-4"
              variant="secondary"
            >
              {event.category}
            </Badge>
          </div>

          <div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <CalendarClock className="h-5 w-5 mr-2" />
                <span>{formatDate(event.date)} • {event.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2" />
                <span>
                  {event.attendees.length} / {event.capacity} attendees
                </span>
              </div>
              <div className="flex items-center font-semibold">
                <DollarSign className="h-5 w-5 mr-2" />
                <span>${event.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">About This Event</h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>

          {/* Attendees Section (visible only to event creator) */}
          {isEventCreator && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Attendees</h2>
              {attendeesInfo.length === 0 ? (
                <p className="text-gray-500">No attendees yet</p>
              ) : (
                <div className="space-y-4">
                  {attendeesInfo.map((attendee) => (
                    <Card key={attendee?.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={attendee?.profileImage} />
                            <AvatarFallback>
                              {attendee?.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <p className="font-medium">{attendee?.name}</p>
                            <p className="text-sm text-gray-500">{attendee?.email}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Booking and Organizer Info */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Booking Information</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Price</span>
                  <span className="font-semibold">${event.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability</span>
                  <span className="font-semibold">
                    {event.capacity - event.attendees.length} spots left
                  </span>
                </div>
              </div>

              {isAttendee && (
                <>
                  {isAttending ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleCancelBooking}
                      disabled={isLoading}
                    >
                      Cancel Booking
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleBookEvent}
                      disabled={isEventFull || isLoading}
                    >
                      {isEventFull ? "Sold Out" : "Book Now"}
                    </Button>
                  )}
                </>
              )}
              
              {isOrganizer && isEventCreator && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/edit-event/${event.id}`)}
                >
                  Edit Event
                </Button>
              )}
              
              {!user && (
                <Button
                  className="w-full"
                  onClick={() => navigate(`/login?redirect=/events/${event.id}`)}
                >
                  Log in to Book
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Organizer Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Organizer</h2>
              <div className="flex items-center">
                <User className="h-10 w-10 p-2 bg-gray-100 rounded-full mr-4" />
                <div>
                  <p className="font-medium">{event.organizerName}</p>
                  <p className="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
