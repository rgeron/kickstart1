"use client";

import { signInEmailAction } from "@/actions/user-management/sign-in-email.action";
import { signIn } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInOauthButton } from "./sign-in-oauth-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [isPending, setIsPending] = useState(false);
  const [isMagicLinkPending, setIsMagicLinkPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    setIsPending(true);

    const formData = new FormData(evt.currentTarget);

    const { error } = await signInEmailAction(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success("Login successful. Good to have you back.");
      router.push("/profile");
    }
  }

  async function handleMagicLink(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget);
    const email = String(formData.get("magicEmail"));

    if (!email) return toast.error("Please enter your email.");

    await signIn.magicLink({
      email,
      name: email.split("@")[0],
      callbackURL: "/profile",
      fetchOptions: {
        onRequest: () => {
          setIsMagicLinkPending(true);
        },
        onResponse: () => {
          setIsMagicLinkPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Check your email for the magic link!");
        },
      },
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Logging in..." : "Login"}
                </Button>
                <SignInOauthButton provider="google" />
              </div>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or try magic link
                </span>
              </div>
            </div>
            
            <form onSubmit={handleMagicLink} className="mt-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  name="magicEmail"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  variant="outline" 
                  disabled={isMagicLinkPending}
                  className="shrink-0"
                >
                  <StarIcon className="w-4 h-4 mr-1" />
                  {isMagicLinkPending ? "Sending..." : "Send"}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
