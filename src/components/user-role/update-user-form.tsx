"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UpdateUserFormProps {
  name: string;
  image: string;
}

export const UpdateUserForm = ({ name, image }: UpdateUserFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    const name = String(formData.get("name"));
    const image = String(formData.get("image"));

    if (!name && !image) {
      return toast.error("Please enter a name or image");
    }

    await updateUser({
      ...(name && { name }),
      image,
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
          toast.success("User updated successfully");
          (evt.target as HTMLFormElement).reset();
          router.refresh();
        },
      },
    });
  }

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={name}
            placeholder="Enter your full name"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image" className="text-sm font-medium">
            Profile Image URL
          </Label>
          <Input 
            id="image" 
            name="image" 
            defaultValue={image}
            placeholder="https://example.com/image.jpg"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Enter a URL for your profile image
          </p>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isPending}
        className="w-full sm:w-auto"
      >
        {isPending ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
};
