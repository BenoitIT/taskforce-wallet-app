"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState, Suspense } from "react";
import {
  transactionHeaders,
  transactionData,
} from "@/components/table-headers/transactions";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Loader from "@/components/loader";
import ErrorSection from "@/components/error-section";
import Paginator from "@/components/paiginator";
import usePagination from "@/hooks/usePagination";
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
import Transactions from "@/components/pages/transactions";
import useSWR from "swr";
import { deleteTransaction, getTransactions } from "@/app/services/transaction";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const session: any = useSession();
  const currentpath: string = usePathname()!;
  const searchParams: any = useSearchParams();
  const activePage = searchParams?.get("page");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowId, setRowId] = useState<any>();
  const [action, setRespondAction] = useState(false);
  const userId = session?.data?.id;
  const { data, isLoading, error } = useSWR(
    userId && ["transactions", userId,action],
    () => getTransactions(userId)
  );
  const { handlePageChange, handleNextPage, handlePreviousPage } =
    usePagination(transactionData, currentPage);
  const handleEdit = async (id: number | string) => {
    router.push(`${currentpath}/${id}`);
  };

  const handleDelete = async (id: number) => {
    setRowId(id);
  };
  const handleConfirmDelete = async (id: number) => {
    try {
      const message = await deleteTransaction(id);
      toast.success(message);
      setRespondAction(!action);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete this category");
    }
  };

  useEffect(() => {
    if (activePage) {
      setCurrentPage(activePage);
    }
  }, [activePage]);
  const actions = [
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
                transaction.
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

  if (data?.data) {
    return (
      <div className="w-full">
        <Transactions
          headers={transactionHeaders}
          data={data?.data}
          action={actions}
        />
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
