
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { CITIES, INTERESTS } from "@/lib/constants";
import { UserRole } from "@/lib/types";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["attendee", "organizer"] as const),
  gender: z.string().optional(),
  city: z.string().optional(),
  interests: z.array(z.string()).optional(),
  age: z.number().min(18).max(100).optional(),
  budget: z.number().min(0).max(10000).optional(),
  profileImage: z.instanceof(File).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "attendee" as UserRole,
      gender: undefined,
      city: undefined,
      interests: [],
      age: 25,
      budget: 500,
    },
  });

  const role = form.watch("role");

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("profileImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    try {
      // Convert File to URL for demo
      let profileImageUrl = undefined;
      if (data.profileImage) {
        profileImageUrl = URL.createObjectURL(data.profileImage);
      }

      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        gender: data.gender,
        city: data.city,
        interests: data.interests,
        age: data.age,
        budget: data.budget,
        profileImage: profileImageUrl,
      });

      toast({
        title: "Account created",
        description: "You're now registered with EventHub!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: (error as Error).message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-gray-500">
          Fill in the details below to create your EventHub account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Type Selection */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={field.value === "attendee" ? "default" : "outline"}
                      className="flex-1 h-20"
                      onClick={() => field.onChange("attendee")}
                    >
                      <div className="flex flex-col items-center">
                        <UserCircle className="h-6 w-6 mb-2" />
                        <span>Attendee</span>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "organizer" ? "default" : "outline"}
                      className="flex-1 h-20"
                      onClick={() => field.onChange("organizer")}
                    >
                      <div className="flex flex-col items-center">
                        <UserCircle className="h-6 w-6 mb-2" />
                        <span>Organizer</span>
                      </div>
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  {field.value === "attendee"
                    ? "Attendees can browse and book events"
                    : "Organizers can create and manage events"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Profile Picture */}
            <FormItem className="col-span-full">
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border">
                    {profileImagePreview ? (
                      <img 
                        src={profileImagePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <UserCircle className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Upload a profile picture (optional)
              </FormDescription>
            </FormItem>
          </div>

          {/* Extended Profile Fields */}
          {role === "attendee" && (
            <div className="space-y-6 rounded-lg border p-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Non-binary">Non-binary</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CITIES.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Age Range */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Age: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={18}
                          max={100}
                          step={1}
                          defaultValue={[field.value || 25]}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Budget Range */}
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Budget: ${field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={10000}
                          step={50}
                          defaultValue={[field.value || 500]}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Interests */}
                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem className="col-span-full">
                      <div className="mb-4">
                        <FormLabel>Interests</FormLabel>
                        <FormDescription>
                          Select areas you're interested in
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                        {INTERESTS.map((interest) => (
                          <FormField
                            key={interest}
                            control={form.control}
                            name="interests"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={interest}
                                  className="flex items-start space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(interest)}
                                      onCheckedChange={(checked) => {
                                        const currentInterests = field.value || [];
                                        if (checked) {
                                          field.onChange([...currentInterests, interest]);
                                        } else {
                                          field.onChange(
                                            currentInterests.filter(
                                              (i) => i !== interest
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {interest}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        <p className="text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
