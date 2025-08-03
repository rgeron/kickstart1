"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSession } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin, Tag, User } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createPostFlexibleAction } from "../actions/create-post-flexible.action";
import {
  createPostFlexibleSchema,
  type CreatePostFlexibleInput,
} from "../utils/post-utils";
import { MentionInput } from "./mention-input";
import { CompactTagSelector } from "./tag-selector";
import { CompactZoneSelector } from "./zone-selector";

export function CreatePostForm() {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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

  const watchedIsAnonymous = form.watch("isAnonymous");

  function onSubmit(values: CreatePostFlexibleInput) {
    setError(null);
    startTransition(async () => {
      try {
        await createPostFlexibleAction(values);
        toast.success("Post créé avec succès !");
        form.reset();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la création du post";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ✍️ Raconte ton histoire de Meudon...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Un titre accrocheur pour ton histoire..."
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content with mentions */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu</FormLabel>
                  <FormControl>
                    <MentionInput
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Raconte ton histoire... Utilise @ pour mentionner des personnes, lieux ou commerces de Meudon"
                      rows={6}
                      disabled={isPending}
                      onMentionAdd={(mention) => {
                        console.log("Mention ajoutée:", mention);
                      }}
                    />
                  </FormControl>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <FormMessage />
                    <span>{field.value?.length || 0}/1000</span>
                  </div>
                </FormItem>
              )}
            />

            {/* Tags and Location Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tags Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <Label className="text-base font-medium">Tags</Label>
                </div>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="postType"
                    render={({ field }) => (
                      <FormItem>
                        <CompactTagSelector
                          selectedType={field.value}
                          selectedContext={form.watch("postContext")}
                          onTypeChange={(type) => {
                            field.onChange(type);
                            form.setValue("postContext", undefined);
                          }}
                          onContextChange={(context) =>
                            form.setValue("postContext", context)
                          }
                          disabled={isPending}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <Label className="text-base font-medium">Localisation</Label>
                </div>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="zone"
                    render={({ field }) => (
                      <FormItem>
                        <CompactZoneSelector
                          selectedZone={field.value}
                          onZoneChange={field.onChange}
                          disabled={isPending}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="locationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Lieu spécifique (ex: Musée Rodin, Place de la Mairie...)"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Author Settings */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <Label className="text-base font-medium">Auteur</Label>
              </div>

              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Publier anonymement
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Ton nom ne sera pas affiché publiquement
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchedIsAnonymous && (
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d'affichage (optionnel)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Anonyme"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publier mon histoire
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isPending}
              >
                Effacer
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
