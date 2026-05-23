import { prisma } from "@/lib/prisma";
import ReservationActions from "./ReservationActions";

async function getReservation(id: string) {

  return prisma.reservation.findUnique({
    where: {
      id,
    },
    include: {
      product: true,
      warehouse: true,
    },
  });
}

export default async function ReservationPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {

  const { id } = await params;

  const reservation =
    await getReservation(id);

  if (!reservation) {
    return (
      <div className="p-10">
        Reservation not found
      </div>
    );
  }

  return (
    <main className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Reservation Checkout
      </h1>

      <div className="border p-6 rounded-lg">

        <h2 className="text-2xl font-semibold">
          {reservation.product.name}
        </h2>

        <p>
          Warehouse:
          {" "}
          {reservation.warehouse.name}
        </p>

        <p>
          Quantity:
          {" "}
          {reservation.quantity}
        </p>

        <p>
          Status:
          {" "}
          {reservation.status}
        </p>

        <p>
          Expires At:
          {" "}
          {new Date(
            reservation.expiresAt
          ).toLocaleString()}
        </p>

        <ReservationActions
          reservationId={reservation.id}
          expiresAt={reservation.expiresAt.toISOString()}
        />

      </div>

    </main>
  );
}