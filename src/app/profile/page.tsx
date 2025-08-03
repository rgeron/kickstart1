import { ChangePasswordForm } from "@/components/auth-management/change-password-form";
import { SignOutButton } from "@/components/auth-management/sign-out-button";
import { ReturnButton } from "@/components/buttons/return-button";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateUserForm } from "@/components/user-role/update-user-form";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) redirect("/auth/login");

  const FULL_POST_ACCESS = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: {
        posts: ["update", "delete"],
      },
    },
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <ReturnButton href="/" label="Home" />
          <div className="flex items-center gap-2">
            {session.user.role === "ADMIN" && (
              <Button size="sm" asChild>
                <Link href="/admin/dashboard">Admin Dashboard</Link>
              </Button>
            )}
            <SignOutButton />
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <AvatarUpload 
                  userId={session.user.id}
                  currentImage={session.user.image || undefined}
                />
                
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{session.user.name}</h3>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {session.user.role.toLowerCase()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Manage Own Posts</span>
                <Button size="sm" variant="secondary">
                  Enabled
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Manage All Posts</span>
                <Button 
                  size="sm" 
                  variant={FULL_POST_ACCESS.success ? "secondary" : "outline"}
                  disabled={!FULL_POST_ACCESS.success}
                >
                  {FULL_POST_ACCESS.success ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Update Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateUserForm
                name={session.user.name}
                image={session.user.image ?? ""}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}