import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  try {

    const expiredReservations =
      await prisma.reservation.findMany({
        where: {
          status: "PENDING",
          expiresAt: {
            lt: new Date(),
          },
        },
      });

    for (
      const reservation
      of expiredReservations
    ) {

      await prisma.$transaction(
        async (tx) => {

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
            return;
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

        }
      );
    }

    const products =
      await prisma.product.findMany({
        include: {
          inventory: {
            include: {
              warehouse: true,
            },
          },
        },
      });

    return NextResponse.json(products);

  } catch (error: any) {

    console.log(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}