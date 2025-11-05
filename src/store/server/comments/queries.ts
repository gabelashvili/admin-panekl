import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios-config";
import { CommentResponseModel } from "./interfaces";
import commentsTags from "./tags";

const useCommentsQuery = (userId: string) => {
    return useQuery({
      queryKey: [commentsTags.comments, userId],
      queryFn: async (): Promise<CommentResponseModel> => {
        const searchParams = new URLSearchParams();
        searchParams.set('userId', userId);
        searchParams.set('page', "1");
        searchParams.set('pageSize', "100000");
        const { data } = await api.get(`comment?${searchParams.toString()}`)
        return data
      },
    })
}

export { useCommentsQuery }