import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0;
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const checkNameExistance = await prisma.category.findFirst({
      where: {
        name: {
          equals: body.name,
          mode: "insensitive",
        },
        userId: body.userId,
      },
    });
    if (checkNameExistance)
      return NextResponse.json({
        status: 400,
        message: "Another category with this name already exist.",
      });
    const account = await prisma.category.create({
      data: {
        name: body.name,
        type: body.type,
        userId: body.userId,
      },
    });
    return NextResponse.json({
      status: 201,
      message: "A category is created successfully",
      data: account,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: 400,
      message: "Unexpected error occurs",
    });
  }
};

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams?.get("user"));
  const records = await prisma.category.findMany({
    where: {
      userId: Number(userId),
    },
    select: {
      id:true,
      name: true,
      type: true,
    },
  });
  return NextResponse.json({
    status: 200,
    data: records,
  });
};
