export const MEUDON_ZONES = {
  centre: {
    name: "Meudon-Centre",
    emoji: "🏘️",
    description: "Mairie, Église, commerces",
    coordinates: { lat: 48.8139, lng: 2.2364 },
  },
  "sur-seine": {
    name: "Meudon-sur-Seine",
    emoji: "🌊",
    description: "Quais, port, immeubles modernes",
    coordinates: { lat: 48.8203, lng: 2.2281 },
  },
  "la-foret": {
    name: "Meudon-la-Forêt",
    emoji: "🌲",
    description: "HLM, école, centre commercial",
    coordinates: { lat: 48.8089, lng: 2.2456 },
  },
  bellevue: {
    name: "Bellevue",
    emoji: "🏛️",
    description: "Musée Rodin, château, quartiers résidentiels",
    coordinates: { lat: 48.8267, lng: 2.2289 },
  },
  "val-fleury": {
    name: "Val-Fleury",
    emoji: "🌿",
    description: "RER, pavillons, espaces verts",
    coordinates: { lat: 48.8156, lng: 2.2511 },
  },
  "foret-domaniale": {
    name: "Forêt Domaniale",
    emoji: "🌳",
    description: "Randonnées, étangs, observatoire",
    coordinates: { lat: 48.8022, lng: 2.2378 },
  },
} as const;
