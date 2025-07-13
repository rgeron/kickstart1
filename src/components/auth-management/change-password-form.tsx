"use client";

import { changePasswordAction } from "@/actions/user-management/change-password.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export const ChangePasswordForm = () => {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);

    setIsPending(true);

    const { error } = await changePasswordAction(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Password changed successfully");
      (evt.target as HTMLFormElement).reset();
    }

    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-sm font-medium">
            Current Password
          </Label>
          <Input 
            type="password" 
            id="currentPassword" 
            name="currentPassword"
            placeholder="Enter your current password"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-sm font-medium">
            New Password
          </Label>
          <Input 
            type="password" 
            id="newPassword" 
            name="newPassword"
            placeholder="Enter your new password"
            className="w-full"
            required
          />
          <p className="text-xs text-muted-foreground">
            Choose a strong password with at least 8 characters
          </p>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isPending}
        variant="destructive"
        className="w-full sm:w-auto"
      >
        {isPending ? "Changing..." : "Change Password"}
      </Button>
    </form>
  );
};
