"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRecordDonation } from "@/hooks/useDonations";
import { useDonorSearch, useCreateDonor } from "@/hooks/useDonors";
import { useEvent } from "@/hooks/useEvents";
import { useCampaignSummaries } from "@/hooks/useDashboard";
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
import { ArrowLeft, Search, Plus, Check } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  donorId: z.string().min(1, "Select or create a donor"),
  amount: z.number().positive("Amount must be positive"),
  method: z.enum(["cash", "upi", "bank_transfer", "cheque", "online", "qr"]),
  campaignId: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function RecordDonationPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [donorSearch, setDonorSearch] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<{
    _id: string;
    name: string;
  } | null>(null);
  const [showNewDonor, setShowNewDonor] = useState(false);
  const [newDonorName, setNewDonorName] = useState("");
  const [newDonorPhone, setNewDonorPhone] = useState("");

  const { data: event } = useEvent(eventId);
  const { data: campaigns } = useCampaignSummaries(eventId);
  const { data: searchResults } = useDonorSearch(
    event?.organisation || "",
    donorSearch
  );
  const recordMutation = useRecordDonation();
  const createDonorMutation = useCreateDonor(event?.organisation || "");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      donorId: "",
      amount: 0,
      method: "cash",
      campaignId: "",
      reference: "",
      notes: "",
    },
  });

  const handleSelectDonor = (donor: { _id: string; name: string }) => {
    setSelectedDonor(donor);
    form.setValue("donorId", donor._id);
    setDonorSearch("");
  };

  const handleCreateNewDonor = async () => {
    if (!newDonorName.trim()) return;

    try {
      const donor = await createDonorMutation.mutateAsync({
        name: newDonorName,
        phone: newDonorPhone || undefined,
        type: "individual",
      });
      setSelectedDonor(donor);
      form.setValue("donorId", donor._id);
      setShowNewDonor(false);
      setNewDonorName("");
      setNewDonorPhone("");
      toast.success("Donor created");
    } catch (err) {
      toast.error("Failed to create donor");
    }
  };

  const onSubmit = (data: FormValues) => {
    recordMutation.mutate(
      {
        eventId,
        donorId: data.donorId,
        amount: data.amount,
        method: data.method,
        campaignId: data.campaignId || undefined,
        reference: data.reference || undefined,
        notes: data.notes || undefined,
      },
      {
        onSuccess: (donation) => {
          toast.success(
            `Donation recorded! Receipt: ${donation.receiptNumber}`
          );
          router.push(`/donations/${donation._id}`);
        },
        onError: (err: Error) => {
          const axiosError = err as unknown as {
            response?: { data?: { error?: { message?: string } } };
          };
          toast.error(
            axiosError?.response?.data?.error?.message ||
              "Failed to record donation"
          );
        },
      }
    );
  };

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/events/${eventId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Event
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Record Donation</CardTitle>
          <CardDescription>
            {event?.name && `Recording donation for ${event.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Donor Selection */}
              <div>
                <FormLabel>Donor *</FormLabel>
                {selectedDonor ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg mt-1">
                    <div>
                      <p className="font-medium">{selectedDonor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Selected
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDonor(null);
                        form.setValue("donorId", "");
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="mt-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search donors by name, phone, or email..."
                        value={donorSearch}
                        onChange={(e) => setDonorSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Search Results */}
                    {searchResults && searchResults.data.length > 0 && (
                      <div className="mt-1 border rounded-lg max-h-48 overflow-y-auto">
                        {searchResults.data.map((donor) => (
                          <button
                            key={donor._id}
                            type="button"
                            onClick={() =>
                              handleSelectDonor({
                                _id: donor._id,
                                name: donor.name,
                              })
                            }
                            className="flex items-center justify-between w-full p-3 hover:bg-accent transition-colors text-left"
                          >
                            <div>
                              <p className="font-medium">{donor.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {donor.phone || donor.email || "No contact"}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Create New Donor */}
                    {donorSearch.length >= 2 &&
                      (!searchResults ||
                        searchResults.data.length === 0) && (
                        <div className="mt-2">
                          {!showNewDonor ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setShowNewDonor(true);
                                setNewDonorName(donorSearch);
                              }}
                            >
                              <Plus className="mr-2 h-3 w-3" />
                              Create &quot;{donorSearch}&quot; as new donor
                            </Button>
                          ) : (
                            <Card className="p-3">
                              <div className="space-y-2">
                                <Input
                                  placeholder="Donor name"
                                  value={newDonorName}
                                  onChange={(e) =>
                                    setNewDonorName(e.target.value)
                                  }
                                />
                                <Input
                                  placeholder="Phone (optional)"
                                  value={newDonorPhone}
                                  onChange={(e) =>
                                    setNewDonorPhone(e.target.value)
                                  }
                                />
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleCreateNewDonor}
                                    disabled={
                                      !newDonorName.trim() ||
                                      createDonorMutation.isPending
                                    }
                                  >
                                    <Check className="mr-2 h-3 w-3" />
                                    {createDonorMutation.isPending
                                      ? "Creating..."
                                      : "Create Donor"}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowNewDonor(false)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          )}
                        </div>
                      )}
                  </div>
                )}
                <FormMessage>
                  {form.formState.errors.donorId?.message}
                </FormMessage>
              </div>

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₹) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="500"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method *</FormLabel>
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
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank_transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="qr">QR Code</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campaign (optional) */}
              {campaigns && campaigns.length > 0 && (
                <FormField
                  control={form.control}
                  name="campaignId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign (optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select campaign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {campaigns.map((campaign) => (
                            <SelectItem
                              key={campaign._id}
                              value={campaign._id}
                            >
                              {campaign.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}

              {/* Reference */}
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference / Transaction ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="UPI ref, cheque no, etc."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Any additional notes"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={recordMutation.isPending || !selectedDonor}
                className="w-full"
              >
                {recordMutation.isPending
                  ? "Recording..."
                  : "Record Donation"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
