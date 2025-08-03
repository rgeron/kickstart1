"use client";

import { signIn } from "@/lib/auth/auth-client";
import { ChevronDownIcon, StarIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const MagicLinkLoginForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDetailsElement>(null);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget);
    const email = String(formData.get("email"));

    if (!email) return toast.error("Please enter your email.");

    await signIn.magicLink({
      email,
      name: email.split("@")[0],
      callbackURL: "/",
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
          toast.success("Check your email for the magic link!");
          if (ref.current) {
            ref.current.open = false;
            setIsOpen(false);
          }
        },
      },
    });
  }

  return (
    <details
      ref={ref}
      className="w-full rounded-lg border border-border overflow-hidden bg-card"
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="flex gap-2 items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted cursor-pointer transition-colors list-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-2">
          <StarIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Try Magic Link</span>
        </div>
        <ChevronDownIcon 
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </summary>

      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label
              htmlFor="magic-email"
              className="text-xs text-muted-foreground"
            >
              Enter your email to receive a magic link
            </Label>
            <div className="flex gap-2">
              <Input
                type="email"
                id="magic-email"
                name="email"
                placeholder="Enter your email"
                className="flex-1"
                required
              />
              <Button
                type="submit"
                disabled={isPending}
                size="sm"
                className="shrink-0"
              >
                <StarIcon className="w-4 h-4 mr-1" />
                {isPending ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </details>
  );
};
