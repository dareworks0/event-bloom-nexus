
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserCircle, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ParallaxBackground } from "@/components/gyro/ParallaxBackground";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["attendee", "organizer"] as const),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Get the redirect URL from query params or default to dashboard
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "attendee" as UserRole,
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      await login(data.email, data.password, data.role);
      toast({
        title: "Login successful",
        description: "Welcome back to EventHub!",
      });
      navigate(redirectTo);
    } catch (error) {
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes("Invalid role")) {
        setAuthError("You are not registered with this role. Please try again with a different role.");
      } else if (errorMessage.includes("Invalid login credentials")) {
        setAuthError("Invalid email or password. Please check your credentials and try again.");
      } else if (errorMessage.includes("Email not confirmed")) {
        setAuthError("Please confirm your email before logging in.");
      } else {
        setAuthError(errorMessage || "An unexpected error occurred during login.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ParallaxBackground className="mx-auto w-full max-w-md space-y-6 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg animate-entrance">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-gray-500">
          Enter your credentials to access your account
        </p>
      </div>
      
      {authError && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="your.email@example.com"
                    type="email"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Password
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="••••••••" 
                    type="password" 
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login as</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={field.value === "attendee" ? "default" : "outline"}
                      className="flex-1 h-16 hover-scale transition-all"
                      onClick={() => {
                        field.onChange("attendee");
                        setAuthError(null);
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <UserCircle className="h-5 w-5 mb-1" />
                        <span>Attendee</span>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "organizer" ? "default" : "outline"}
                      className="flex-1 h-16 hover-scale transition-all"
                      onClick={() => {
                        field.onChange("organizer");
                        setAuthError(null);
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <UserCircle className="h-5 w-5 mb-1" />
                        <span>Organizer</span>
                      </div>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm">
        <p className="text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </ParallaxBackground>
  );
}
