import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../utils/axios-config";
import { CreateCommentModel } from "./interfaces";
import commentsTags from "./tags";


const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async (values: CreateCommentModel): Promise<any> => {
        const { data } = await api.post('comment', values)
        return data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [commentsTags.comments] });
      },
    })
}

export { useCreateComment }