"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { userInfo, userInfoError } from "@/interfaces/users";
import { createAnaccount } from "@/app/services/users";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export const SignUp = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const router = useRouter();
  const [payload, setPayload] = useState<userInfo>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<userInfoError>({});
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setErrors((prevState: userInfoError) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPayload((prevState: userInfo) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    ErrorLogger(e.target.name, null);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const firstName = form.elements.namedItem("name") as HTMLInputElement;
    const lastName = form.elements.namedItem("lname") as HTMLInputElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const cpassword = form.elements.namedItem("cpassword") as HTMLInputElement;
    if (firstName.value == "") {
      ErrorLogger("name", "First name is required.");
    } else if (firstName.value.length < 2) {
      ErrorLogger("name", "First name should not be single character");
    } else if (lastName.value == "") {
      ErrorLogger("lname", "Last name is required.");
    } else if (lastName.value.length < 2) {
      ErrorLogger("lname", "Last name should not be single character");
    } else if (email.value == "") {
      ErrorLogger("email", "Email is required.");
    } else if (cpassword.value == "") {
      ErrorLogger("cpassword", "Please confirm your password");
    } else if (payload?.password != cpassword.value) {
      ErrorLogger("cpassword", "Passwords do not match");
    } else {
      setLoading(true);
      try {
        const response = await createAnaccount(payload);
        if (response?.status === 201) {
          toast.success("Account created successfully!");
          form.reset();
          router.push("/");
        } else {
          toast.error(response?.message || "Failed to create account");
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Sign up</h1>
                <p className="text-balance text-muted-foreground">
                  Sign up into your wallet app
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fname">First name</Label>
                <Input id="name" name="name" type="name" placeholder="John" onChange={handleChange} />
                <span
                  className={errors?.name ? "text-xs text-red-500" : "hidden"}
                >
                  {errors?.name}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lname">Last name</Label>
                <Input id="lname" name="lname" type="lname" placeholder="Doe" onChange={handleChange} />
                <span
                  className={errors?.name ? "text-xs text-red-500" : "hidden"}
                >
                  {errors?.name}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  onChange={handleChange}
                />
                <span
                  className={errors?.email? "text-xs text-red-500" : "hidden"}
                >
                  {errors?.email}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="*******"
                />
                <span
                  className={
                    errors?.password ? "text-xs text-red-500" : "hidden"
                  }
                >
                  {errors?.password}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cpassword">Confirm your password</Label>
                <Input
                  id="password"
                  type="password"
                  name="cpassword"
                  onChange={handleChange}
                  placeholder="*******"
                />
                <span
                  className={
                    errors?.cpassword ? "text-xs text-red-500" : "hidden"
                  }
                >
                  {errors?.cpassword}
                </span>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#B2BEB5] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/wallet.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
