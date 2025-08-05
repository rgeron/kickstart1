# Enhanced Post Rendering System

This system provides comprehensive post rendering with full interaction capabilities including voting, liking, commenting, and complete post information display.

## Components Overview

### Core Components

- **`EnhancedPostCard`**: Interactive post card with voting, liking, and commenting
- **`PostWithComments`**: Full post view with comment display and interaction
- **`PostsListWithSearch`**: Enhanced posts list using the new interactive cards

### Server Actions

- **`likePostAction`**: Toggle like/unlike on posts
- **`commentPostAction`**: Create comments on posts
- **`voteAction`**: Vote up/down on posts and comments (from voting feature)

## Features

### 🗳️ Voting System
- Up/down voting on posts and comments
- Real-time vote count updates
- Optimistic UI updates
- User vote state tracking
- Horizontal and vertical vote button layouts

### ❤️ Like System
- Toggle like/unlike functionality
- Like count display
- Optimistic UI updates
- User authentication required

### 💬 Comment System
- Add comments to posts
- Comment form with validation
- Comment display with author info
- Comment voting support
- Nested comment structure ready

### 📊 Complete Post Information
- Full post content display
- Author information (with anonymous support)
- Creation date and time ago formatting
- Post metadata and badges
- Image support (if available)

## Usage Examples

### Basic Enhanced Post Card

```tsx
import { EnhancedPostCard } from "@/features/posts/components/enhanced-post-card";
import { likePostAction } from "@/features/posts/actions/like-post.action";
import { commentPostAction } from "@/features/posts/actions/comment-post.action";

function MyPostList({ posts }) {
  const handleLike = async (postId: string) => {
    const result = await likePostAction(postId);
    if (result.success) {
      toast.success(result.message);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    const result = await commentPostAction({ postId, content });
    if (result.success) {
      toast.success(result.message);
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <EnhancedPostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
        />
      ))}
    </div>
  );
}
```

### Full Post with Comments

```tsx
import { PostWithComments } from "@/features/posts/components/post-with-comments";

function PostDetailPage({ post }) {
  return (
    <PostWithComments
      post={post}
      onLike={handleLike}
      onComment={handleComment}
      onCommentVote={handleCommentVote}
    />
  );
}
```

### Using the Enhanced Posts List

```tsx
import { PostsListWithSearch } from "@/features/posts/components/posts-list-with-search";

function PostsPage({ posts }) {
  return (
    <PostsListWithSearch 
      posts={posts} 
      pageSize={10} 
    />
  );
}
```

## Data Requirements

### Post Data Structure

Posts should include the following relations:

```typescript
interface PostWithRelations {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isAnonymous: boolean;
  authorName?: string;
  user?: {
    id: string;
    name: string;
    image?: string;
  };
  likes: Array<{ userId: string }>;
  votes: Array<{ type: "UP" | "DOWN"; userId: string }>;
  comments: Array<{ id: string }>;
  _count?: {
    likes: number;
    votes: number;
    comments: number;
  };
}
```

### Comment Data Structure (for full post view)

```typescript
interface CommentWithVotes {
  id: string;
  content: string;
  createdAt: Date;
  userId: string | null;
  user: {
    id: string;
    name: string;
    image?: string;
  } | null;
  votes: Array<{
    type: "UP" | "DOWN";
    userId: string;
  }>;
  _count: {
    votes: number;
  };
}
```

## Authentication & Permissions

The system respects user permissions:

- **Voting**: Requires authentication (`canUserVote`)
- **Liking**: Requires authentication (`canUserLike`) 
- **Commenting**: Requires authentication (`canUserInteract`)
- **Anonymous users**: Can view all content but cannot interact

## Error Handling

All interactions include proper error handling:

- Server action errors are caught and displayed
- Optimistic updates are rolled back on failure
- Toast notifications for user feedback
- Loading states during async operations

## Styling

Components use Tailwind CSS and shadcn/ui components:

- Responsive design
- Dark/light mode support
- Consistent spacing and typography
- Accessible color schemes
- Interactive hover states

## Integration with Existing Features

This system integrates with:

- **Voting System**: Uses `VoteButtons` and `useVoting` hook
- **Search & Filters**: Works with existing search functionality
- **Pagination**: Supports paginated post lists
- **Authentication**: Respects user roles and permissions

## Example Pages

- `/posts/enhanced` - Enhanced posts list with all interactions
- `/posts/[id]` - Individual post view with full comment system

## Performance Considerations

- Optimistic UI updates for better UX
- Efficient re-rendering with proper state management
- Server-side pagination support
- Lazy loading of comments when needed
