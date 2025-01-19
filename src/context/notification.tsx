"use client";
import { createContext } from "react";

export interface NotificationContextProps {
  count: number;
}
export const NotificationContext = createContext<
  NotificationContextProps 
>({count:0});
