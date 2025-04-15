
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Event, EventCategory, EventFilter } from "./types";
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent, bookEvent as bookEventService, cancelBooking as cancelBookingService } from "./supabase-service";
import { filterEvents } from "./utils";
import { useAuth } from "./auth-context";
import { supabase } from "@/integrations/supabase/client";

interface EventContextType {
  events: Event[];
  filteredEvents: Event[];
  userEvents: Event[];
  filter: EventFilter;
  setFilter: (filter: Partial<EventFilter>) => void;
  getEvent: (id: string) => Promise<Event | undefined>;
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
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilterState] = useState<EventFilter>(defaultFilter);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [userEvents, setUserEvents] = useState<Event[]>([]);

  // Load events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };

    fetchEvents();

    // Subscribe to changes in the events table
    const eventsChannel = supabase
      .channel('events-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' }, 
        fetchEvents
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'attendees' }, 
        fetchEvents
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
    };
  }, []);

  // Update filtered events whenever events or filter changes
  useEffect(() => {
    setFilteredEvents(filterEvents(events, filter));
  }, [events, filter]);

  // Update user events whenever user or events change
  useEffect(() => {
    if (user && events.length > 0) {
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

  const getEventById = async (id: string): Promise<Event | undefined> => {
    try {
      return await getEvent(id);
    } catch (error) {
      console.error("Error getting event:", error);
      return undefined;
    }
  };

  const createNewEvent = async (eventData: Omit<Event, "id" | "organizerId" | "organizerName" | "attendees">): Promise<Event> => {
    if (!user || user.role !== "organizer") {
      throw new Error("Only organizers can create events");
    }

    const newEvent = await createEvent(eventData, user.id);
    
    // Transform to match our Event type
    const formattedEvent: Event = {
      id: newEvent.id,
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      price: newEvent.price,
      category: newEvent.category as EventCategory,
      imageUrl: newEvent.image_url,
      organizerId: newEvent.organizer_id,
      organizerName: user.name,
      attendees: [],
      capacity: newEvent.capacity
    };

    setEvents(prev => [...prev, formattedEvent]);
    return formattedEvent;
  };

  const updateExistingEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
    // Find the event to check permissions
    const event = events.find(e => e.id === id);
    
    if (!event) {
      throw new Error("Event not found");
    }

    // Check permissions
    if (!user || (user.id !== event.organizerId && user.role !== "organizer")) {
      throw new Error("You don't have permission to update this event");
    }

    // Map to database field names
    const dbEventData: any = {
      ...eventData,
      image_url: eventData.imageUrl
    };
    
    delete dbEventData.imageUrl;
    delete dbEventData.organizerId;
    delete dbEventData.organizerName;
    delete dbEventData.attendees;
    
    const updatedEvent = await updateEvent(id, dbEventData);
    
    // Transform to match our Event type
    const formattedEvent: Event = {
      ...event,
      ...eventData,
    };

    setEvents(prev => prev.map(e => e.id === id ? formattedEvent : e));
    return formattedEvent;
  };

  const deleteExistingEvent = async (id: string): Promise<void> => {
    // Find the event to check permissions
    const event = events.find(e => e.id === id);
    
    if (!event) {
      throw new Error("Event not found");
    }

    // Check permissions
    if (!user || (user.id !== event.organizerId && user.role !== "organizer")) {
      throw new Error("You don't have permission to delete this event");
    }

    await deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const bookEventForUser = async (eventId: string): Promise<Event> => {
    if (!user || user.role !== "attendee") {
      throw new Error("Only attendees can book events");
    }

    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error("Event not found");
    }
    
    // Check if event is full
    if (event.attendees.length >= event.capacity) {
      throw new Error("Event is at full capacity");
    }

    // Check if user is already attending
    if (event.attendees.includes(user.id)) {
      throw new Error("You are already attending this event");
    }

    await bookEventService(eventId, user.id);
    
    // Update our local state
    const updatedEvent = { 
      ...event, 
      attendees: [...event.attendees, user.id] 
    };
    
    setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
    return updatedEvent;
  };

  const cancelUserBooking = async (eventId: string): Promise<Event> => {
    if (!user) {
      throw new Error("You must be logged in");
    }

    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error("Event not found");
    }
    
    // Check if user is attending
    if (!event.attendees.includes(user.id)) {
      throw new Error("You are not attending this event");
    }

    await cancelBookingService(eventId, user.id);
    
    // Update our local state
    const updatedEvent = { 
      ...event, 
      attendees: event.attendees.filter(id => id !== user.id) 
    };
    
    setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
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
        getEvent: getEventById,
        createEvent: createNewEvent,
        updateEvent: updateExistingEvent,
        deleteEvent: deleteExistingEvent,
        bookEvent: bookEventForUser,
        cancelBooking: cancelUserBooking,
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
