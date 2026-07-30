"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateEvent } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Event name is required").max(200),
  type: z.enum(["ganpati", "shiv_jayanti", "blood_donation", "school_donation", "tree_plantation", "cleanliness", "other"]),
  description: z.string().max(2000).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  visibility: z.enum(["public", "members_only", "committee_only"]).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgId = searchParams.get("org") || "";

  const mutation = useCreateEvent(orgId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "ganpati",
      description: "",
      startDate: "",
      endDate: "",
      city: "",
      state: "",
      visibility: "members_only",
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(
      {
        name: data.name,
        type: data.type,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        location: { city: data.city, state: data.state },
        settings: { visibility: data.visibility },
      },
      {
        onSuccess: (event) => {
          toast.success("Event created");
          router.push(`/events/${event._id}`);
        },
        onError: (err: Error) => {
          const axiosError = err as unknown as { response?: { data?: { error?: { message?: string } } } };
          toast.error(axiosError?.response?.data?.error?.message || "Failed to create event");
        },
      }
    );
  };

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          <CardDescription>
            Set up a new event like Ganpati Utsav, Shiv Jayanti, or any community event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ganpati Utsav 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ganpati">Ganpati Utsav</SelectItem>
                        <SelectItem value="shiv_jayanti">Shiv Jayanti</SelectItem>
                        <SelectItem value="blood_donation">Blood Donation Camp</SelectItem>
                        <SelectItem value="school_donation">School Donation Drive</SelectItem>
                        <SelectItem value="tree_plantation">Tree Plantation</SelectItem>
                        <SelectItem value="cleanliness">Cleanliness Drive</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the event" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Pune" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Maharashtra" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="members_only">Members Only</SelectItem>
                        <SelectItem value="committee_only">Committee Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
