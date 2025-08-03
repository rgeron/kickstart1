export type BadgeCategory = 'KARMA' | 'COMMUNITY' | 'SPECIAL' | 'LOCAL';

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: BadgeCategory;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY';
  requirements?: BadgeRequirement[];
  isActive: boolean;
}

export interface BadgeRequirement {
  type: 'KARMA' | 'POSTS' | 'COMMENTS' | 'VOTES_RECEIVED' | 'TIME_ACTIVE' | 'SPECIAL';
  value: number;
  description: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  badge: Badge;
}

export interface LocalAward {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cost: number; // en "points" communautaires
  category: 'NATURE' | 'HERITAGE' | 'COMMUNITY';
}

// Badges karma (automatiques)
export const KARMA_BADGES: Record<string, Badge> = {
  'nouveau-meudonnais': {
    id: 'nouveau-meudonnais',
    name: 'Nouveau Meudonnais',
    description: 'Bienvenue dans la communauté !',
    emoji: '🌱',
    category: 'KARMA',
    rarity: 'COMMON',
    requirements: [{ type: 'KARMA', value: 0, description: '0-50 karma' }],
    isActive: true,
  },
  'habitant-confirme': {
    id: 'habitant-confirme',
    name: 'Habitant Confirmé',
    description: 'Vous commencez à bien connaître Meudon',
    emoji: '🌿',
    category: 'KARMA',
    rarity: 'COMMON',
    requirements: [{ type: 'KARMA', value: 51, description: '51-200 karma' }],
    isActive: true,
  },
  'pilier-communaute': {
    id: 'pilier-communaute',
    name: 'Pilier de la Communauté',
    description: 'Un membre respecté et actif',
    emoji: '🌳',
    category: 'KARMA',
    rarity: 'UNCOMMON',
    requirements: [{ type: 'KARMA', value: 201, description: '201-500 karma' }],
    isActive: true,
  },
  'legende-meudon': {
    id: 'legende-meudon',
    name: 'Légende de Meudon',
    description: 'Une figure emblématique de la communauté',
    emoji: '🏆',
    category: 'KARMA',
    rarity: 'LEGENDARY',
    requirements: [{ type: 'KARMA', value: 501, description: '500+ karma' }],
    isActive: true,
  },
};

// Awards locaux (payants avec points communautaires)
export const LOCAL_AWARDS: Record<string, LocalAward> = {
  'ami-foret': {
    id: 'ami-foret',
    name: 'Ami de la Forêt',
    emoji: '🌲',
    description: 'Pour les amoureux de la nature meudonnaise',
    cost: 100,
    category: 'NATURE',
  },
  'gardien-patrimoine': {
    id: 'gardien-patrimoine',
    name: 'Gardien du Patrimoine',
    emoji: '🏛️',
    description: 'Protecteur de l\'histoire de Meudon',
    cost: 150,
    category: 'HERITAGE',
  },
  'bon-voisin': {
    id: 'bon-voisin',
    name: 'Bon Voisin',
    emoji: '🤝',
    description: 'Pour l\'entraide et la solidarité',
    cost: 75,
    category: 'COMMUNITY',
  },
  'conteur': {
    id: 'conteur',
    name: 'Conteur',
    emoji: '🌟',
    description: 'Maître dans l\'art de raconter des histoires',
    cost: 200,
    category: 'COMMUNITY',
  },
  'meudonnais-coeur': {
    id: 'meudonnais-coeur',
    name: 'Meudonnais de Cœur',
    emoji: '⭐',
    description: 'Amour inconditionnel pour Meudon',
    cost: 300,
    category: 'COMMUNITY',
  },
};

// Badges spéciaux (événements, modération, etc.)
export const SPECIAL_BADGES: Record<string, Badge> = {
  'premier-post': {
    id: 'premier-post',
    name: 'Premier Post',
    description: 'Votre première contribution à la communauté',
    emoji: '✨',
    category: 'SPECIAL',
    rarity: 'COMMON',
    requirements: [{ type: 'POSTS', value: 1, description: 'Publier votre premier post' }],
    isActive: true,
  },
  'commentateur-actif': {
    id: 'commentateur-actif',
    name: 'Commentateur Actif',
    description: 'Toujours prêt à participer aux discussions',
    emoji: '💬',
    category: 'COMMUNITY',
    rarity: 'UNCOMMON',
    requirements: [{ type: 'COMMENTS', value: 50, description: '50 commentaires publiés' }],
    isActive: true,
  },
  'explorateur-meudon': {
    id: 'explorateur-meudon',
    name: 'Explorateur de Meudon',
    description: 'A posté dans toutes les zones de Meudon',
    emoji: '🗺️',
    category: 'LOCAL',
    rarity: 'RARE',
    requirements: [{ type: 'SPECIAL', value: 6, description: 'Poster dans les 6 zones de Meudon' }],
    isActive: true,
  },
  'moderateur': {
    id: 'moderateur',
    name: 'Modérateur',
    description: 'Gardien de la communauté',
    emoji: '🛡️',
    category: 'SPECIAL',
    rarity: 'LEGENDARY',
    isActive: true,
  },
};
