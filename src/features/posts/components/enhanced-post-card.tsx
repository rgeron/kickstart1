'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Share2, 
  MapPin, 
  Clock, 
  User,
  Award
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';

// Import de nos nouvelles features
import { VoteButtons } from '../../voting/components/vote-buttons';
import { useVoting } from '../../voting/hooks/use-voting';
import { VoteStats } from '../../voting/types';
import { MEUDON_ZONES } from '../../../content/geolocation';
import { TAG_HIERARCHY } from '../../../content/tags';

interface EnhancedPost {
  id: string;
  content: string;
  createdAt: Date;
  
  // Système de tags amélioré
  primaryTag: keyof typeof TAG_HIERARCHY;
  secondaryTag?: string;
  
  // Géolocalisation
  zone?: keyof typeof MEUDON_ZONES;
  locationName?: string;
  
  // Auteur
  isAnonymous: boolean;
  authorName?: string;
  author?: {
    id: string;
    name: string;
    karma?: number;
    badge?: string;
  };
  
  // Contenu
  imageUrl?: string;
  
  // Stats
  voteStats: VoteStats;
  commentCount: number;
  
  // Mentions (à implémenter)
  mentions?: Array<{
    type: 'USER' | 'PLACE' | 'BUSINESS';
    name: string;
    displayName: string;
  }>;
}

interface EnhancedPostCardProps {
  post: EnhancedPost;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  showFullContent?: boolean;
  size?: 'compact' | 'normal' | 'detailed';
}

export function EnhancedPostCard({ 
  post, 
  onComment, 
  onShare,
  showFullContent = true,
  size = 'normal'
}: EnhancedPostCardProps) {
  // Hook de vote avec gestion optimiste
  const voting = useVoting({
    postId: post.id,
    initialStats: post.voteStats,
  });

  // Formatage de l'affichage
  const authorDisplay = post.isAnonymous 
    ? (post.authorName || 'Anonyme')
    : (post.author?.name || 'Utilisateur');

  const zoneDisplay = post.zone 
    ? `${MEUDON_ZONES[post.zone].emoji} ${MEUDON_ZONES[post.zone].name}`
    : null;

  const primaryTagInfo = TAG_HIERARCHY[post.primaryTag];
  const tagDisplay = `${primaryTagInfo.emoji} ${post.primaryTag}${post.secondaryTag ? ` • ${post.secondaryTag}` : ''}`;

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { 
    addSuffix: true, 
    locale: fr 
  });

  // Tronquer le contenu si nécessaire
  const displayContent = showFullContent || post.content.length <= 200 
    ? post.content 
    : `${post.content.substring(0, 200)}...`;

  const cardClasses = {
    compact: 'p-3',
    normal: 'p-4',
    detailed: 'p-6',
  };

  return (
    <Card className={`w-full hover:shadow-md transition-shadow ${cardClasses[size]}`}>
      <CardHeader className="pb-3">
        {/* Header avec auteur, lieu, temps */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              {post.isAnonymous ? (
                <User size={16} className="text-gray-400" />
              ) : (
                <User size={16} className="text-blue-500" />
              )}
              <span className="font-medium">{authorDisplay}</span>
              {post.author?.karma && (
                <span className="text-xs text-gray-500">({post.author.karma} karma)</span>
              )}
            </div>
            
            {post.author?.badge && (
              <Badge variant="secondary" className="text-xs">
                <Award size={12} className="mr-1" />
                {post.author.badge}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {zoneDisplay && (
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>{zoneDisplay}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {tagDisplay}
          </Badge>
          {post.locationName && (
            <Badge variant="secondary" className="text-xs">
              📍 {post.locationName}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Contenu principal */}
        <div className="space-y-3">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>
          
          {!showFullContent && post.content.length > 200 && (
            <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
              Lire la suite...
            </Button>
          )}

          {/* Image si présente */}
          {post.imageUrl && (
            <div className="relative w-full max-w-md mx-auto">
              <Image
                src={post.imageUrl}
                alt="Image du post"
                width={400}
                height={300}
                className="rounded-lg object-cover w-full"
              />
            </div>
          )}

          {/* Mentions (placeholder pour future implémentation) */}
          {post.mentions && post.mentions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.mentions.map((mention, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  @{mention.displayName}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          {/* Votes */}
          <VoteButtons
            postId={post.id}
            stats={voting.stats}
            onVote={voting.vote}
            onRemoveVote={voting.removeVote}
            disabled={voting.isLoading}
            size={size === 'compact' ? 'sm' : 'md'}
            orientation="horizontal"
          />

          {/* Autres actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(post.id)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
            >
              <MessageCircle size={16} />
              <span className="text-sm">{post.commentCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              className="flex items-center gap-1 text-gray-600 hover:text-green-600"
            >
              <Share2 size={16} />
              <span className="text-sm">Partager</span>
            </Button>
          </div>
        </div>

        {/* Badges et récompenses (si en mode détaillé) */}
        {size === 'detailed' && post.author && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>🏆 Badges:</span>
              <Badge variant="secondary" className="text-xs">
                🌟 Conteur
              </Badge>
              <Badge variant="secondary" className="text-xs">
                ⭐ Meudonnais
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
