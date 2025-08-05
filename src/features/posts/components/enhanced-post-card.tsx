"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth/auth-client";
import { canUserInteract, canUserLike, canUserVote } from "@/lib/permissions";
import { PostWithRelations } from "@/lib/post-filters";
import { VoteButtons } from "@/features/voting/components/vote-buttons";
import { useVoting } from "@/features/voting/hooks/use-voting";
import { VoteStats } from "@/features/voting/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Heart, 
  MessageCircle, 
  User, 
  MapPin, 
  Clock, 
  Send,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

interface EnhancedPostCardProps {
  post: PostWithRelations;
  onLike?: (postId: string) => Promise<void>;
  onComment?: (postId: string, content: string) => Promise<void>;
}

export function EnhancedPostCard({ post, onLike, onComment }: EnhancedPostCardProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(
    session?.user ? post.likes.some((like) => like.userId === session.user.id) : false
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
    userVote: userVote === "UP" ? "UPVOTE" : userVote === "DOWN" ? "DOWNVOTE" : null,
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
      // Revert optimistic update on error
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
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {authorName}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {timeAgo}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Post Content */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
            {post.content}
          </p>

          {/* Interaction Bar */}
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-4">
              {/* Voting Buttons */}
              <VoteButtons
                postId={post.id}
                stats={voting.stats}
                onVote={voting.vote}
                onRemoveVote={voting.removeVote}
                disabled={voting.isLoading || !canVotePost}
                size="sm"
                orientation="horizontal"
              />

              {/* Like Button */}
              <Button
                variant={isLiked ? "default" : "ghost"}
                size="sm"
                onClick={handleLike}
                disabled={!canLikePost || isSubmittingLike}
                className="h-8 px-2"
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-xs ml-1">{post.likes.length}</span>
              </Button>

              {/* Comment Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="h-8 px-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs ml-1">{post.comments.length}</span>
              </Button>
            </div>

            <Badge variant="secondary" className="text-xs">
              {new Date(post.createdAt).toLocaleDateString()}
            </Badge>
          </div>

          {/* Comment Form */}
          {showCommentForm && canInteract && (
            <div className="space-y-2 border-t pt-3">
              <Textarea
                placeholder="Écrivez votre commentaire..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="min-h-[80px] resize-none"
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
