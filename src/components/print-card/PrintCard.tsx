import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Logo from "/images/logo.png";
import DatePicker from "../../components/form/date-picker";
import { SignatureCanvas } from "react-signature-canvas";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Modal } from "../../components/ui/modal";
import { RequestResponseModel } from "../../store/server/requets/interfaces";
import { useRequestDocumentGenerate } from "../../store/server/requets/mutations";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const schema = z.object({
  cardNumber: z.string().min(1, { message: "ბარათის ნომერი აუცილებელია" }),
  customerName: z.string().min(1, { message: "სახელი გვარი აუცილებელია" }),
  customerAge: z.string().min(1, { message: "ასაკი აუცილებელია" }),
  customerParentName: z
    .string()
    .min(1, { message: "მშობლის სახელი გვარი აუცილებელია" }),
  policeName: z.string().min(1, { message: "დაცვა აუცილებელია" }),
  doctorName: z.string().min(1, { message: "უმცროსი ექიმი აუცილებელია" }),
  address: z.string().min(1, { message: "შემთხვევის მისამართი აუცილებელია" }),
  arriveTime: z.string().min(1, { message: "მისვლის დრო აუცილებელია" }),
  reason: z.string().min(1, { message: "გამოძახების მიზეზი აუცილებელია" }),
  finishTime: z.string().min(1, { message: "დასრულების დრო აუცილებელია" }),
  responsiblePersonName: z
    .string()
    .min(1, { message: "მეურვე/დროებითი პასუხისმგებელი პირი აუცილებელია" }),
  signature: z.string().min(1, { message: "ხელმოწერა აუცილებელია" }),
  date: z.any(),
  description: z.string().min(1, { message: "შემთხვევის აღწერა აუცილებელია" }),
});

function replaceOklabColors() {
  const elements = document.querySelectorAll("#print-area *");

  elements.forEach((el) => {
    const style = getComputedStyle(el);

    ["color", "backgroundColor", "borderColor"].forEach((prop) => {
      const value = style[prop as any];
      if (value?.includes("oklab") || value?.includes("oklch")) {
        (el as HTMLElement).style[prop as any] = "rgb(0,0,0)";
      }
    });
  });
}

export async function htmlElementToPdfBlob(
  element: HTMLElement
): Promise<Blob> {
  replaceOklabColors();

  // Find the print-page element
  const printPage = element.querySelector(".print-page") as HTMLElement;
  if (!printPage) {
    throw new Error("Print page element not found");
  }

  // Force element to exact A4 dimensions before capture
  printPage.style.width = "210mm";
  printPage.style.height = "297mm";
  printPage.style.maxHeight = "297mm";
  printPage.style.overflow = "hidden";

  element.classList.add("pdf-print-mode");
  element.classList.remove("pdf-edit-mode");
  // Wait for styles to apply
  await new Promise((resolve) => setTimeout(resolve, 200));

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm

  // Capture only the print-page element, not the entire container
  const canvas = await html2canvas(printPage, {
    scale: 5, // Good balance between quality and performance
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  // Fill entire page (no centering needed since we're capturing exact A4 size)
  pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight, "", "FAST");

  element.classList.remove("pdf-print-mode");
  element.classList.add("pdf-edit-mode");

  // Reset styles
  printPage.style.width = "";
  printPage.style.height = "";
  printPage.style.maxHeight = "";
  printPage.style.overflow = "";
  printPage.style.boxSizing = "";
  pdf.save("test.pdf");
  const blob = pdf.output("blob");
  return blob;
}

export default function PrintCard({
  data,
  onClose,
}: {
  data: RequestResponseModel["helpRequests"][number];
  onClose: () => void;
}) {
  const [pending, setPending] = useState(false);
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      cardNumber: "",
      customerName: data?.secondaryUser?.name,
      customerAge: data?.secondaryUser?.age.toString(),
      customerParentName: data?.parentUser?.name,
      policeName: "",
      doctorName: "",
      address: data?.secondaryUser?.address || "",
      arriveTime: "",
      reason: "",
      finishTime: "",
      description: "",
      responsiblePersonName: "",
      signature: "",
      date: new Date().toISOString(),
    },
  });

  const signatureCanvas = useRef<SignatureCanvas>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: generateDocument, isPending } =
    useRequestDocumentGenerate();

  if (pending) {
    return (
      <div className="fixed top-0 left-0 flex justify-center items-center h-full bg-black/40 w-screen z-[999]">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    data && (
      <>
        <Modal
          isOpen={true}
          onClose={onClose}
          className="max-w-[700px] m-4 max-h-[90vh]"
        >
          <div
            className="flex justify-center items-start pdf-edit-mode  overflow-y-auto max-h-[90vh]"
            id="print-area"
            ref={contentRef}
          >
            <div
              className={clsx(
                "print-page w-[210mm] print:h-[297mm] mx-auto bg-white shadow-2xl print:shadow-none print:overflow-hidden"
              )}
            >
              {/* Decorative Top Border */}

              {/* Header */}
              <div className="relative bg-white border-b-2 border-[#900a16]/20">
                <div className="absolute top-5 right-8 text-[#900a16] flex items-center gap-2 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="tracking-wide">*0100</span>
                </div>
                <div className="flex items-center justify-center py-2">
                  <img
                    src={Logo}
                    alt="LumeX Logo"
                    className="h-12 rounded-sm"
                  />
                </div>
              </div>

              {/* Form Container */}
              <div className="px-2 py-2 print:px-3 print:py-2">
                {/* Title */}
                <div className="text-center mb-2">
                  <div className="inline-block relative">
                    <h2 className="text-[#900a16] font-semibold relative z-10 px-6 py-4">
                      სერვისის გამოძახების ბარათი
                    </h2>
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#900a16]/10 rounded"></div>
                  </div>
                </div>

                {/* Card Number */}
                <div className="py-4 ">
                  <div className="flex items-center gap-3 w-full">
                    <span
                      className={clsx(
                        "text-gray-700 font-semibold text-sm min-w-fit",
                        errors.cardNumber && "text-red-500"
                      )}
                    >
                      ბარათის ნომერი:
                    </span>
                    <div className="border-b-2 border-gray-300 pb-1 label w-full">
                      <p className="text-sm text-black w-full">
                        {watch("cardNumber")}
                      </p>
                    </div>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="ბარათის ნომერი"
                      className="w-full input"
                      rootClassName="w-full"
                      value={watch("cardNumber")}
                      error={!!errors.cardNumber}
                      onChange={(e) =>
                        setValue("cardNumber", e.target.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 py-5">
                  {/* Customer Information Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-6 bg-[#900a16] rounded-full"></div>
                      <h3 className="text-[#900a16] text-sm font-semibold">
                        მომხმარებლის ინფორმაცია
                      </h3>
                    </div>

                    <div className="pl-4 space-y-6 p-4 rounded-lg print:bg-transparent print:border-0 print:p-2">
                      <div className="space-y-0">
                        <label
                          className={clsx(
                            "text-sm block font-semibold pb-2.5 title",
                            errors.customerName && "text-red-500"
                          )}
                        >
                          სახელი გვარი
                        </label>
                        <div className="border-b-2 border-gray-300 pb-1 label">
                          <p className="text-sm text-black">
                            {watch("customerName")}
                          </p>
                        </div>
                        <Input
                          id="customerName"
                          disabled
                          error={!!errors.customerName}
                          type="text"
                          placeholder="სახელი გვარი"
                          value={watch("customerName")}
                          onChange={(e) =>
                            setValue("customerName", e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className="input"
                        />
                      </div>

                      <div className="space-y-0">
                        <label
                          className={clsx(
                            "text-sm block font-semibold pb-2.5 title",
                            errors.customerAge && "text-red-500"
                          )}
                        >
                          ასაკი
                        </label>
                        <div className="border-b-2 border-gray-300 pb-1 label">
                          <p className="text-sm text-black">
                            {watch("customerAge")}
                          </p>
                        </div>
                        <Input
                          error={!!errors.customerAge}
                          disabled
                          type="text"
                          placeholder="ასაკი"
                          value={watch("customerAge")}
                          onChange={(e) =>
                            setValue("customerAge", e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className="input"
                        />
                      </div>

                      <div className="space-y-0">
                        <label
                          className={clsx(
                            "text-sm block font-semibold pb-2.5 title",
                            errors.customerParentName && "text-red-500"
                          )}
                        >
                          მშობლის სახელი გვარი
                        </label>
                        <div className="border-b-2 border-gray-300 pb-1 label">
                          <p className="text-sm text-black">
                            {watch("customerParentName")}
                          </p>
                        </div>
                        <Input
                          error={!!errors.customerParentName}
                          disabled
                          type="text"
                          placeholder="მშობლის სახელი გვარი"
                          value={watch("customerParentName")}
                          onChange={(e) =>
                            setValue("customerParentName", e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className="input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Crew Information Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-6 bg-[#900a16] rounded-full"></div>
                      <h3 className="text-[#900a16] text-sm font-semibold">
                        ეკიპაჟის ინფორმაცია
                      </h3>
                    </div>

                    <div className="pl-4 space-y-6 p-4 rounded-lg print:bg-transparent print:border-0 print:p-2">
                      <div className="space-y-0">
                        <label
                          className={clsx(
                            "text-sm block font-semibold  pb-2.5 title",
                            errors.policeName && "text-red-500"
                          )}
                        >
                          დაცვა
                        </label>
                        <div className="border-b-2 border-gray-300 pb-1 label">
                          <p className="text-sm text-black">
                            {watch("policeName")}
                          </p>
                        </div>
                        <Input
                          error={!!errors.policeName}
                          type="text"
                          placeholder="დაცვა"
                          value={watch("policeName")}
                          onChange={(e) =>
                            setValue("policeName", e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className="input"
                        />
                      </div>

                      <div className="space-y-0">
                        <label
                          className={clsx(
                            "text-sm block font-semibold pb-2.5 title",
                            errors.doctorName && "text-red-500"
                          )}
                        >
                          უმცროსი ექიმი
                        </label>
                        <div className="border-b-2 border-gray-300 pb-1 label">
                          <p className="text-sm text-black">
                            {watch("doctorName")}
                          </p>
                        </div>
                        <Input
                          error={!!errors.doctorName}
                          type="text"
                          placeholder="უმცროსი ექიმი"
                          value={watch("doctorName")}
                          onChange={(e) =>
                            setValue("doctorName", e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incident Details Section - Full Width */}
                <div className="mb-4 pt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-[#900a16] rounded-full"></div>
                    <h3 className="text-[#900a16] text-sm font-semibold">
                      შემთხვევის დეტალები
                    </h3>
                  </div>

                  <div className="pl-4 space-y-6 p-4 rounded-lg print:bg-transparent print:border-0 print:p-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-0">
                        <label
                          className={clsx(
                            "text-sm block font-semibold  pb-2.5 title",
                            errors.address && "text-red-500"
                          )}
                        >
                          შემთხვევის მისამართი
                        </label>
                        <div className="border-b-2 border-gray-300 pb-1 label">
                          <p className="text-sm text-black">
                            {watch("address")}
                          </p>
                        </div>
                        <Input
                          error={!!errors.address}
                          type="text"
                          placeholder="შემთხვევის მისამართი"
                          value={watch("address")}
                          onChange={(e) =>
                            setValue("address", e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className="input"
                        />
                      </div>

                      <div className="space-y-0">
                        <label
                          className={clsx(
                            "text-sm block font-semibold pb-2.5 title",
                            errors.arriveTime && "text-red-500"
                          )}
                        >
                          მისვლის დრო
                        </label>
                        <div className="border-b-2 border-gray-300 pb-1 label">
                          <p className="text-sm text-black">
                            {dayjs(watch("arriveTime")).format(
                              "MM.DD.YYYY HH:mm"
                            )}
                          </p>
                        </div>
                        <DatePicker
                          id="arriveTime"
                          mode="single"
                          placeholder="აირჩიეთ მისვლის დრო"
                          defaultDate={watch("arriveTime")}
                          onChange={(dates) =>
                            setValue("arriveTime", dates[0].toISOString(), {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          enableTime
                          error={!!errors.arriveTime}
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-0">
                        <label
                          className={clsx(
                            "text-sm block font-semibold pb-2.5 title",
                            errors.reason && "text-red-500"
                          )}
                        >
                          გამოძახების მიზეზი
                        </label>
                        <div className="border-b-2 border-gray-300 pb-1 label">
                          <p className="text-sm text-black">
                            {watch("reason")}
                          </p>
                        </div>
                        <Input
                          error={!!errors.reason}
                          type="text"
                          placeholder="გამოძახების მიზეზი"
                          value={watch("reason")}
                          onChange={(e) =>
                            setValue("reason", e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className="input"
                        />
                      </div>

                      <div className="space-y-0">
                        <label
                          className={clsx(
                            "text-sm block font-semibold pb-2.5 title",
                            errors.finishTime && "text-red-500"
                          )}
                        >
                          დასრულების დრო
                        </label>
                        <div className="border-b-2 border-gray-300 pb-1 label">
                          <p className="text-sm text-black">
                            {dayjs(watch("finishTime")).format(
                              "MM.DD.YYYY HH:mm"
                            )}
                          </p>
                        </div>
                        {/* <Input type="text" placeholder="დასრულების დრო" /> */}
                        <DatePicker
                          id="finishTime"
                          mode="single"
                          placeholder="აირჩიეთ დასრულების დრო"
                          defaultDate={watch("finishTime")}
                          onChange={(dates) =>
                            setValue("finishTime", dates[0].toISOString(), {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          enableTime
                          error={!!errors.finishTime}
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="space-y-0">
                      <label
                        className={clsx(
                          "text-sm block font-semibold pb-2.5 textarea-title",
                          errors.description && "text-red-500"
                        )}
                      >
                        შემთხვევის აღწერა
                      </label>
                      <div className="border-2 border-gray-300 rounded-lg min-h-28 !p-1.5 bg-white label">
                        <p className="text-sm text-black">
                          {watch("description")}
                        </p>
                      </div>
                      <TextArea
                        error={!!errors.description}
                        placeholder="შემთხვევის აღწერა"
                        value={watch("description")}
                        onChange={(value) =>
                          setValue("description", value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                {/* Signatures and Date Section */}
                <div className="pt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-[#900a16] rounded-full"></div>
                    <h3 className="text-[#900a16] text-sm font-semibold">
                      ხელმოწერები და თარიღი
                    </h3>
                  </div>

                  <div className="pl-4 space-y-6 p-4 rounded-lg print:bg-transparent print:border-0 print:p-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-0">
                        <label
                          className={clsx(
                            "text-sm block font-semibold pb-2.5 title",
                            errors.responsiblePersonName && "text-red-500"
                          )}
                        >
                          მეურვე/დროებითი პასუხისმგებელი პირი
                        </label>
                        <div className="border-b-2 border-gray-300 pb-1 label">
                          <p className="text-sm text-black">
                            {watch("responsiblePersonName")}
                          </p>
                        </div>
                        <Input
                          type="text"
                          placeholder="მეურვე/დროებითი პასუხისმგებელი პირი"
                          value={watch("responsiblePersonName")}
                          onChange={(e) =>
                            setValue("responsiblePersonName", e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          error={!!errors.responsiblePersonName}
                          className="input"
                        />
                      </div>
                      <div className="space-y-0">
                        <label
                          className={clsx(
                            "text-sm block font-semibold pb-2.5 title",
                            errors.date && "text-red-500"
                          )}
                        >
                          თარიღი
                        </label>
                        <div className="border-b-2 border-gray-300 pb-1 label">
                          <p className="text-sm text-black">
                            {dayjs(watch("date")).format("MM.DD.YYYY")}
                          </p>
                        </div>
                        {/* <Input type="text" placeholder="თარიღი" /> */}
                        <DatePicker
                          id="signatureDate"
                          mode="single"
                          placeholder="აირჩიეთ დასრულების დრო"
                          defaultDate={watch("date")}
                          onChange={(dates) =>
                            setValue("date", dates[0], {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          error={!!errors.date}
                          disabled
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-0">
                        <div className="flex items-center gap-2">
                          <label
                            className={clsx(
                              "text-sm block font-semibold pb-2.5 title",
                              errors.signature && "text-red-500"
                            )}
                          >
                            ხელმოწერა
                          </label>
                          <img
                            src={watch("signature")}
                            alt="signature"
                            className="text-sm text-black label"
                            width={200}
                            height={120}
                          ></img>
                        </div>
                        <SignatureCanvas
                          penColor="black"
                          ref={signatureCanvas}
                          canvasProps={{
                            height: 150,
                            className: "sigCanvas bg-gray-100 w-full input",
                          }}
                          onEnd={() => {
                            setValue(
                              "signature",
                              signatureCanvas.current?.toDataURL() || "",
                              { shouldValidate: true, shouldDirty: true }
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end p-4 px-4 input">
                  <Button
                    className="ml-auto"
                    loading={isPending}
                    onClick={handleSubmit(
                      async () => {
                        setPending(true);
                        await new Promise((resolve) =>
                          setTimeout(resolve, 2000)
                        );
                        try {
                          const blob = await htmlElementToPdfBlob(
                            contentRef.current!
                          );
                          await generateDocument({
                            HelpRequestId: data.id,
                            Document: blob,
                          });
                          toast.success("ბარათი წარმატებით გაგზავნილია");
                          onClose();
                        } catch (error: any) {
                          toast.error(error.error || "მოხდა შეცდომა");
                        } finally {
                          setPending(false);
                        }
                      },
                      (errors) => console.log(errors)
                    )}
                   
                    type="submit"
                  >
                    დასრულება
                  </Button>
                </div>
              </div>

              {/* Footer */}
            </div>
            <style>{`
  @media print {
    @page {
      size: A4;
      margin: 0cm;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Override for print */
    .print-page {
      width: 100% !important;
      height: auto !important;
      margin: 0 !important;
      box-shadow: none !important;
    }

    /* Optional: remove flex centering on outer container during print */
    body > div {
      display: block !important;
    }
  }

  /* PDF Print Mode Styles */
  .pdf-print-mode .input {
    display: none !important;
  }

  .pdf-print-mode .sigCanvas {
    display: none !important;
  }

  .pdf-print-mode button {
    display: none !important;
  }

  .pdf-print-mode .print-page {
    width: 210mm !important;
    height: 297mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }

  .pdf-print-mode .label {
    display: block !important;
  }

  .pdf-edit-mode .label {
    display: none !important;
  }

  .pdf-edit-mode .input {
    display: block !important;
  }
`}</style>
          </div>
        </Modal>
      </>
    )
  );
}
