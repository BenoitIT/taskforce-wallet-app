import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0;
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const checkNameExistance = await prisma.budget.findFirst({
      where: {
        year: body.year,
        userId: body.userId,
      },
    });
    if (checkNameExistance)
      return NextResponse.json({
        status: 400,
        message: "Budet of the selected year already exist.",
      });
    const budget = await prisma.budget.create({
      data: {
        year: body.year,
        budgetAmount: Number(body.budgetAmount),
        remainingAmount: Number(body.budgetAmount),
        spentAmount: 0,
        userId: body.userId,
      },
    });
    return NextResponse.json({
      status: 201,
      message: "A budget created successfully",
      data: budget,
    });
  } catch (err) {
    console.error(err)
    return NextResponse.json({
      status: 400,
      message: "Unexpected error occurs",
    });
  }
};

export const GET = async (req: Request) => {
  const { searchParams }:any = new URL(req.url);
  const userId = Number(searchParams?.get("user"));
  const records = await prisma.budget.findMany({
    where: {
      userId: Number(userId),
    },
    select: {
      id:true,
      year: true,
      budgetAmount: true,
      remainingAmount: true,
      spentAmount: true,
    },
  });
  return NextResponse.json({
    status: 200,
    data: records,
  });
};
