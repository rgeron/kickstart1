import { Suspense } from "react";
import { PostsListWithSearch } from "@/components/posts/posts-list-with-search";
import { getPostsAction } from "@/actions/posts/get-posts.action";
import type { PostWithRelations } from "@/lib/post-filters";

// Mock data for demonstration - replace with actual data fetching
const mockPosts: PostWithRelations[] = [
  {
    id: "1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    title: "Getting Started with Next.js 15",
    content: "Next.js 15 brings amazing new features including improved performance, better developer experience, and enhanced server components. Let's explore what's new in this major release.",
    userId: "user1",
    user: {
      id: "user1",
      name: "Alice Johnson",
      email: "alice@example.com",
      image: null,
    },
    likes: [{ userId: "user2" }, { userId: "user3" }],
    votes: [
      { type: "UP" as const, userId: "user2" },
      { type: "UP" as const, userId: "user3" },
      { type: "DOWN" as const, userId: "user4" },
    ],
    comments: [{ id: "comment1" }, { id: "comment2" }],
  },
  {
    id: "2",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    title: "Building Modern Web Applications",
    content: "Modern web development requires understanding of various technologies and patterns. This post covers the essential tools and practices for building scalable applications.",
    userId: "user2",
    user: {
      id: "user2",
      name: "Bob Smith",
      email: "bob@example.com",
      image: null,
    },
    likes: [{ userId: "user1" }],
    votes: [{ type: "UP" as const, userId: "user1" }],
    comments: [{ id: "comment3" }],
  },
  {
    id: "3",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    title: "State Management with Nuqs",
    content: "Learn how to manage URL state effectively with nuqs library. This powerful tool helps maintain application state in the URL for better user experience and shareability.",
    userId: "user1",
    user: {
      id: "user1",
      name: "Alice Johnson",
      email: "alice@example.com",
      image: null,
    },
    likes: [{ userId: "user2" }, { userId: "user3" }, { userId: "user4" }],
    votes: [
      { type: "UP" as const, userId: "user2" },
      { type: "UP" as const, userId: "user3" },
    ],
    comments: [],
  },
  {
    id: "4",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    title: "Database Design Best Practices",
    content: "Designing efficient database schemas is crucial for application performance. This guide covers normalization, indexing, and query optimization techniques.",
    userId: "user3",
    user: {
      id: "user3",
      name: "Carol Davis",
      email: "carol@example.com",
      image: null,
    },
    likes: [],
    votes: [{ type: "DOWN" as const, userId: "user1" }],
    comments: [{ id: "comment4" }, { id: "comment5" }, { id: "comment6" }],
  },
];

// Loading component for the posts list
function PostsLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-muted rounded mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PostsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Posts</h1>
        <p className="text-muted-foreground">
          Discover and search through community discussions and insights.
        </p>
      </div>

      <Suspense fallback={<PostsLoading />}>
        <PostsListWithSearch posts={mockPosts} pageSize={5} />
      </Suspense>
    </div>
  );
}