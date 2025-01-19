import prisma from "../../../../prisma/client";
import { NextResponse } from "next/server";
export const revalidate = 0;
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const userId = Number(searchParams?.get("user"));
  const start = startDate
    ? new Date(startDate)
    : new Date(
        `${currentYear}-${currentMonth
          .toString()
          .padStart(2, "0")}-01T00:00:00.000Z`
      );
  const end = endDate
    ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
    : new Date(
        `${currentYear}-${(currentMonth + 1)
          .toString()
          .padStart(2, "0")}-01T00:00:00.000Z`
      );
  const totalIncomeMadeInTimeRange = await prisma.transaction.aggregate({
    where: {
      category: {
        type: "income",
      },
      userId: Number(userId),
      createdAt: {
        gte: start,
        lt: end,
      },
    },
    _sum: {
      amount: true,
    },
  });
  const totalRevenueMadeInTimeRange = await prisma.transaction.aggregate({
    where: {
      category: {
        type: "expense",
      },
      userId: Number(userId),
      createdAt: {
        gte: start,
        lt: end,
      },
    },
    _sum: {
      amount: true,
    },
  });
  const currentYearBuget = await prisma.budget.findFirst({
    where: {
      year: currentYear,
      userId: Number(userId),
    },
  });
  const countOfExepenseMadeInTimeRange = await prisma.transaction.aggregate({
    where: {
      category: {
        type: "expense",
      },
      userId: Number(userId),
      createdAt: {
        gte: start,
        lt: end,
      },
    },
    _count: {
      id: true,
    },
  });

  const recentExapnses = await prisma.transaction.findMany({
    where: {
      category: {
        type: "expense",
      },
      userId: Number(userId),
    },
    include: {
      category: true,
    },

    orderBy: {
      id: "desc",
    },
    take: 5,
  });
  const simpleExapnsesRecord = recentExapnses.map((expense) => ({
    ExpName: expense.category?.name,
    ExpType: expense.category?.type,
    amount: expense.amount,
    date:expense.createdAt.toDateString()
  }));
  const IncomeByMonth = await prisma.transaction.findMany({
    where: {
      category: {
        type: "income",
      },
      userId: Number(userId),
    },
    select: {
      createdAt: true,
      amount: true,
    },
  });
  const monthlyIncome = IncomeByMonth.reduce((acc, inc) => {
    const month = new Date(inc.createdAt).getMonth()!;
    acc[month] = (acc[month] || 0) + (inc.amount || 0);
    return acc;
  }, {} as { [key: number]: number });
  const chartData = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return {
      month: monthNames[monthIndex],
      income: monthlyIncome[monthIndex] || 0,
    };
  });
  return NextResponse.json({
    status: 200,
    data: {
      totalIncomeMade: totalIncomeMadeInTimeRange._sum.amount,
      totalExpenseMade: totalRevenueMadeInTimeRange._sum.amount,
      currentYearBuget: currentYearBuget?.remainingAmount,
      expenseCount: countOfExepenseMadeInTimeRange._count.id,
      simpleExapnsesRecord: simpleExapnsesRecord,
      chatRecords: chartData,
    },
  });
};
