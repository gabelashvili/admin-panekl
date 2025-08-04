import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios-config";
import { RequestResponseModel, RequestsFiltersModel } from "./interfaces";
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
    })
}


const useNewRequestsQuery = () => {
  return useQuery({
    queryKey: ['new-requests'],
    queryFn: async (): Promise<RequestResponseModel> => {
      const { data } = await api.get(`help/active`)
      return data
    },
    refetchInterval: 2500
  })
}


export { useRequestsQuery, useNewRequestsQuery }