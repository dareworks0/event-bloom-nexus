import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Event, EventCategory, EventFilter } from "./types";
import { getEvents as fetchEvents, getEvent as fetchEvent, createEvent as createEventService, updateEvent as updateEventService, deleteEvent as deleteEventService, bookEvent as bookEventService, cancelBooking as cancelBookingService } from "./supabase-service";
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

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };

    loadEvents();

    const eventsChannel = supabase
      .channel('events-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' }, 
        () => loadEvents()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'attendees' }, 
        () => loadEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
    };
  }, []);

  useEffect(() => {
    setFilteredEvents(filterEvents(events, filter));
  }, [events, filter]);

  useEffect(() => {
    if (user && events.length > 0) {
      if (user.role === "attendee") {
        setUserEvents(events.filter(event => event.attendees.includes(user.id)));
      } else if (user.role === "organizer") {
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
      const cachedEvent = events.find(e => e.id === id);
      if (cachedEvent) return cachedEvent;
      
      return await fetchEvent(id);
    } catch (error) {
      console.error("Error getting event:", error);
      return undefined;
    }
  };

  const createNewEvent = async (eventData: Omit<Event, "id" | "organizerId" | "organizerName" | "attendees">): Promise<Event> => {
    if (!user || user.role !== "organizer") {
      throw new Error("Only organizers can create events");
    }

    const newEvent = await createEventService(eventData, user.id);
    
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
    const event = events.find(e => e.id === id);
    
    if (!event) {
      throw new Error("Event not found");
    }

    if (!user || (user.id !== event.organizerId && user.role !== "organizer")) {
      throw new Error("You don't have permission to update this event");
    }

    const dbEventData: any = {
      ...eventData,
      image_url: eventData.imageUrl
    };
    
    delete dbEventData.imageUrl;
    delete dbEventData.organizerId;
    delete dbEventData.organizerName;
    delete dbEventData.attendees;
    
    const updatedEvent = await updateEventService(id, dbEventData);
    
    const formattedEvent: Event = {
      ...event,
      ...eventData,
    };

    setEvents(prev => prev.map(e => e.id === id ? formattedEvent : e));
    return formattedEvent;
  };

  const deleteExistingEvent = async (id: string): Promise<void> => {
    const event = events.find(e => e.id === id);
    
    if (!event) {
      throw new Error("Event not found");
    }

    if (!user || (user.id !== event.organizerId && user.role !== "organizer")) {
      throw new Error("You don't have permission to delete this event");
    }

    await deleteEventService(id);
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
    
    if (event.attendees.length >= event.capacity) {
      throw new Error("Event is at full capacity");
    }

    if (event.attendees.includes(user.id)) {
      throw new Error("You are already attending this event");
    }

    await bookEventService(eventId, user.id);
    
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
    
    if (!event.attendees.includes(user.id)) {
      throw new Error("You are not attending this event");
    }

    await cancelBookingService(eventId, user.id);
    
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
