"use client";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "./getQueryClient";
import React from "react";

interface HydrateProps {
  children: React.ReactNode;
}

export function Hydrate({ children }: HydrateProps) {
  const dehydratedState = dehydrate(getQueryClient());

  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}
