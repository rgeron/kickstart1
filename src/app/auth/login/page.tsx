import { LoginForm } from "@/components/auth-management/login-form";
import { MagicLinkLoginForm } from "@/components/auth-management/magic-link-login-form";
import { ReturnButton } from "@/components/buttons/return-button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/" label="Home" />

        <h1 className="text-3xl font-bold">Login</h1>
      </div>

      <div className="space-y-4">
        <MagicLinkLoginForm />

        <LoginForm />

        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="hover:text-foreground">
            Register
          </Link>
        </p>
      </div>

      <hr className="max-w-sm" />
    </div>
  );
}
