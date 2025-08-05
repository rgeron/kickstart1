import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostsListWithSearch } from "@/features/posts/components/posts-list-with-search";
import { getPostsAction } from "@/features/posts/queries/get-posts.action";

// Loading skeleton for posts
function PostsLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="w-full animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded mb-2" />
            <div className="h-4 bg-muted rounded w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Posts component with enhanced interactions
async function EnhancedPosts() {
  try {
    const result = await getPostsAction();
    
    if (!result.success) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
          <p className="text-muted-foreground">{result.error}</p>
        </div>
      );
    }

    return <PostsListWithSearch posts={result.posts} pageSize={10} />;
  } catch (error) {
    console.error("Error loading posts:", error);
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💥</div>
        <h3 className="text-lg font-semibold mb-2">Erreur inattendue</h3>
        <p className="text-muted-foreground">
          Une erreur s'est produite lors du chargement des posts.
        </p>
      </div>
    );
  }
}

export default function EnhancedPostsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Posts avec Interactions Complètes</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez les posts avec toutes les fonctionnalités d'interaction : 
            votes, likes, commentaires, et affichage complet des informations.
          </p>
        </div>

        {/* Features showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="text-2xl mb-2">👍👎</div>
            <h3 className="font-semibold mb-1">Système de Vote</h3>
            <p className="text-sm text-muted-foreground">
              Votez pour ou contre les posts avec mise à jour en temps réel
            </p>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl mb-2">❤️</div>
            <h3 className="font-semibold mb-1">Likes</h3>
            <p className="text-sm text-muted-foreground">
              Aimez les posts qui vous plaisent
            </p>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-semibold mb-1">Commentaires</h3>
            <p className="text-sm text-muted-foreground">
              Commentez et engagez la conversation
            </p>
          </Card>
        </div>

        {/* Posts List */}
        <Suspense fallback={<PostsLoading />}>
          <EnhancedPosts />
        </Suspense>
      </div>
    </div>
  );
}
