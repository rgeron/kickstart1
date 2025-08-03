# Posts Search and Filter System

This directory contains a comprehensive search and filter system for posts using `nuqs` for URL state management.

## Components Overview

### Core Components

- **`PostSearchControls`**: Main wrapper component that combines search bar and filters
- **`PostSearchBar`**: Search input with debounced queries  
- **`PostFilters`**: Sort options and advanced filter dialog
- **`PostPagination`**: URL-aware pagination controls
- **`PostsListWithSearch`**: Complete implementation with posts display

### State Management

- **`usePostSearch`** hook: Manages all search state in URL parameters
- **`post-filters.ts`**: Utility functions for filtering, sorting, and processing posts

## Features

### Search Capabilities
- **Text Search**: Search in post titles, content, and author names
- **Author Filter**: Filter posts by specific authors
- **Vote Filtering**: Filter by vote status (positive, negative, no votes)
- **Date Range**: Filter posts by creation date range
- **Sorting**: Multiple sort options (latest, oldest, most-liked, most-voted)
- **Pagination**: URL-based pagination with page state

### URL State Management
All search parameters are stored in the URL using nuqs:
- `q` - Search query
- `sort` - Sort option
- `page` - Current page number
- `author` - Author filter
- `votes` - Vote filter option
- `dateFrom` / `dateTo` - Date range filters

### Performance Features
- **Debounced Search**: 300ms debounce on search input
- **Client-side Filtering**: Instant filtering for better UX
- **Server-side Support**: Actions for server-side filtering and pagination
- **Shallow URL Updates**: Configurable URL update behavior

## Usage Examples

### Basic Implementation

```tsx
import { PostsListWithSearch } from "@/components/posts/posts-list-with-search";

export default function PostsPage() {
  const posts = await getPosts(); // Your data fetching

  return (
    <PostsListWithSearch posts={posts} pageSize={10} />
  );
}
```

### Custom Implementation

```tsx
import { usePostSearch } from "@/hooks/use-post-search";
import { PostSearchControls } from "@/components/posts/post-search-controls";
import { processPostsWithFilters } from "@/lib/post-filters";

export function CustomPostsList({ posts }) {
  const searchState = usePostSearch();
  
  const filteredPosts = useMemo(() => 
    processPostsWithFilters(posts, searchState), 
    [posts, searchState]
  );

  return (
    <div>
      <PostSearchControls />
      {/* Your custom post display */}
    </div>
  );
}
```

### Server-side Data Fetching

```tsx
import { getPostsAction } from "@/actions/posts/get-posts.action";

// In a Server Component
export default async function PostsPage({ searchParams }) {
  const result = await getPostsAction({
    q: searchParams.q,
    sort: searchParams.sort,
    page: parseInt(searchParams.page || "1"),
    // ... other search params
  });

  return <PostsDisplay {...result} />;
}
```

## Customization

### Adding New Filters

1. Update the search hook:
```tsx
// In use-post-search.ts
const [searchState, setSearchState] = useQueryStates({
  // ... existing params
  category: parseAsString.withDefault(""),
});
```

2. Add filter logic:
```tsx
// In post-filters.ts
if (params.category) {
  filteredPosts = filteredPosts.filter(post => 
    post.category === params.category
  );
}
```

3. Update UI components to include new filter controls.

### Custom Sort Options

Add new sort options to the `SORT_OPTIONS` array and implement sorting logic in `sortPosts` function.

### Styling Customization

All components use Tailwind CSS and shadcn/ui components. Customize by:
- Modifying component classes
- Creating variant props
- Extending the design system

## Best Practices

1. **Always use the hook**: Use `usePostSearch` for any search-related state
2. **Server-side rendering**: Use the provided actions for SSR-friendly data fetching  
3. **Performance**: Consider using server-side filtering for large datasets
4. **Accessibility**: Components include proper ARIA labels and keyboard navigation
5. **URL sharing**: All search states are preserved in URLs for easy sharing

## Integration with Database

The system includes utilities for both client-side and server-side filtering:

- **Client-side**: Use `processPostsWithFilters` for instant filtering
- **Server-side**: Use `buildPostsQuery` to generate Prisma queries
- **Hybrid**: Combine both approaches for optimal performance

## Dependencies

- `nuqs` - URL state management
- `@radix-ui/react-*` - UI primitives
- `lucide-react` - Icons
- Custom hooks: `useDebounceFn`