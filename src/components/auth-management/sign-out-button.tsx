"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const SignOutButton = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleClick() {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("You’ve logged out. See you soon!");
          router.push("/auth/login");
        },
      },
    });
  }

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant="outline"
      disabled={isPending}
      className="hover:bg-foreground hover:text-destructive-foreground border-destructive text-destructive"
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
};
