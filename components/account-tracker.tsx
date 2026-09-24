"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { rememberAccount } from "@/lib/accounts";

/** Records the signed-in account so it shows up under "Switch account". */
export function AccountTracker() {
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user?.email) return;
    rememberAccount({
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
    });
  }, [user?.email, user?.name, user?.image, user?.role]);

  return null;
}
