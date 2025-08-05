# Guide d'Intégration des Features - ilovemeudon.fr

## 🚀 Comment utiliser la nouvelle architecture

### 1. Système de Vote

#### Composant VoteButtons

```tsx
import { VoteButtons } from "@/features/voting/components/vote-buttons";
import { useVoting } from "@/features/voting/hooks/use-voting";

function MyPostComponent({ post }) {
  const voting = useVoting({
    postId: post.id,
    initialStats: post.voteStats,
  });

  return (
    <VoteButtons
      postId={post.id}
      stats={voting.stats}
      onVote={voting.vote}
      onRemoveVote={voting.removeVote}
      disabled={voting.isLoading}
    />
  );
}
```

#### Actions Server-Side

```tsx
import {
  voteAction,
  getVoteStats,
} from "@/features/voting/actions/vote.action";

// Dans une Server Action
export async function handleVote(postId: string, type: "UPVOTE" | "DOWNVOTE") {
  const result = await voteAction({ postId, type });
  return result;
}

// Pour récupérer les stats
export async function getPostWithVotes(postId: string, userId?: string) {
  const post = await getPost(postId);
  const voteStats = await getVoteStats(postId, undefined, userId);

  return { ...post, voteStats };
}
```

### 2. Système de Tags

#### Utilisation des tags hiérarchiques

```tsx
import { TAG_HIERARCHY } from "@/features";

function TagSelector({ onTagSelect }) {
  return (
    <div>
      {Object.entries(TAG_HIERARCHY).map(([key, tag]) => (
        <div key={key}>
          <h3>
            {tag.emoji} {key}
          </h3>
          {tag.level2.map((subTag) => (
            <button key={subTag} onClick={() => onTagSelect(key, subTag)}>
              {subTag}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### 3. Géolocalisation

#### Sélection de zone

```tsx
import { MEUDON_ZONES } from "@/features";

function ZoneSelector({ onZoneSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(MEUDON_ZONES).map(([key, zone]) => (
        <button
          key={key}
          onClick={() => onZoneSelect(key)}
          className="p-3 border rounded-lg hover:bg-gray-50"
        >
          <div className="text-2xl">{zone.emoji}</div>
          <div className="font-medium">{zone.name}</div>
          <div className="text-sm text-gray-500">{zone.description}</div>
        </button>
      ))}
    </div>
  );
}
```

### 4. Système de Commentaires

#### Structure hiérarchique

```tsx
import {
  buildCommentTree,
  sortComments,
} from "@/features/comments/utils/comment-tree";

function CommentSection({ comments, sortType = "best" }) {
  const sortedComments = sortComments(comments, sortType);
  const commentTree = buildCommentTree(sortedComments);

  return (
    <div>
      {commentTree.map((node) => (
        <CommentNode key={node.comment.id} node={node} />
      ))}
    </div>
  );
}

function CommentNode({ node, depth = 0 }) {
  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div>{node.comment.content}</div>
      {node.children.map((child) => (
        <CommentNode key={child.comment.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}
```

### 5. Système de Mentions

#### Parser les mentions

```tsx
import {
  parseMentions,
  renderMentionsAsHTML,
} from "@/features/mentions/utils/mention-parser";

function PostContent({ content }) {
  const mentions = parseMentions(content);
  const htmlContent = renderMentionsAsHTML(content, mentions);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
```

#### Autocomplétion

```tsx
import {
  extractCurrentMention,
  filterSuggestions,
} from "@/features/mentions/utils/mention-parser";

function MentionInput({ value, onChange, suggestions }) {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const currentMention = extractCurrentMention(value, cursorPosition);
  const filteredSuggestions = currentMention
    ? filterSuggestions(suggestions, currentMention.query)
    : [];

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setCursorPosition(e.target.selectionStart);
        }}
      />
      {showSuggestions && (
        <MentionSuggestions suggestions={filteredSuggestions} />
      )}
    </div>
  );
}
```

### 6. Recherche Avancée

#### Parser les requêtes

```tsx
import {
  parseSearchQuery,
  buildSearchQuery,
} from "@/features/search/utils/search-parser";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const { cleanQuery, filters } = parseSearchQuery(query);
    onSearch({ query: cleanQuery, ...filters });
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher... (ex: tag:histoire zone:centre @MuseeRodin)"
      />
      <button onClick={handleSearch}>Rechercher</button>
    </div>
  );
}
```

## 🔧 Bonnes Pratiques

### 1. Gestion d'État

- Utilisez les hooks personnalisés pour la logique métier
- Implémentez des mises à jour optimistes pour une meilleure UX
- Gérez les états de chargement et d'erreur

### 2. Performance

- Utilisez React.memo pour les composants lourds
- Implémentez la pagination pour les listes longues
- Optimisez les images avec Next.js Image

### 3. Accessibilité

- Ajoutez des labels ARIA appropriés
- Gérez la navigation au clavier
- Utilisez des couleurs contrastées

### 4. Tests

- Testez les utilitaires avec Jest
- Testez les composants avec React Testing Library
- Testez les actions avec des mocks Prisma

## 📊 Métriques à Suivre

### Engagement

```tsx
// Exemple de tracking d'événements
function trackVote(postId: string, voteType: string) {
  analytics.track("post_voted", {
    postId,
    voteType,
    timestamp: Date.now(),
  });
}
```

### Performance

```tsx
// Mesurer les temps de réponse
const startTime = performance.now();
await voteAction({ postId, type: "UPVOTE" });
const endTime = performance.now();
console.log(`Vote took ${endTime - startTime} milliseconds`);
```

## 🚨 Points d'Attention

1. **Sécurité**: Toujours valider les données côté serveur
2. **Rate Limiting**: Implémenter des limites pour éviter le spam
3. **Modération**: Surveiller le contenu généré par les utilisateurs
4. **Performance**: Optimiser les requêtes de base de données
5. **Scalabilité**: Prévoir la croissance de la communauté
