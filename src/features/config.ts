/**
 * Configuration centralisée pour toutes les features de ilovemeudon.fr
 */

// Configuration générale de l'application
export const APP_CONFIG = {
  name: "ilovemeudon.fr",
  description: "Pour tous les amoureux de Meudon",
  version: "1.0.0",
  maxPostLength: 1000,
  maxCommentLength: 500,
  maxImageSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ["image/jpeg", "image/png", "image/webp"],
} as const;

// Configuration des posts
export const POSTS_CONFIG = {
  maxLength: 1000,
  maxImagesPerPost: 1,
  allowAnonymous: true,
  defaultAuthorName: "Anonyme",
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
} as const;

// Configuration du système de votes
export const VOTING_CONFIG = {
  hotScoreAlgorithm: {
    // score / (age_in_hours + offset)^gravity
    gravity: 1.8,
    timeOffset: 2, // heures
  },
} as const;

// Configuration des commentaires
export const COMMENTS_CONFIG = {
  maxLength: 500,
  maxDepth: 10, // Profondeur maximale de threading
  defaultSort: "best" as const,
  pagination: {
    defaultLimit: 50,
    maxLimit: 200,
  },
  collapseThreshold: -5, // Score en dessous duquel les commentaires sont cachés
} as const;

// Configuration des mentions
export const MENTIONS_CONFIG = {
  maxSuggestions: 10,
  minQueryLength: 1,
  searchDelay: 300, // ms de debounce
  types: {
    users: { prefix: "@", color: "#3b82f6" },
    places: { prefix: "@", color: "#10b981" },
    businesses: { prefix: "@", color: "#f59e0b" },
  },
} as const;

// Configuration de la recherche
export const SEARCH_CONFIG = {
  maxQueryLength: 500,
  maxFilters: {
    tags: 10,
    zones: 6,
    mentions: 20,
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  suggestions: {
    maxCount: 10,
    includeRecent: true,
    includeTrending: true,
  },
  indexing: {
    minWordLength: 2,
    stopWords: ["le", "la", "les", "de", "du", "des", "et", "ou", "un", "une"],
  },
} as const;

// Configuration de la carte
export const MAP_CONFIG = {
  meudon: {
    center: { lat: 48.8139, lng: 2.2364 },
    defaultZoom: 14,
    minZoom: 12,
    maxZoom: 18,
    bounds: {
      north: 48.835,
      south: 48.795,
      east: 2.265,
      west: 2.205,
    },
  },
  clustering: {
    enabled: true,
    maxZoom: 15,
    radius: 50,
    minPoints: 2,
  },
  pins: {
    maxVisible: 500,
    refreshInterval: 30000, // 30 secondes
  },
} as const;

// Configuration de la modération
export const MODERATION_CONFIG = {
  autoModeration: {
    enabled: true,
    spamThreshold: 5, // Nombre de rapports pour auto-hide
    karmaThreshold: -10, // Karma minimum pour poster
  },
  reports: {
    maxPerUser: 10, // Par jour
    reasons: [
      "SPAM",
      "HARASSMENT",
      "INAPPROPRIATE_CONTENT",
      "MISINFORMATION",
      "OFF_TOPIC",
      "DUPLICATE",
      "OTHER",
    ],
  },
  queue: {
    priorities: {
      URGENT: 1,
      HIGH: 2,
      MEDIUM: 3,
      LOW: 4,
    },
    autoAssign: true,
    maxAssignedPerModerator: 20,
  },
} as const;

// Configuration de l'upload de fichiers
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  compression: {
    quality: 0.8,
    maxWidth: 1200,
    maxHeight: 1200,
  },
  storage: {
    bucket: "ilovemeudon-uploads",
    region: "auto",
    publicUrl: process.env.R2_PUBLIC_URL,
  },
} as const;

// Configuration des notifications
export const NOTIFICATIONS_CONFIG = {
  types: {
    mention: { enabled: true, realtime: true },
    reply: { enabled: true, realtime: true },
    vote: { enabled: false, realtime: false },
    badge: { enabled: true, realtime: true },
    moderation: { enabled: true, realtime: true },
  },
  delivery: {
    inApp: true,
    email: false, // À implémenter plus tard
    push: false, // À implémenter plus tard
  },
  retention: {
    days: 30,
    maxPerUser: 1000,
  },
} as const;

// Configuration de la géolocalisation
export const GEO_CONFIG = {
  zones: {
    required: false, // Les posts peuvent être sans zone
    defaultZone: null,
    validation: {
      withinMeudon: true,
      precision: 100, // mètres
    },
  },
  privacy: {
    exactLocation: false, // Jamais stocker la position exacte
    zoneOnly: true,
  },
} as const;
