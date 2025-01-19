import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  try {
    const accountId = req.url.split("accounts/")[1];
    const accountToDelete = await prisma.account.delete({
      where: {
        id: Number(accountId),
      },
    });
    if (accountToDelete) {
      return NextResponse.json({
        status: 200,
        message: "account is deleted successfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "account is not found",
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
    const accountId = req.url.split("accounts/")[1];
    const account = await prisma.account.findFirst({
      where: {
        id: Number(accountId),
      },
    });
    if (account) {
      return NextResponse.json({
        status: 200,
        data: account,
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
export const PUT = async (req: Request) => {
  try {
    const accountId = req.url.split("accounts/")[1];
    const body = await req.json();
    delete body.id;
    const account = await prisma.account.update({
      where: {
        id: Number(accountId),
      },
      data: body,
    });
    if (account) {
      return NextResponse.json({
        status: 200,
        message: "Account's information are updated succesfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Coud not find account",
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
