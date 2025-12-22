import { useMemo } from "react";
import {
  useFeedbackSummaryQuery,
  useFeedbacksQuery,
} from "../store/server/feedback/queries";

const FeedbackPage = () => {
  // Example filters – adjust as needed
  const summaryFilters = useMemo(
    () => ({
      FromDate: undefined,
      ToDate: undefined,
      Rating: undefined,
      ParentName: undefined,
    }),
    []
  );

  const listFilters = useMemo(
    () => ({
      SortDescending: true,
      FromDate: undefined,
      ToDate: undefined,
      Rating: undefined,
      ParentName: undefined,
      Page: 1,
      PageSize: 20,
    }),
    []
  );

  const summaryQuery = useFeedbackSummaryQuery(summaryFilters);
  const feedbacksQuery = useFeedbacksQuery(listFilters);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Feedback Summary</h1>
        {summaryQuery.isLoading && <p>Loading summary...</p>}
        {summaryQuery.isError && <p>Error loading summary</p>}
        {summaryQuery.data && (
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(summaryQuery.data, null, 2)}
          </pre>
        )}
      </div>

      <div>
        <h1 className="text-xl font-semibold">Feedbacks</h1>
        {feedbacksQuery.isLoading && <p>Loading feedbacks...</p>} 
        {feedbacksQuery.isError && <p>Error loading feedbacks</p>}
        {feedbacksQuery.data && (
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(feedbacksQuery.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage