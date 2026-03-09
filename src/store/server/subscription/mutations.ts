import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios-config";

interface ActivateFreeTrialRequest {
  phoneNumbers: string[];
}

interface CancelSubscriptionRequest {
  phoneNumber: string;
}

const useActivateFreeTrial = () => {
  return useMutation({
    mutationFn: async (values: ActivateFreeTrialRequest): Promise<any> => {
      const { data } = await api.post('subscription/activate-free-trail', values);
      return data;
    }
  });
};

const useCancelSubscription = () => {
  return useMutation({
    mutationFn: async (values: CancelSubscriptionRequest): Promise<any> => {
      const { data } = await api.post("admin/subscription/cancel", values);
      return data;
    },
  });
};

export { useActivateFreeTrial, useCancelSubscription };
export type { ActivateFreeTrialRequest, CancelSubscriptionRequest };
