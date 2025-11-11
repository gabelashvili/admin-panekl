import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios-config";
import { PaymentResponseModel } from "./interfaces";


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

