import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0;
interface TransactionBody {
  userId: string | number;
  accountId: string | number;
  categoryId: string | number;
  amount: string | number;
  notes: string;
}

export const POST = async (req: NextRequest) => {
  try {
    let body: TransactionBody;
    try {
      body = await req.json();
      if (
        !body ||
        !body.userId ||
        !body.accountId ||
        !body.amount ||
        !body.categoryId
      ) {
        return NextResponse.json({
          status: 400,
          message: "Missing required fields",
        });
      }
    } catch (err) {
      console.error(err)
      return NextResponse.json({
        status: 400,
        message: "Invalid request body format",
      });
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const selectedCategory = await prisma.category.findFirst({
      where: {
        id: Number(body.categoryId),
        userId: Number(body.userId),
      },
    });
    const selectedAccount = await prisma.account.findFirst({
      where: {
        id: Number(body.accountId),
        userId: Number(body.userId),
      },
    });

    if (!selectedAccount) {
      return NextResponse.json({
        status: 404,
        message: "Account not found or doesn't belong to user",
      });
    }
    const currentBudget = await prisma.budget.findFirst({
      where: {
        year: currentYear,
        userId: Number(body.userId),
      },
    });

    if (!currentBudget) {
      return NextResponse.json({
        status: 400,
        message: "You didn't prepare a budget for this year",
      });
    }
    const amount = Number(body.amount);
    if (
      selectedCategory?.type == "expense" &&
      selectedAccount.balance < amount
    ) {
      return NextResponse.json({
        status: 400,
        message: "Insufficient amount from your account",
      });
    }
    if (
      selectedCategory?.type == "expense" &&
      currentBudget.remainingAmount < amount
    ) {
      return NextResponse.json({
        status: 400,
        message: `Transaction exceeds remaining budget. Available: ${currentBudget.remainingAmount}`,
      });
    }
    let budgetRemainingAmount;
    let budgetSpentAmount;
    let accountRemainingBalance;
    if (selectedCategory?.type == "expense") {
      budgetRemainingAmount = currentBudget.remainingAmount - amount;
      budgetSpentAmount = currentBudget.spentAmount + amount;
      accountRemainingBalance = selectedAccount.balance - amount;
    } else {
      budgetRemainingAmount = currentBudget.remainingAmount;
      budgetSpentAmount = currentBudget.spentAmount;
      accountRemainingBalance = selectedAccount.balance + amount;
    }
    const [newTransaction] = await prisma.$transaction([
      prisma.account.update({
        where: {
          id: Number(body.accountId),
          userId: Number(body.userId),
        },
        data: {
          balance: accountRemainingBalance,
        },
      }),
      prisma.budget.update({
        where: {
          id: currentBudget.id,
          userId: Number(body.userId),
          year: currentYear,
        },
        data: {
          remainingAmount: budgetRemainingAmount,
          spentAmount: budgetSpentAmount,
        },
      }),
      prisma.transaction.create({
        data: {
          userId: Number(body.userId),
          accountId: Number(body.accountId),
          categoryId: Number(body.categoryId),
          amount: amount,
          notes: body.notes || "",
        },
      }),
      prisma.notification.createMany({
        data: [
          {
            userId: Number(body.userId),
            title: `Your remaining ${selectedAccount.name} balance is $ ${accountRemainingBalance}`,
          },
          {
            userId: Number(body.userId),
            title: `Your remaining ${currentBudget.year} budget balance is $ ${budgetRemainingAmount}`,
          },
          {
            userId: Number(body.userId),
            title: `You have made an  ${selectedCategory?.type} transaction`,
          },
        ],
      }),
    ]);
    return NextResponse.json({
      status: 201,
      message: "New transaction is recorded successfully",
      data: newTransaction,
    });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({
        status: 500,
        message: `Error processing transaction: ${err.message}`,
      });
    }

    return NextResponse.json({
      status: 500,
      message: "An unexpected error occurred while processing the transaction",
    });
  }
};

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams?.get("user"));
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = endDate
    ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
    : new Date();
  const records = await prisma.transaction.findMany({
    where: {
      userId: Number(userId),
      createdAt: {
        gte: start,
        lt: end,
      },
    },
    include: {
      category: {
        select: {
          name: true,
          type: true,
        },
      },
      account: {
        select: {
          name: true,
        },
      },
    },
  });
  return NextResponse.json({
    status: 200,
    data: records.map((record) => ({
      id: record.id,
      accountName: record.account.name,
      categoryName: record.category?.name,
      categoryType: record.category?.type,
      amount: record.amount,
      date:
        record.createdAt.toDateString() +
        ", " +
        record.createdAt.toLocaleTimeString(),
      notes: record.notes,
    })),
  });
};
