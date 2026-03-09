import { useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, Loader2 } from "lucide-react";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button";
import { useCancelSubscription } from "../store/server/subscription/mutations";

const SubscriptionCancelPage = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const cancelSubscriptionMutation = useCancelSubscription();

  const isValidPhone = (phone: string) => {
    const trimmed = phone.trim();
    return trimmed.length >= 9 && /^[0-9]+$/.test(trimmed);
  };

  const trimmedPhoneNumber = phoneNumber.trim();

  const handleSubmit = async () => {
    if (!trimmedPhoneNumber) {
      toast.error("გთხოვთ შეიყვანოთ ტელეფონის ნომერი");
      return;
    }

    if (!isValidPhone(trimmedPhoneNumber)) {
      toast.error("ტელეფონის ნომერი უნდა შედგებოდეს მინიმუმ 9 ციფრისგან");
      return;
    }

    try {
      await cancelSubscriptionMutation.mutateAsync({
        phoneNumber: trimmedPhoneNumber,
      });

      setIsSuccess(true);
      setPhoneNumber("");
      toast.success("გამოწერა წარმატებით გაუქმდა!");

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error: any) {
      toast.error(
        error?.error || error?.message || "დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან."
      );
    }
  };

  return (
    <ComponentCard title="გამოწერის გაუქმება" bodyClassName="sm:p-6">
      <div className="space-y-6">
        {isSuccess && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-emerald-900 dark:text-emerald-100">
                წარმატებით შესრულდა!
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                მომხმარებელს გაუუქმდა გამოწერა
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label>ტელეფონის ნომერი</Label>
          <Input
            type="text"
            placeholder="მაგ: 595123456"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={trimmedPhoneNumber !== "" && !isValidPhone(trimmedPhoneNumber)}
            hint={
              trimmedPhoneNumber !== "" && !isValidPhone(trimmedPhoneNumber)
                ? "ტელეფონის ნომერი უნდა შედგებოდეს მინიმუმ 9 ციფრისგან"
                : undefined
            }
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={
              cancelSubscriptionMutation.isPending ||
              !trimmedPhoneNumber ||
              !isValidPhone(trimmedPhoneNumber)
            }
            className="flex-1 sm:flex-none sm:min-w-[200px]"
          >
            {cancelSubscriptionMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                გაუქმება...
              </>
            ) : (
              "გამოწერის გაუქმება"
            )}
          </Button>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <span>ერთჯერადად უქმებს ერთ მომხმარებელს გამოწერას</span>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default SubscriptionCancelPage;
