import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  try {
    const budgetId = req.url.split("budget/")[1];
    const budgetToDelete = await prisma.budget.delete({
      where: {
        id: Number(budgetId),
      },
    });
    if (budgetToDelete) {
      return NextResponse.json({
        status: 200,
        message: "budget is deleted successfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "budget is not found",
    });
  } catch (err) {
    console.error(err)
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
export const GET = async (req: Request) => {
  try {
    const budgetId = req.url.split("budget/")[1];
    const budget = await prisma.budget.findFirst({
      where: {
        id: Number(budgetId),
      },
    });
    if (budget) {
      return NextResponse.json({
        status: 200,
        data: budget,
      });
    }
    return NextResponse.json({
      status: 404,
      message: null,
    });
  } catch (err) {
    console.error(err)
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
export const PUT = async (req: Request) => {
  try {
    const budgetId = req.url.split("budget/")[1];
    const body = await req.json();
    const budget = await prisma.budget.update({
      where: {
        id: Number(budgetId),
        remainingAmount: {
          lte: Number(body.budgetAmount),
        },
      },
      data: {
        userId: Number(body.userId),
        budgetAmount: Number(body.budgetAmount),
        year: Number(body.year),
      },
    });
    if (budget) {
      return NextResponse.json({
        status: 200,
        message: "budget's information are updated succesfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Coud not find budget",
    });
  } catch (err) {
    console.error("errr", err);
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
