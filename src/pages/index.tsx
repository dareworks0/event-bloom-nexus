
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Star, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/layout";
import { EventCard } from "@/components/events/event-card";
import { useEvents } from "@/lib/event-context";

export default function Index() {
  const { events } = useEvents();
  
  // Get featured events (first 3)
  const featuredEvents = events.slice(0, 3);

  return (
    <Layout fullWidth>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/90 to-primary">
        <div className="container px-4 py-20 mx-auto text-center md:py-32">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            Discover & Book Amazing Events
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-white/90">
            Connect with event organizers and attendees for unforgettable experiences. Find music concerts, tech conferences, workshops, and travel adventures all in one place.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 mt-10 md:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link to="/explore">
                Explore Events <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 z-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Event background" 
            className="object-cover w-full h-full"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center">Why Choose EventHub?</h2>
          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10 text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Dual Registration</h3>
              <p className="text-gray-600">
                Sign up as an attendee to discover and book events, or as an organizer to create and manage your own events.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-secondary/10 text-secondary">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Personalized Experience</h3>
              <p className="text-gray-600">
                Get event recommendations based on your interests, location, and previous bookings.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-accent/10 text-accent">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Wide Range of Events</h3>
              <p className="text-gray-600">
                From music concerts to tech conferences, workshops to travel experiences—there's something for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <Link 
              to="/explore" 
              className="flex items-center text-primary hover:underline"
            >
              View all events <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold">Ready to Experience Amazing Events?</h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
            Create your account today and start discovering events that match your interests.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 mt-8 md:flex-row">
            <Button asChild size="lg">
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/explore">Browse Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
