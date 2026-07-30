import { PublicLayout } from "@/layouts/publicLayout";
import React from "react";

export default function PublicLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
