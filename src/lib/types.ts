
// User type definitions
export type UserRole = "attendee" | "organizer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  gender?: string;
  city?: string;
  interests?: string[];
  age?: number;
  budget?: number;
  verified: boolean;
}

// Event type definitions
export type EventCategory = "Music" | "Travel" | "Tech" | "Workshops" | "All";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  category: EventCategory;
  imageUrl: string;
  organizerId: string;
  organizerName: string;
  attendees: string[];
  capacity: number;
}

export interface EventFilter {
  search: string;
  category: EventCategory;
  date: "soonest" | "farthest" | "all";
}

// Form types
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  gender?: string;
  city?: string;
  interests?: string[];
  age?: number;
  budget?: number;
  profileImage?: File;
}

export interface LoginFormData {
  email: string;
  password: string;
}
