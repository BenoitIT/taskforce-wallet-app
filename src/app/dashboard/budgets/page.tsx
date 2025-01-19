"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
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
import Budget from "@/components/pages/budgets";
import { budgetHeaders } from "@/components/table-headers/budget";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { deleteBudget, getBudgets } from "@/app/services/budget";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const currentpath: string = usePathname()!;
  const session: any = useSession();
  const [rowId, setRowId] = useState<any>();
  const [action, setRespondAction] = useState(false);
  const userId = session?.data?.id;
  const { data, isLoading, error } = useSWR(
    userId && ["budget", userId, action],
    () => getBudgets(userId)
  );
  const handleEdit = async (id: number | string) => {
    router.push(`${currentpath}/${id}`);
  };

  const handleDelete = async (id: number) => {
    setRowId(id);
  };
  const handleConfirmDelete = async (id: number) => {
    try {
      const message = await deleteBudget(id);
      toast.success(message);
      setRespondAction(!action);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete this category");
    }
  };
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
                budget.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className=" text-white bg-black">
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
        <Budget headers={budgetHeaders} data={data.data} action={actions} />
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
