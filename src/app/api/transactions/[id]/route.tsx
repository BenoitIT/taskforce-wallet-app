import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  try {
    const transactionId = req.url.split("transactions/")[1];
    const transactionToDelete = await prisma.transaction.delete({
      where: {
        id: Number(transactionId),
      },
    });
    if (transactionToDelete) {
      return NextResponse.json({
        status: 200,
        message: "transaction is deleted successfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "transaction is not found",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
export const GET = async (req: Request) => {
  try {
    const transactionId = req.url.split("transactions/")[1];
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: Number(transactionId),
      },
    });
    if (transaction) {
      return NextResponse.json({
        status: 200,
        data: transaction,
      });
    }
    return NextResponse.json({
      status: 404,
      message: null,
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
