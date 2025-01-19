"use client";
import useSWR from "swr";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState, Suspense } from "react";
import { headers } from "@/components/table-headers/account";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Loader from "@/components/loader";
import ErrorSection from "@/components/error-section";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Accounts from "@/components/pages/accounts";
import { deleteCashAccount, getCashaccount } from "@/app/services/account";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const currentpath: string = usePathname()!;
  const searchParams: any = useSearchParams();
  const session: any = useSession();
  const activePage = searchParams?.get("page");
  const [rowId, setRowId] = useState<any>();
  const [action, setRespondAction] = useState(false);
  const userId = session?.data?.id;
  const { data, isLoading, error } = useSWR(
    userId && ["cashaccount", userId, action],
    () => getCashaccount(userId)
  );
  const handleEdit = async (id: number | string) => {
    router.push(`${currentpath}/${id}`);
  };
  const handleDelete = async (id: number) => {
    setRowId(id);
  };
  const handleConfirmDelete = async (id: number) => {
    try {
      const message = await deleteCashAccount(id);
      toast.success(message);
      setRespondAction(!action);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete this account");
    }
  };

  useEffect(() => {
    if (activePage) {
    }
  }, [activePage]);
  const actions = [
    { icon: <FaEdit />, Click: handleEdit },
    {
      icon: (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <FaTrash />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className=" text-black">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-black opacity-65">
                This action cannot be undone. This will permanently delete the
                account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className=" text-white bg-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleConfirmDelete(rowId);
                }}
                className="bg-[#55865f]"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
      Click: handleDelete,
      name: "delete",
    },
  ];

  if (data) {
    return (
      <div className="w-full">
        <Accounts headers={headers} data={data?.data} action={actions} />
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
const SuspensePage = () => (
  <Suspense fallback={<Loader />}>
    <Page />
  </Suspense>
);

export default SuspensePage;
