import { useRef, useState } from "react";
import { useUsersListQuery } from "../store/server/requets/queries";
import Pagination from "../components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import ComponentCard from "../components/common/ComponentCard";
import { Modal } from "../components/ui/modal";
import Button from "../components/ui/button";
import { ChildModel } from "../store/server/requets/interfaces";
import Input from "../components/form/input/InputField";

const UsersList = () => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{
    data: {
      [key: string]: {
        label: string;
        value: string | number;
      };
    };
    title: string;
  } | null>(null);
  const [childrenModal, setChildrenModal] = useState<ChildModel[] | null>(null);

  const { data: allData } = useUsersListQuery({
    Page: page + 1,
    PageSize: 10,
    SearchTerm: search || null,
  });

  return (
    <>
      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        className="max-w-md mx-auto"
      >
        <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">{modal?.title}</h3>

          {modal && (
            <div className="mt-10">
              {Object.keys(modal.data).map((key) => (
                <div className="flex justify-between border-b py-3 px-2 hover:bg-gray-100">
                  <span className="text-gray-600">{modal.data[key].label}</span>
                  <span className="font-medium">{modal.data[key].value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={!!childrenModal}
        onClose={() => setChildrenModal(null)}
        className="max-w-md mx-auto"
      >
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">შვილები</h3>

          <div className="space-y-4">
            <div className="border-b pb-3">
              {childrenModal?.map((child) => (
                <div className="grid grid-cols-1 gap-4" key={child.kidId}>
                  <div>
                    <span className="text-sm text-gray-500">სახელი:</span>
                    <span className="ml-2 font-medium">{child.kidName}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      პირადი ნომერი:
                    </span>
                    <span className="ml-2 font-medium">
                      {child.kidPersonalNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      ტელეფონის ნომერი:
                    </span>
                    <span className="ml-2 font-medium">
                      {child.kidPhoneNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      <ComponentCard
        title={"Test"}
        bodyClassName="sm:p-0"
        renderHeader={() => {
          return (
            <div className="flex items-center gap-2 w-fit pr-6">
              <Input
                placeholder="ძებნა"
                onChange={(e) => {
                  if (timer.current) {
                    clearTimeout(timer.current);
                  }
                  timer.current = setTimeout(() => {
                    setPage(0);
                    setSearch(e.target.value);
                  }, 300);
                }}
              />
            </div>
          );
        }}
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
                    სახელი
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    ტელეფონის ნომერი
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    პირადი ნომერი
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    შვილები
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    გამოძახების სტატისტიკა
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Subscription
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 cursor-pointer dark:divide-white/[0.05] [&>tr]:even:bg-gray-50 dark:[&>tr]:even:bg-gray-900/50 [&>tr]:hover:bg-gray-200 dark:[&>tr]:hover:bg-gray-900">
                {allData?.users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {user.parentName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {user.parentNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {user.personalNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      <Button
                        variant="outline"
                        onClick={() => setChildrenModal(user.kids)}
                      >
                        გახსნა
                      </Button>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setModal({
                            data: {
                              acceptedSosRequestsByOperator: {
                                label: "ავტომატური თანხმობა",
                                value: user.acceptedSosRequestsByOperator,
                              },
                              acceptedSosRequestsByParent: {
                                label: "მშობლის თანხმობა",
                                value: user.acceptedSosRequestsByParent,
                              },
                              rejectedSosRequests: {
                                label: "უარყოფილი მოთხოვნები",
                                value: user.rejectedSosRequests,
                              },
                            },
                            title: "სტატისტიკა",
                          })
                        }
                      >
                        გახსნა
                      </Button>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setModal({
                            data: {
                              subscriptionPlan: {
                                label: "პაკეტი",
                                value: user.subscriptionPlan,
                              },
                              subscriptionStatus: {
                                label: "სტატუსი",
                                value: user.subscriptionStatus,
                              },
                              subscriptionType: {
                                label: "ტიპი",
                                value: user.subscriptionType,
                              },
                            },
                            title: "Subscription",
                          })
                        }
                      >
                        გახსნა
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="border-t rounded-b-2xl py-4 px-6">
          {allData && (
            <Pagination
              totalPages={allData?.totalPages}
              page={page}
              setPage={setPage}
            />
          )}
        </div>
      </ComponentCard>
    </>
  );
};

export default UsersList;
