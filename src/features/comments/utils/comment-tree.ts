import { Comment, CommentTree, CommentSortType } from '../types';

/**
 * Construit un arbre de commentaires à partir d'une liste plate
 */
export function buildCommentTree(comments: Comment[]): CommentTree[] {
  const commentMap = new Map<string, CommentTree>();
  const rootComments: CommentTree[] = [];

  // Créer les nœuds de l'arbre
  comments.forEach(comment => {
    commentMap.set(comment.id, {
      comment,
      children: [],
      totalReplies: 0,
    });
  });

  // Construire la hiérarchie
  comments.forEach(comment => {
    const node = commentMap.get(comment.id)!;
    
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.children.push(node);
        // Mettre à jour le compteur de réponses
        updateTotalReplies(parent);
      }
    } else {
      rootComments.push(node);
    }
  });

  return rootComments;
}

/**
 * Met à jour récursivement le compteur de réponses totales
 */
function updateTotalReplies(node: CommentTree): void {
  node.totalReplies = node.children.length;
  node.children.forEach(child => {
    updateTotalReplies(child);
    node.totalReplies += child.totalReplies;
  });
}

/**
 * Trie les commentaires selon le type spécifié
 */
export function sortComments(comments: Comment[], sortType: CommentSortType): Comment[] {
  const sorted = [...comments];
  
  switch (sortType) {
    case 'best':
      // Algorithme "best" : combine score et controverse
      return sorted.sort((a, b) => {
        const scoreA = calculateBestScore(a);
        const scoreB = calculateBestScore(b);
        return scoreB - scoreA;
      });
      
    case 'top':
      return sorted.sort((a, b) => b.score - a.score);
      
    case 'new':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
    case 'old':
      return sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      
    case 'controversial':
      return sorted.sort((a, b) => {
        const controversyA = calculateControversialScore(a.upvotes, a.downvotes);
        const controversyB = calculateControversialScore(b.upvotes, b.downvotes);
        return controversyB - controversyA;
      });
      
    default:
      return sorted;
  }
}

/**
 * Calcule le score "best" qui favorise les commentaires avec un bon ratio
 */
function calculateBestScore(comment: Comment): number {
  const { upvotes, downvotes } = comment;
  const total = upvotes + downvotes;
  
  if (total === 0) return 0;
  
  // Utilise l'intervalle de confiance de Wilson
  const p = upvotes / total;
  const z = 1.96; // 95% de confiance
  const denominator = 1 + (z * z) / total;
  const numerator = p + (z * z) / (2 * total) - z * Math.sqrt((p * (1 - p) + (z * z) / (4 * total)) / total);
  
  return numerator / denominator;
}

/**
 * Calcule le score controversé
 */
function calculateControversialScore(upvotes: number, downvotes: number): number {
  if (upvotes === 0 || downvotes === 0) return 0;
  
  const total = upvotes + downvotes;
  const balance = Math.min(upvotes, downvotes) / Math.max(upvotes, downvotes);
  
  return total * balance;
}

/**
 * Applique le tri récursivement à tout l'arbre de commentaires
 */
export function sortCommentTree(tree: CommentTree[], sortType: CommentSortType): CommentTree[] {
  // Trier les commentaires du niveau actuel
  const comments = tree.map(node => node.comment);
  const sortedComments = sortComments(comments, sortType);
  
  // Reconstruire l'arbre avec l'ordre trié
  const sortedTree = sortedComments.map(comment => {
    const originalNode = tree.find(node => node.comment.id === comment.id)!;
    return {
      ...originalNode,
      comment,
      children: sortCommentTree(originalNode.children, sortType),
    };
  });
  
  return sortedTree;
}

/**
 * Calcule la profondeur maximale d'un arbre de commentaires
 */
export function getMaxDepth(tree: CommentTree[]): number {
  if (tree.length === 0) return 0;
  
  return Math.max(...tree.map(node => 
    1 + getMaxDepth(node.children)
  ));
}

/**
 * Compte le nombre total de commentaires dans un arbre
 */
export function countTotalComments(tree: CommentTree[]): number {
  return tree.reduce((total, node) => 
    total + 1 + countTotalComments(node.children), 0
  );
}
