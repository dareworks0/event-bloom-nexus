
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload } from "lucide-react";
import { Layout } from "@/components/layout/layout";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { useEvents } from "@/lib/event-context";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { EventCategory } from "@/lib/types";

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  category: z.enum(EVENT_CATEGORIES.filter(c => c !== "All") as [EventCategory, ...EventCategory[]]),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  imageUrl: z.string().min(1, "Image URL is required"),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const { createEvent } = useEvents();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Redirect if not an organizer
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "organizer")) {
      toast({
        title: "Access denied",
        description: "Only organizers can create events",
        variant: "destructive",
      });
      navigate("/login?redirect=/create-event");
    }
  }, [user, authLoading, navigate, toast]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0], // Set to current date
      time: "18:00",
      location: "",
      price: 0,
      category: "Music",
      capacity: 50,
      imageUrl: "https://source.unsplash.com/random/800x600/?event",
    },
  });

  async function onSubmit(data: EventFormValues) {
    setIsSubmitting(true);
    try {
      const newEvent = await createEvent({
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        price: data.price,
        category: data.category,
        capacity: data.capacity,
        imageUrl: data.imageUrl,
      });

      toast({
        title: "Event created",
        description: "Your event has been created successfully!",
      });
      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle image preview
  const handleImageUrlChange = (url: string) => {
    form.setValue("imageUrl", url);
    setImagePreview(url);
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container max-w-3xl py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
          <p className="mt-2 text-gray-500">
            Fill in the details to create your event
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My Amazing Event" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your event..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EVENT_CATEGORIES.filter(c => c !== "All").map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Set to 0 for free events
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Capacity */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum number of attendees
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image URL */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Event Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input 
                          placeholder="Image URL" 
                          {...field} 
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                        />
                        {imagePreview && (
                          <div className="relative w-full h-48 overflow-hidden rounded-md border">
                            <img
                              src={imagePreview}
                              alt="Event preview"
                              className="w-full h-full object-cover"
                              onError={() => setImagePreview(null)}
                            />
                          </div>
                        )}
                        {!imagePreview && (
                          <div className="flex flex-col items-center justify-center w-full h-48 border border-dashed rounded-md p-4 text-gray-500">
                            <Upload className="h-10 w-10 mb-2" />
                            <p>Enter a URL for your event image</p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Provide a URL for your event image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Event...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
