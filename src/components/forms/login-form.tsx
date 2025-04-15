
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserCircle } from "lucide-react";
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
    try {
      await login(data.email, data.password, data.role);
      toast({
        title: "Login successful",
        description: "Welcome back to EventHub!",
      });
      navigate(redirectTo);
    } catch (error) {
      toast({
        title: "Login failed",
        description: (error as Error).message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-gray-500">
          Enter your credentials to access your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your.email@example.com"
                    type="email"
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
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
                      className="flex-1 h-16"
                      onClick={() => field.onChange("attendee")}
                    >
                      <div className="flex flex-col items-center">
                        <UserCircle className="h-5 w-5 mb-1" />
                        <span>Attendee</span>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "organizer" ? "default" : "outline"}
                      className="flex-1 h-16"
                      onClick={() => field.onChange("organizer")}
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
          <Button type="submit" className="w-full" disabled={isLoading}>
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
    </div>
  );
}
