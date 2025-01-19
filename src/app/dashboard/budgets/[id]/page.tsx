"use client";
import { cn } from "@/lib/utils";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { BudgetInfo } from "@/interfaces/budget";
import { createBuget, getBudget, updateBuget } from "@/app/services/budget";
import useSWR from "swr";
import Loader from "@/components/loader";
import ErrorSection from "@/components/error-section";

const Page = ({ className, ...props }: React.ComponentProps<"div">) => {
  const router = useRouter();
  const params: any = useParams();
  const id = params?.id;
  const [years, setYears] = useState<number[]>([]);
  const session: any = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<BudgetInfo>({});
  const userId = session?.data?.id;
  const { data, isLoading, error } = useSWR(userId && ["singlebudget", userId], () =>
    getBudget(id)
  );
  const [payload, setPayload] = useState<BudgetInfo>({});
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setErrors((prevState: BudgetInfo) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPayload((prevState: BudgetInfo) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    ErrorLogger(e.target.name, null);
  };
  const handleSelectYearChange = (value: string) => {
    setPayload({ ...payload, year: Number(value) });
    setErrors((prevState: BudgetInfo) => ({
      ...prevState,
      year: "",
    }));
    ErrorLogger("year", null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const Amount = form.elements.namedItem("budgetAmount") as HTMLInputElement;
    if (Amount.value == "") {
      ErrorLogger("budgetAmount", "Amount is required.");
    } else if (!payload.year) {
      ErrorLogger("year", "Year should be selected.");
    } else {
      setLoading(true);
      try {
        payload.userId = userId;
        delete payload.id;
        const response = await updateBuget(payload,id);
        if (response?.status === 200) {
          toast.success(response?.message);
          form.reset();
          router.back();
        } else {
          toast.error(response?.message || "Failed to update budget");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (data) {
      setPayload(data.data);
    }
  }, [data]);
  useEffect(() => {
    function getNext50Years() {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = 0; i < 50; i++) {
        years.push(currentYear + i);
      }
      setYears(years);
    }
    getNext50Years();
  }, []);
  if (data) {
    return (
      <div className={cn("flex flex-col gap-6 mt-6", className)} {...props}>
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
                  <h1 className="text-2xl font-bold">Update budget</h1>
                  <p className="text-balance text-muted-foreground">
                    Budget information
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Budget amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    name="budgetAmount"
                    value={payload?.budgetAmount}
                    placeholder="Ex:500000"
                    onChange={handleChange}
                  />
                  <span
                    className={errors?.year ? "text-xs text-red-500" : "hidden"}
                  >
                    {errors?.year}
                  </span>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">Select Year</Label>
                  <Select name="year" onValueChange={handleSelectYearChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={payload?.year} />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year, i) => (
                        <SelectItem value={year.toString()} key={i}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span
                    className={
                      errors?.budgetAmount ? "text-xs text-red-500" : "hidden"
                    }
                  >
                    {errors?.budgetAmount}
                  </span>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#B2BEB5]"
                  disabled={loading}
                >
                  {loading ? "loading.." : "save"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorSection />;
  }

  return null;
};
export default Page;
