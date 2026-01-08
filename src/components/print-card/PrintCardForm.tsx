import clsx from "clsx";
import Input from "../../components/form/input/InputField";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { useRef, useState, useEffect } from "react";
import DatePicker from "../../components/form/date-picker";
import TextArea from "../../components/form/input/TextArea";
import SignatureCanvas from "react-signature-canvas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RequestResponseModel } from "../../store/server/requets/interfaces";
import dayjs from "dayjs";
import { useRequestDocumentGenerate } from "../../store/server/requets/mutations";
import Button from "../ui/button";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "../../context/ThemeContext";

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

const RenderTextField = ({
  isPrintMode = false,
  direction = "row",
  label = "ბარათის ნომერი",
  value = "",
  inputClassName,
  type = "text",
  id,
  disabled = false,
  onChange,
  error,
  minDate,
  maxDate,
}: {
  isPrintMode?: boolean;
  direction?: "row" | "column";
  label?: string;
  value?: string;
  inputClassName?: string;
  type?: "text" | "textarea" | "date" | "date-time" | "signature";
  id: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  error?: boolean;
  minDate?: Date;
  maxDate?: Date;
}) => {
  const signatureCanvas = useRef<SignatureCanvas>(null);
  const canvasContainer = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 600, height: 150 });
  const previousWidth = useRef<number>(600);

  useEffect(() => {
    if (type !== "signature" || !canvasContainer.current || isPrintMode) return;

    const updateCanvasSize = () => {
      if (canvasContainer.current) {
        const width = canvasContainer.current.offsetWidth;
        const height = 150;
        
        // Only update if width actually changed
        if (Math.abs(width - previousWidth.current) > 5) {
          setCanvasDimensions({ width, height });
          previousWidth.current = width;
          
          // Clear canvas on resize to avoid coordinate mismatch
          if (signatureCanvas.current) {
            signatureCanvas.current.clear();
            onChange?.("");
          }
        }
      }
    };

    // Set initial size
    const initialWidth = canvasContainer.current.offsetWidth;
    setCanvasDimensions({ width: initialWidth, height: 150 });
    previousWidth.current = initialWidth;

    // Listen for window resize and zoom
    window.addEventListener("resize", updateCanvasSize);

    // Use ResizeObserver for more responsive updates
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(canvasContainer.current);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      resizeObserver.disconnect();
    };
  }, [type, isPrintMode]);

  return (
    <div
      className={clsx(
        "flex gap-x-2 gap-y-2 w-full",
        direction === "column" ? "flex-col " : "flex-row items-baseline"
      )}
    >
      <p
        className={clsx(
          "text-lg text-black dark:text-white font-semibold",
          error ? "text-red-500" : ""
        )}
      >
        {label}:
      </p>
      <div className={clsx("w-full", inputClassName)}>
        {/* Print mode: show line */}
        {isPrintMode && (
          <>
            {type === "signature" ? (
              <div className="w-full h-full border-b-2 border-b-black dark:border-b-white pb-1">
                <img src={value} alt="signature" className="w-[50%]" />
              </div>
            ) : (
              <p
                className={clsx(
                  `w-full  dark:text-white pb-1 text-lg break-words ${
                    isPrintMode ? "block" : "hidden"
                  }`,
                  error ? "text-red-500" : "",
                  type === "textarea"
                    ? "border-2 border-black dark:border-white rounded-md p-2 min-h-[180px]"
                    : "border-b-2 border-b-black dark:border-b-white"
                )}
              >
                {type === "date" ? dayjs(value).format("MM.DD.YYYY") : ""}
                {type === "date-time"
                  ? dayjs(value).format("MM.DD.YYYY HH:mm")
                  : ""}
                {type === "text" || type === "textarea" ? value : ""}
              </p>
            )}
          </>
        )}
        {/* Edit mode: show input */}
        <div
          className={clsx(
            isPrintMode ? "hidden" : "block",
            disabled ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          {type === "text" && (
            <Input
              type="text"
              id={id}
              placeholder={label}
              className={clsx("w-full input", error ? "border-red-500" : "")}
              rootClassName="w-full"
              onChange={(e) => {
                if (!disabled) {
                  onChange?.(e.target.value);
                }
              }}
              value={value}
            />
          )}
          {type === "textarea" && (
            <TextArea
              placeholder="ბარათის ნომერი"
              className={clsx(
                "w-full input min-h-[180px]",
                error ? "border-red-500" : ""
              )}
              value={value}
              onChange={(e) => {
                if (!disabled) {
                  console.log(e);
                  onChange?.(e);
                }
              }}
            />
          )}
          {(type === "date" || type === "date-time") && (
            <DatePicker
              id={id}
              placeholder={label}
              className={clsx("w-full input", error ? "border-red-500" : "")}
              enableTime={type === "date-time"}
              defaultDate={value}
              onChange={(e) => {
                if (!disabled) {
                  onChange?.(e[0].toISOString());
                }
              }}
              minDate={minDate}
              maxDate={maxDate}
            />
          )}
          {type === "signature" && (
            <div 
              ref={canvasContainer}
              className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-md border-2 border-gray-300 dark:border-gray-600"
            >
              <SignatureCanvas
                penColor="black"
                ref={signatureCanvas}
                canvasProps={{
                  width: canvasDimensions.width,
                  height: canvasDimensions.height,
                  className: "w-full h-[150px]",
                }}
                onEnd={() => {
                  if (!disabled) {
                    const value =
                      signatureCanvas.current?.getCanvas().toDataURL() || "";
                    onChange?.(value);
                  }
                }}
              />
           
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start gap-2 mb-2 flex-col w-full space-y-4">
      <h3 className="text-[#900a16] text-xl font-semibold border-l-4 border-l-[#900a16] pl-2">
        მომხმარებლის ინფორმაცია
      </h3>
      <div className="flex flex-col gap-4 w-full">{children}</div>
    </div>
  );
};

const generateHtmlPdf = async () => {
  const input = document.getElementById("content-to-pdf") as HTMLElement;
  if (!input) {
    console.error("Element not found");
    return;
  }

  try {
    // A4 dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10; // 10mm margins
    const contentWidth = pageWidth - margin * 2;

    // Capture the form with high quality
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      allowTaint: true,
    });

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate the PDF dimensions maintaining aspect ratio
    const pdfHeight = (imgHeight / imgWidth) * contentWidth;

    // Create PDF
    const doc = new jsPDF("p", "mm", "a4");
    let pdfHeightRemaining = pageHeight - margin * 2;
    let position = 0;
    let pageNumber = 0;

    // Divide image into sections that fit on each page
    while (position < pdfHeight) {
      if (pageNumber > 0) {
        doc.addPage();
      }

      // Calculate how much of the image fits on this page
      const sectionHeight = Math.min(pdfHeightRemaining, pdfHeight - position);

      // Calculate the source rectangle from the original canvas
      const srcHeight = (sectionHeight / pdfHeight) * imgHeight;
      const srcY = (position / pdfHeight) * imgHeight;

      // Create a temporary canvas for this page section
      const sectionCanvas = document.createElement("canvas");
      sectionCanvas.width = imgWidth;
      sectionCanvas.height = srcHeight;

      const ctx = sectionCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          srcY,
          imgWidth,
          srcHeight,
          0,
          0,
          imgWidth,
          srcHeight
        );
      }

      // Convert section to image and add to PDF
      const sectionImgData = sectionCanvas.toDataURL("image/png");
      doc.addImage(
        sectionImgData,
        "PNG",
        margin,
        margin,
        contentWidth,
        sectionHeight,
        "",
        "FAST"
      );

      position += sectionHeight;
      pdfHeightRemaining = pageHeight - margin * 2;
      pageNumber++;
    }
    return doc.output("blob");
  } catch (error) {
    console.error("PDF generation error:", error);
  }
};
const PrintCardForm = ({
  data,
  pending,
  setPending,
}: {
  data: RequestResponseModel["helpRequests"][number];
  pending: boolean;
  setPending: (pending: boolean) => void;
}) => {
  const [isPrintMode, setIsPrintMode] = useState(false);
  const { mutateAsync: generateDocument } = useRequestDocumentGenerate();
  const { toggleTheme, theme } = useTheme();

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
      customerName: data?.child?.name,
      customerAge: data?.child?.age.toString(),
      customerParentName: data?.responderParentUser?.name,
      policeName: "",
      doctorName: "",
      address: data?.child?.address || data?.address || "",
      arriveTime: "",
      reason: "",
      finishTime: "",
      description: "",
      responsiblePersonName: "",
      signature: "",
      date: new Date().toISOString(),
    },
  });
  const queryClient = useQueryClient();

  return (
    <>
      <div
        id="content-to-pdf"
        className={clsx(
          " bg-white dark:bg-gray-900 o",
          !pending && "max-h-[90vh] overflow-auto"
        )}
      >
        <section
          id="header"
          className="grid grid-cols-3 items-center justify-between border-b-2 border-b-[#900a16] dark:border-b-red-600 p-4"
        >
          <div />
          <img
            src="/images/logo.png"
            alt="logo"
            className="rounded-sm w-36 mx-auto"
          />
          <div className="text-[#900a16] dark:text-red-500 flex items-center gap-2 text-sm justify-end">
            <svg
              className="w-5 h-5"
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
            <span className="tracking-wide text-lg">*0100</span>
          </div>
        </section>
        <div className="flex flex-col gap-8">
          <section id="title" className="px-4">
            <div className="flex flex-col w-fit mx-auto gap-2 items-center py-12">
              <h2 className="text-[#900a16] dark:text-red-500 font-semibold text-center">
                სერვისის გამოძახების ბარათი
              </h2>
              <div className="h-2 bg-[#900a16]/10 dark:bg-red-500/20 rounded w-[120%]"></div>
            </div>
            <RenderTextField
              isPrintMode={isPrintMode}
              direction="row"
              label="ბარათის ნომერი"
              value={watch("cardNumber")}
              inputClassName="max-w-xs"
              id="card-number"
              disabled={isPrintMode}
              onChange={(value) => {
                setValue("cardNumber", value, { shouldValidate: true });
              }}
              error={!!errors.cardNumber}
            />
          </section>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-4">
            <section id="customer-info" className="">
              <CardWrapper>
                <RenderTextField
                  isPrintMode={isPrintMode}
                  direction="column"
                  label="სახელი გვარი"
                  value={watch("customerName")}
                  id="name"
                  disabled={true}
                  onChange={(value) => {
                    if(value.length > 30) {
                      toast.error("სიმბოლოების მაქსიმალური რაოდენობა არის 30");
                      return;
                    }
                    setValue("customerName", value, { shouldValidate: true });
                  }}
                  error={!!errors.customerName}
                />
                <RenderTextField
                  isPrintMode={isPrintMode}
                  direction="column"
                  label="ასაკი"
                  value={watch("customerAge")}
                  id="age"
                  disabled={true}
                  onChange={(value) => {
                    if(Number(value) > 99) {
                      toast.error("ასაკი მაქსიმალური ზღვარია 99");
                      return;
                    }
                    setValue("customerAge", value, { shouldValidate: true });
                  }}
                  error={!!errors.customerAge}
                />
                <RenderTextField
                  isPrintMode={isPrintMode}
                  direction="column"
                  label="მშობლის სახელი გვარი"
                  value={watch("customerParentName")}
                  id="parent-name"
                  disabled={true}
                  onChange={(value) => {
                    if(value.length > 30) {
                      toast.error("სიმბოლოების მაქსიმალური რაოდენობა არის 30");
                      return;
                    }
                    setValue("customerParentName", value, {
                      shouldValidate: true,
                    });
                  }}
                  error={!!errors.customerParentName}
                />
              </CardWrapper>
            </section>
            <section id="crew-info" className="">
              <CardWrapper>
                <RenderTextField
                  isPrintMode={isPrintMode}
                  direction="column"
                  label="დაცვა"
                  value={watch("policeName")}
                  id="security-name"
                  disabled={isPrintMode}
                  onChange={(value) => {
                    if(value.length > 30) {
                      toast.error("სიმბოლოების მაქსიმალური რაოდენობა არის 30");
                      return;
                    }
                    setValue("policeName", value, { shouldValidate: true });
                  }}
                  error={!!errors.policeName}
                />
                <RenderTextField
                  isPrintMode={isPrintMode}
                  direction="column"
                  label="უმცროსი ექიმი"
                  value={watch("doctorName")}
                  id="doctor-name"
                  disabled={isPrintMode}
                  onChange={(value) => {
                    if(value.length > 30) {
                      toast.error("სიმბოლოების მაქსიმალური რაოდენობა არის 30");
                      return;
                    }
                    setValue("doctorName", value, { shouldValidate: true });
                  }}
                  error={!!errors.doctorName}
                />
              </CardWrapper>
            </section>
          </div>
          <section id="details" className="px-4">
            <CardWrapper>
              <div className="flex gap-x-4 gap-y-6 flex-col">
                <RenderTextField
                  isPrintMode={isPrintMode}
                  direction="column"
                  label="შემთხვევის მისამართი"
                  value={watch("address")}
                  id="address"
                  disabled={!!data?.address || !!data?.child?.address}
                  onChange={(value) => {
                    if(value.length > 100) {
                      toast.error("სიმბოლოების მაქსიმალური რაოდენობა არის 100");
                      return;
                    }
                    setValue("address", value, { shouldValidate: true });
                  }}
                  error={!!errors.address}
                />
                <RenderTextField
                  isPrintMode={isPrintMode}
                  direction="column"
                  label="გამოძახების მიზეზი"
                  value={watch("reason")}
                  id="reason"
                  disabled={isPrintMode}
                  onChange={(value) => {
                    if(value.length > 500) {
                      toast.error("სიმბოლოების მაქსიმალური რაოდენობა არის 500");
                      return;
                    }
                    setValue("reason", value, { shouldValidate: true });
                  }}
                  error={!!errors.reason}
                />
                <div className="grid grid-cols-2 gap-8">
                  <RenderTextField
                    isPrintMode={isPrintMode}
                    direction="column"
                    label="მისვლის დრო"
                    value={watch("arriveTime")}
                    type="date-time"
                    id="arrival-time"
                    disabled={isPrintMode}
                    onChange={(value) => {
                      const finishTime = watch("finishTime");
                      if (finishTime && new Date(value) >= new Date(finishTime)) {
                        toast.error("მისვლის დრო უნდა იყოს დასრულების დროზე ადრე");
                        return;
                      }
                      setValue("arriveTime", value, { shouldValidate: true });
                    }}
                    error={!!errors.arriveTime}
                    minDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                    maxDate={new Date(new Date().setDate(new Date().getDate()))}
                  />
                  <RenderTextField
                    isPrintMode={isPrintMode}
                    direction="column"
                    label="დასრულების დრო"
                    value={watch("finishTime")}
                    type="date-time"
                    id="finish-time"
                    disabled={isPrintMode}
                    onChange={(value) => {
                      const arriveTime = watch("arriveTime");
                      if (arriveTime && new Date(value) <= new Date(arriveTime)) {
                        toast.error("დასრულების დრო უნდა იყოს მისვლის დროზე გვიან");
                        return;
                      }
                      setValue("finishTime", value, { shouldValidate: true });
                    }}
                    error={!!errors.finishTime}
                    minDate={watch("arriveTime") ? new Date(watch("arriveTime")) : new Date(new Date().setDate(new Date().getDate() - 1))}
                    maxDate={new Date(new Date().setDate(new Date().getDate()))}
                  />
                </div>
                <RenderTextField
                  isPrintMode={isPrintMode}
                  direction="column"
                  label="შემთხვევის აღწერა"
                  value={watch("description")}
                  type="textarea"
                  id="description"
                  disabled={isPrintMode}
                  onChange={(value) => {
                    if(value.length > 1000) {
                      toast.error("სიმბოლოების მაქსიმალური რაოდენობა არის 1000");
                      return;
                    }
                    setValue("description", value, { shouldValidate: true });
                  }}
                  error={!!errors.description}
                />
              </div>
            </CardWrapper>
          </section>
          <section id="signature" className="px-4">
            <CardWrapper>
              <div className="grid grid-cols-2 gap-8">
                <RenderTextField
                  isPrintMode={isPrintMode}
                  direction="column"
                  label="მეურვე/დროებითი პასუხისმგებელი პირი"
                  value={watch("responsiblePersonName")}
                  id="responsible-person-name"
                  disabled={isPrintMode}
                  onChange={(value) => {
                    if(value.length > 30) {
                      toast.error("სიმბოლოების მაქსიმალური რაოდენობა არის 30");
                      return;
                    }
                    setValue("responsiblePersonName", value, {
                      shouldValidate: true,
                    });
                  }}
                  error={!!errors.responsiblePersonName}
                />
                <RenderTextField
                  isPrintMode={isPrintMode}
                  direction="column"
                  label="თარიღი"
                  value={watch("date")}
                  inputClassName="pointer-events-none"
                  type="date"
                  id="date"
                  disabled={true}
                  onChange={(value) => {
                    setValue("date", value, { shouldValidate: true });
                  }}
                  error={!!errors.date}
                />
              </div>
              <div
                className={clsx(
                  "w-full pb-4 flex",
                  isPrintMode
                    ? "[&>div]:items-baseline mt-4"
                    : "[&>div]:items-center mt-8"
                )}
              >
                <RenderTextField
                  isPrintMode={isPrintMode}
                  direction="row"
                  label="ხელმოწერა"
                  value={watch("signature")}
                  type="signature"
                  id="signature"
                  disabled={isPrintMode}
                  onChange={(value) => {
                    setValue("signature", value, { shouldValidate: true });
                  }}
                  error={!!errors.signature}
                />
              </div>
            </CardWrapper>
          </section>
        </div>
        {!isPrintMode && (
          <div className="flex justify-end p-4 px-4 input">
            <Button
              className="ml-auto"
              loading={pending}
              onClick={handleSubmit(
                async () => {
                  setPending(true);
                  try {
                    setIsPrintMode(true);
                   
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    if(theme === "dark") {
                      toggleTheme();
                      await new Promise((resolve) => setTimeout(resolve, 300));
                    }
                    const blob = await generateHtmlPdf();
                    if (!blob) {
                      throw new Error("მოხდა შეცდომა");
                    }
                    await generateDocument({
                      HelpRequestId: data.id,
                      Document: blob,
                    });
                    
                    await queryClient.invalidateQueries({
                      queryKey: ["new-requests", "requests"],
                    });
                    toast.success("ბარათი წარმატებით გაგზავნილია");
                  } catch (error: any) {
                    setIsPrintMode(false);
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
        )}
      </div>
    </>
  );
};

export default PrintCardForm;
