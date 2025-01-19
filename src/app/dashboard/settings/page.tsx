"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { userInfo, userInfoError } from "@/interfaces/users";
import { updatePassword } from "@/app/services/users";
import { toast } from "react-toastify";
const Page = () => {
  const session: any = useSession();
  const username = session?.data?.user?.name;
  const email = session?.data?.user?.email;
  const [expand, setExapand] = useState(false);
  const [payload, setPayload] = useState<userInfo>({});
  const [errors, setErrors] = useState<userInfoError>({});
  const userid = session?.data?.id;
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setErrors((prevState: userInfoError) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
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
    const oldPassword = form.elements.namedItem(
      "oldpassword"
    ) as HTMLInputElement;
    const NewPassword = form.elements.namedItem("password") as HTMLInputElement;
    const cPassword = form.elements.namedItem("cpassword") as HTMLInputElement;
    if (NewPassword.value == "") {
      ErrorLogger("password", "password is required");
    } else if (oldPassword.value == "") {
      ErrorLogger("cpassword", "confirm password is required");
    } else if (cPassword.value == "") {
      ErrorLogger("cpassword", "Please confirm your password");
    } else if (payload?.password != cPassword.value) {
      ErrorLogger("cpassword", "Passwords do not match");
    } else {
      try {
        const response = await updatePassword(userid, payload);
        if (response?.status == 200) {
          toast.success(response.message);
        } else {
          toast.error(response?.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border mt-12">
      <div className="w-full flex justify-between">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-semibold text-gray-900">
            {username}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-900">
            Other related information.
          </p>
        </div>
        <Button className="bg-red-800" onClick={handleSignOut}>
          Logout
        </Button>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-700">Email</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {email}
            </dd>
          </div>
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-700">Ownership</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              Wallet owner
            </dd>
          </div>
        </dl>
      </div>
      <div className="w-full px-4 md:py-5 py-2 sm:px-6 md:mt-4 mt-2">
        <div className="flex justify-between">
          <Label className="w-full font-semibold">Change password</Label>
          <Label
            className="text-sm font-bold cursor-pointer w-full text-right"
            onClick={() => setExapand(!expand)}
          >
            {expand ? "Minimize" : "Expand"}
          </Label>
        </div>
        <div className={expand ? "w-full mt-6 lg:w-[60%]" : "hidden"}>
          <form onSubmit={handleSubmit}>
            <Label className="text-sm my-2 font-medium">Old password</Label>
            <Input
              placeholder="Old passsowrd..."
              type="password"
              name="oldpassword"
              onChange={handleChange}
            />
            <span
              className={errors?.oldpassword ? "text-xs text-red-500" : "hidden"}
            >
              {errors?.password}
            </span>
            <div className="flex flex-col md:flex-row w-full gap-2 mt-2">
              <div className="w-full">
                <Label className="text-sm my-2 font-medium">New password</Label>
                <Input
                  placeholder="passsowrd..."
                  type="password"
                  name="password"
                  onChange={handleChange}
                />{" "}
                <span
                  className={
                    errors?.password ? "text-xs text-red-500" : "hidden"
                  }
                >
                  {errors?.password}
                </span>
              </div>
              <div className="w-full">
                <Label className="text-sm my-2 font-medium">
                  Confirm new password
                </Label>
                <Input
                  placeholder="passsowrd..."
                  type="password"
                  name="cpassword"
                  onChange={handleChange}
                />
                <span
                  className={
                    errors?.cpassword ? "text-xs text-red-500" : "hidden"
                  }
                >
                  {errors?.cpassword}
                </span>
              </div>
            </div>
            <Button className="mt-4 bg-[#B2BEB5]" type="submit">
              save
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Page;
