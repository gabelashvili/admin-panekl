import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useFeedbackSummaryQuery, useFeedbacksQuery } from "../store/server/feedback/queries";
import Pagination from "../components/ui/pagination";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import Button from "../components/ui/button";
import DatePicker from "../components/form/date-picker";
import Input from "../components/form/input/InputField";

const ratingOptions = [undefined, 1, 2, 3, 4, 5] as const;

const FeedbackPage = () => {

  const [page, setPage] = useState(1);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [parentName, setParentName] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    from: string | null;
    to: string | null;
  }>(() => {
    const to = dayjs().endOf("day").toISOString();
    const from = dayjs().subtract(30, "day").startOf("day").toISOString();
    return { from, to };
  });

  const sharedFilters = useMemo(
    () => ({
      FromDate: dateRange.from || undefined,
      ToDate: dateRange.to || undefined,
      Rating: rating,
      ParentName: parentName || undefined,
    }),
    [dateRange, rating, parentName]
  );

  const listFilters = useMemo(
    () => ({
      ...sharedFilters,
      SortDescending: true,
      Page: page,
      PageSize: 10,
    }),
    [sharedFilters, page]
  );

  const summaryQuery = useFeedbackSummaryQuery(sharedFilters);
  const feedbacksQuery = useFeedbacksQuery(listFilters);

  const onDateChange = (selected: Date[]) => {
    if (selected.length === 2) {
      setDateRange({
        from: dayjs(selected[0]).startOf("day").toISOString(),
        to: dayjs(selected[1]).endOf("day").toISOString(),
      });
      setPage(1);
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5 text-yellow-500">
        {Array.from({ length: 5 }).map((_, idx) => (
          <span key={idx}>{idx < count ? "★" : "☆"}</span>
        ))}
      </div>
    );
  };

  // if (user?.userType !== "CompanyAdmin") {
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-xl font-semibold text-gray-800 dark:text-white">გადმოსახედები</h1>
  //       <p className="mt-2 text-gray-600 dark:text-gray-300">ამ გვერდზე წვდომა მხოლოდ Company Admin მომხმარებლებს აქვთ.</p>
  //     </div>
  //   );
  // }

  const summary = summaryQuery.data;
  const feedbacks = feedbacksQuery.data?.feedbacks ?? [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Feedback</h1>

      {/* Summary widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-100">Average Rating</p>
          {summaryQuery.isLoading ? (
            <p className="text-lg font-semibold mt-1">Loading...</p>
          ) : summary ? (
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold dark:text-white">{summary.averageRating?.toFixed(1) ?? "-"}</span>
              <span className="text-sm text-gray-500 dark:text-gray-100">/ 5</span>
            </div>
          ) : (
            <p className="text-lg font-semibold mt-1">-</p>
          )}
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-100">Total Feedbacks</p>
          {summaryQuery.isLoading ? (
            <p className="text-2xl font-bold mt-1">Loading...</p>
          ) : (
            <p className="text-2xl font-bold mt-1 dark:text-white">{summary?.totalFeedbacks ?? "-"}</p>
          )}
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Rating Distribution</p>
          {summaryQuery.isLoading && <p>Loading...</p>}
          {!summaryQuery.isLoading && summary?.ratingDistribution?.length ? (
            <div className="space-y-1">
              {summary.ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="w-8 text-sm text-gray-600 dark:text-gray-300">{item.rating}★</span>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-right text-sm text-gray-600 dark:text-gray-300">
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No data</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="w-full md:w-1/3">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Date Range (last 30 days by default)</p>
            <DatePicker
              id="feedback-date-range"
              placeholder="Select date range"
              mode="range"
              defaultDate={[dayjs(dateRange.from).toDate(), dayjs(dateRange.to).toDate()]}
              onChange={(dates) => onDateChange(dates as Date[])}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {ratingOptions.map((opt) => (
              <Button
                key={opt ?? "all"}
                size="sm"
                variant={rating === opt ? "primary" : "outline"}
                className="min-w-[60px]"
                onClick={() => {
                  setRating(opt);
                  setPage(1);
                }}
              >
                {opt ? `${opt}★` : "All"}
              </Button>
            ))}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Search by parent name</p>
            <Input
              type="text"
              id="parent-name-search"
              placeholder="Search by parent name"
              className="w-full input"
              rootClassName="w-full"
              value={parentName}
              onChange={(e) => {
                setParentName(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 bg-gray-100 dark:border-white/[0.05] dark:bg-gray-900">
              <TableRow>
                <TableCell isHeader className="text-start px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400">Rating</TableCell>
                <TableCell isHeader className="text-center px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400">Comment</TableCell>
                <TableCell isHeader className="text-center px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400">Parent Name</TableCell>
                <TableCell isHeader className="text-center px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400">Parent Phone</TableCell>
                <TableCell isHeader className="text-center px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400">SOS Request ID</TableCell>
                <TableCell isHeader className="text-center px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400">Date &amp; Time</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {feedbacksQuery.isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    Loading feedbacks...
                  </TableCell>
                </TableRow>
              )}
              {!feedbacksQuery.isLoading && feedbacks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No feedbacks found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
              {feedbacks.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                  <TableCell className="text-center px-4 py-3">{renderStars(item.rating)}</TableCell>
                  <TableCell className="text-center px-4 py-3">
                    <CommentPreview text={item.comment} />
                  </TableCell>
                  <TableCell className="text-center px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-200">{item.parentName}</TableCell>
                  <TableCell className="text-center px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-200">{item.parentPhoneNumber}</TableCell>
                  <TableCell className="text-center px-4 py-3 text-theme-sm  text-gray-700 dark:text-gray-200">
                      {item.helpRequestId}
                  </TableCell>
                  <TableCell className="text-center px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-200">
                    {dayjs(item.timestamp).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {feedbacksQuery.data && (
          <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-4">
            <Pagination
              totalPages={feedbacksQuery.data.totalPages}
              page={feedbacksQuery.data.currentPage - 1}
              setPage={(p) => setPage(p + 1)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const CommentPreview = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 120;
  const preview = isLong ? `${text.slice(0, 120)}...` : text;

  return (
    <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
      <p className="leading-relaxed">{expanded ? text : preview}</p>
      {isLong && (
        <button
          type="button"
          className="text-xs text-blue-600 dark:text-blue-400 font-medium"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default FeedbackPage;