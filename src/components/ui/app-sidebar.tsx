"use client";
import Link from "next/link";
import {
  ChartBarStacked,
  ArrowRightLeft,
  BetweenHorizontalEnd,
  LayoutTemplate,
  BadgeDollarSign,
  Settings,
  Bell,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useContext } from "react";
import { NotificationContext, NotificationContextProps } from "@/context/notification";

const items = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutTemplate,
  },
  {
    title: "Budgets",
    url: "/dashboard/budgets",
    icon: BadgeDollarSign,
  },
  {
    title: "Accounts",
    url: "/dashboard/accounts",
    icon: BetweenHorizontalEnd,
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: ChartBarStacked,
  },
  {
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: ArrowRightLeft,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export const AppSidebar = () => {
  const pathname = usePathname();
  const {count}=useContext<NotificationContextProps>(NotificationContext);
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl mt-3 font-semibold text-gray-900">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-6 ml-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`${
                    pathname == item.url
                      ? "bg-[#55865f]  rounded text-white font-semibold"
                      : ""
                  } mx-2 hover:cursor-pointer hover:bg-[#B2BEB5] rounded`}
                >
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      <span
                        className={
                          item.title == "Notifications"
                            ? "text-[10px] px-2 rounded-full bg-gray-800 text-white"
                            : "hidden"
                        }
                      >
                        {count}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
