
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { ParallaxBackground } from "@/components/gyro/ParallaxBackground";
import { useAuth } from "@/lib/auth-context";

export default function Index() {
  const { user } = useAuth();

  return (
    <Layout>
      <ParallaxBackground>
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Find and Book Amazing Events
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              Discover events, connect with others, and create unforgettable
              memories with EventHub
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="animate-entrance hover-scale">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="animate-entrance hover-scale">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="animate-entrance hover-scale"
                    >
                      Log in
                    </Button>
                  </Link>
                </>
              )}
              <Link to="/explore">
                <Button
                  variant="secondary"
                  size="lg"
                  className="animate-entrance hover-scale"
                >
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </ParallaxBackground>

      <div className="py-24 bg-slate-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose EventHub?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow-sm hover-scale">
              <h3 className="text-xl font-semibold mb-3">Discover Events</h3>
              <p className="text-gray-600">
                Find events that match your interests, from concerts to workshops
                and everything in between.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm hover-scale">
              <h3 className="text-xl font-semibold mb-3">Create & Organize</h3>
              <p className="text-gray-600">
                Easily create and manage your own events. Reach a wider audience
                and boost attendance.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm hover-scale">
              <h3 className="text-xl font-semibold mb-3">
                Connect with Others
              </h3>
              <p className="text-gray-600">
                Meet people with similar interests and expand your social
                network through events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
