"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import useSWR from "swr";
import { getCashaccount } from "@/app/services/account";
import { useSession } from "next-auth/react";
import { cashAccountInfo } from "@/interfaces/accounts";
import Loader from "@/components/loader";
import ErrorSection from "@/components/error-section";
import { ChangeEvent, FormEvent, Suspense, useState } from "react";
import { getCategories } from "@/app/services/category";
import { categoriesInfo } from "@/interfaces/categories";
import { toast } from "react-toastify";
import { transactionInfo } from "@/interfaces/transaction";
import { createTransaction } from "@/app/services/transaction";

const Page = ({ className, ...props }: React.ComponentProps<"div">) => {
  const router = useRouter();
  const session: any = useSession();
  const userId = session?.data?.id;
  const [payload, setPayload] = useState<transactionInfo>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<transactionInfo>({});
  const { data, isLoading, error } = useSWR(
    userId && ["cashaccount", userId],
    () => getCashaccount(userId)
  );
  const {
    data: categories,
    isLoading: laoder,
    error: errorinfo,
  } = useSWR(userId && ["category", userId], () => getCategories(userId));
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setErrors((prevState: transactionInfo) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setPayload((prevState: transactionInfo) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    ErrorLogger(e.target.name, null);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const form = e.target as HTMLFormElement;
    e.preventDefault();
    setLoading(true);
    try {
      payload.userId = userId;
      delete payload.id;
      const response = await createTransaction(payload);
      if (response?.status === 201) {
        toast.success(response?.message);
        form.reset();
        router.back();
      } else {
        toast.error(response?.message || "Failed to create transaction");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (data?.data) {
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
                  <h1 className="text-2xl font-bold">New Transaction</h1>
                  <p className="text-balance text-muted-foreground">
                    Fill the fields below
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Account Name</Label>
                  <div className="relative">
                    <select
                      name="accountId"
                      className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                      onChange={handleChange}
                    >
                      <option value="">select...</option>
                      {data?.data.map((account: cashAccountInfo) => (
                        <option value={account?.id} key={account?.id}>
                          {account.name}  ({account.accountnumber})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Transaction category</Label>
                  <select
                    name="categoryId"
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                    onChange={handleChange}
                  >
                    <option value="">select...</option>
                    {categories?.data.map((category: categoriesInfo) => (
                      <option value={category.id} key={category?.id}>
                        {category.name} ({category.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    name="amount"
                    placeholder="Ex:1000"
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    name="notes"
                    placeholder="Type Notes here."
                    onChange={handleChange}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#B2BEB5]"
                  disabled={loading}
                >
                  {loading ? "loading..." : "save"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (isLoading || laoder) {
    return <Loader />;
  }

  if (error || errorinfo) {
    return <ErrorSection />;
  }
};

const SuspensePage = () => (
  <Suspense fallback={<Loader />}>
    <Page />
  </Suspense>
);

export default SuspensePage;
