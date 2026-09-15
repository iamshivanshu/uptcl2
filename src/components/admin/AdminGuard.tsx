"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/admin/login");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || !profile || profile.role !== "ADMIN") {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("Admin authorization error:", error);
        await supabase.auth.signOut();
        router.replace("/admin/login");
      } finally {
        setChecking(false);
      }
    }

    checkAdmin();
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070B14] text-[#F5F1E8]">
        <p className="text-[9px] font-semibold tracking-[0.2em] text-white/35">
          AUTHENTICATING...
        </p>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
