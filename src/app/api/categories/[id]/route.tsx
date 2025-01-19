import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  try {
    const categoryId = req.url.split("categories/")[1];
    const categoryToDelete = await prisma.category.delete({
      where: {
        id: Number(categoryId),
      },
    });
    if (categoryToDelete) {
      return NextResponse.json({
        status: 200,
        message: "category is deleted successfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "category is not found",
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
    const categoryId = req.url.split("categories/")[1];
    const category = await prisma.category.findFirst({
      where: {
        id: Number(categoryId),
      },
    });
    if (category) {
      return NextResponse.json({
        status: 200,
        data: category,
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
    const categoryId = req.url.split("categories/")[1];
    const body = await req.json();
    delete body.id;
    const category = await prisma.category.update({
      where: {
        id: Number(categoryId),
      },
      data: body,
    });
    if (category) {
      return NextResponse.json({
        status: 200,
        message: "category's information are updated succesfully",
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Coud not find category",
    });
  } catch (err) {
    console.error(err)
    return NextResponse.json({
      status: 400,
      message: "something went wrong",
    });
  }
};
