import { useState } from "react";
import ComponentCard from "../components/common/ComponentCard";
import Button from "../components/ui/button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import { useActivateFreeTrial } from "../store/server/subscription/mutations";
import { toast } from "react-toastify";
import { Plus, X, CheckCircle2, Loader2 } from "lucide-react";

const FreeTrialPage = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);
  const activateFreeTrialMutation = useActivateFreeTrial();
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const addPhoneField = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const removePhoneField = (index: number) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
    }
  };

  const updatePhoneNumber = (index: number, value: string) => {
    const updated = [...phoneNumbers];
    updated[index] = value;
    setPhoneNumbers(updated);
  };

  const handleSubmit = async () => {
    const validPhoneNumbers = phoneNumbers
      .map((phone) => phone.trim())
      .filter((phone) => phone.length > 0);

    if (validPhoneNumbers.length === 0) {
      toast.error("გთხოვთ შეიყვანოთ მინიმუმ ერთი ტელეფონის ნომერი");
      return;
    }

    try {
      await activateFreeTrialMutation.mutateAsync({
        phoneNumbers: validPhoneNumbers,
      });
      
      setSuccessCount(validPhoneNumbers.length);
      setPhoneNumbers([""]);
      toast.success(
        `${validPhoneNumbers.length} მომხმარებელს გააქტივებული აქვს უფასო საცდელი ვერსია!`
      );
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccessCount(null);
      }, 5000);
    } catch (error: any) {
      toast.error(
        error?.error || error?.message || "დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან."
      );
    }
  };

  const isValidPhone = (phone: string) => {
    const trimmed = phone.trim();
    return trimmed.length >= 9 && /^[0-9]+$/.test(trimmed);
  };

  const allPhonesValid = phoneNumbers.every(
    (phone) => phone.trim() === "" || isValidPhone(phone)
  );

  return (
    <ComponentCard
      title="უფასო საცდელი ვერსიის აქტივაცია"
      bodyClassName="sm:p-6"
    >
      <div className="space-y-6">
        {/* Success Message */}
        {successCount !== null && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-emerald-900 dark:text-emerald-100">
                წარმატებით გააქტივდა!
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                {successCount} მომხმარებელს გააქტივებული აქვს უფასო საცდელი ვერსია
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {/* <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>ინსტრუქცია:</strong> შეიყვანეთ ტელეფონის ნომრები, რომლებსაც გსურთ
            უფასო საცდელი ვერსიის გაცემა. შეგიძლიათ ერთდროულად რამდენიმე ნომრის დამატება.
          </p>
        </div> */}

        {/* Phone Number Fields */}
        <div className="space-y-3">
          <Label>ტელეფონის ნომრები</Label>
          {phoneNumbers.map((phone, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="მაგ: 595123456"
                  value={phone}
                  onChange={(e) => updatePhoneNumber(index, e.target.value)}
                  error={
                    phone.trim() !== "" && !isValidPhone(phone)
                      ? true
                      : false
                  }
                  hint={
                    phone.trim() !== "" && !isValidPhone(phone)
                      ? "ტელეფონის ნომერი უნდა შედგებოდეს მინიმუმ 9 ციფრისგან"
                      : undefined
                  }
                />
              </div>
              {phoneNumbers.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removePhoneField(index)}
                  className="mt-0 h-11 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Add More Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={addPhoneField}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          დამატება
        </Button>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={
              activateFreeTrialMutation.isPending ||
              !allPhonesValid ||
              phoneNumbers.every((p) => p.trim() === "")
            }
            className="flex-1 sm:flex-none sm:min-w-[200px]"
          >
            {activateFreeTrialMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                აქტივაცია...
              </>
            ) : (
              "საცდელი ვერსიის აქტივაცია"
            )}
          </Button>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <span>
              {phoneNumbers.filter((p) => p.trim() !== "").length} ნომერი
              მზადაა აქტივაციისთვის
            </span>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default FreeTrialPage;
