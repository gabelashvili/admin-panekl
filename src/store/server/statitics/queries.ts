import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../../utils/axios-config";
import { StatisticsResponse } from "./interfaces";



const PAGE_SIZE = 15;

export const useStatisticsQuery = (fromDate: string, toDate: string) =>
  useInfiniteQuery<StatisticsResponse>({
    queryKey: ["statistics", fromDate, toDate],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const searchParams = new URLSearchParams();
      searchParams.set("Page", String(pageParam));
      searchParams.set("PageSize", PAGE_SIZE.toString());
      if(fromDate) {
        searchParams.set("fromDate", fromDate);
      }
      if(toDate) {
        searchParams.set("toDate", toDate);
      }
      const { data } = await api.get(
        `/user/summary?${searchParams.toString()}`
      );

      return data;
    },
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage;
      if (currentPage >= totalPages) return undefined;
      return currentPage + 1;
    },
  });