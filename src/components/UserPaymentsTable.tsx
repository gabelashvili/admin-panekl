import { useTransactionsInfinite } from "../store/server/payments/queries";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import Button from "./ui/button";
import { Calendar, CreditCard, Hash, FileText, Clock } from "lucide-react";

const UserPaymentsTable = ({ userId }: { userId: string }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactionsInfinite(userId);

  const transactions =
    data?.pages.flatMap((page) => page.transactions) ?? [];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ka-GE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800/30">
      {transactions.length === 0 ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">ტრანზაქციები არ მოიძებნა</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                <TableRow>
                  <TableCell 
                    isHeader
                    className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      თარიღი
                    </div>
                  </TableCell>
                  <TableCell 
                    isHeader
                    className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      ID
                    </div>
                  </TableCell>
                  <TableCell 
                    isHeader
                    className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      ტიპი
                    </div>
                  </TableCell>
                  <TableCell 
                    isHeader
                    className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    align="right"
                  >
                    თანხა
                  </TableCell>
                  <TableCell 
                    isHeader
                    className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    align="center"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <Clock className="h-4 w-4" />
                      Grace Period
                    </div>
                  </TableCell>
                  <TableCell 
                    isHeader
                    className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    align="center"
                  >
                    სტატუსი
                  </TableCell>
                  <TableCell 
                    isHeader
                    className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    align="center"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <CreditCard className="h-4 w-4" />
                      ბარათი
                    </div>
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                {transactions.map((transaction, index) => (
                  <TableRow 
                    key={transaction.transactionId}
                    className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      index % 2 === 0 ? "bg-white dark:bg-gray-800/20" : "bg-gray-50/50 dark:bg-gray-800/30"
                    }`}
                  >
                    <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300 font-mono">
                        {transaction.transactionId}
                      </code>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {transaction.description || (
                        <span className="italic text-gray-400 dark:text-gray-500">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100" align="right">
                      {transaction.amount}₾
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400" align="center">
                      {transaction.gracePeriodEndDate ? new Date(transaction.gracePeriodEndDate).toLocaleDateString("ka-GE") : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3" align="center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          transaction.status === "SUCCESS"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : transaction.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {transaction.status === "SUCCESS"
                          ? "წარმატებული"
                          : transaction.status === "PENDING"
                          ? "მიმდინარე"
                          : "შეცდომა"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400" align="center">
                      {transaction?.card?.cardType ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                          <CreditCard className="h-3 w-3" />
                          {transaction.card.cardType}
                        </span>
                      ) : (
                        <span className="italic text-gray-400 dark:text-gray-500">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {hasNextPage && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 px-4 py-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full sm:w-auto mx-auto flex items-center justify-center gap-2"
              >
                {isFetchingNextPage ? "იტვირთება..." : "მეტის ჩატვირთვა"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserPaymentsTable;
