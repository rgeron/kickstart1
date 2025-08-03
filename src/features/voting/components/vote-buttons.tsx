'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoteStats, VoteType } from '../types';

interface VoteButtonsProps {
  postId?: string;
  commentId?: string;
  stats: VoteStats;
  onVote?: (type: VoteType) => Promise<void>;
  onRemoveVote?: () => Promise<void>;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'vertical' | 'horizontal';
}

export function VoteButtons({
  postId,
  commentId,
  stats,
  onVote,
  onRemoveVote,
  disabled = false,
  size = 'md',
  orientation = 'vertical',
}: VoteButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticStats, setOptimisticStats] = useState(stats);

  const handleVote = async (type: VoteType) => {
    if (disabled || isLoading || !onVote) return;

    setIsLoading(true);
    
    // Mise à jour optimiste
    const currentVote = optimisticStats.userVote;
    let newStats = { ...optimisticStats };

    if (currentVote === type) {
      // Retirer le vote
      if (type === 'UPVOTE') {
        newStats.upvotes--;
      } else {
        newStats.downvotes--;
      }
      newStats.userVote = null;
      newStats.score = newStats.upvotes - newStats.downvotes;
      
      setOptimisticStats(newStats);
      
      try {
        await onRemoveVote?.();
      } catch (error) {
        // Rollback en cas d'erreur
        setOptimisticStats(stats);
      }
    } else {
      // Nouveau vote ou changement de vote
      if (currentVote) {
        // Retirer l'ancien vote
        if (currentVote === 'UPVOTE') {
          newStats.upvotes--;
        } else {
          newStats.downvotes--;
        }
      }
      
      // Ajouter le nouveau vote
      if (type === 'UPVOTE') {
        newStats.upvotes++;
      } else {
        newStats.downvotes++;
      }
      
      newStats.userVote = type;
      newStats.score = newStats.upvotes - newStats.downvotes;
      
      setOptimisticStats(newStats);
      
      try {
        await onVote(type);
      } catch (error) {
        // Rollback en cas d'erreur
        setOptimisticStats(stats);
      }
    }
    
    setIsLoading(false);
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const containerClasses = cn(
    'flex items-center gap-1',
    orientation === 'vertical' ? 'flex-col' : 'flex-row',
    disabled && 'opacity-50 cursor-not-allowed'
  );

  const buttonClasses = cn(
    'flex items-center justify-center rounded-md transition-all duration-200',
    'hover:bg-gray-100 active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[size]
  );

  const upvoteClasses = cn(
    buttonClasses,
    optimisticStats.userVote === 'UPVOTE' 
      ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
      : 'text-gray-500 hover:text-orange-600'
  );

  const downvoteClasses = cn(
    buttonClasses,
    optimisticStats.userVote === 'DOWNVOTE' 
      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
      : 'text-gray-500 hover:text-blue-600'
  );

  const scoreClasses = cn(
    'font-medium tabular-nums',
    optimisticStats.score > 0 && 'text-orange-600',
    optimisticStats.score < 0 && 'text-blue-600',
    optimisticStats.score === 0 && 'text-gray-500',
    size === 'sm' && 'text-xs',
    size === 'md' && 'text-sm',
    size === 'lg' && 'text-base'
  );

  return (
    <div className={containerClasses}>
      <button
        onClick={() => handleVote('UPVOTE')}
        disabled={disabled || isLoading}
        className={upvoteClasses}
        title="Upvote"
        aria-label={`Upvote (${optimisticStats.upvotes})`}
      >
        <ChevronUp size={iconSizes[size]} />
      </button>
      
      <span className={scoreClasses} title={`${optimisticStats.upvotes} upvotes, ${optimisticStats.downvotes} downvotes`}>
        {optimisticStats.score}
      </span>
      
      <button
        onClick={() => handleVote('DOWNVOTE')}
        disabled={disabled || isLoading}
        className={downvoteClasses}
        title="Downvote"
        aria-label={`Downvote (${optimisticStats.downvotes})`}
      >
        <ChevronDown size={iconSizes[size]} />
      </button>
    </div>
  );
}
