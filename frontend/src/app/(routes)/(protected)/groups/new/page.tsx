"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateGroup } from "@/hooks/useGroups";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  type: z.enum(["trip", "home", "couple", "committee", "event", "other"]),
  description: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewGroupPage() {
  const router = useRouter();
  const mutation = useCreateGroup();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", type: "other", description: "" },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data, {
      onSuccess: (group) => {
        toast.success("Group created");
        router.push(`/groups/${group._id}`);
      },
      onError: (err: Error) => {
        const axiosError = err as unknown as { response?: { data?: { error?: { message?: string } } } };
        toast.error(axiosError?.response?.data?.error?.message || "Failed to create group");
      },
    });
  };

  return (
    <div className="container mx-auto max-w-xl py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/groups">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Groups
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Create Group</CardTitle>
          <CardDescription>Create a group to split expenses with others.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Roommates, Trip to Goa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="trip">Trip</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="couple">Couple</SelectItem>
                      <SelectItem value="committee">Committee</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="What's this group for?" {...field} />
                  </FormControl>
                </FormItem>
              )} />
              <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? "Creating..." : "Create Group"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
