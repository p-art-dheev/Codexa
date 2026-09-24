"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

/** Current user's total points; listens for the app-wide `pointsUpdated` event. */
export function usePoints() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) {
      setPoints(null);
      return;
    }
    let mounted = true;

    async function fetchPoints() {
      try {
        const res = await fetch("/api/users/me/points");
        if (res.ok) {
          const data = await res.json();
          if (mounted) setPoints(data.points ?? 0);
        }
      } catch (e) {
        console.warn("Failed to fetch user points", e);
      }
    }

    function onPointsUpdated(e: Event) {
      const val = (e as CustomEvent<{ totalPoints?: number }>).detail
        ?.totalPoints;
      if (typeof val === "number") setPoints(val);
      else fetchPoints();
    }

    fetchPoints();
    window.addEventListener("pointsUpdated", onPointsUpdated);
    return () => {
      mounted = false;
      window.removeEventListener("pointsUpdated", onPointsUpdated);
    };
  }, [userId]);

  return points;
}
