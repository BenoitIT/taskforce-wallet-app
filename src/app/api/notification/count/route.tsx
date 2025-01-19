import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";
export const revalidate = 0;
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams?.get("user"));
  const records = await prisma.notification.aggregate({
    where: {
      userId: Number(userId),
      isRead: false,
    },
    _count: {
      id: true,
    },
  });
  return NextResponse.json({
    status: 200,
    data: records._count.id,
  });
};
