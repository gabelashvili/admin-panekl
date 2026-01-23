import type React from "react";
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
import { UsersListResponseModel } from "../store/server/requets/interfaces";
import Input from "../components/form/input/InputField";
import dayjs from "dayjs";

const UsersList = () => {
  const CollapsibleSection = ({
    title,
    children,
    defaultOpen = false,
  }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900/60 shadow-sm">
        <button
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="font-medium text-gray-900 dark:text-white">{title}</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {open ? "ჩაკეცვა" : "გახსნა"}
          </span>
        </button>
        {open && <div className="p-4">{children}</div>}
      </div>
    );
  };

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [detailModal, setDetailModal] = useState<{
    title: string;
    rows: { label: string; value: string | number | React.ReactNode }[];
    children?: UsersListResponseModel["children"];
    campaign?: UsersListResponseModel["attribution"] | null;
    deviceInfo?: UsersListResponseModel["deviceInfo"] | null;
  } | null>(null);

  const { data: allData } = useUsersListQuery({
    Page: page + 1,
    PageSize: 10,
    SearchTerm: search || null,
  });
  

  return (
    <>
      <Modal
        isOpen={!!detailModal}
        onClose={() => setDetailModal(null)}
        className="max-w-3xl mx-auto"
        showCloseButton={false}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{detailModal?.title}</h3>
            </div>
            <button
              className="rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 text-sm"
              onClick={() => setDetailModal(null)}
            >
              დახურვა
            </button>
          </div>

          {detailModal && (
            <div className="space-y-4  max-h-[80vh] overflow-y-auto">
              <CollapsibleSection title="მშობლის ინფორმაცია">
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  {detailModal.rows
                    .filter((row) =>
                      [
                        "ტელეფონი",
                        "სარეზერვო ტელეფონი",
                        "ელ.ფოსტა",
                        "პირადი ნომერი",
                        "რეგისტრაცია",
                        "კამპანია",
                        "პაკეტი",
                        "სტატუსი",
                        "ტიპი",
                      ].includes(row.label)
                    )
                    .map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-300">{row.label}</span>
                        <span className="font-medium text-gray-900 dark:text-white text-right">{row.value}</span>
                      </div>
                    ))}
                </div>
              </CollapsibleSection>

              {detailModal.campaign && (
                <CollapsibleSection title="კამპანია">
                  <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                    {Object.entries(detailModal.campaign).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-300">{key}</span>
                        <span className="font-medium text-gray-900 dark:text-white text-right">{String(value ?? "—")}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              {detailModal?.deviceInfo && (
                <CollapsibleSection title="მოწყობილობის ინფორმაცია">
                  <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                    {Object.entries(detailModal.deviceInfo).map(([key, value]) => {
                      const labelMap: Record<string, string> = {
                        model: "მოდელი",
                        manufacturer: "მწარმოებელი",
                        systemName: "სისტემის სახელი",
                        systemVersion: "სისტემის ვერსია",
                        deviceId: "მოწყობილობის ID",
                        apiLevel: "API დონე",
                        isTablet: "ტაბლეტი",
                        isEmulator: "ემულატორი",
                        deviceType: "მოწყობილობის ტიპი",
                        screenWidth: "ეკრანის სიგანე",
                        screenHeight: "ეკრანის სიმაღლე",
                        pixelDensity: "პიქსელების სიმკვრივე",
                        fontScale: "ფონტის მასშტაბი",
                      };
                      
                      const displayValue = 
                        typeof value === 'boolean' 
                          ? value ? 'დიახ' : 'არა'
                          : value ?? "—";
                      
                      return (
                        <div
                          key={key}
                          className="flex justify-between gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-300">{labelMap[key] || key}</span>
                          <span className="font-medium text-gray-900 dark:text-white text-right">{String(displayValue)}</span>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleSection>
              )}

              <CollapsibleSection title="გამოძახების სტატისტიკა">
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  {detailModal.rows
                    .filter((row) =>
                      [
                        "ავტომატური თანხმობა",
                        "მშობლის თანხმობა",
                        "უარყოფილი მოთხოვნები",
                      ].includes(row.label)
                    )
                    .map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-300">{row.label}</span>
                        <span className="font-medium text-gray-900 dark:text-white text-right">{row.value}</span>
                      </div>
                    ))}
                </div>
              </CollapsibleSection>

              {detailModal.children && (
                <CollapsibleSection title="შვილები">
                  <div className="grid gap-4">
                    {detailModal.children.map((child) => (
                      <div
                        key={child.id}
                        className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 bg-white dark:bg-gray-900/60 shadow-sm"
                      >
                        <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-200">
                          <div><span className="text-gray-500 dark:text-gray-400">სახელი:</span> <span className="font-medium">{child.name}</span></div>
                          <div><span className="text-gray-500 dark:text-gray-400">პირადი ნომერი:</span> <span className="font-medium">{child.personalNumber}</span></div>
                          <div><span className="text-gray-500 dark:text-gray-400">ტელეფონის ნომერი:</span> <span className="font-medium">{child.phoneNumber}</span></div>
                          <div><span className="text-gray-500 dark:text-gray-400">დაბადების თარიღი:</span> <span className="font-medium">{dayjs(child.birthdate).format('MM/DD/YYYY')}</span></div>
                          <div><span className="text-gray-500 dark:text-gray-400">ასაკი:</span> <span className="font-medium">{dayjs().diff(dayjs(child.birthdate), 'year')}</span></div>
                          <div><span className="text-gray-500 dark:text-gray-400">სქესი:</span> <span className="font-medium">{child.gender === 'Male' ? 'მამრობითი' : 'მდედრობითი'}</span></div>
                          <div><span className="text-gray-500 dark:text-gray-400">გამოძახების სტატისტიკა:</span> <span className="font-medium">{child.numberOfSosRequestsSent}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              )}
            </div>
          )}
        </div>
      </Modal>
      <ComponentCard
        title={"მომხმარებლების სია"}
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
                    რეგისტრაციის თარიღი
                  </TableCell>
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
                    OS
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
                    კამპანია
                    
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                     დეტალები
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 cursor-pointer dark:divide-white/[0.05] [&>tr]:even:bg-gray-50 dark:[&>tr]:even:bg-gray-900/50 [&>tr]:hover:bg-gray-200 dark:[&>tr]:hover:bg-gray-900">
                {allData?.users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {dayjs(user.timeStamp).format('MM/DD/YYYY HH:mm')}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {user.parentName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {user.parentNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {user?.deviceInfo?.systemName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {user.subscriptionStatus === "Active" ? "აქტიური" : "არააქტიური"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {user.attribution?.trackerName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setDetailModal({
                            title: `${user.parentName} - დეტალები`,
                            rows: [
                              { label: "ტელეფონი", value: user.parentNumber },
                              { label: "სარეზერვო ტელეფონი", value: user.secondaryNumber || "—" },
                              { label: "ელ.ფოსტა", value: user.email || "—" },
                              { label: "პირადი ნომერი", value: user.personalNumber },
                              { label: "რეგისტრაცია", value: dayjs(user.timeStamp).format('MM/DD/YYYY HH:mm') },
                              { label: "კამპანია", value: user.attribution?.trackerName || "—" },
                              { label: "პაკეტი", value: user.subscriptionPlan },
                              { label: "სტატუსი", value: user.subscriptionStatus },
                              { label: "ტიპი", value: user.subscriptionType },
                              { label: "ავტომატური თანხმობა", value: user.acceptedSosRequestsByOperator },
                              { label: "მშობლის თანხმობა", value: user.acceptedSosRequestsByParent },
                              { label: "უარყოფილი მოთხოვნები", value: user.rejectedSosRequests },
                            ],
                            children: user.children || [],
                            campaign: user.attribution || null,
                            deviceInfo: user?.deviceInfo || null,
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
