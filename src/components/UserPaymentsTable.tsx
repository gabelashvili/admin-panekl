import { useTransactionsInfinite } from "../store/server/payments/queries";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";

const UserPaymentsTable = ({ userId }: { userId: string }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactionsInfinite(userId);

  const transactions =
    data?.pages.flatMap((page) => page.transactions) ?? [];

  return (
    <TableRow className="transactions">
      <TableCell colSpan={12}>
        <Table>
          <TableHeader className="border-b border-gray-100 bg-gray-100 text-gray-500 dark:text-gray-400 dark:border-white/[0.05] dark:bg-gray-900">
            <TableRow>
              <TableCell className="px-4">გადახდის თარიღი</TableCell>
              <TableCell>გადახდის ID</TableCell>
              <TableCell>გადახდის ტიპი</TableCell>
              <TableCell>თანხა</TableCell>
              <TableCell>შედეგი</TableCell>
              <TableCell>ბარათის ტიპი</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 cursor-pointer dark:divide-white/[0.05] [&>tr]:even:bg-gray-50 dark:[&>tr]:even:bg-gray-900/50 [&>tr]:hover:bg-gray-200 dark:[&>tr]:hover:bg-gray-900 text-gray-500 dark:text-gray-400">
            {transactions.map((transaction) => (
              <TableRow key={transaction.transactionId}>
                <TableCell className="px-4">
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.transactionId}</TableCell>
                <TableCell>{transaction.description || "N/A"}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.status === "SUCCESS" ? "წარმატებული" : "შეცდომა"}</TableCell>
                <TableCell>{transaction?.card?.cardType || "N/A"}</TableCell>
              </TableRow>
            ))}

            {hasNextPage && (
              <TableRow>
                <TableCell colSpan={12} align="center" className="py-5">
                  <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="max-w-xs mx-auto w-full py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isFetchingNextPage ? "იტვირთება..." : "მეტის ჩატვირთვა"}
                  </button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableCell>
    </TableRow>
  );
};

export default UserPaymentsTable;
