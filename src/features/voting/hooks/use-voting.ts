'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { VoteType, VoteStats } from '../types';
import { voteAction, removeVoteAction } from '../actions/vote.action';

interface UseVotingProps {
  postId?: string;
  commentId?: string;
  initialStats: VoteStats;
  onStatsChange?: (stats: VoteStats) => void;
}

export function useVoting({
  postId,
  commentId,
  initialStats,
  onStatsChange,
}: UseVotingProps) {
  const [stats, setStats] = useState<VoteStats>(initialStats);
  const [isLoading, setIsLoading] = useState(false);

  const updateStats = useCallback((newStats: VoteStats) => {
    setStats(newStats);
    onStatsChange?.(newStats);
  }, [onStatsChange]);

  const vote = useCallback(async (type: VoteType) => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      const result = await voteAction({
        postId,
        commentId,
        type,
      });

      if (result.success) {
        // Mise à jour optimiste des stats
        const currentVote = stats.userVote;
        let newStats = { ...stats };

        if (currentVote === type) {
          // Retirer le vote (toggle)
          if (type === 'UPVOTE') {
            newStats.upvotes--;
          } else {
            newStats.downvotes--;
          }
          newStats.userVote = null;
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
        }
        
        newStats.score = newStats.upvotes - newStats.downvotes;
        updateStats(newStats);
        
        if (result.message) {
          toast.success(result.message);
        }
      } else {
        toast.error(result.error || 'Erreur lors du vote');
      }
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      toast.error('Erreur lors du vote');
    } finally {
      setIsLoading(false);
    }
  }, [postId, commentId, stats, isLoading, updateStats]);

  const removeVote = useCallback(async () => {
    if (isLoading || !stats.userVote) return;

    setIsLoading(true);
    
    try {
      const result = await removeVoteAction({
        postId,
        commentId,
      });

      if (result.success) {
        // Mise à jour optimiste
        let newStats = { ...stats };
        
        if (stats.userVote === 'UPVOTE') {
          newStats.upvotes--;
        } else {
          newStats.downvotes--;
        }
        
        newStats.userVote = null;
        newStats.score = newStats.upvotes - newStats.downvotes;
        
        updateStats(newStats);
        
        if (result.message) {
          toast.success(result.message);
        }
      } else {
        toast.error(result.error || 'Erreur lors de la suppression du vote');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du vote:', error);
      toast.error('Erreur lors de la suppression du vote');
    } finally {
      setIsLoading(false);
    }
  }, [postId, commentId, stats, isLoading, updateStats]);

  const upvote = useCallback(() => vote('UPVOTE'), [vote]);
  const downvote = useCallback(() => vote('DOWNVOTE'), [vote]);

  return {
    stats,
    isLoading,
    vote,
    upvote,
    downvote,
    removeVote,
    hasVoted: !!stats.userVote,
    hasUpvoted: stats.userVote === 'UPVOTE',
    hasDownvoted: stats.userVote === 'DOWNVOTE',
  };
}
