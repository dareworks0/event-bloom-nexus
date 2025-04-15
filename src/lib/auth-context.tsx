
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "./types";
import { MOCK_USERS } from "./constants";
import { generateId } from "./utils";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: Partial<User> & { password: string }) => Promise<User>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("eventHubUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("eventHubUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("eventHubUser");
    }
  }, [user]);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, check against mock users
    const mockUser = MOCK_USERS.find(u => u.email === email);
    
    if (!mockUser) {
      setIsLoading(false);
      throw new Error("Invalid email or password");
    }
    
    setUser(mockUser);
    setIsLoading(false);
    return mockUser;
  };

  // Register function
  const register = async (userData: Partial<User> & { password: string }): Promise<User> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if email already exists
    if (MOCK_USERS.some(u => u.email === userData.email)) {
      setIsLoading(false);
      throw new Error("Email already in use");
    }
    
    // Create new user
    const newUser: User = {
      id: generateId(),
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role as UserRole || "attendee",
      profileImage: userData.profileImage,
      gender: userData.gender,
      city: userData.city,
      interests: userData.interests,
      age: userData.age,
      budget: userData.budget,
      verified: false, // Would be verified via email in a real app
    };
    
    // Add to mock users (would store in DB in real app)
    MOCK_USERS.push(newUser);
    
    setUser(newUser);
    setIsLoading(false);
    
    return newUser;
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Update user function
  const updateUser = async (userData: Partial<User>): Promise<User> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!user) {
      setIsLoading(false);
      throw new Error("No user logged in");
    }
    
    const updatedUser = { ...user, ...userData };
    
    // Update in mock list
    const index = MOCK_USERS.findIndex(u => u.id === user.id);
    if (index >= 0) {
      MOCK_USERS[index] = updatedUser;
    }
    
    setUser(updatedUser);
    setIsLoading(false);
    
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
