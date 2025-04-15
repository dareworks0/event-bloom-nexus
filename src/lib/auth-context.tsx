
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "./types";
import { signUp, signIn, signOut, getCurrentUser, updateProfile } from "./supabase-service";
import { supabase } from "@/integrations/supabase/client";

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

  // Initialize auth state and set up listener
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const user = await getCurrentUser();
          setUser(user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error("Failed to get user after login");
      }
      
      setUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: Partial<User> & { password: string }): Promise<User> => {
    setIsLoading(true);
    
    try {
      const { password, ...userDetails } = userData;
      await signUp(userDetails.email || "", password, userDetails);
      
      // In a real app, we'd wait for email verification
      // For now, we'll log them in right away
      return await login(userDetails.email || "", password);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    await signOut();
    setUser(null);
  };

  // Update user function
  const updateUser = async (userData: Partial<User>): Promise<User> => {
    setIsLoading(true);
    
    try {
      if (!user) {
        throw new Error("No user logged in");
      }
      
      const updatedProfileData = await updateProfile(user.id, userData);
      const updatedUser = { ...user, ...updatedProfileData };
      setUser(updatedUser as User);
      return updatedUser as User;
    } finally {
      setIsLoading(false);
    }
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
