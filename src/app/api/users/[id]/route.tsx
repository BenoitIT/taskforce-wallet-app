import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export const revalidate = 0;
export const PUT = async (req: Request) => {
  try {
    const userId = req.url.split("users/")[1];
    const body = await req.json();
    console.log(body)
    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(
        body.oldpassword,user.password,
      );
      if (!isPasswordMatch) {
        return NextResponse.json({
          status: 400,
          message: "Invalid old password",
        });
      }
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const updatedUser = await prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          password: hashedPassword,
        },
      });
      return NextResponse.json({
        status: 200,
        message: "Password is updated successfully",
        data: updatedUser,
      });
    } else {
      return NextResponse.json({
        status: 400,
        message: "Could not find user with provided ID",
      });
    }
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
