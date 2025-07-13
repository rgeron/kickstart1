import { RegisterForm } from "@/components/auth-management/register-form";
import { ReturnButton } from "@/components/buttons/return-button";

export default function Page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/" label="Home" />

        <h1 className="text-3xl font-bold">Register</h1>
      </div>

      <div className="space-y-4">
        <RegisterForm />
      </div>
    </div>
  );
}
