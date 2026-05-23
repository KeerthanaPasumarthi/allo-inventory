import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      productId,
      warehouseId,
      quantity,
    } = body;

    const result =
      await prisma.$transaction(async (tx) => {

        const inventory =
          await tx.inventory.findUnique({
            where: {
              productId_warehouseId: {
                productId,
                warehouseId,
              },
            },
          });

        if (!inventory) {
          throw new Error("Inventory not found");
        }

        const available =
          inventory.totalStock -
          inventory.reservedStock;

        if (available < quantity) {
          throw new Error("Not enough stock");
        }

        await tx.inventory.update({
          where: {
            id: inventory.id,
          },
          data: {
            reservedStock: {
              increment: quantity,
            },
          },
        });

        const reservation =
          await tx.reservation.create({
            data: {
              productId,
              warehouseId,
              quantity,
              expiresAt: new Date(
                Date.now() + 10 * 60 * 1000
              ),
            },
          });

        return reservation;
      });

    return NextResponse.json(result);

  } catch (error: any) {

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 409,
      }
    );
  }
}