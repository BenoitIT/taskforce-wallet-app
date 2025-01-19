"use client";
import { cn } from "@/lib/utils";
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
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { categoriesInfo } from "@/interfaces/categories";
import { createCategory, getCategory, updateCategory } from "@/app/services/category";
import { toast } from "react-toastify";
import useSWR from "swr";
import Loader from "@/components/loader";
import ErrorSection from "@/components/error-section";
import { updateBuget } from "@/app/services/budget";

const Page = ({ className, ...props }: React.ComponentProps<"div">) => {
  const router = useRouter();
  const session: any = useSession();
  const params: any = useParams();
  const id = params?.id;
  const [payload, setPayload] = useState<categoriesInfo>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<categoriesInfo>({});
  const userId = session?.data?.id;
  const { data, isLoading, error } = useSWR(userId && ["category", userId], () =>
    getCategory(id)
  );
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setErrors((prevState: categoriesInfo) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPayload((prevState: categoriesInfo) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    ErrorLogger(e.target.name, null);
  };
  const handleSelectTypeChange = (value: string) => {
    setPayload({ ...payload, type: value });
    setErrors((prevState: categoriesInfo) => ({
      ...prevState,
      type: "",
    }));
    ErrorLogger("type", null);
  };
  useEffect(() => {
    if (data) {
      setPayload(data.data);
    }
  }, [data]);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const type = form.elements.namedItem("type") as HTMLInputElement;
    if (name.value == "") {
      ErrorLogger("name", "category name is required.");
    } else if (type.value == "") {
      ErrorLogger("type", "Category type is required.");
    } else {
      setLoading(true);
      try {
        payload.userId = userId;
        delete payload.id;
        const response = await updateCategory(id,payload);
        if (response?.status === 200) {
          toast.success(response?.message);
          form.reset();
          router.back();
        } else {
          toast.error(response?.message || "Failed to update category");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
 if(data){
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
                <h1 className="text-2xl font-bold">Update category</h1>
                <p className="text-balance text-muted-foreground">
                  Information
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={payload.name}
                  placeholder="Ex:salary"
                  onChange={handleChange}
                />
                <span
                  className={errors?.name ? "text-xs text-red-500" : "hidden"}
                >
                  {errors?.name}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Category Type</Label>
                <Select name="type" onValueChange={handleSelectTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={payload.type} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <span
                  className={errors?.type ? "text-xs text-red-500" : "hidden"}
                >
                  {errors?.type}
                </span>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#B2BEB5]"
                disabled={loading}
              >
                {loading ? "Loading..." : "save"}
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
