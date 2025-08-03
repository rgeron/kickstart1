"use server";

import { prisma } from "@/lib/prisma";

export interface MentionSuggestion {
  id: string;
  type: "USER" | "PLACE" | "BUSINESS";
  name: string;
  displayName: string;
  description?: string;
  verified?: boolean;
  zone?: string;
}

// Get user suggestions for mentions
export async function getUserSuggestions(
  query: string,
  limit: number = 10
): Promise<MentionSuggestion[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        banned: { not: true }, // Exclude banned users
      },
      select: {
        id: true,
        name: true,
        email: true,
        karma: true,
      },
      take: limit,
      orderBy: [
        { karma: "desc" }, // Higher karma users first
        { name: "asc" },
      ],
    });

    return users.map((user) => ({
      id: user.id,
      type: "USER" as const,
      name: user.name.replace(/\s+/g, "_"), // Convert spaces to underscores for @mentions
      displayName: user.name,
      description: `${user.karma} karma`,
    }));
  } catch (error) {
    console.error("Error fetching user suggestions:", error);
    return [];
  }
}

// Get place suggestions for mentions
export async function getPlaceSuggestions(
  query: string,
  limit: number = 10
): Promise<MentionSuggestion[]> {
  try {
    const places = await prisma.meudonLocation.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { displayName: { contains: query, mode: "insensitive" } },
        ],
        type: { in: ["MONUMENT", "PARC", "INSTITUTION"] }, // Place-like types
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        zone: true,
        type: true,
      },
      take: limit,
      orderBy: [{ displayName: "asc" }],
    });

    return places.map((place) => ({
      id: place.id,
      type: "PLACE" as const,
      name: place.name,
      displayName: place.displayName,
      description: place.zone ? `${place.zone}` : undefined,
      verified: true, // Assume all places in DB are verified
    }));
  } catch (error) {
    console.error("Error fetching place suggestions:", error);
    return [];
  }
}

// Get business suggestions for mentions
export async function getBusinessSuggestions(
  query: string,
  limit: number = 10
): Promise<MentionSuggestion[]> {
  try {
    const businesses = await prisma.meudonLocation.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { displayName: { contains: query, mode: "insensitive" } },
        ],
        type: "COMMERCE", // Use the correct enum value
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        zone: true,
        type: true,
        description: true,
      },
      take: limit,
      orderBy: [{ displayName: "asc" }],
    });

    return businesses.map((business) => ({
      id: business.id,
      type: "BUSINESS" as const,
      name: business.name,
      displayName: business.displayName,
      description: business.zone
        ? `${business.zone}`
        : business.description || undefined,
      verified: true, // Assume all businesses in DB are verified
    }));
  } catch (error) {
    console.error("Error fetching business suggestions:", error);
    return [];
  }
}

// Get all mention suggestions (combined)
export async function getMentionSuggestions(
  query: string,
  types: ("USER" | "PLACE" | "BUSINESS")[] = ["USER", "PLACE", "BUSINESS"],
  limit: number = 10
): Promise<MentionSuggestion[]> {
  const suggestions: MentionSuggestion[] = [];
  const limitPerType = Math.ceil(limit / types.length);

  try {
    // Fetch suggestions for each requested type
    const promises = types.map(async (type) => {
      switch (type) {
        case "USER":
          return await getUserSuggestions(query, limitPerType);
        case "PLACE":
          return await getPlaceSuggestions(query, limitPerType);
        case "BUSINESS":
          return await getBusinessSuggestions(query, limitPerType);
        default:
          return [];
      }
    });

    const results = await Promise.all(promises);

    // Combine and sort results
    const combined = results.flat();

    // Sort by relevance (exact matches first, then verified, then alphabetical)
    const sorted = combined.sort((a, b) => {
      const aExact =
        a.name.toLowerCase().startsWith(query.toLowerCase()) ||
        a.displayName.toLowerCase().startsWith(query.toLowerCase());
      const bExact =
        b.name.toLowerCase().startsWith(query.toLowerCase()) ||
        b.displayName.toLowerCase().startsWith(query.toLowerCase());

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;

      return a.displayName.localeCompare(b.displayName);
    });

    return sorted.slice(0, limit);
  } catch (error) {
    console.error("Error fetching mention suggestions:", error);
    return [];
  }
}

// Mock data for development (when database is not available)
export function getMockMentionSuggestions(
  query: string,
  limit: number = 10
): MentionSuggestion[] {
  const mockData: MentionSuggestion[] = [
    // Users
    {
      id: "user-1",
      type: "USER",
      name: "Pierre_Durand",
      displayName: "Pierre Durand",
      description: "125 karma",
    },
    {
      id: "user-2",
      type: "USER",
      name: "Marie_Martin",
      displayName: "Marie Martin",
      description: "89 karma",
    },
    {
      id: "user-3",
      type: "USER",
      name: "Jean_Dupont",
      displayName: "Jean Dupont",
      description: "67 karma",
    },

    // Places
    {
      id: "place-1",
      type: "PLACE",
      name: "MuseeRodin",
      displayName: "Musée Rodin",
      description: "BELLEVUE",
      verified: true,
    },
    {
      id: "place-2",
      type: "PLACE",
      name: "ForetMeudon",
      displayName: "Forêt de Meudon",
      description: "FORET_DOMANIALE",
      verified: true,
    },
    {
      id: "place-3",
      type: "PLACE",
      name: "PlaceMairie",
      displayName: "Place de la Mairie",
      description: "MEUDON_CENTRE",
      verified: true,
    },

    // Businesses
    {
      id: "business-1",
      type: "BUSINESS",
      name: "BoulangerieCentre",
      displayName: "Boulangerie du Centre",
      description: "Boulangerie • MEUDON_CENTRE",
      verified: true,
    },
    {
      id: "business-2",
      type: "BUSINESS",
      name: "PharmacieGare",
      displayName: "Pharmacie de la Gare",
      description: "Pharmacie • VAL_FLEURY",
      verified: false,
    },
    {
      id: "business-3",
      type: "BUSINESS",
      name: "RestaurantBellevue",
      displayName: "Restaurant de Bellevue",
      description: "Restaurant • BELLEVUE",
      verified: true,
    },
  ];

  // Filter by query
  const filtered = mockData.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.displayName.toLowerCase().includes(query.toLowerCase())
  );

  // Sort by relevance
  const sorted = filtered.sort((a, b) => {
    const aExact =
      a.name.toLowerCase().startsWith(query.toLowerCase()) ||
      a.displayName.toLowerCase().startsWith(query.toLowerCase());
    const bExact =
      b.name.toLowerCase().startsWith(query.toLowerCase()) ||
      b.displayName.toLowerCase().startsWith(query.toLowerCase());

    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    if (a.verified && !b.verified) return -1;
    if (!a.verified && b.verified) return 1;

    return a.displayName.localeCompare(b.displayName);
  });

  return sorted.slice(0, limit);
}
