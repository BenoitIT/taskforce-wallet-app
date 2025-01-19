"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { categoriesInfo } from "@/interfaces/categories";
import { createCategory } from "@/app/services/category";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const session: any = useSession();
  const [payload, setPayload] = useState<categoriesInfo>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<categoriesInfo>({});
  const userId = session?.data?.id;
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
        const response = await createCategory(payload);
        if (response?.status === 201) {
          toast.success(response?.message);
          form.reset();
          router.back();
        } else {
          toast.error(response?.message || "Failed to create category");
        }
      } catch (error) {
        console.error(error)
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
                <h1 className="text-2xl font-bold">New category</h1>
                <p className="text-balance text-muted-foreground">
                  Fill the fields below
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
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
                    <SelectValue placeholder="category  type" />
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
};
export default Page;
