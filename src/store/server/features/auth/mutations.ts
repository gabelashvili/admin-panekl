import { useMutation } from "@tanstack/react-query";
import api from "../../../../utils/axios-config";
import { SignInRequest, SignInResponse } from "./interfaces";

const useSignIn = () => {
    return useMutation({
      mutationFn: async (values: SignInRequest): Promise<SignInResponse> => {
        const { data } = await api.post('auth/login', values)
        return data
      }
    })
}


export { useSignIn }