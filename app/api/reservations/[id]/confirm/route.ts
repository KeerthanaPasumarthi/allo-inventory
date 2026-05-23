import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id,
        },
      });

    if (!reservation) {
      throw new Error(
        "Reservation not found"
      );
    }

    if (
      reservation.expiresAt <
      new Date()
    ) {
      throw new Error(
        "Reservation expired"
      );
    }

    const updated =
      await prisma.reservation.update({
        where: {
          id,
        },
        data: {
          status: "CONFIRMED",
        },
      });

    return NextResponse.json(updated);

  } catch (error: any) {

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 410,
      }
    );
  }
}