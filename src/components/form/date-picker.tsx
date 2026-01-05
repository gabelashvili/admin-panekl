import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import { cn } from "../../utils/cn";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: (value: Date[]) => void;
  defaultDate?: any;
  label?: string;
  placeholder?: string;
  inputClassName?: string;
  enableTime?: boolean;
  error?: boolean;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  inputClassName,
  enableTime,
  error,
  className,
  disabled,
  minDate,
  maxDate,
}: PropsType) {
  

  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      enableTime: enableTime || false,
      dateFormat: enableTime ? "d-m-Y H:i" : "d-m-Y",
      time_24hr: true,
      defaultDate,
      locale: {
        rangeSeparator: " - ",
      },
      minDate: minDate,
      maxDate: maxDate,
      closeOnSelect: mode === "single",
      onClose: function(selectedDates, dateStr, instance) {
        if(selectedDates.length == 1){
            onChange?.([selectedDates[0]]);
            instance.setDate([selectedDates[0]], true);
        }
        else if(selectedDates.length == 0) {}
        else {
          onChange?.(selectedDates);
        }
    }
    });

    if (!Array.isArray(flatPickr) && !defaultDate?.[0] && !defaultDate?.[1]) {
      flatPickr.clear();
    }

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate, enableTime]);

  return (
    <div className={cn(className)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          disabled={disabled}
          placeholder={placeholder}
          className={cn("h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800", inputClassName, error && 'border-red-500')}
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
