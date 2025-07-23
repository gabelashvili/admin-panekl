import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button";
import GoogleMapReact from "google-map-react";

interface ListProps {
  data: Array<{
    requestId: string;
    childName: string;
    childPhoneNumber: string;
    parentName: string;
    parentPhoneNumber: string;
    backupPhoneNumber: string;
    requestSource: "Parent Approved" | "Child Direct";
    requestTime: string;
    location: {
      latitude: number;
      longitude: number;
    };
    status: string;
    actions: string[];
    isNew: boolean;
  }>;
  newItems: Array<{
    requestId: string;
    childName: string;
    childPhoneNumber: string;
    parentName: string;
    parentPhoneNumber: string;
    backupPhoneNumber: string;
    requestSource: "Parent Approved" | "Child Direct";
    requestTime: string;
    location: {
      latitude: number;
      longitude: number;
    };
    status: string;
    actions: string[];
    isNew: boolean;
  }>;
}

const AnyReactComponent = ({ text }: { text: string }) => (
  <div className="text-white bg-gray-500 p-2 rounded-full size-14 flex items-center justify-center text-sm">
    {text}
  </div>
);

export default function List({ data, newItems }: ListProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [tableData, setTableData] = useState<ListProps["data"]>([]);
  const [selectedItem, setSelectedItem] = useState<ListProps["data"][0] | null>(
    null
  );

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    if (selectedItem) {
      openModal();
    } else {
      closeModal();
    }
  }, [selectedItem, openModal, closeModal]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              See full detail.
            </p>
          </div>
          <div className="space-y-6 w-full overflow-y-auto max-h-[60vh]">
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                    Children Information
                  </h4>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        First Name
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.childName.split(" ")[0]}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Last Name
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.childName.split(" ")[1]}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Phone
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.childPhoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                    Parent Info
                  </h4>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        First Name
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.parentName.split(" ")[0]}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Last Name
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.parentName.split(" ")[1]}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Phone
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.parentPhoneNumber}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Backup phone
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.backupPhoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                    Location
                  </h4>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Latitude
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.location.latitude}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Longitude
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.location.longitude}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Phone
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.parentName}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Backup phone
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.backupPhoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="w-full mt-6">
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Google Map
                    </p>
                    {selectedItem?.location && (
                      <div className="w-full h-[300px]">
                        <GoogleMapReact
                          bootstrapURLKeys={{
                            key: "AIzaSyB-RZ07fiNIAFp9Mdf3V5Rh8v1Q39Jej-0",
                          }}
                          defaultCenter={{
                            lat: selectedItem?.location.latitude,
                            lng: selectedItem?.location.longitude,
                          }}
                          defaultZoom={8}
                          options={{
                            zoomControl: true,
                            mapTypeControl: true,
                            scaleControl: true,
                            streetViewControl: true,
                            fullscreenControl: true,
                            gestureHandling: "greedy",
                            keyboardShortcuts: true,
                          }}
                        >
                          <AnyReactComponent
                            lat={selectedItem?.location.latitude}
                            lng={selectedItem?.location.longitude}
                            text={`${
                              selectedItem?.childName.split(" ")[0][0]
                            }. ${selectedItem?.childName.split(" ")[1][0]}.`}
                          />
                        </GoogleMapReact>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <div className="overflow-hidden bg-white dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 bg-gray-100 dark:border-white/[0.05] dark:bg-gray-900">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Request ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Child Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Child Phone Number
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Parent Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Parent Phone Number
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Backup Phone Number
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Request Source
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Request Time
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 cursor-pointer dark:divide-white/[0.05] [&>tr]:even:bg-gray-50 dark:[&>tr]:even:bg-gray-900/50 [&>tr]:hover:bg-gray-200 dark:[&>tr]:hover:bg-gray-900">
              {newItems.map((order) => (
                <TableRow
                  key={order.requestId}
                  className={`${
                    order.isNew &&
                    dayjs(order.requestTime).diff(dayjs(), "second") < 5
                      ? "animate-[highlight_2s_ease-in-out_5]"
                      : ""
                  }`}
                >
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.requestId}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.childName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.childPhoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.parentName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.parentPhoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.backupPhoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.requestSource}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {dayjs(order.requestTime).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        order.status === "Acknowledged"
                          ? "warning"
                          : order.status === "Approved"
                          ? "info"
                          : order.status === "Completed"
                          ? "success"
                          : order.status === "Rejected by Parent"
                          ? "error"
                          : "warning"
                      }
                    >
                      {order.status === "Rejected by Parent"
                        ? "Rejected"
                        : order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    <Button
                      className="min-w-max"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(order)}
                    >
                      View Full
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {tableData.map((order) => (
                <TableRow
                  key={order.requestId}
                  className={`${
                    order.isNew &&
                    dayjs(order.requestTime).diff(dayjs(), "second") < 5
                      ? "animate-[highlight_2s_ease-in-out_5]"
                      : ""
                  }`}
                >
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.requestId}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.childName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.childPhoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.parentName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.parentPhoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.backupPhoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {order.requestSource}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {dayjs(order.requestTime).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        order.status === "Acknowledged"
                          ? "warning"
                          : order.status === "Approved"
                          ? "info"
                          : order.status === "Completed"
                          ? "success"
                          : order.status === "Rejected by Parent"
                          ? "error"
                          : "warning"
                      }
                    >
                      {order.status === "Rejected by Parent"
                        ? "Rejected"
                        : order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    <Button
                      className="min-w-max"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(order)}
                    >
                      View Full
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
