"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ArrowUp, 
  ArrowDown, 
  MapPin, 
  Clock, 
  User,
  UserX,
  Award
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { useSession } from "@/lib/auth/auth-client";
import { canUserInteract, canUserVote, canUserLike } from "@/lib/permissions";

// Types pour les posts avec les nouvelles relations
interface PostWithDetails {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Nouveau système
  postType: string;
  postContext?: string;
  zone?: string;
  locationName?: string;
  isAnonymous: boolean;
  authorName?: string;
  karmaScore: number;
  imageUrl?: string;
  
  // Relations
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
    karma?: number;
    badges?: Array<{ badgeType: string; earnedAt: Date }>;
  };
  
  likes: Array<{ userId: string }>;
  votes: Array<{ type: "UP" | "DOWN"; userId: string }>;
  comments: Array<{ id: string }>;
  mentions: Array<{ 
    mentionType: string; 
    mentionText: string; 
    mentionedUser?: { name: string } 
  }>;
  
  _count: {
    likes: number;
    votes: number;
    comments: number;
  };
}

const POST_TYPE_ICONS = {
  HISTOIRE: "📖",
  ANECDOTE: "😄", 
  BON_PLAN: "💡",
  LIEU_INCONTOURNABLE: "🏛️",
  PERSONNALITE_LOCALE: "👤",
  SOUVENIR: "💭",
  EVENEMENT: "📢"
};

const ZONE_ICONS = {
  MEUDON_CENTRE: "🏘️",
  MEUDON_SUR_SEINE: "🌊", 
  MEUDON_LA_FORET: "🌲",
  BELLEVUE: "🏛️",
  VAL_FLEURY: "🌿",
  FORET_DOMANIALE: "🌳"
};

const BADGE_ICONS = {
  NOUVEAU_MEUDONNAIS: "🌱",
  HABITANT_CONFIRME: "🌿",
  PILIER_COMMUNAUTE: "🌳",
  LEGENDE_MEUDON: "🏆",
  AMI_FORET: "🌲",
  GARDIEN_PATRIMOINE: "🏛️",
  BON_VOISIN: "🤝",
  CONTEUR: "🌟",
  MEUDONNAIS_STAR: "⭐"
};

interface PostCardDetailedProps {
  post: PostWithDetails;
  onVote?: (postId: string, voteType: "UP" | "DOWN") => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function PostCardDetailed({ 
  post, 
  onVote, 
  onLike, 
  onComment, 
  onShare 
}: PostCardDetailedProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(
    session?.user ? post.likes.some(like => like.userId === session.user.id) : false
  );
  const [userVote, setUserVote] = useState<"UP" | "DOWN" | null>(
    session?.user 
      ? post.votes.find(vote => vote.userId === session.user.id)?.type || null
      : null
  );

  const canInteract = canUserInteract(session?.user?.role);
  const canVotePost = canUserVote(session?.user?.role);
  const canLikePost = canUserLike(session?.user?.role);

  // Calculer les votes
  const upvotes = post.votes.filter(vote => vote.type === "UP").length;
  const downvotes = post.votes.filter(vote => vote.type === "DOWN").length;
  const netVotes = upvotes - downvotes;

  // Formater l'auteur
  const authorDisplay = post.isAnonymous 
    ? (post.authorName || "Anonyme")
    : (post.user?.name || "Utilisateur");

  // Formater la localisation
  const locationDisplay = post.zone 
    ? `${ZONE_ICONS[post.zone as keyof typeof ZONE_ICONS] || "📍"} ${post.zone.replace(/_/g, "-")}${post.locationName ? ` • ${post.locationName}` : ""}`
    : post.locationName || "";

  // Formater le temps
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { 
    addSuffix: true, 
    locale: fr 
  });

  const handleVote = (voteType: "UP" | "DOWN") => {
    if (!canVotePost) return;
    
    const newVote = userVote === voteType ? null : voteType;
    setUserVote(newVote);
    onVote?.(post.id, voteType);
  };

  const handleLike = () => {
    if (!canLikePost) return;
    
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      {/* POST HEADER */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar ou icône anonyme */}
            <div className="flex-shrink-0">
              {post.isAnonymous ? (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <UserX className="h-5 w-5 text-muted-foreground" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Nom d'utilisateur */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {post.isAnonymous ? "👤" : "@"}{authorDisplay}
                </span>
                
                {/* Badges utilisateur */}
                {!post.isAnonymous && post.user?.badges && post.user.badges.length > 0 && (
                  <div className="flex gap-1">
                    {post.user.badges.slice(0, 2).map((badge, index) => (
                      <span key={index} className="text-xs" title={badge.badgeType}>
                        {BADGE_ICONS[badge.badgeType as keyof typeof BADGE_ICONS] || "🏆"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Localisation et temps */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                {locationDisplay && (
                  <>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {locationDisplay}
                    </span>
                    <span>•</span>
                  </>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeAgo}
                </span>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-col gap-1">
            <Badge variant="secondary" className="text-xs">
              {POST_TYPE_ICONS[post.postType as keyof typeof POST_TYPE_ICONS]} {post.postType}
            </Badge>
            {post.postContext && (
              <Badge variant="outline" className="text-xs">
                {post.postContext}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      {/* CONTENU PRINCIPAL */}
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Titre */}
          <h3 className="font-semibold text-lg leading-tight">
            {post.title}
          </h3>
          
          {/* Contenu */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
          
          {/* Image optionnelle */}
          {post.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt="Image du post" 
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}
          
          {/* Mentions */}
          {post.mentions && post.mentions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.mentions.map((mention, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {mention.mentionText}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* INTERACTIONS */}
      <CardContent className="pt-0 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Votes */}
            <div className="flex items-center gap-1">
              <Button
                variant={userVote === "UP" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleVote("UP")}
                disabled={!canVotePost}
                className="h-8 px-2"
              >
                <ArrowUp className="h-4 w-4" />
                <span className="text-xs ml-1">{upvotes}</span>
              </Button>
              
              <Button
                variant={userVote === "DOWN" ? "destructive" : "ghost"}
                size="sm"
                onClick={() => handleVote("DOWN")}
                disabled={!canVotePost}
                className="h-8 px-2"
              >
                <ArrowDown className="h-4 w-4" />
                <span className="text-xs ml-1">{downvotes}</span>
              </Button>
            </div>

            {/* Like */}
            <Button
              variant={isLiked ? "default" : "ghost"}
              size="sm"
              onClick={handleLike}
              disabled={!canLikePost}
              className="h-8 px-2"
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-xs ml-1">{post._count.likes}</span>
            </Button>

            {/* Commentaires */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(post.id)}
              className="h-8 px-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs ml-1">{post._count.comments} commentaires</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Score karma */}
            {post.karmaScore > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Award className="h-3 w-3" />
                <span>{post.karmaScore}</span>
              </div>
            )}
            
            {/* Partager */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              className="h-8 px-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs ml-1">Partager</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
