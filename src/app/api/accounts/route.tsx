import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import accountValidationSchema from "../validation/account";
export const revalidate = 0;
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const inpuValidation = accountValidationSchema.safeParse(body);
    if (!inpuValidation.success)
      return NextResponse.json({
        message:
          inpuValidation.error.errors[0].path +
          " " +
          inpuValidation.error.errors[0].message,
        status: 400,
      });
    const checkNameExistance = await prisma.account.findFirst({
      where: {
        userId: body.userId,
        accountnumber: body.accountnumber,
      },
    });
    if (checkNameExistance)
      return NextResponse.json({
        status: 400,
        message: "Another account with this name already exist.",
      });
    const account = await prisma.account.create({ data: body });
    return NextResponse.json({
      status: 201,
      message: "A cash account is created successfully",
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
  const searchParm: any = new URL(req.url);
  const userId = Number(searchParm?.searchParams?.get("user"));
  const records = await prisma.account.findMany({
    where: {
      userId: Number(userId),
    },
    select: {
      id: true,
      name: true,
      accountnumber: true,
      type: true,
      balance: true,
    },
  });
  return NextResponse.json({
    status: 200,
    data: records,
  });
};
