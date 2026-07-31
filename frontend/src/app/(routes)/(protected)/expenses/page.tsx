"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExpensesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/groups");
  }, [router]);

  return (
    <div className="container mx-auto py-10 text-center">
      <p className="text-muted-foreground">Redirecting to Groups...</p>
    </div>
  );
}
