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
  useRequestCancel,
  useRequestStatusChange,
  useRequestStatusComplete,
} from "../../store/server/requets/mutations";
import { toast } from "react-toastify";
import useAuthedUserStore from "../../store/client/useAuthedUserStore";
import CommentBox from "../comment";
import { CopyIcon } from "lucide-react";
import PrintCardModal from "../print-card/PrintCardModal";

interface ListProps {
  data: RequestResponseModel["helpRequests"];
  activeItems: RequestResponseModel["helpRequests"];
  pending: boolean;
}

const AnyReactComponent = ({
  text,
}: {
  text: string;
  lat?: number;
  lng?: number;
}) => (
  <div className="text-white bg-gray-500 p-2 rounded-full size-14 flex items-center justify-center text-sm">
    {text}
  </div>
);

type ClipboardField = { title?: string; value?: string | number | null | undefined };
type ClipboardSection = {
  title?: string;
  type?: string;
  [key: string]: ClipboardField | string | number | null | undefined;
};

const getUserAgeType = (age?: number | null) => {
  if (age === null || age === undefined) return "-";
  return age >= 18 ? "სრულწლოვანი" : "არასრულწლოვანი";
};

export default function List({ data, activeItems }: ListProps) {
  const user = useAuthedUserStore((state) => state.user);
  const isRestrictedDispatcher = user?.userName === "algani_dispatcher";
  const { t } = useTranslation();
  const reqStatusChangeMutation = useRequestStatusChange();
  const reqStatusCompleteMutation = useRequestStatusComplete();
  const reqCancelMutation = useRequestCancel();
  const { isOpen, openModal, closeModal } = useModal();
  const [tableData, setTableData] = useState<ListProps["data"]>([]);
  const [selectedItem, setSelectedItem] = useState<ListProps["data"][0] | null>(
    null
  );
  const [statusChangeItem, setStatusChangeItem] = useState<
    ListProps["data"][0] | null
  >(null);
  const [openCardData, setOpenCardData] = useState<
    RequestResponseModel["helpRequests"][number] | null
  >(null);
  const [cancelItem, setCancelItem] = useState<
    RequestResponseModel["helpRequests"][number] | null
  >(null);
  const [selectedStatus, setSelectedStatus] = useState<null | string>(null);
  const renderOptionsBasedOnStatus = (
    status: RequestResponseModel["helpRequests"][number]["status"]
  ) => {
    if (status === "Pending") {
      return [
        {
          label: t("home.table.cancel"),
          value: "Cancelled",
        },
         {
          label: t("home.table.securityDispatched"),
          value: "SecurityDispatched",
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

    // if (status === "Accepted" || status === "AutoAccepted") {
    //   return [
    //     {
    //       label: t("home.table.securityDispatched"),
    //       value: "SecurityDispatched",
    //     },
    //   ];
    // }

    if (status === "Accepted") {
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

  const copyDataToClipboard = (data: ClipboardSection[]) => {
    let text = "";

    data.forEach((section, index) => {
      // Title / Type (with one space below)
      const sectionTitle = section.title || section.type;
      if (sectionTitle) {
        text += `${sectionTitle}:\n\n`; // space after title
      }

      // Fields
      Object.values(section).forEach((field) => {
        if (field && typeof field === "object" && "title" in field) {
          const { title, value } = field as ClipboardField;
          if (title !== undefined) {
            text += `${title}: ${value ?? "-"}\n`;
          }
        }
      });

      // ⬇ Add **2 blank lines BETWEEN SECTIONS**, but NOT after last
      if (index < data.length - 1) {
        text += `\n\n`;
      }
    });

    navigator.clipboard
      .writeText(text)
      .then(() => alert("ინფორმაცია დაკოპირდა!"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  const openCardModal = (
    data: RequestResponseModel["helpRequests"][number]
  ) => {
    setOpenCardData(data);
  };

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
          <div className="px-2 pr-14 flex justify-between items-center mb-2">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {t("home.requesetDetails.title")}
            </h4>
            <Button
              variant="outline"
              size="sm"
              className=""
              onClick={() => {
                const data = [
                  {
                    title: t("home.requesetDetails.userInfo"),
                    name: {
                      title: "სახელი, გვარი",
                      value: selectedItem?.requestingUser?.name,
                    },
                    userAgeType: {
                      title: "მომხმარებლის ტიპი",
                      value: getUserAgeType(selectedItem?.requestingUser?.age),
                    },
                    age: {
                      title: "ასაკი",
                      value: selectedItem?.requestingUser?.age,
                    },
                    phone: {
                      title: "ტელეფონის ნომერი",
                      value: selectedItem?.requestingUser?.phoneNumber,
                    },
                  },
                  {
                    title: t("home.requesetDetails.circleMemberInfo"),
                    name: {
                      title: "სახელი, გვარი",
                      value: selectedItem?.circleMembers?.find(m => m.id !== selectedItem.requestingUser.id)?.name,
                    },
                    phone: {
                      title: "ტელეფონის ნომერი",
                      value: selectedItem?.circleMembers?.find(m => m.id !== selectedItem.requestingUser.id)?.phoneNumber,
                    },
                  },
                  {
                    title: "მისამართი",
                    name: {
                      title: "Google Map",
                      value: `http://www.google.com/maps/place/${selectedItem?.latitude},${selectedItem?.longitude}/@${selectedItem?.latitude},${selectedItem?.longitude},20z`,
                    },
                    address: {
                      title: "მისამართი",
                      value:
                        selectedItem?.requestingUser?.address || selectedItem?.address,
                    },
                  },
                ];
                copyDataToClipboard(data);
              }}
            >
              <CopyIcon className="size-5" />
            </Button>
          </div>
          <div className="space-y-6 w-full overflow-y-auto max-h-[60vh]">
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                    {t("home.requesetDetails.userInfo")}
                  </h4>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        სახელი, გვარი
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.requestingUser?.name}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        მომხმარებლის ტიპი
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {getUserAgeType(selectedItem?.requestingUser?.age)}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        ასაკი
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.requestingUser?.age}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        {t("common.phoneNumber")}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedItem?.requestingUser?.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="w-full">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                    {(selectedItem?.circleMembers?.filter(m => m.id !== selectedItem.requestingUser.id)?.length ?? 0) === 1 ? t("home.requesetDetails.circleMemberInfo") : t("home.requesetDetails.circleMembersInfo")}
                  </h4>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    {(selectedItem?.circleMembers?.filter(m => m.id !== selectedItem.requestingUser.id) ?? []).map((parent, index) => {
                      return (
                        <div
                          key={parent.id ?? index}
                          className="relative p-3 rounded-xl border w-full border-gray-200 dark:border-gray-800"
                        >


                          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            სახელი, გვარი
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {parent.name}
                          </p>

                          <p className="mt-3 mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            {t("common.phoneNumber")}
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {parent.phoneNumber}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="">
                <div>
                  {(selectedItem?.requestingUser?.address ||
                    selectedItem?.address) && (
                      <>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                          {t("home.requesetDetails.location")}
                        </h4>
                        <div className="mb-4">
                          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            მისამართი
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {selectedItem?.requestingUser?.address || selectedItem?.address}
                          </p>
                        </div>
                      </>
                    )}
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
                          defaultZoom={14.5}
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
                            text={`${selectedItem?.requestingUser?.name?.[0] ?? ""} ${
                              selectedItem?.requestingUser?.name
                                ?.split(" ")?.[1]?.[0] || ""
                            }`}
                          />
                        </GoogleMapReact>
                      </div>
                    )}
                    <Button
                      className="w-full mt-3 !bg-[#900a16]/90 hover:!bg-[#900a16] text-black font-bold"
                      variant="primary"
                      size="md"
                      onClick={() => {
                        window.open(
                          `http://www.google.com/maps/place/${selectedItem?.latitude},${selectedItem?.longitude}/@${selectedItem?.latitude},${selectedItem?.longitude},20z`
                        );
                      }}
                    >
                      რუკაზე ნახვა
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              {selectedItem?.circleMembers?.find(m => m.id !== selectedItem.requestingUser.id)?.id && (
                <CommentBox userId={selectedItem.circleMembers.find(m => m.id !== selectedItem.requestingUser.id)!.id} />
              )}
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
              defaultValue={selectedStatus ?? ""}
              onChange={(value) => setSelectedStatus(value as any)}
              disabled={isRestrictedDispatcher}
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
      <Modal
        isOpen={!!cancelItem}
        onClose={() => setCancelItem(null)}
        className="max-w-[400px] m-4"
      >
        <div className="space-y-4 relative w-full max-w-[400px] rounded-3xl bg-white p-6 dark:bg-gray-900">
          <h1 className="font-medium text-xl dark:text-white">გაუქმების დადასტურება</h1>
          <p className="text-gray-600 dark:text-gray-400">დარწმუნებული ხართ, რომ გსურთ გამოძახების გაუქმება?</p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setCancelItem(null)}>
              არა
            </Button>
            <Button
              onClick={async () => {
                try {
                  await reqCancelMutation.mutateAsync({ helpRequestId: cancelItem!.id });
                  toast.success("გამოძახება გაუქმებულია");
                } catch (error: any) {
                  console.log(error);
                  toast.error(error?.error || "მოხდა შეცდომა");
                }
                setCancelItem(null);
              }}
            >
              დიახ, გაუქმება
            </Button>
          </div>
        </div>
      </Modal>
      {openCardData && (
        <PrintCardModal
          data={openCardData}
          onClose={() => setOpenCardData(null)}
        />
      )}
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
                  {t("home.table.userName")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  მომხმარებლის ტიპი
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("home.table.userPhoneNumber")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("home.table.circleMemberName")}
                </TableCell>
                {/* <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("home.table.acceptedBy")}
                </TableCell> */}
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
                  სტატუსის შეცვლა
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {" "}
                  {/* {t("common.actions")} */}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 cursor-pointer dark:divide-white/[0.05] [&>tr]:even:bg-gray-50 dark:[&>tr]:even:bg-gray-900/50 [&>tr]:hover:bg-gray-200 dark:[&>tr]:hover:bg-gray-900">
              {activeItems.map((request) => {
                const nonRequestingMembers = request.circleMembers?.filter(m => m.id !== request.requestingUser.id) ?? [];
                const mainCircleMember = nonRequestingMembers[0];
                return (
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
                        : "bg-[rgb(144,_10,_22)] text-white font-medium"
                    }
                  >
                    <TableCell
                      className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                        request.status === "Pending"
                          ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                          : "bg-[rgb(144,_10,_22)] text-white font-medium"
                      } `}
                    >
                      {request.id}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                        request.status === "Pending"
                          ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                          : "bg-[rgb(144,_10,_22)] text-white font-medium"
                      } `}
                    >
                      {request?.requestingUser?.name}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                        request.status === "Pending"
                          ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                          : "bg-[rgb(144,_10,_22)] text-white font-medium"
                      } `}
                    >
                      {getUserAgeType(request?.requestingUser?.age)}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                        request.status === "Pending"
                          ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                          : "bg-[rgb(144,_10,_22)] text-white font-medium"
                      } `}
                    >
                      {request?.requestingUser?.phoneNumber}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                        request.status === "Pending"
                          ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                          : "bg-[rgb(144,_10,_22)] text-white font-medium"
                      } `}
                    >
                      {mainCircleMember?.name}
                    </TableCell>
                    {/* <TableCell
                      className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                        request.status === "Pending"
                          ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                          : "bg-[rgb(144,_10,_22)] text-white font-medium"
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
                        t("home.table.acceptedByCircleMember")}
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
                        t("home.table.acceptedByCircleMember")}
                      {request.status === "Completed" &&
                        !request.parentRespondedTimestamp &&
                        t("home.table.acceptedBySystem")}
                    </TableCell> */}
                    <TableCell
                      className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                        request.status === "Pending"
                          ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                          : "bg-[rgb(144,_10,_22)] text-white font-medium"
                      } `}
                    >
                      {dayjs(request.timestamp).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                        request.status === "Pending"
                          ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                          : "bg-[rgb(144,_10,_22)] text-white font-medium"
                      } `}
                    >
                      {request.status === "Pending" && "გამოძახება მუშავდება"}
                      {request.status === "Accepted" &&
                        "დაცვის გუნდი გზაშია"}
                      {request.status === "AutoAccepted" &&
                        "სისტემამ ავტომატურად დაადასტურა გამოძახება"}
                      {request.status === "SecurityDispatched" &&
                        "დაცვის გუნდი გზაშია"}
                      {request.status === "Completed" && "გამოძახება დასრულდა"}
                      {request.status === "Rejected" &&
                        "გამოძახება გააუქმა ოპერატორმა"}
                      {request.status === "RejectedByDispatcher" &&
                        "გამოძახება გააუქმა ოპერატორმა"}
                      {request.status === "Cancelled" && "გამოძახება გაუქმდა"}
                      {request.status === "CancelledByDispatcher" && "გამოძახება გააუქმა დისპეჩერმა"}
                      {request.status === "CancelledByUser" && "გამოძახება გააუქმა მომხმარებელმა"}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                        request.status === "Pending"
                          ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                          : "bg-[rgb(144,_10,_22)] text-white"
                      } `}
                    >
                      {[
                        "Pending",
                        "SecurityDispatched",
                        "Accepted",
                        "AutoAccepted",
                      ].includes(request.status) && !isRestrictedDispatcher &&
                        user?.userType === "Dispatcher" && (
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
                        {user?.userType === "Admin" && ["AutoAccepted", "Pending", "Accepted", "SecurityDispatched"].includes(request.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-max min-w-max"
                            onClick={() => setCancelItem(request)}
                          >
                            გაუქმება
                          </Button>
                        )}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                        request.status === "Pending"
                          ? "animate-[highlight-text_2s_ease-in-out_infinite]"
                          : "bg-[rgb(144,_10,_22)] text-white"
                      } `}
                    >
                      <div className="flex flex-col gap-2">
                        <Button
                          className="min-w-max"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedItem(request)}
                        >
                          {t("home.table.viewDetails")}
                        </Button>
                        <Button
                          className="min-w-max"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if(user?.userType === "SecurityPoliceReadOnly") {
                              if(!request.document?.url && ['SecurityDispatched', 'Completed'].includes(request.status)) {
                                openCardModal(request);
                                return
                              }
                              if(!request.document?.url && !['SecurityDispatched', 'Completed'].includes(request.status)) {
                                toast.error("მიმდინარე სტატუსზე ბარათის მიბმა შეუძლებელია");
                                return
                              }
                            }
                            if(!request.document?.url) {
                              toast.error("ბარათი მითითებული არ არის");
                              return;
                            }
                            window.open(request.document!.url, "_blank");
                          }}
                        >
                          ბარათი
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {tableData.map((request) => {
                const nonRequestingMembers = request.circleMembers?.filter(m => m.id !== request.requestingUser.id) ?? [];
                const mainCircleMember = nonRequestingMembers[0];
                return (
                  <TableRow key={request.id}>
                    <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {request.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {request?.requestingUser?.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {getUserAgeType(request?.requestingUser?.age)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {request?.requestingUser?.phoneNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {mainCircleMember?.name}
                    </TableCell>
                    {/* <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
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
                          t("home.table.acceptedByCircleMember")}
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
                    </TableCell> */}
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {dayjs(request.timestamp).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {request.status === "Pending" && "გამოძახება მუშავდება"}
                      {request.status === "Accepted" &&
                        "მიმდინარე"}
                      {request.status === "AutoAccepted" &&
                        "სისტემამ ავტომატურად დაადასტურა გამოძახება"}
                      {request.status === "SecurityDispatched" &&
                        "დაცვის გუნდი გზაშია"}
                      {request.status === "Completed" && "გამოძახება დასრულდა"}
                      {request.status === "Rejected" &&
                        "გამოძახება გააუქმა ოპერატორმა"}
                      {request.status === "RejectedByDispatcher" &&
                        "გამოძახება გააუქმა ოპერატორმა"}
                      {request.status === "Cancelled" && "გამოძახება გაუქმდა"}
                      {request.status === "CancelledByDispatcher" && "გამოძახება გააუქმა დისპეჩერმა"}
                      {request.status === "CancelledByUser" && "გამოძახება გააუქმა მომხმარებელმა"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {dayjs(request.timestamp).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col gap-2">
                        <Button
                          className="min-w-max"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedItem(request)}
                        >
                          {t("home.table.viewDetails")}
                        </Button>
                        <Button
                          className="min-w-max"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if(user?.userType === "SecurityPoliceReadOnly") {
                              if(!request.document?.url && ['SecurityDispatched', 'Completed'].includes(request.status)) {
                                openCardModal(request);
                                return
                              }
                              toast.error("მიმდინარე სტატუსზე ბარათის მიბმა შეუძლებელია");
                              return
                            }
                            if(!request.document?.url) {
                              toast.error("ბარათი მითითებული არ არის");
                              return;
                            }
                            window.open(request.document!.url, "_blank");
                          }}
                        >
                          ბარათი
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
