import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button";
import GoogleMapReact from "google-map-react";
import { useTranslation } from "react-i18next";
import { RequestResponseModel } from "../../store/server/requets/interfaces";

interface ListProps {
  data: RequestResponseModel['helpRequests'];
  activeItems: RequestResponseModel['helpRequests'];
  pending: boolean;
}

const AnyReactComponent = ({ text }: { text: string }) => (
  <div className="text-white bg-gray-500 p-2 rounded-full size-14 flex items-center justify-center text-sm">
    {text}
  </div>
);

export default function List({ data, activeItems, pending }: ListProps) {
  const { t } = useTranslation();
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
      <Modal isOpen={isOpen} onClose={() => {
        closeModal()
        setSelectedItem(null)
      }} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {t('home.requesetDetails.title')}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {t('home.requesetDetails.description')}
            </p>
          </div>
          <div className="space-y-6 w-full overflow-y-auto max-h-[60vh]">
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                    {t('home.requesetDetails.childrenInfo')}
                  </h4>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t('common.firstName')}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.secondaryUser.name}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t('common.lastName')}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.secondaryUser.name}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t('common.phoneNumber')}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.secondaryUser.phoneNumber}
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
                    {t('home.requesetDetails.parentInfo')}
                  </h4>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t('common.firstName')}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.parentUser.name}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t('common.lastName')}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.parentUser.name}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t('common.phoneNumber')}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.parentUser.phoneNumber}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t('common.backupPhoneNumber')}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        N/A
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
                    {t('home.requesetDetails.location')}
                  </h4>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t('home.requesetDetails.latitude')}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.latitude}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      {t('home.requesetDetails.longitude')}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.longitude}
                      </p>
                    </div>
                 
                  </div>

                  <div className="w-full mt-6">
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Google Map
                    </p>
                    {selectedItem?.latitude && selectedItem.longitude && (
                      <div className="w-full h-[300px]">
                        <GoogleMapReact
                          bootstrapURLKeys={{
                            key: "AIzaSyB-RZ07fiNIAFp9Mdf3V5Rh8v1Q39Jej-0",
                          }}
                          defaultCenter={{
                            lat: Number(selectedItem?.latitude) || 0,
                            lng: Number(selectedItem?.longitude) || 0,
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
                            lat={Number(selectedItem?.latitude) || 0}
                            lng={Number(selectedItem?.longitude) || 0}
                            text={`${
                              selectedItem?.secondaryUser.name.split(" ")[0][0]
                            }. ${selectedItem?.secondaryUser.name.split(" ")[1][0]}.`}
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
                  {t('home.table.requestId')}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t('home.table.childName')}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t('home.table.childPhoneNumber')}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t('home.table.parentName')}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t('home.table.parentPhoneNumber')}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t('common.backupPhoneNumber')}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t('home.table.requestSource')}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t('home.table.requestTime')}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t('home.table.status')}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t('common.actions')}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 cursor-pointer dark:divide-white/[0.05] [&>tr]:even:bg-gray-50 dark:[&>tr]:even:bg-gray-900/50 [&>tr]:hover:bg-gray-200 dark:[&>tr]:hover:bg-gray-900">
              {activeItems.map((request) => (
                <TableRow
                  key={request.id}
                  // className={`${
                  //   order.isNew &&
                  //   dayjs(order.requestTime).diff(dayjs(), "second") < 5
                  //     ? "animate-[highlight_2s_ease-in-out_5]"
                  //     : ""
                  // }`}
                  className="animate-[highlight_2s_ease-in-out_infinite]"
                >
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.parentUser.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.parentUser.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.secondaryUser.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.secondaryUser.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {/* {request.backupPhoneNumber} */}
                    N/A
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {/* {request.requestSource} */}
                    N/A
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {/* {dayjs(order.requestTime).format("DD/MM/YYYY HH:mm")} */}
                    N/A
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {/* <Badge
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
                        {t(`home.requestStatuses.${camelCase(order.status)}` as any)}
                    </Badge> */}
                    N/A
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    <Button
                      className="min-w-max"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(request)}
                    >
                      {t('home.table.viewDetails')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {tableData.map((request) => (
                <TableRow
                  key={request.id}
                  // className={`${
                  //   order.isNew &&
                  //   dayjs(order.requestTime).diff(dayjs(), "second") < 5
                  //     ? "animate-[highlight_2s_ease-in-out_5]"
                  //     : ""
                  // }`}
                >
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.parentUser.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.parentUser.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.secondaryUser.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.secondaryUser.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {/* {request.parentUser.backupPhoneNumber} */} N/A
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {/* {order.requestSource} */} N/A
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {dayjs(request.timestamp).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {/* <Badge
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
                      {t(`home.requestStatuses.${camelCase(order.status)}` as any)}
                    </Badge> */}
                    N/A
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    <Button
                      className="min-w-max"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(request)}
                    >
                      {t('home.table.viewDetails')}
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
