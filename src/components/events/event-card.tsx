
import { Link } from "react-router-dom";
import { CalendarClock, MapPin, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/lib/types";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface EventCardProps {
  event: Event;
  onBook?: (eventId: string) => void;
  isBooked?: boolean;
}

export function EventCard({ event, onBook, isBooked = false }: EventCardProps) {
  const { user } = useAuth();
  const daysRemaining = getDaysRemaining(event.date);
  const isOrganizer = user?.role === "organizer";
  const isAttendee = user?.role === "attendee";
  const isEventFull = event.attendees.length >= event.capacity;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-video">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="object-cover w-full h-full"
        />
        <Badge
          className="absolute top-2 right-2"
          variant="secondary"
        >
          {event.category}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold tracking-tight">
            <Link to={`/events/${event.id}`} className="hover:text-primary">
              {event.title}
            </Link>
          </h3>
          <p className="text-sm font-medium text-primary">
            {daysRemaining > 0 ? (
              <span>{daysRemaining} days left</span>
            ) : (
              <span>Event has ended</span>
            )}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarClock className="w-4 h-4 mr-2" />
            <span>{formatDate(event.date)} • {event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            <span>
              {event.attendees.length} / {event.capacity} attendees
            </span>
          </div>
          <div className="flex items-center text-sm font-semibold">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>${event.price.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {isAttendee && (
          <>
            {isBooked ? (
              <Link to={`/events/${event.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            ) : (
              <Button
                className="w-full"
                onClick={() => onBook && onBook(event.id)}
                disabled={isEventFull}
              >
                {isEventFull ? "Sold Out" : "Book Now"}
              </Button>
            )}
          </>
        )}
        {isOrganizer && (
          <Link to={`/events/${event.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              {event.organizerId === user?.id ? "Manage Event" : "View Details"}
            </Button>
          </Link>
        )}
        {!user && (
          <Link to={`/login?redirect=/events/${event.id}`} className="w-full">
            <Button className="w-full">
              Log in to Book
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
