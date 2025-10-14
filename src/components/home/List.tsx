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
import Select from "../form/Select";
import {
  useRequestStatusChange,
  useRequestStatusComplete,
} from "../../store/server/requets/mutations";
import { toast } from "react-toastify";

interface ListProps {
  data: RequestResponseModel["helpRequests"];
  activeItems: RequestResponseModel["helpRequests"];
  pending: boolean;
}

const AnyReactComponent = ({ text }: { text: string }) => (
  <div className="text-white bg-gray-500 p-2 rounded-full size-14 flex items-center justify-center text-sm">
    {text}
  </div>
);

export default function List({ data, activeItems, pending }: ListProps) {
  const { t } = useTranslation();
  const reqStatusChangeMutation = useRequestStatusChange();
  const reqStatusCompleteMutation = useRequestStatusComplete();
  const { isOpen, openModal, closeModal } = useModal();
  const [tableData, setTableData] = useState<ListProps["data"]>([]);
  const [selectedItem, setSelectedItem] = useState<ListProps["data"][0] | null>(
    null
  );
  const [statusChangeItem, setStatusChangeItem] = useState<
    ListProps["data"][0] | null
  >(null);
  const [selectedStatus, setSelectedStatus] = useState<null | string>(null);

  const renderOptionsBasedOnStatus = (
    status: RequestResponseModel["helpRequests"][number]["status"]
  ) => {
    console.log(status);

    if (status === "Pending") {
      return [
        {
          label: t("home.table.cancel"),
          value: "Cancelled",
        },
      ];
    }
    if (
      status === "Rejected" ||
      status === "RejectedByDispatcher" ||
      status === "Completed"
    ) {
      return [];
    }

    if (status === "Accepted" || status === "AutoAccepted") {
      return [
        {
          label: t("home.table.securityDispatched"),
          value: "SecurityDispatched",
        },
      ];
    }

    if (status === "SecurityDispatched") {
      return [
        {
          label: t("home.table.finish"),
          value: "Finish",
        },
      ];
    }

    return [];
  };

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
      <Modal
        isOpen={isOpen}
        onClose={() => {
          closeModal();
          setSelectedItem(null);
        }}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {t("home.requesetDetails.title")}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {t("home.requesetDetails.description")}
            </p>
          </div>
          <div className="space-y-6 w-full overflow-y-auto max-h-[60vh]">
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                    {t("home.requesetDetails.childrenInfo")}
                  </h4>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t("common.firstName")}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.secondaryUser?.name}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t("common.lastName")}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.secondaryUser?.name}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t("common.phoneNumber")}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.secondaryUser?.phoneNumber}
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
                    {t("home.requesetDetails.parentInfo")}
                  </h4>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t("common.firstName")}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.parentUser.name}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t("common.lastName")}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.parentUser.name}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t("common.phoneNumber")}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.parentUser.phoneNumber}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t("common.backupPhoneNumber")}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.parentUser.secondaryNumber || "N/A"}
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
                    {t("home.requesetDetails.location")}
                  </h4>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t("home.requesetDetails.latitude")}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.latitude}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t("home.requesetDetails.longitude")}
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
                            key: "AIzaSyCm1aC6f3A6S1nC9h8NMHicK8jPit58WNg",
                          }}
                          defaultCenter={{
                            lat: Number(selectedItem?.latitude) || 0,
                            lng: Number(selectedItem?.longitude) || 0,
                          }}
                          defaultZoom={12}
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
                            text={`${selectedItem?.secondaryUser?.name[0]} ${
                              selectedItem?.secondaryUser?.name?.split(
                                " "
                              )?.[1]?.[0] || ""
                            }`}
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
      <Modal
        isOpen={!!statusChangeItem}
        onClose={() => {
          setStatusChangeItem(null);
          setSelectedStatus(null);
        }}
        className="max-w-[700px] m-4"
      >
        <div className="space-y-4 no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h1 className="font-medium text-xl dark:text-white">
            აირჩიეთ სტატუსი
          </h1>
          {renderOptionsBasedOnStatus(statusChangeItem?.status as any) && (
            <Select
              placeholder=""
              options={renderOptionsBasedOnStatus(
                statusChangeItem?.status as any
              )}
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value as any)}
            />
          )}

          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedStatus(null);
                setStatusChangeItem(null);
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              disabled={!selectedStatus}
              onClick={async () => {
                try {
                  if (selectedStatus === "Finish") {
                    await reqStatusCompleteMutation.mutateAsync(
                      statusChangeItem!.id
                    );
                  } else {
                    await reqStatusChangeMutation.mutateAsync({
                      helpRequestId: statusChangeItem!.id,
                      accepted: selectedStatus === "SecurityDispatched",
                    });
                  }
                } catch (error: any) {
                  toast.error(error?.error || t("common.somethingWentWrong"));
                }
                setSelectedStatus(null);
                setStatusChangeItem(null);
              }}
            >
              {t("common.save")}
            </Button>
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
                  {t("home.table.requestId")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("home.table.childName")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("home.table.childPhoneNumber")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("home.table.parentName")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("home.table.parentPhoneNumber")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("common.backupPhoneNumber")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("home.table.acceptedBy")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("home.table.requestTime")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("home.table.status")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("home.table.changeStatus")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("common.actions")}
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
                  className={
                    request.status === "Pending"
                      ? "animate-[highlight_2s_ease-in-out_infinite]"
                      : "bg-[rgb(144,_10,_22)]text-white font-medium"
                  }
                >
                  <TableCell
                    className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                      request.status === "Pending"
                        ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                        : "bg-[rgb(144,_10,_22)]text-white font-medium"
                    } `}
                  >
                    {request.id}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                      request.status === "Pending"
                        ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                        : "bg-[rgb(144,_10,_22)]text-white font-medium"
                    } `}
                  >
                    {request.parentUser.name}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                      request.status === "Pending"
                        ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                        : "bg-[rgb(144,_10,_22)]text-white font-medium"
                    } `}
                  >
                    {request.parentUser.phoneNumber}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                      request.status === "Pending"
                        ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                        : "bg-[rgb(144,_10,_22)]text-white font-medium"
                    } `}
                  >
                    {request.secondaryUser?.name}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                      request.status === "Pending"
                        ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                        : "bg-[rgb(144,_10,_22)]text-white font-medium"
                    } `}
                  >
                    {request.secondaryUser?.phoneNumber}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                      request.status === "Pending"
                        ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                        : "bg-[rgb(144,_10,_22)]text-white font-medium"
                    } `}
                  >
                    {/* {request.backupPhoneNumber} */}
                    N/A
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                      request.status === "Pending"
                        ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                        : "bg-[rgb(144,_10,_22)]text-white font-medium"
                    } `}
                  >
                    {(request.status === "Rejected" ||
                      request.status === "RejectedByDispatcher") &&
                      t("home.table.cancelled")}
                    {!(
                      request.status === "Rejected" ||
                      request.status === "RejectedByDispatcher"
                    ) &&
                      (request.status === "Accepted" ||
                        !!request.parentRespondedTimestamp) &&
                      t("home.table.acceptedByParent")}
                    {!(
                      request.status === "Rejected" ||
                      request.status === "RejectedByDispatcher"
                    ) &&
                      (request.status === "AutoAccepted" ||
                        request.status === "SecurityDispatched") &&
                      !request.parentRespondedTimestamp &&
                      t("home.table.acceptedBySystem")}
                    {request.status === "Completed" &&
                      request.parentRespondedTimestamp &&
                      t("home.table.acceptedByParent")}
                    {request.status === "Completed" &&
                      !request.parentRespondedTimestamp &&
                      t("home.table.acceptedBySystem")}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                      request.status === "Pending"
                        ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                        : "bg-[rgb(144,_10,_22)]text-white font-medium"
                    } `}
                  >
                    {/* {dayjs(order.requestTime).format("DD/MM/YYYY HH:mm")} */}
                    N/A
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                      request.status === "Pending"
                        ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                        : "bg-[rgb(144,_10,_22)]text-white font-medium"
                    } `}
                  >
                    {request.status === "Pending" && "გამოძახება მუშავდება"}
                    {request.status === "Accepted" &&
                      "მშობელმა დაადასტურა გამოძახება"}
                    {request.status === "AutoAccepted" &&
                      "სისტემამ ავტომატურად დაადასტურა გამოძახება"}
                    {request.status === "SecurityDispatched" &&
                      "დაცვის გუნდი გზაშია"}
                    {request.status === "Completed" && "გამოძახება დასრულდა"}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                      request.status === "Pending"
                        ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                        : "bg-[rgb(144,_10,_22)]text-white"
                    } `}
                  >
                    {[
                      "Pending",
                      "SecurityDispatched",
                      "Accepted",
                      "AutoAccepted",
                    ].includes(request.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-max min-w-max"
                        onClick={() => {
                          setStatusChangeItem(request);
                        }}
                      >
                        {t("home.table.changeStatus")}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                      request.status === "Pending"
                        ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                        : "bg-[rgb(144,_10,_22)]text-white"
                    } `}
                  >
                    <Button
                      className="min-w-max"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(request)}
                    >
                      {t("home.table.viewDetails")}
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
                    {request.secondaryUser?.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.secondaryUser?.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.parentUser.secondaryNumber || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {(request.status === "Rejected" ||
                        request.status === "RejectedByDispatcher") &&
                        t("home.table.cancelled")}
                      {!(
                        request.status === "Rejected" ||
                        request.status === "RejectedByDispatcher"
                      ) &&
                        (request.status === "Accepted" ||
                          !!request.parentRespondedTimestamp ||
                          (request.status === "Completed" &&
                            request.parentRespondedTimestamp)) &&
                        t("home.table.acceptedByParent")}
                      {!(
                        request.status === "Rejected" ||
                        request.status === "RejectedByDispatcher"
                      ) &&
                        (request.status === "AutoAccepted" ||
                          request.status === "SecurityDispatched") &&
                        !request.parentRespondedTimestamp &&
                        t("home.table.acceptedBySystem")}
                      {request.status === "Completed" &&
                        !request.parentRespondedTimestamp &&
                        t("home.table.acceptedBySystem")}
                    </TableCell>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {dayjs(request.timestamp).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {request.status === "Pending" && "გამოძახება მუშავდება"}
                    {request.status === "Accepted" &&
                      "მშობელმა დაადასტურა გამოძახება"}
                    {request.status === "AutoAccepted" &&
                      "სისტემამ ავტომატურად დაადასტურა გამოძახება"}
                    {request.status === "SecurityDispatched" &&
                      "დაცვის გუნდი გზაშია"}
                    {request.status === "Completed" && "გამოძახება დასრულდა"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {/* N/A */}
                    N/A
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    <Button
                      className="min-w-max"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(request)}
                    >
                      {t("home.table.viewDetails")}
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
