"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { cashAccountInfo } from "@/interfaces/accounts";
import { createCashaccount } from "@/app/services/account";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
const Page = () => {
  const router = useRouter();
  const session: any = useSession();
  const [payload, setPayload] = useState<cashAccountInfo>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<cashAccountInfo>({});
  const userId = session?.data?.id;
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setErrors((prevState: cashAccountInfo) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPayload((prevState: cashAccountInfo) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    ErrorLogger(e.target.name, null);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const type = form.elements.namedItem("type") as HTMLInputElement;
    const balance = form.elements.namedItem("balance") as HTMLInputElement;
    if (name.value == "") {
      ErrorLogger("name", "Account name is required.");
    } else if (type.value == "") {
      ErrorLogger("type", "Account type is required.");
    } else if (balance.value == "") {
      ErrorLogger("balance", "Initial balance is required.");
    } else {
      setLoading(true);
      try {
        payload.userId = userId;
        delete payload.id;
        payload.balance = Number(payload.balance);
        const response = await createCashaccount(payload);
        if (response?.status === 201) {
          toast.success("Cash ccount created successfully!");
          form.reset();
          router.back();
        } else {
          toast.error(response?.message || "Failed to create money account");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className={cn("flex flex-col gap-6 mt-6")}>
      <b
        className="font-semibold text-base hover:cursor-pointer"
        onClick={() => router.back()}
      >
        Back
      </b>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 lg:mx-[20vw] md:mx-[10vw] mx-2">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Account registration</h1>
                <p className="text-balance text-muted-foreground">
                  Fill the fields below
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Account Number</Label>
                <Input
                  id="accountnumber"
                  type="text"
                  name="accountnumber"
                  placeholder="Ex:000000000000"
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Ex:Equity, MOMO.."
                  onChange={handleChange}
                />
                <span
                  className={errors?.name ? "text-xs text-red-500" : "hidden"}
                >
                  {errors?.name}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Account Type</Label>
                <Input
                  id="type"
                  type="text"
                  name="type"
                  placeholder="Ex:Bank"
                  onChange={handleChange}
                />
                <span
                  className={errors?.type ? "text-xs text-red-500" : "hidden"}
                >
                  {errors?.type}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="balance">Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  name="balance"
                  placeholder="Ex:200000"
                  onChange={handleChange}
                />
                <span
                  className={
                    errors?.balance ? "text-xs text-red-500" : "hidden"
                  }
                >
                  {errors?.balance}
                </span>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#B2BEB5]"
                disabled={loading}
              >
                {!loading ? "save" : "Loading..."}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Page;
