"use client";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/app/services/notification";
import ErrorSection from "@/components/error-section";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import { Notification } from "@/interfaces/notification";
import useSWR from "swr";
import { Bell } from "lucide-react";
import { toast } from "react-toastify";

const Page = () => {
  const session: any = useSession();

  const userId = session?.data?.id;
  const { data, isLoading, error } = useSWR(
    userId && ["notificationcount", userId],
    () => getNotifications(userId)
  );
  const handleMarkNotificationASread = async () => {
    try {
      const response = await markNotificationAsRead(userId);
      if (response?.status === 200) {
        toast.success(response?.message);
      } else {
        toast.error(response?.message || "Failed to create category");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
    }
  };
  if (data) {
    return (
      <div className="w-full">
        <div className="w-full flex flex-col-reverse md:flex-row justify-between mb-4 gap-2">
          <div className="flex gap-2 justify-end w-full mt-4">
            <Button
              className="bg-[#55865f]"
              onClick={handleMarkNotificationASread}
            >
              Mark as read
            </Button>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="bg-white overflow-hidden shadow rounded-lg border mt-12 lg:w-[50%] md:w-[70%] w-full">
            <div className="w-full flex justify-between">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-semibold text-gray-900">
                  Notifications
                </h3>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                {data.data?.length > 0 ? (
                  data.data.map((note: Notification) => (
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6 even:bg-gray-50">
                      <dt className="text-sm font-medium text-gray-700 flex gap-2">
                        <span>
                          <Bell className="w-[20px] text-gray-500" />
                        </span>
                        <span>{note.title}</span>
                      </dt>
                    </div>
                  ))
                ) : (
                  <dt className="text-sm font-medium text-gray-700 flex justify-center py-4">
                    <span>No notification found</span>
                  </dt>
                )}
              </dl>
            </div>
          </div>
        </div>
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
