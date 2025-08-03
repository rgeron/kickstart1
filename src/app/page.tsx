import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { canUserCreatePost, canUserInteract } from "@/lib/permissions";
import { headers } from "next/headers";
import Link from "next/link";
import { CreatePostForm } from "@/features/posts/components/create-post-form";
import { PostsListWithSearch } from "@/features/posts/components/posts-list-with-search";
import { getPostsAction } from "@/features/posts/queries/get-posts.action";

async function PostsList() {
  try {
    const { posts } = await getPostsAction({ pageSize: 10 });
    return <PostsListWithSearch posts={posts} pageSize={10} />;
  } catch (error) {
    console.error("Failed to load posts:", error);
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load posts. Please try again later.
      </div>
    );
  }
}

function PostsLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="w-full animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded mb-2" />
            <div className="h-4 bg-muted rounded w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function Page() {
  const headersList = await headers();
  
  const session = await auth.api.getSession({
    headers: headersList,
  });

  const userRole = session?.user?.role;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">ILoveMeudon Forum</h1>
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Button size="sm" asChild variant="outline">
                  <Link href="/profile">Profile</Link>
                </Button>
                {session.user.role === "ADMIN" && (
                  <Button size="sm" asChild>
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </Button>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" asChild variant="outline">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {session && (
          <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
            <div>
              <p className="font-medium">Welcome back, {session.user.name}!</p>
              <p className="text-sm text-muted-foreground">
                {canUserCreatePost(userRole) 
                  ? "You can create posts, comment, like, and vote" 
                  : "Browse posts and join the discussion by signing up"}
              </p>
            </div>
          </div>
        )}

        {session && canUserCreatePost(userRole) && (
          <CreatePostForm />
        )}

        {!session && (
          <Card>
            <CardHeader>
              <CardTitle>Join the Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Sign up to create posts, comment, like, and vote on content in the ILoveMeudon forum.
              </p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Already have an account?</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Community Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<PostsLoading />}>
              <PostsList />
            </Suspense>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Forum Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={canUserInteract(userRole) ? "text-green-600" : "text-muted-foreground"}>
                  {canUserInteract(userRole) ? "✓" : "○"}
                </span>
                <span className="text-sm">Create and manage posts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={canUserInteract(userRole) ? "text-green-600" : "text-muted-foreground"}>
                  {canUserInteract(userRole) ? "✓" : "○"}
                </span>
                <span className="text-sm">Comment on posts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={canUserInteract(userRole) ? "text-green-600" : "text-muted-foreground"}>
                  {canUserInteract(userRole) ? "✓" : "○"}
                </span>
                <span className="text-sm">Like and vote on content</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={session?.user?.role === "ADMIN" ? "text-green-600" : "text-muted-foreground"}>
                  {session?.user?.role === "ADMIN" ? "✓" : "○"}
                </span>
                <span className="text-sm">Moderate all content (Admin)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Posts</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Comments</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="text-sm font-medium">{session ? "1+" : "0"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
