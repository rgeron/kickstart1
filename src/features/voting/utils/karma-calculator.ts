import { KarmaBadge, KARMA_BADGES } from '../types';

/**
 * Calcule le karma avec un algorithme logarithmique
 * Les 10 premiers votes valent autant que les 100 suivants
 */
export function calculateKarmaFromVotes(upvotes: number, downvotes: number): number {
  const netVotes = upvotes - downvotes;
  
  if (netVotes <= 0) return 0;
  
  // Algorithme logarithmique : log10(votes) * 10
  // Cela signifie que 10 votes = 10 karma, 100 votes = 20 karma, 1000 votes = 30 karma
  return Math.floor(Math.log10(netVotes + 1) * 10);
}

/**
 * Détermine le badge karma basé sur le karma total
 */
export function getKarmaBadge(totalKarma: number): KarmaBadge {
  if (totalKarma >= KARMA_BADGES['legende-meudon'].minKarma) {
    return 'legende-meudon';
  }
  if (totalKarma >= KARMA_BADGES['pilier-communaute'].minKarma) {
    return 'pilier-communaute';
  }
  if (totalKarma >= KARMA_BADGES['habitant-confirme'].minKarma) {
    return 'habitant-confirme';
  }
  return 'nouveau-meudonnais';
}

/**
 * Calcule le score d'un post/commentaire pour le tri "Hot"
 * Basé sur l'algorithme Reddit : score / (age_in_hours + 2)^1.8
 */
export function calculateHotScore(
  upvotes: number, 
  downvotes: number, 
  createdAt: Date
): number {
  const score = upvotes - downvotes;
  const ageInHours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
  
  // Éviter la division par zéro
  const denominator = Math.pow(ageInHours + 2, 1.8);
  
  return score / denominator;
}

/**
 * Calcule le score "controversé" : posts avec beaucoup d'upvotes ET de downvotes
 */
export function calculateControversialScore(upvotes: number, downvotes: number): number {
  if (upvotes === 0 || downvotes === 0) return 0;
  
  const total = upvotes + downvotes;
  const balance = Math.min(upvotes, downvotes) / Math.max(upvotes, downvotes);
  
  return total * balance;
}
