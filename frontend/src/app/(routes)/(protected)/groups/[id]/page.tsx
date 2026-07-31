"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGroup,
  useExpenses,
  useGroupBalances,
  useSimplifiedDebts,
  useSettlements,
  useCreateSettlement,
  type GroupMember,
  type Expense,
  type Balance,
  type SimplifiedDebt,
  type Settlement,
} from "@/hooks/useGroups";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MetricCard,
  DashboardSection,
} from "@/components/dashboard/primitives";
import {
  Users,
  IndianRupee,
  Plus,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.id as string;
  const [activeTab, setActiveTab] = useState("expenses");

  const { data: group, isLoading } = useGroup(groupId);
  const { data: expenses } = useExpenses(groupId);
  const { data: balances } = useGroupBalances(groupId);
  const { data: simplified } = useSimplifiedDebts(groupId);
  const { data: settlements } = useSettlements(groupId);
  const settleMutation = useCreateSettlement();

  const handleSettle = (from: string, to: string, amount: number) => {
    settleMutation.mutate(
      { group: groupId, paidBy: from, paidTo: to, amount },
      {
        onSuccess: () => toast.success("Settlement recorded!"),
        onError: () => toast.error("Failed to record settlement"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-96 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Group not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/groups">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Groups
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          {group.description && (
            <p className="text-muted-foreground mt-1">{group.description}</p>
          )}
        </div>
        <Button asChild>
          <Link href={`/groups/${groupId}/expenses/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Link>
        </Button>
      </div>

      {/* Members */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-muted-foreground">Members:</span>
        <div className="flex -space-x-2">
          {group.members?.slice(0, 8).map((member: GroupMember) => (
            <Avatar key={member.user._id} className="h-8 w-8 border-2 border-background">
              <AvatarFallback className="text-xs">
                {member.user.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <span className="text-sm text-muted-foreground ml-2">
          {group.members?.length || 0} members
        </span>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="settle">Settle Up</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Expenses ({expenses?.data?.length || 0})
            </h2>
            <Button asChild size="sm">
              <Link href={`/groups/${groupId}/expenses/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Link>
            </Button>
          </div>
          {expenses && expenses.data.length > 0 ? (
            <div className="space-y-2">
              {expenses.data.map((expense: Expense) => (
                <Card key={expense._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Paid by {expense.paidBy?.name} &middot;{" "}
                          {new Date(expense.date).toLocaleDateString("en-IN")}
                          {expense.category && ` · ${expense.category}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ₹{parseFloat(String(expense.amount)).toLocaleString("en-IN")}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {expense.splitType}
                        </Badge>
                      </div>
                    </div>
                    {/* Split details */}
                    {expense.splits && expense.splits.length > 0 && (
                      <div className="mt-2 pt-2 border-t flex flex-wrap gap-2">
                        {expense.splits.map((split, i) => (
                          <span
                            key={i}
                            className="text-xs bg-muted px-2 py-1 rounded"
                          >
                            {split.user?.name}: ₹
                            {parseFloat(String(split.amount)).toLocaleString("en-IN")}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No expenses yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Balances Tab */}
        <TabsContent value="balances">
          <h2 className="text-lg font-semibold mb-4">Who Owes Whom</h2>
          {balances && balances.length > 0 ? (
            <div className="space-y-2">
              {balances.map((balance: Balance) => (
                <Card key={balance._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {balance.from?.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{balance.from?.name}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {balance.to?.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{balance.to?.name}</span>
                      </div>
                      <span className="font-bold text-lg text-red-600">
                        ₹{parseFloat(String(balance.amount)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No outstanding balances.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settle Up Tab */}
        <TabsContent value="settle">
          <h2 className="text-lg font-semibold mb-4">Suggested Settlements</h2>
          <p className="text-sm text-muted-foreground mb-4">
            These are the minimum transactions needed to settle all debts.
          </p>
          {simplified && simplified.length > 0 ? (
            <div className="space-y-3">
              {simplified.map((debt: SimplifiedDebt, i: number) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {debt.from?.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{debt.from?.name}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {debt.to?.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{debt.to?.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">
                          ₹{debt.amount.toLocaleString("en-IN")}
                        </span>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleSettle(debt.from._id, debt.to._id, debt.amount)
                          }
                          disabled={settleMutation.isPending}
                        >
                          Settle
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">
                  Everyone is settled up!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <h2 className="text-lg font-semibold mb-4">Settlement History</h2>
          {settlements && settlements.data.length > 0 ? (
            <div className="space-y-2">
              {settlements.data.map((settlement: Settlement) => (
                <Card key={settlement._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {settlement.paidBy?.name} → {settlement.paidTo?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(settlement.createdAt).toLocaleDateString("en-IN")}
                          {settlement.method && ` · ${settlement.method}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ₹{parseFloat(String(settlement.amount)).toLocaleString("en-IN")}
                        </p>
                        <Badge
                          variant={
                            settlement.status === "confirmed"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {settlement.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No settlements yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
