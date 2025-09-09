import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios-config";

const useRequestStatusChange = () => {
    return useMutation({
      mutationFn: async (values: {helpRequestId: string, accepted: boolean}): Promise<any> => {
        const { data } = await api.post('help/respond', values)
        return data
      }
    })
}

const useRequestStatusComplete = () => {
  return useMutation({
    mutationFn: async (helpRequestId: string): Promise<any> => {
      const { data } = await api.post('help/complete', {helpRequestId})
      return data
    }
  })
}



export { useRequestStatusChange, useRequestStatusComplete }