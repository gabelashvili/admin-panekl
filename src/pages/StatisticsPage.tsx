import ComponentCard from "../components/common/ComponentCard";
import DatePicker from "../components/form/date-picker";
import Button from "../components/ui/button";
import { useSearchParams } from "react-router";
import { useStatisticsQuery } from "../store/server/statitics/queries";
import { GroupIcon, BoxCubeIcon, PieChartIcon } from "../icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import dayjs from "dayjs";

import "dayjs/locale/ka";

function toWholeLocalDayRange(date: Date): [string, string] {
  // Use local date parts
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Start of local day
  const localStart = new Date(year, month, day, 0, 0, 0, 0);
  // End of local day
  const localEnd = new Date(year, month, day, 23, 59, 59, 999);

  // Return as UTC ISO strings
  return [localStart.toISOString(), localEnd.toISOString()];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return dayjs(date).locale("ka").format("MMMM DD,  YYYY");
  return date.toLocaleDateString("ka-GE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const StatisticsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useStatisticsQuery(
      searchParams.get("fromDate") || "",
      searchParams.get("toDate") || ""
    );

  // Flatten all daily stats from all pages
  const dailyStats = data?.pages.flatMap((page) => page.dailyStats || []) ?? [];

  const isSelected = (startDate: string, endDate: string) => {
    return (
      searchParams.get("fromDate") === startDate &&
      searchParams.get("toDate") === endDate
    );
  };

  return (
    <ComponentCard
      title={"გადახდების სია"}
      renderHeader={() => (
        <div className="flex items-center gap-2 justify-between py-4 px-6">
          <div className="w-fit">
            <DatePicker
              id="statistics-date-picker"
              placeholder={"აირჩიეთ თარიღები"}
              mode="range"
              onChange={(dates) => {
                if (!dates || !dates[0]) return;
                const [startDate, endDate] = dates;
                const [fromDateIso] = toWholeLocalDayRange(startDate);
                const [, toDateIso] = toWholeLocalDayRange(
                  endDate ?? startDate
                );

                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set("fromDate", fromDateIso);
                newSearchParams.set("toDate", toDateIso);

                setSearchParams(newSearchParams);
              }}
              inputClassName="w-64"
              defaultDate={
                [
                  (searchParams.get("fromDate") || undefined) as any,
                  (searchParams.get("toDate") || undefined) as any,
                ] as any
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={
                isSelected(
                  toWholeLocalDayRange(new Date())[0],
                  toWholeLocalDayRange(new Date())[1]
                )
                  ? "primary"
                  : "outline"
              }
              onClick={() => {
                const today = new Date();
                const [startDate, endDate] = toWholeLocalDayRange(today);
                setSearchParams({ fromDate: startDate, toDate: endDate });
              }}
            >
              დღეს
            </Button>
            <Button
              variant={
                isSelected(
                  toWholeLocalDayRange(
                    new Date(new Date().setDate(new Date().getDate() - 1))
                  )[0],
                  toWholeLocalDayRange(
                    new Date(new Date().setDate(new Date().getDate() - 1))
                  )[1]
                )
                  ? "primary"
                  : "outline"
              }
              onClick={() => {
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const [startDate, endDate] = toWholeLocalDayRange(yesterday);
                setSearchParams({ fromDate: startDate, toDate: endDate });
              }}
            >
              გუშინ
            </Button>
            <Button
              variant={
                isSelected(
                  toWholeLocalDayRange(
                    new Date(new Date().setDate(new Date().getDate() - 6))
                  )[0],
                  toWholeLocalDayRange(new Date())[1]
                )
                  ? "primary"
                  : "outline"
              }
              onClick={() => {
                const endRange = new Date();
                const startRange = new Date(endRange);
                startRange.setDate(startRange.getDate() - 6);
                setSearchParams({
                  fromDate: toWholeLocalDayRange(startRange)[0],
                  toDate: toWholeLocalDayRange(endRange)[1],
                });
              }}
            >
              ბოლო 7 დღის
            </Button>
            <Button
              variant={isSelected("", "") ? "primary" : "outline"}
              onClick={() => {
                setSearchParams({ fromDate: "", toDate: "" });
              }}
            >
              ყველა
            </Button>
          </div>
        </div>
      )}
    >
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {/* Registered Users Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                რეგისტრირებული მომხმარებლები
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {data?.pages[0]?.totalRegisteredUsers?.toLocaleString() || 0}
              </h4>
            </div>
          </div>

          {/* Active Subscriptions Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <BoxCubeIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                აქტიური გამოწერები
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {data?.pages[0]?.activeSubscriptions?.toLocaleString() || 0}
              </h4>
            </div>
          </div>

          {/* Conversion Rate Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <PieChartIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                კონვერტაციის მაჩვენებელი
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {data?.pages[0]?.conversionRate?.toFixed(2) || 0}%
              </h4>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden bg-white rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 bg-gray-100 dark:border-white/[0.05] dark:bg-gray-900">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    თარიღი
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-center px-5 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                    align="center"
                  >
                    რეგისტრაციები
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-center px-5 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                    align="center"
                  >
                    გამოწერები
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-center px-5 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                    align="center"
                  >
                    კონვერტაციის მაჩვენებელი
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] [&>tr]:even:bg-gray-50 dark:[&>tr]:even:bg-gray-900/50 [&>tr]:hover:bg-gray-100 dark:[&>tr]:hover:bg-gray-900">
                {dailyStats.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      className="px-5 py-8 text-gray-500 text-theme-sm dark:text-gray-400"
                    >
                      მონაცემები ვერ მოიძებნა
                    </TableCell>
                  </TableRow>
                ) : (
                  dailyStats.map((stat, index) => (
                    <>
                      <TableRow key={`${stat.date}-${index}`}>
                        <TableCell className="px-5 py-3">
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {formatDate(stat.date)}
                          </p>
                        </TableCell>
                        <TableCell align="center" className="px-5 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                          {stat.registrations.toLocaleString()}
                        </TableCell>
                        <TableCell align="center" className="px-5 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                          {stat.subscriptions.toLocaleString()}
                        </TableCell>
                        <TableCell align="center" className="px-5 py-3">
                          <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {stat.conversionRate.toFixed(2)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    </>
                  ))
                )}
                {hasNextPage && (
                  <TableRow>
                    <TableCell colSpan={12} align="center" className="py-2">
                      <button
                        type="button"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="max-w-xs mx-auto w-full py-2 text-sm rounded-md font-semibold  disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isFetchingNextPage
                          ? "იტვირთება..."
                          : "მეტის ჩატვირთვა"}
                      </button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default StatisticsPage;
