import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios-config";
import { RequestResponseModel, RequestsFiltersModel, UsersListFiltersModel, UsersListResponseModel } from "./interfaces";
import requestsTags from "./tags";

const useRequestsQuery = (filters: RequestsFiltersModel) => {
    return useQuery({
      queryKey: [requestsTags.requests, filters],
      queryFn: async (): Promise<RequestResponseModel> => {
        const searchParams = new URLSearchParams()
        Object.keys(filters).forEach(key => {
          const value = filters[key as keyof typeof filters]
          if(!value && value !== 0) return 
          searchParams.set(key, typeof value === 'string' ? value : value.toString())
        })

        const { data } = await api.get(`help?${searchParams.toString()}`)
        return data
      },
      refetchInterval: false
    })
}


const useNewRequestsQuery = () => {
  return useQuery({
    queryKey: ['new-requests'],
    queryFn: async (): Promise<RequestResponseModel> => {
      const { data } = await api.get(`help/active`, {params: {pageSize: 1000}})
      return data
    },
    refetchInterval: 2000,
    refetchIntervalInBackground: true
  })
}


const useUsersListQuery = (filters: UsersListFiltersModel) => {
  return useQuery({
    queryKey: ['users-list', filters],
    queryFn: async (): Promise<UsersListResponseModel> => {
      const searchParams = new URLSearchParams()
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters]
        if(!value && value !== 0) return 
        searchParams.set(key, typeof value === 'string' ? value : value.toString())
      })
      const { data } = await api.get(`user/list?${searchParams.toString()}`)
      return data
    },
    refetchIntervalInBackground: false
  })
}

const useFeedbackSummaryQuery = (filters: FeedbackSummaryFilters) => {
  return useQuery({
    queryKey: ["feedback-summary", filters],
    queryFn: async (): Promise<FeedbackSummaryResponse> => {
      const searchParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        const value = filters[key as keyof typeof filters];
        if (!value && value !== 0) return;
        searchParams.set(key, typeof value === "string" ? value : value.toString());
      });

      const { data } = await api.get(`feedback/summary?${searchParams.toString()}`);
      return data;
    },
  });
};

const useFeedbacksQuery = (filters: FeedbacksFilters) => {
  return useQuery({
    queryKey: ["feedbacks", filters],
    queryFn: async (): Promise<FeedbacksResponse> => {
      const searchParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        const value = filters[key as keyof typeof filters];
        if (!value && value !== 0) return;
        searchParams.set(key, typeof value === "string" ? value : value.toString());
      });

      const { data } = await api.get(`feedback?${searchParams.toString()}`);
      return data;
    },
  });
};


export { useRequestsQuery, useNewRequestsQuery, useUsersListQuery, useFeedbackSummaryQuery, useFeedbacksQuery }


export function useDownloadCSV() {
  return useQuery({
    queryKey: ["help", "csv", "last-month"],
    queryFn: async (): Promise<void> => {
      const { data } = await api.get(`help/download/last-month`)
      return data
    },
    enabled: false, // ⚠️ We’ll trigger it manually
  });
}