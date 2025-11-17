import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios-config";
import { PaymentResponseModel, TransactionsResponseModel } from "./interfaces";


export const usePaymentsQuery = (filters: { 
  Page: number | null;
  PageSize: number | null;
}) => {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: async (): Promise<PaymentResponseModel> => {
      const searchParams = new URLSearchParams()
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters]
        if(!value && value !== 0) return 
        searchParams.set(key, typeof value === 'string' ? value : value.toString())
      })
      const { data } = await api.get(`payment/list?${searchParams.toString()}`)
      return data
    },
    refetchInterval: false,
  })
}


export const useTransactionsQuery = (userId: string, filters: { 
  Page: number | null;
  PageSize: number | null;
}) => {
  return useQuery({
    queryKey: ['user-transactions', filters],
    queryFn: async (): Promise<TransactionsResponseModel> => {
      const searchParams = new URLSearchParams()
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters]
        if(!value && value !== 0) return 
        searchParams.set(key, typeof value === 'string' ? value : value.toString())
      })
      searchParams.set('UserId', userId)
      const { data } = await api.get(`payment/user-transactions?${searchParams.toString()}`)
      return data
    },
    refetchInterval: false,
  })
}




export const useTransactionsInfinite = (userId: string) =>
  useInfiniteQuery<TransactionsResponseModel>({
    queryKey: ["transactions", userId],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const searchParams = new URLSearchParams();
      searchParams.set("Page", String(pageParam));
      searchParams.set("PageSize", "10");
      searchParams.set("UserId", userId);
      const { data } = await api.get(
        `/payment/user-transactions?${searchParams.toString()}`
      );

      return data;
    },
    getNextPageParam: (lastPage) => {
      const { page } = lastPage;
      return page + 1;
    },
  });