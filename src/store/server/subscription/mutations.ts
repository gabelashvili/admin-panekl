import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios-config";

interface ActivateFreeTrialRequest {
  phoneNumbers: string[];
}

const useActivateFreeTrial = () => {
  return useMutation({
    mutationFn: async (values: ActivateFreeTrialRequest): Promise<any> => {
      const { data } = await api.post('subscription/activate-free-trail', values);
      return data;
    }
  });
};

export { useActivateFreeTrial };
export type { ActivateFreeTrialRequest };
