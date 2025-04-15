
import { Link } from "react-router-dom";
import { Calendar, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container px-6 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">EventHub</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Discover, book, and experience amazing events around you. EventHub connects event organizers with attendees for unforgettable experiences.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-primary">Explore</h3>
            <div className="flex flex-col mt-4 space-y-2">
              <Link to="/explore?category=Music" className="text-gray-600 hover:text-primary">Music Events</Link>
              <Link to="/explore?category=Travel" className="text-gray-600 hover:text-primary">Travel Experiences</Link>
              <Link to="/explore?category=Tech" className="text-gray-600 hover:text-primary">Tech Conferences</Link>
              <Link to="/explore?category=Workshops" className="text-gray-600 hover:text-primary">Workshops</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-primary">Company</h3>
            <div className="flex flex-col mt-4 space-y-2">
              <Link to="/about" className="text-gray-600 hover:text-primary">About Us</Link>
              <a href="#" className="text-gray-600 hover:text-primary">Blog</a>
              <a href="#" className="text-gray-600 hover:text-primary">Careers</a>
              <a href="#" className="text-gray-600 hover:text-primary">Contact</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-primary">Follow Us</h3>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary">
                <Facebook className="w-6 h-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Instagram className="w-6 h-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Twitter className="w-6 h-6" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Subscribe to our newsletter for the latest updates on events and promotions.
            </p>
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
