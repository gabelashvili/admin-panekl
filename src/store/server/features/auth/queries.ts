import { useQuery } from "@tanstack/react-query";
import api from "../../../../utils/axios-config";
import { AuthedUserQueryResponse } from "./interfaces";

const useAuthedUserQuery = (enabled?: boolean) => {
    return useQuery({
      queryFn: async (): Promise<AuthedUserQueryResponse> => {
        const { data } = await api.get('user')
        return data
      },
      queryKey: ['authedUserQuery'],
      enabled,
      refetchInterval: false
    })
}


export { useAuthedUserQuery }