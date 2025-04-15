
import { Link } from "react-router-dom";
import { Search, Menu, X, User, Users, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">EventHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link to="/explore" className="text-gray-700 hover:text-primary">
            Explore
          </Link>
          {user && (
            <Link to="/dashboard" className="text-gray-700 hover:text-primary">
              Dashboard
            </Link>
          )}
          {user?.role === "organizer" && (
            <Link to="/my-events" className="text-gray-700 hover:text-primary">
              My Events
            </Link>
          )}
          {user?.role === "attendee" && (
            <Link to="/my-bookings" className="text-gray-700 hover:text-primary">
              My Bookings
            </Link>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative w-10 h-10 rounded-full">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback className="bg-primary">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start p-2 space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback className="bg-primary">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center cursor-pointer">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden space-x-2 md:flex">
              <Button variant="outline" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[385px]">
              <div className="flex flex-col h-full py-6">
                <div className="flex items-center justify-between">
                  <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-primary">EventHub</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="flex flex-col mt-6 space-y-4">
                  <Link to="/explore" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                    <Search className="w-5 h-5 mr-3" />
                    Explore
                  </Link>
                  {user ? (
                    <>
                      <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                        <Calendar className="w-5 h-5 mr-3" />
                        Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                        <User className="w-5 h-5 mr-3" />
                        Profile
                      </Link>
                      {user.role === "organizer" && (
                        <Link to="/my-events" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                          <Calendar className="w-5 h-5 mr-3" />
                          My Events
                        </Link>
                      )}
                      {user.role === "attendee" && (
                        <Link to="/my-bookings" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                          <Users className="w-5 h-5 mr-3" />
                          My Bookings
                        </Link>
                      )}
                      <Button variant="ghost" className="flex items-center justify-start px-4 py-2 text-red-600 hover:bg-red-50" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                        <LogOut className="w-5 h-5 mr-3" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2 mt-4">
                      <Button asChild>
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                      </Button>
                      <Button variant="secondary" asChild>
                        <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
