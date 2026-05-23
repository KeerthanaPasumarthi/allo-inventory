"use client";

import { useRouter } from "next/navigation";

export default function ReserveButton({
  productId,
  warehouseId,
}: {
  productId: string;
  warehouseId: string;
}) {

  const router = useRouter();

  async function reserveProduct() {

    const res = await fetch(
      "/api/reservations",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          productId,
          warehouseId,
          quantity: 1,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    router.push(
      `/reservation/${data.id}`
    );
  }

  return (
    <button
      onClick={reserveProduct}
      className="bg-black text-white px-4 py-2 rounded mt-3"
    >
      Reserve
    </button>
  );
}