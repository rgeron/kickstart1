"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, MapPin, User, UserX } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  POST_TYPE_LABELS,
  ZONE_LABELS,
  createPostFlexibleSchema,
  getContextOptionsForType,
  type CreatePostFlexibleInput,
} from "../utils/post-utils";
import { MentionInput } from "./mention-input";
// import { createPostFlexibleAction } from "../actions/create-post-flexible.action";

const getContextOptions = (postType: string) => {
  const options = getContextOptionsForType(postType);
  const labelMap: Record<string, string> = {
    DROLE: "Drôle",
    AMOUR: "Amour",
    NOSTALGIQUE: "Nostalgique",
    FAMILLE: "Famille",
    INSOLITE: "Insolite",
    EMOUVANTE: "Émouvante",
    SURPRENANTE: "Surprenante",
    TOUCHANTE: "Touchante",
    CURIEUSE: "Curieuse",
    RECENTE: "Récente",
    RESTAURANT: "Restaurant",
    SHOPPING: "Shopping",
    LOISIR: "Loisir",
    PRATIQUE: "Pratique",
    GRATUIT: "Gratuit",
    INCONTOURNABLE: "Incontournable",
    CACHE: "Caché",
    HISTORIQUE: "Historique",
    NATURE: "Nature",
    CULTURE: "Culture",
  };

  return options.map((option) => ({
    value: option,
    label: labelMap[option] || option,
  }));
};

export function CreatePostFormFlexible() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePostFlexibleInput>({
    resolver: zodResolver(createPostFlexibleSchema),
    defaultValues: {
      title: "",
      content: "",
      postType: "HISTOIRE",
      isAnonymous: !session?.user,
      authorName: session?.user ? "" : "Anonyme",
    },
  });

  const watchedPostType = form.watch("postType");
  const watchedIsAnonymous = form.watch("isAnonymous");

  const onSubmit = async (data: CreatePostFlexibleInput) => {
    setIsSubmitting(true);
    try {
      // TODO: Implémenter l'action de création de post
      console.log("Données du post:", data);
      toast.success("Post créé avec succès ! (Mode test)");
      form.reset();
    } catch (error) {
      toast.error("Erreur lors de la création du post");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ✍️ Raconte ton histoire de Meudon...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Mode anonyme toggle */}
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Button
              type="button"
              variant={watchedIsAnonymous ? "secondary" : "outline"}
              size="sm"
              onClick={() => form.setValue("isAnonymous", !watchedIsAnonymous)}
              className="flex items-center gap-2"
            >
              {watchedIsAnonymous ? (
                <UserX className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
              {watchedIsAnonymous ? "Mode Anonyme" : "Mode Connecté"}
            </Button>

            {watchedIsAnonymous && (
              <div className="flex-1">
                <Input
                  placeholder="Nom d'affichage (optionnel)"
                  {...form.register("authorName")}
                  className="h-8"
                />
              </div>
            )}
          </div>

          {/* Titre */}
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              placeholder="Un titre accrocheur..."
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Contenu avec mentions */}
          <div>
            <Label htmlFor="content">Contenu</Label>
            <MentionInput
              value={form.watch("content") || ""}
              onChange={(value) => form.setValue("content", value)}
              placeholder="Raconte ton histoire... Utilise @ pour mentionner des personnes, lieux ou commerces de Meudon"
              rows={4}
              onMentionAdd={(mention) => {
                console.log("Mention ajoutée:", mention);
                // TODO: Sauvegarder les mentions pour les traiter lors de la soumission
              }}
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>{form.formState.errors.content?.message}</span>
              <span>{form.watch("content")?.length || 0}/1000</span>
            </div>
          </div>

          {/* Type et contexte */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select
                value={form.watch("postType")}
                onValueChange={(value) => {
                  form.setValue("postType", value as any);
                  form.setValue("postContext", undefined);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(POST_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Contexte</Label>
              <Select
                value={form.watch("postContext") || ""}
                onValueChange={(value) =>
                  form.setValue("postContext", value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un contexte..." />
                </SelectTrigger>
                <SelectContent>
                  {getContextOptions(watchedPostType).map(
                    ({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Zone géographique */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Zone de Meudon
              </Label>
              <Select
                value={form.watch("zone") || ""}
                onValueChange={(value) => form.setValue("zone", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une zone..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ZONE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lieu spécifique</Label>
              <Input
                placeholder="Ex: Musée Rodin, Place de la Mairie..."
                {...form.register("locationName")}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              {isSubmitting ? "Publication..." : "Publier"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
