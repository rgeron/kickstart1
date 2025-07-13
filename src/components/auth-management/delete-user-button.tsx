"use client";

import { deleteUserAction } from "@/actions/user-management/delete-user.action";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteUserButtonProps {
  userId: string;
}

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);
    const res = await deleteUserAction({ userId });

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("User deleted successfully");
    }
    setIsPending(false);
  }

  return (
    <Button
      size="icon"
      variant="destructive"
      className="size-7 rounded-sm"
      onClick={handleClick}
      disabled={isPending}
    >
      <span className="sr-only">Delete User</span>
      <TrashIcon />
    </Button>
  );
};

export const PlaceholderDeleteUserButton = () => {
  return (
    <Button
      size="icon"
      variant="destructive"
      className="size-7 rounded-sm"
      disabled
    >
      <span className="sr-only">Delete User</span>
      <TrashIcon />
    </Button>
  );
};
