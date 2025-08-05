"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { VoteButtons } from "@/features/voting/components/vote-buttons";
import { useVoting } from "@/features/voting/hooks/use-voting";
import { VoteStats } from "@/features/voting/types";
import { useSession } from "@/lib/auth/auth-client";
import { canUserInteract, canUserLike, canUserVote } from "@/lib/permissions";
import { PostWithRelations } from "@/lib/post-filters";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, Heart, MessageCircle, Send, User } from "lucide-react";
import { useState } from "react";

// Extended post type with full comment data
interface PostWithFullComments extends PostWithRelations {
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    userId: string | null;
    user: {
      id: string;
      name: string;
      image?: string;
    } | null;
    votes: Array<{
      type: "UP" | "DOWN";
      userId: string;
    }>;
    _count: {
      votes: number;
    };
  }>;
}

interface PostWithCommentsProps {
  post: PostWithFullComments;
  onLike?: (postId: string) => Promise<void>;
  onComment?: (postId: string, content: string) => Promise<void>;
  onCommentVote?: (
    commentId: string,
    type: "UPVOTE" | "DOWNVOTE"
  ) => Promise<void>;
}

function CommentItem({
  comment,
  onVote,
}: {
  comment: PostWithFullComments["comments"][0];
  onVote?: (commentId: string, type: "UPVOTE" | "DOWNVOTE") => Promise<void>;
}) {
  const { data: session } = useSession();

  const upVotes = comment.votes.filter((vote) => vote.type === "UP").length;
  const downVotes = comment.votes.filter((vote) => vote.type === "DOWN").length;
  const userVote = session?.user
    ? comment.votes.find((vote) => vote.userId === session.user.id)?.type
    : null;

  const voteStats: VoteStats = {
    upvotes: upVotes,
    downvotes: downVotes,
    score: upVotes - downVotes,
    userVote:
      userVote === "UP" ? "UPVOTE" : userVote === "DOWN" ? "DOWNVOTE" : null,
  };

  const voting = useVoting({
    commentId: comment.id,
    initialStats: voteStats,
  });

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <div className="border-l-2 border-gray-100 pl-4 py-2">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <User className="h-3 w-3" />
            <span>{comment.user?.name || "Utilisateur"}</span>
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
          <p className="text-sm leading-relaxed mb-2">{comment.content}</p>
          <div className="flex items-center gap-2">
            <VoteButtons
              commentId={comment.id}
              stats={voting.stats}
              onVote={voting.vote}
              onRemoveVote={voting.removeVote}
              disabled={voting.isLoading}
              size="sm"
              orientation="horizontal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PostWithComments({
  post,
  onLike,
  onComment,
  onCommentVote,
}: PostWithCommentsProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(
    session?.user
      ? post.likes.some((like) => like.userId === session.user.id)
      : false
  );
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingLike, setIsSubmittingLike] = useState(false);

  // Calculate vote stats for the voting component
  const upVotes = post.votes.filter((vote) => vote.type === "UP").length;
  const downVotes = post.votes.filter((vote) => vote.type === "DOWN").length;
  const userVote = session?.user
    ? post.votes.find((vote) => vote.userId === session.user.id)?.type
    : null;

  const voteStats: VoteStats = {
    upvotes: upVotes,
    downvotes: downVotes,
    score: upVotes - downVotes,
    userVote:
      userVote === "UP" ? "UPVOTE" : userVote === "DOWN" ? "DOWNVOTE" : null,
  };

  const voting = useVoting({
    postId: post.id,
    initialStats: voteStats,
  });

  const canInteract = canUserInteract(session?.user?.role);
  const canVotePost = canUserVote(session?.user?.role);
  const canLikePost = canUserLike(session?.user?.role);

  // Handle anonymous posts
  const authorName = post.isAnonymous
    ? post.authorName || "Anonyme"
    : post.user?.name || "Utilisateur";

  // Format time
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  const handleLike = async () => {
    if (!canLikePost || isSubmittingLike) return;

    setIsSubmittingLike(true);
    try {
      setIsLiked(!isLiked);
      await onLike?.(post.id);
    } catch (error) {
      setIsLiked(isLiked);
    } finally {
      setIsSubmittingLike(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      await onComment?.(post.id, commentContent);
      setCommentContent("");
      setShowCommentForm(false);
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold leading-tight">{post.title}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {authorName}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {timeAgo}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Post Content */}
          <div className="prose prose-sm max-w-none">
            <p className="leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Interaction Bar */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-4">
              {/* Voting Buttons */}
              <VoteButtons
                postId={post.id}
                stats={voting.stats}
                onVote={voting.vote}
                onRemoveVote={voting.removeVote}
                disabled={voting.isLoading || !canVotePost}
                size="md"
                orientation="horizontal"
              />

              {/* Like Button */}
              <Button
                variant={isLiked ? "default" : "ghost"}
                size="sm"
                onClick={handleLike}
                disabled={!canLikePost || isSubmittingLike}
              >
                <Heart
                  className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`}
                />
                {post.likes.length}
              </Button>

              {/* Comment Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommentForm(!showCommentForm)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.comments.length} commentaires
              </Button>
            </div>

            <Badge variant="secondary">
              {format(new Date(post.createdAt), "dd/MM/yyyy", { locale: fr })}
            </Badge>
          </div>

          {/* Comment Form */}
          {showCommentForm && canInteract && (
            <div className="space-y-3 border-t pt-4">
              <Textarea
                placeholder="Écrivez votre commentaire..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isSubmittingComment}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCommentForm(false);
                    setCommentContent("");
                  }}
                  disabled={isSubmittingComment}
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleCommentSubmit}
                  disabled={!commentContent.trim() || isSubmittingComment}
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isSubmittingComment ? "Envoi..." : "Commenter"}
                </Button>
              </div>
            </div>
          )}

          {/* Comments Section */}
          {post.comments.length > 0 && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium text-sm text-muted-foreground">
                Commentaires ({post.comments.length})
              </h3>
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onVote={onCommentVote}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Login prompt for non-authenticated users */}
          {showCommentForm && !canInteract && (
            <div className="text-center py-4 text-sm text-muted-foreground border-t">
              <p>Connectez-vous pour commenter ce post</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
