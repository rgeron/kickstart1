import { CreatePostFormFlexible } from "@/features/posts/components/create-post-form-flexible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestFlexiblePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            🌳 I Love Meudon - Test
          </h1>
          <p className="text-lg text-muted-foreground">
            Test du système de publication flexible
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Système de Publication Flexible</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Ce formulaire permet à tous les utilisateurs (connectés ou anonymes) de créer des posts avec le nouveau système de tags, géolocalisation et mentions.
            </p>
            <CreatePostFormFlexible />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fonctionnalités Testées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">✅ Système d'authentification flexible</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Publication anonyme avec nom personnalisé</li>
                  <li>• Publication connectée avec profil utilisateur</li>
                  <li>• Basculement entre modes anonyme/connecté</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🏷️ Système de tags à deux niveaux</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Types: Histoire, Anecdote, Bon plan, etc.</li>
                  <li>• Contextes dynamiques selon le type</li>
                  <li>• Interface intuitive avec sélecteurs</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📍 Géolocalisation Meudon</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Zones prédéfinies de Meudon</li>
                  <li>• Lieux spécifiques optionnels</li>
                  <li>• Interface avec icônes géographiques</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📝 Structure de post détaillée</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Titre et contenu avec limites</li>
                  <li>• Compteur de caractères en temps réel</li>
                  <li>• Validation côté client et serveur</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
