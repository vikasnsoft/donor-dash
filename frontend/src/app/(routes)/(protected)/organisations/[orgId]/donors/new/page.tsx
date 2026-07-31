"use client";

import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateDonor } from "@/hooks/useDonors";
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
  name: z.string().min(1, "Name is required").max(200),
  type: z.enum(["individual", "family", "corporate"]),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewDonorPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.orgId as string;
  const mutation = useCreateDonor(orgId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "individual",
      phone: "",
      email: "",
      city: "",
      state: "",
      pincode: "",
      tags: "",
      notes: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(
      {
        name: data.name,
        type: data.type,
        phone: data.phone || undefined,
        email: data.email || undefined,
        address: {
          city: data.city || undefined,
          state: data.state || undefined,
          pincode: data.pincode || undefined,
        },
        tags: data.tags
          ? data.tags.split(",").map((t) => t.trim())
          : undefined,
        notes: data.notes || undefined,
      },
      {
        onSuccess: (donor) => {
          toast.success("Donor created");
          router.push(`/donors/${donor._id}`);
        },
        onError: (err: Error) => {
          const axiosError = err as unknown as {
            response?: { data?: { error?: { message?: string } } };
          };
          toast.error(
            axiosError?.response?.data?.error?.message ||
              "Failed to create donor"
          );
        },
      }
    );
  };

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/organisations/${orgId}/donors`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Donors
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add Donor</CardTitle>
          <CardDescription>
            Add a new donor to your organisation.
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
                    <FormLabel>Donor Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Ramesh Patil"
                        {...field}
                      />
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
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="donor@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
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
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="411001" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VIP, Regular, Sponsor (comma separated)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Any additional notes" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full"
              >
                {mutation.isPending ? "Adding..." : "Add Donor"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
