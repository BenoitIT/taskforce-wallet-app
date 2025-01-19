"use client";
import useSWR from "swr";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationContext } from "@/context/notification";
import { getNotificationsNumber } from "../services/notification";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: any = useSession();
  const pathname: string | null = usePathname();
  const userId = session?.data?.id;
  const { data } = useSWR(
    userId && ["notificationcount", userId, pathname],
    () => getNotificationsNumber(userId)
  );
  return (
    <div className=" min-h-screen h-full flex w-full">
      <NotificationContext.Provider value={{ count: data?.data || 0 }}>
        <SidebarProvider>
          <div className="w-[20%] md:w-[15vw] lg:w-[16%]  p-4 sticky top-0 h-screen">
            <AppSidebar />
          </div>
          <div className="w-full  bg-gray-100 min-h-fit h-full -ml-4">
            <div className="w-full flex justify-between border-b-4 border-white lg:mr-10 mr-4 py-3">
              <SidebarTrigger />
              <div className="flex gap-2 justify-center items-center mr-4">
                <div className="py-1 px-3 rounded-full border bg-white uppercase text-base font-semibold">
                  {session?.data?.user?.name[0]}
                </div>
                <p className="text-sm font-semibold">
                  {session?.data?.user?.name}
                </p>
              </div>
            </div>
            <div className="p-0 md:p-4 border rounded border-gray-200 min-h-[88vh]">
              {children}
            </div>
          </div>
        </SidebarProvider>
      </NotificationContext.Provider>
    </div>
  );
}
