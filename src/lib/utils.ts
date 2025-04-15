
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Event, EventFilter } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Filter events based on search, category, and date
export function filterEvents(events: Event[], filter: EventFilter): Event[] {
  let filtered = [...events];

  // Filter by search term
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
    );
  }

  // Filter by category
  if (filter.category && filter.category !== "All") {
    filtered = filtered.filter((event) => event.category === filter.category);
  }

  // Sort by date
  if (filter.date === "soonest") {
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (filter.date === "farthest") {
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return filtered;
}

// Generate a QR code URL for the specified content
export function generateQRCodeURL(content: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    content
  )}`;
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Calculate days remaining until an event
export function getDaysRemaining(eventDate: string): number {
  const today = new Date();
  const event = new Date(eventDate);
  const diffTime = event.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
