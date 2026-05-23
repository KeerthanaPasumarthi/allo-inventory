"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReservationActions({
  reservationId,
  expiresAt,
}: {
  reservationId: string;
  expiresAt: string;
}) {

  const router = useRouter();

  const [timeLeft, setTimeLeft] =
    useState("");

  useEffect(() => {

    const interval = setInterval(() => {

      const now =
        new Date().getTime();

      const expiry =
        new Date(expiresAt).getTime();

      const distance =
        expiry - now;

      if (distance <= 0) {

        setTimeLeft("Expired");

        clearInterval(interval);

        return;
      }

      const minutes =
        Math.floor(
          distance / (1000 * 60)
        );

      const seconds =
        Math.floor(
          (distance % (1000 * 60)) /
          1000
        );

      setTimeLeft(
        `${minutes}m ${seconds}s`
      );

    }, 1000);

    return () =>
      clearInterval(interval);

  }, [expiresAt]);

  async function confirmReservation() {

    const res = await fetch(
      `/api/reservations/${reservationId}/confirm`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Purchase Confirmed");

    router.refresh();
  }

  async function cancelReservation() {

    const res = await fetch(
      `/api/reservations/${reservationId}/release`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Reservation Cancelled");

    router.push("/");
  }

  return (
  <div className="mt-6">

    <p className="font-bold mb-4">
      Time Left:
      {" "}
      {timeLeft}
    </p>

    <div className="flex gap-4">

      <button
        onClick={confirmReservation}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Confirm Purchase
      </button>

      <button
        onClick={cancelReservation}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>

      <button
        onClick={() => router.push("/")}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Return Home
      </button>

    </div>

  </div>
);
}