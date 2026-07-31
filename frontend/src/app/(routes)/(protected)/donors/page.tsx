"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrganisations } from "@/hooks/useOrganisations";

export default function DonorsPage() {
  const router = useRouter();
  const { data: orgs } = useOrganisations();

  useEffect(() => {
    if (orgs?.data?.[0]?._id) {
      router.replace(`/organisations/${orgs.data[0]._id}/donors`);
    }
  }, [orgs, router]);

  return (
    <div className="container mx-auto py-10 text-center">
      <p className="text-muted-foreground">Redirecting to donors...</p>
    </div>
  );
}
