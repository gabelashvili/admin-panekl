import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios-config";
import {
  FeedbacksFilters,
  FeedbacksResponse,
  FeedbackSummaryFilters,
  FeedbackSummaryResponse,
} from "./interfaces";

const buildSearchParams = (filters: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (!value && value !== 0) return;
    searchParams.set(key, typeof value === "string" ? value : value.toString());
  });
  return searchParams.toString();
};

export const useFeedbackSummaryQuery = (filters: FeedbackSummaryFilters) => {
  return useQuery({
    queryKey: ["feedback-summary", filters],
    queryFn: async (): Promise<FeedbackSummaryResponse> => {
      const qs = buildSearchParams(filters);
      const { data } = await api.get(`feedback/summary?${qs}`);
      return data;
    },
  });
};

export const useFeedbacksQuery = (filters: FeedbacksFilters) => {
  return useQuery({
    queryKey: ["feedbacks", filters],
    queryFn: async (): Promise<FeedbacksResponse> => {
      const qs = buildSearchParams(filters);
      const { data } = await api.get(`feedback?${qs}`);
      return data;
    },
  });
};
