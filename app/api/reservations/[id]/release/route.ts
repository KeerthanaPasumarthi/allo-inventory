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
      reservation.status !== "PENDING"
    ) {
      throw new Error(
        "Reservation already processed"
      );
    }

    await prisma.$transaction(async (tx) => {

      const inventory =
        await tx.inventory.findUnique({
          where: {
            productId_warehouseId: {
              productId:
                reservation.productId,
              warehouseId:
                reservation.warehouseId,
            },
          },
        });

      if (!inventory) {
        throw new Error(
          "Inventory not found"
        );
      }

      await tx.inventory.update({
        where: {
          id: inventory.id,
        },
        data: {
          reservedStock: {
            decrement:
              reservation.quantity,
          },
        },
      });

      await tx.reservation.update({
        where: {
          id: reservation.id,
        },
        data: {
          status: "RELEASED",
        },
      });

    });

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }
}