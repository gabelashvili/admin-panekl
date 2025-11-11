import ComponentCard from "../components/common/ComponentCard"
import Pagination from "../components/ui/pagination"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table"
import { usePaymentsQuery } from "../store/server/payments/queries"
import { useState } from "react"

const PaymentPage = () => {
    const [page, setPage] = useState(0);
    const { data: payments } = usePaymentsQuery({
        Page: page + 1,
        PageSize: 10,
    })
  
  console.log(payments)
  return (
    <ComponentCard
    title={"გადახდების სია"}
    bodyClassName="sm:p-0"
  >
    <div className="overflow-hidden bg-white dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 bg-gray-100 dark:border-white/[0.05] dark:bg-gray-900">
            <TableRow>
              <TableCell
                isHeader
                className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
              >
                მომხმარებელი
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
              >
                გამოწერის გეგმა
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
              >
                გამოწერის ტიპი
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
              >
                გამოწერის სტატუსი
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
              >
                პერიოდი
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
              >
                ბოლო გადახდა (თანხა)
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
              >
                ბოლო გადახდა (სტატუსი)
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
              >
                ბარათის ტიპი
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
              >
                გადაუხდელია
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 cursor-pointer dark:divide-white/[0.05] [&>tr]:even:bg-gray-50 dark:[&>tr]:even:bg-gray-900/50 [&>tr]:hover:bg-gray-200 dark:[&>tr]:hover:bg-gray-900">
            {payments?.users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {user.userName}
                </TableCell>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {user.subscription?.plan?.name.split(" ")[0]} {' '} შვილი
                </TableCell>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {user.subscription?.plan?.type === "Monthly" ? "თვიური" : "წლიური"}
                </TableCell>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {user.subscription?.status === "Active" ? "აქტიური" : "არაქტიური"}
                </TableCell>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {user.subscription
                    ? `${new Date(user.subscription.startDate).toLocaleDateString()} - ${new Date(user.subscription.endDate).toLocaleDateString()}`
                    : "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {user.lastPayment ? `${user.lastPayment.amount}₾` : "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {user.lastPayment ? user.lastPayment.status === "SUCCESS" ? "წარმატებული" : "შეცდომა" : "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {user.subscription?.card?.cardType ?? user.lastPayment?.card?.cardType ?? "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {user.hasPaymentRequired ? "დიახ" : "არა"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    <div className="border-t rounded-b-2xl py-4 px-6">
      {payments && (
        <Pagination
          totalPages={payments?.totalPages}
          page={page}
          setPage={setPage}
        />
      )}
    </div>
  </ComponentCard>
  )
}

export default PaymentPage