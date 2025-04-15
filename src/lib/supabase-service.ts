
import { supabase } from "@/integrations/supabase/client";
import { User, Event, UserRole, EventCategory } from "./types";

// Profile functions
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, profileData: Partial<User>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(profileData)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

// Event functions
export async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      profiles:organizer_id (name),
      attendees:attendees (attendee_id)
    `);

  if (error) throw error;

  // Transform data to match our Event type
  return data.map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
    price: event.price,
    category: event.category as EventCategory,
    imageUrl: event.image_url,
    organizerId: event.organizer_id,
    organizerName: event.profiles?.name || "Unknown Organizer",
    attendees: event.attendees?.map((a: any) => a.attendee_id) || [],
    capacity: event.capacity
  }));
}

export async function getEvent(eventId: string) {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      profiles:organizer_id (name),
      attendees:attendees (attendee_id)
    `)
    .eq("id", eventId)
    .single();

  if (error) throw error;

  // Transform data to match our Event type
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    location: data.location,
    price: data.price,
    category: data.category as EventCategory,
    imageUrl: data.image_url,
    organizerId: data.organizer_id,
    organizerName: data.profiles?.name || "Unknown Organizer",
    attendees: data.attendees?.map((a: any) => a.attendee_id) || [],
    capacity: data.capacity
  };
}

export async function createEvent(eventData: Omit<Event, "id" | "organizerId" | "organizerName" | "attendees">, organizerId: string) {
  const { data, error } = await supabase
    .from("events")
    .insert({
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      price: eventData.price,
      category: eventData.category,
      image_url: eventData.imageUrl,
      organizer_id: organizerId,
      capacity: eventData.capacity
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(eventId: string, eventData: Partial<Event>) {
  const { data, error } = await supabase
    .from("events")
    .update({
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      price: eventData.price,
      category: eventData.category,
      image_url: eventData.imageUrl,
      capacity: eventData.capacity
    })
    .eq("id", eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(eventId: string) {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) throw error;
}

export async function bookEvent(eventId: string, attendeeId: string) {
  const { data, error } = await supabase
    .from("attendees")
    .insert({
      event_id: eventId,
      attendee_id: attendeeId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelBooking(eventId: string, attendeeId: string) {
  const { error } = await supabase
    .from("attendees")
    .delete()
    .eq("event_id", eventId)
    .eq("attendee_id", attendeeId);

  if (error) throw error;
}

// Auth functions
export async function signUp(email: string, password: string, userData: Partial<User>) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: userData.name,
        role: userData.role,
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string, role?: UserRole) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  
  // If role is specified, check if it matches the user's role
  if (role) {
    const profile = await getProfile(data.user.id);
    if (profile.role !== role) {
      await signOut(); // Sign out if role doesn't match
      throw new Error(`Invalid role. You are not registered as a ${role}.`);
    }
  }
  
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  try {
    const profile = await getProfile(session.user.id);
    
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role as UserRole,
      profileImage: profile.profile_image,
      gender: profile.gender,
      city: profile.city,
      interests: profile.interests,
      age: profile.age,
      budget: profile.budget,
      verified: profile.verified,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
