"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateOrganisation } from "@/hooks/useOrganisations";
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
  type: z.enum(["mandal", "ngo", "trust", "committee", "other"]),
  description: z.string().max(1000).optional(),
  address: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
  }).optional(),
  registrationNumber: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function NewOrganisationPage() {
  const router = useRouter();
  const mutation = useCreateOrganisation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "mandal",
      description: "",
      address: { city: "", state: "", pincode: "" },
      registrationNumber: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data, {
      onSuccess: (org) => {
        toast.success("Organisation created");
        router.push(`/organisations/${org._id}`);
      },
      onError: (err: Error) => {
        const axiosError = err as unknown as { response?: { data?: { error?: string } } };
        toast.error(axiosError?.response?.data?.error || "Failed to create organisation");
      },
    });
  };

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/organisations">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organisations
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create Organisation</CardTitle>
          <CardDescription>
            Set up a new mandal, trust, or committee to manage events and
            donations.
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
                    <FormLabel>Organisation Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Shri Ganpati Utsav Mandal"
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
                        <SelectItem value="mandal">Mandal</SelectItem>
                        <SelectItem value="ngo">NGO</SelectItem>
                        <SelectItem value="trust">Trust</SelectItem>
                        <SelectItem value="committee">Committee</SelectItem>
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
                      <Input placeholder="Brief description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="address.city"
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
                  name="address.state"
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
                  name="address.pincode"
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
                      <Input placeholder="contact@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? "Creating..." : "Create Organisation"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
