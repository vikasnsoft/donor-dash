"use client";

export default function ExpensesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Expenses</h1>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-muted-foreground">
          Track and manage shared expenses across groups and events.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Coming in Phase 2.3 — Shared Expense Engine
        </p>
      </div>
    </div>
  );
}
