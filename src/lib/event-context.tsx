
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Event, EventCategory, EventFilter } from "./types";
import { MOCK_EVENTS } from "./constants";
import { filterEvents, generateId } from "./utils";
import { useAuth } from "./auth-context";

interface EventContextType {
  events: Event[];
  filteredEvents: Event[];
  userEvents: Event[];
  filter: EventFilter;
  setFilter: (filter: Partial<EventFilter>) => void;
  getEvent: (id: string) => Event | undefined;
  createEvent: (eventData: Omit<Event, "id" | "organizerId" | "organizerName" | "attendees">) => Promise<Event>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  bookEvent: (eventId: string) => Promise<Event>;
  cancelBooking: (eventId: string) => Promise<Event>;
}

const defaultFilter: EventFilter = {
  search: "",
  category: "All",
  date: "all",
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [filter, setFilterState] = useState<EventFilter>(defaultFilter);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [userEvents, setUserEvents] = useState<Event[]>([]);

  // Update filtered events whenever events or filter changes
  useEffect(() => {
    setFilteredEvents(filterEvents(events, filter));
  }, [events, filter]);

  // Update user events whenever user or events change
  useEffect(() => {
    if (user) {
      if (user.role === "attendee") {
        // For attendees, show events they're attending
        setUserEvents(events.filter(event => event.attendees.includes(user.id)));
      } else if (user.role === "organizer") {
        // For organizers, show events they've created
        setUserEvents(events.filter(event => event.organizerId === user.id));
      }
    } else {
      setUserEvents([]);
    }
  }, [user, events]);

  const setFilter = (newFilter: Partial<EventFilter>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }));
  };

  const getEvent = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };

  const createEvent = async (eventData: Omit<Event, "id" | "organizerId" | "organizerName" | "attendees">): Promise<Event> => {
    if (!user || user.role !== "organizer") {
      throw new Error("Only organizers can create events");
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newEvent: Event = {
      ...eventData,
      id: generateId(),
      organizerId: user.id,
      organizerName: user.name,
      attendees: [],
    };

    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new Error("Event not found");
    }

    // Check if user is the organizer
    if (user?.id !== events[eventIndex].organizerId && user?.role !== "organizer") {
      throw new Error("You don't have permission to update this event");
    }

    const updatedEvent = { ...events[eventIndex], ...eventData };
    const updatedEvents = [...events];
    updatedEvents[eventIndex] = updatedEvent;
    
    setEvents(updatedEvents);
    return updatedEvent;
  };

  const deleteEvent = async (id: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new Error("Event not found");
    }

    // Check if user is the organizer
    if (user?.id !== events[eventIndex].organizerId && user?.role !== "organizer") {
      throw new Error("You don't have permission to delete this event");
    }

    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const bookEvent = async (eventId: string): Promise<Event> => {
    if (!user || user.role !== "attendee") {
      throw new Error("Only attendees can book events");
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      throw new Error("Event not found");
    }

    const event = events[eventIndex];
    
    // Check if event is full
    if (event.attendees.length >= event.capacity) {
      throw new Error("Event is at full capacity");
    }

    // Check if user is already attending
    if (event.attendees.includes(user.id)) {
      throw new Error("You are already attending this event");
    }

    // Add user to attendees
    const updatedEvent = { 
      ...event, 
      attendees: [...event.attendees, user.id] 
    };
    
    const updatedEvents = [...events];
    updatedEvents[eventIndex] = updatedEvent;
    
    setEvents(updatedEvents);
    return updatedEvent;
  };

  const cancelBooking = async (eventId: string): Promise<Event> => {
    if (!user) {
      throw new Error("You must be logged in");
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      throw new Error("Event not found");
    }

    const event = events[eventIndex];
    
    // Check if user is attending
    if (!event.attendees.includes(user.id)) {
      throw new Error("You are not attending this event");
    }

    // Remove user from attendees
    const updatedEvent = { 
      ...event, 
      attendees: event.attendees.filter(id => id !== user.id) 
    };
    
    const updatedEvents = [...events];
    updatedEvents[eventIndex] = updatedEvent;
    
    setEvents(updatedEvents);
    return updatedEvent;
  };

  return (
    <EventContext.Provider
      value={{
        events,
        filteredEvents,
        userEvents,
        filter,
        setFilter,
        getEvent,
        createEvent,
        updateEvent,
        deleteEvent,
        bookEvent,
        cancelBooking,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
