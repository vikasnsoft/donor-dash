import { QueryClient } from "@tanstack/react-query";

export const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: false,
      },
    },
  });
