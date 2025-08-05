import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PostWithComments } from "@/features/posts/components/post-with-comments";
import { likePostAction } from "@/features/posts/actions/like-post.action";
import { commentPostAction } from "@/features/posts/actions/comment-post.action";
import { voteAction } from "@/features/voting/actions/vote.action";
import { prisma } from "@/lib/prisma";
import { toast } from "sonner";

// Get a single post with all its data
async function getPostWithComments(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            votes: {
              select: {
                type: true,
                userId: true,
              },
            },
            _count: {
              select: {
                votes: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            likes: true,
            votes: true,
            comments: true,
          },
        },
      },
    });

    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Loading component
function PostLoading() {
  return (
    <Card className="w-full animate-pulse">
      <CardHeader>
        <div className="h-8 bg-muted rounded mb-4" />
        <div className="h-4 bg-muted rounded w-1/3 mb-2" />
        <div className="h-4 bg-muted rounded w-1/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
          <div className="h-12 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// Post component with server actions
async function PostDetail({ postId }: { postId: string }) {
  const post = await getPostWithComments(postId);

  if (!post) {
    notFound();
  }

  // Server action handlers
  const handleLike = async (postId: string) => {
    "use server";
    try {
      const result = await likePostAction(postId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleComment = async (postId: string, content: string) => {
    "use server";
    try {
      const result = await commentPostAction({ postId, content });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleCommentVote = async (commentId: string, type: "UPVOTE" | "DOWNVOTE") => {
    "use server";
    try {
      const result = await voteAction({ commentId, type });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  return (
    <PostWithComments
      post={post}
      onLike={handleLike}
      onComment={handleComment}
      onCommentVote={handleCommentVote}
    />
  );
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function PostDetailPage({ params }: PageProps) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        {/* Back button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/posts/enhanced">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux posts
            </Link>
          </Button>
        </div>

        {/* Post detail */}
        <Suspense fallback={<PostLoading />}>
          <PostDetail postId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps) {
  const post = await getPostWithComments(params.id);
  
  if (!post) {
    return {
      title: "Post non trouvé",
    };
  }

  return {
    title: post.title,
    description: post.content.slice(0, 160) + (post.content.length > 160 ? "..." : ""),
  };
}
