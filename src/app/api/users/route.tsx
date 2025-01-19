import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import userValidationSchema from "../validation/users";
import bcrypt from "bcrypt";
export const revalidate = 0;
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const userDataValidation = userValidationSchema.safeParse(body);
    if (!userDataValidation.success)
      return NextResponse.json({
        message:
          userDataValidation.error.errors[0].path +
          " " +
          userDataValidation.error.errors[0].message,
        status: 400,
      });
    const checkUserEmailExistance = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });
    if (checkUserEmailExistance)
      return NextResponse.json({
        status: 400,
        message: "Another with this email already exist.",
      });
    const password = body.password;
    body.name = body.name + " " + body.lname;
    delete body.lname;
    delete body.cpassword;
    body.password = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: body });
    return NextResponse.json({
      status: 201,
      message: "Your account is created successfully",
      data: user,
    });
  } catch (err) {
    console.error(err)
    return NextResponse.json({
      status: 400,
      message: "Unexpected error occurs",
    });
  }
};
