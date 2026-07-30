import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

export interface SearchResult {
  type: "donor" | "event" | "campaign" | "donation" | "group" | "expense";
  id: string;
  title: string;
  subtitle: string;
  path: string;
  updatedAt: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

const searchApi = {
  search: async (query: string, orgId?: string): Promise<SearchResponse> => {
    const params = new URLSearchParams({ q: query });
    if (orgId) params.set("orgId", orgId);
    const response = await apiClient.get(`/search?${params}`);
    return response.data.data;
  },
};

export function useSearch(query: string, orgId?: string) {
  return useQuery({
    queryKey: ["search", query, orgId],
    queryFn: () => searchApi.search(query, orgId),
    enabled: query.length >= 2,
    staleTime: 30000, // Cache for 30 seconds
  });
}
