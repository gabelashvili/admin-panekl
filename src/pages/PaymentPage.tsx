import ComponentCard from "../components/common/ComponentCard";
import Pagination from "../components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import UserPaymentsTable from "../components/UserPaymentsTable";
import { usePaymentsQuery } from "../store/server/payments/queries";
import { useState } from "react";
import Button from "../components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const PaymentPage = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const { data: payments } = usePaymentsQuery({
    Page: page + 1,
    PageSize: 10,
  });

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ComponentCard title={"გადახდების სია"} bodyClassName="sm:p-0">
      <div className="overflow-hidden bg-white dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 bg-gray-100 dark:border-white/[0.05] dark:bg-gray-900">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  მომხმარებელი
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  align="center"
                >
                  გამოწერის გეგმა
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  align="center"
                >
                  სტატუსი
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  align="center"
                >
                  ბოლო გადახდა
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  align="center"
                >
                  დავალიანება
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  align="center"
                >
                  გადაუხდელია
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  align="center"
                >
                  მოქმედებები
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {payments?.users.map((user) => (
                <>
                  <TableRow
                    key={user.userId}
                    className="even:bg-gray-50 dark:even:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {user.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400" align="center">
                      {user.subscription?.plan?.name.split(" ")[0]} შვილი
                      <span className="ml-2 text-xs">
                        ({user.subscription?.plan?.type === "Monthly" ? "თვიური" : "წლიური"})
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400" align="center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.subscription?.status === "Active" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}>
                        {user.subscription?.status === "Active" ? "აქტიური" : "არააქტიური"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400" align="center">
                      {user.lastPayment ? `${user.lastPayment.amount}₾` : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400" align="center">
                      <span className={user.totalOwed > 0 ? "font-semibold text-red-600 dark:text-red-400" : ""}>
                        {user.totalOwed}₾
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400" align="center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.hasPaymentRequired 
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" 
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}>
                        {user.hasPaymentRequired ? "დიახ" : "არა"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm" align="center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleExpanded(user.userId)}
                        className="flex items-center gap-1"
                      >
                        დეტალები
                        {expandedId === user.userId ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedId === user.userId && (
                    <TableRow className="bg-gray-50 dark:bg-gray-900/30">
                      <TableCell colSpan={7} className="px-4 py-6">
                        <div className="space-y-6">
                          {/* Detailed Information Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">გამოწერის ტიპი</h4>
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                {user.subscription?.plan?.type === "Monthly" ? "თვიური" : "წლიური"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">პერიოდი</h4>
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                {user.subscription
                                  ? `${new Date(user.subscription.startDate).toLocaleDateString()} - ${new Date(user.subscription.endDate).toLocaleDateString()}`
                                  : "-"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">შემდეგი გადახდის თარიღი</h4>
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                {user.subscription?.endDate ? new Date(user.subscription.endDate).toLocaleDateString() : "-"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">ბოლოს წარუმატებელი გადახდა</h4>
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                {user.paymentRequiredTransactions?.length > 0 
                                  ? new Date(user.paymentRequiredTransactions[0]!.timestamp!).toLocaleDateString() 
                                  : "-"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">ბოლო გადახდის სტატუსი</h4>
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                {user.lastPayment ? (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    user.lastPayment.status === "SUCCESS"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  }`}>
                                    {user.lastPayment.status === "SUCCESS" ? "წარმატებული" : "შეცდომა"}
                                  </span>
                                ) : "-"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">ბარათის ტიპი</h4>
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                {user.subscription?.card?.cardType ?? user.lastPayment?.card?.cardType ?? "-"}
                              </p>
                            </div>
                          </div>

                          {/* Payment History */}
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">გადახდების ისტორია</h3>
                            <UserPaymentsTable userId={user.userId} />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
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
  );
};

export default PaymentPage;
