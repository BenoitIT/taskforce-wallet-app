import prisma from "../../../../prisma/client";
import { NextResponse } from "next/server";
export const revalidate = 0;
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams?.get("user"));
  const records = await prisma.notification.findMany({
    where: {
      userId: Number(userId),
      isRead: false,
    },
    select: {
      id: true,
      title: true,
    },
  });
  return NextResponse.json({
    status: 200,
    data: records,
  });
};
export const PUT = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams?.get("user"));
  const records = await prisma.notification.updateMany({
    where: {
      userId: Number(userId),
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
  return NextResponse.json({
    status: 200,
    message: "All notifications are read.",
    data: records,
  });
};
