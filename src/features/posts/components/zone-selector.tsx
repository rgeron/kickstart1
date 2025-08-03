"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, X } from "lucide-react";
import { useState } from "react";

// Database enum values (matching Prisma schema)
type MeudonZone =
  | "MEUDON_CENTRE"
  | "MEUDON_SUR_SEINE"
  | "MEUDON_LA_FORET"
  | "BELLEVUE"
  | "VAL_FLEURY"
  | "FORET_DOMANIALE";

// Configuration for display
const ZONE_CONFIG = {
  MEUDON_CENTRE: {
    name: "Meudon-Centre",
    emoji: "🏘️",
    description: "Mairie, Église, commerces",
    coordinates: { lat: 48.8139, lng: 2.2364 },
  },
  MEUDON_SUR_SEINE: {
    name: "Meudon-sur-Seine",
    emoji: "🌊",
    description: "Quais, port, immeubles modernes",
    coordinates: { lat: 48.8203, lng: 2.2281 },
  },
  MEUDON_LA_FORET: {
    name: "Meudon-la-Forêt",
    emoji: "🌲",
    description: "HLM, école, centre commercial",
    coordinates: { lat: 48.8089, lng: 2.2456 },
  },
  BELLEVUE: {
    name: "Bellevue",
    emoji: "🏛️",
    description: "Musée Rodin, château, quartiers résidentiels",
    coordinates: { lat: 48.8267, lng: 2.2289 },
  },
  VAL_FLEURY: {
    name: "Val-Fleury",
    emoji: "🌿",
    description: "RER, pavillons, espaces verts",
    coordinates: { lat: 48.8156, lng: 2.2511 },
  },
  FORET_DOMANIALE: {
    name: "Forêt Domaniale",
    emoji: "🌳",
    description: "Randonnées, étangs, observatoire",
    coordinates: { lat: 48.8022, lng: 2.2378 },
  },
} as const;

// Compact version for use in forms
interface CompactZoneSelectorProps {
  selectedZone?: MeudonZone;
  onZoneChange: (zone: MeudonZone | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function CompactZoneSelector({
  selectedZone,
  onZoneChange,
  disabled = false,
  placeholder = "Choisir une zone...",
}: CompactZoneSelectorProps) {
  return (
    <div className="space-y-3">
      <Select
        value={selectedZone || "none"}
        onValueChange={(value) =>
          onZoneChange(value === "none" ? undefined : (value as MeudonZone))
        }
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Aucune zone spécifique</SelectItem>
          {Object.entries(ZONE_CONFIG).map(([key, zone]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <span>{zone.emoji}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{zone.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {zone.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Preview */}
      {selectedZone && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>Zone:</span>
          <Badge variant="outline" className="text-xs">
            {ZONE_CONFIG[selectedZone].emoji} {ZONE_CONFIG[selectedZone].name}
          </Badge>
        </div>
      )}
    </div>
  );
}

// Full version with grid layout
interface ZoneSelectorProps {
  selectedZone?: MeudonZone;
  onZoneChange: (zone: MeudonZone | undefined) => void;
  disabled?: boolean;
  className?: string;
  showCoordinates?: boolean;
}

export function ZoneSelector({
  selectedZone,
  onZoneChange,
  disabled = false,
  className,
  showCoordinates = false,
}: ZoneSelectorProps) {
  const clearZone = () => {
    onZoneChange(undefined);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Zone de Meudon</Label>
          {selectedZone && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearZone}
              disabled={disabled}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3" />
              Effacer
            </Button>
          )}
        </div>

        {/* Zone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(ZONE_CONFIG).map(([key, zone]) => (
            <Button
              key={key}
              type="button"
              variant={selectedZone === key ? "default" : "outline"}
              onClick={() => onZoneChange(key as MeudonZone)}
              disabled={disabled}
              className="h-auto p-3 flex flex-col items-start text-left"
            >
              <div className="flex items-center gap-2 w-full">
                <span className="text-lg">{zone.emoji}</span>
                <span className="font-medium text-sm">{zone.name}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {zone.description}
              </span>
              {showCoordinates && selectedZone === key && (
                <span className="text-xs text-muted-foreground mt-1">
                  {zone.coordinates.lat.toFixed(4)},{" "}
                  {zone.coordinates.lng.toFixed(4)}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Zone Display */}
      {selectedZone && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Zone sélectionnée</Label>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-2">
              <span>{ZONE_CONFIG[selectedZone].emoji}</span>
              <span>{ZONE_CONFIG[selectedZone].name}</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              {ZONE_CONFIG[selectedZone].description}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for managing zone state
export function useZoneSelector(initialZone?: MeudonZone) {
  const [selectedZone, setSelectedZone] = useState<MeudonZone | undefined>(
    initialZone
  );

  const handleZoneChange = (zone: MeudonZone | undefined) => {
    setSelectedZone(zone);
  };

  const reset = () => {
    setSelectedZone(undefined);
  };

  const getCoordinates = () => {
    return selectedZone ? ZONE_CONFIG[selectedZone].coordinates : null;
  };

  return {
    selectedZone,
    handleZoneChange,
    reset,
    getCoordinates,
    zoneName: selectedZone ? ZONE_CONFIG[selectedZone].name : undefined,
    zoneDescription: selectedZone
      ? ZONE_CONFIG[selectedZone].description
      : undefined,
  };
}

// Utility functions
export function getZoneInfo(zone: MeudonZone) {
  return ZONE_CONFIG[zone];
}

export function findClosestZone(lat: number, lng: number): MeudonZone | null {
  let closestZone: MeudonZone | null = null;
  let minDistance = Infinity;

  Object.entries(ZONE_CONFIG).forEach(([key, zone]) => {
    const distance = Math.sqrt(
      Math.pow(lat - zone.coordinates.lat, 2) +
        Math.pow(lng - zone.coordinates.lng, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestZone = key as MeudonZone;
    }
  });

  return closestZone;
}
