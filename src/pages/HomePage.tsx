import { useState, useEffect, useMemo } from "react";
import type { Post, User } from "../types";
import { fetchPosts, fetchUsers } from "../services/api";
import { calculateDangerScore } from "../services/dangerScore";
import PostCard from "../components/PostCard";
import FilterBar, { type SortOption } from "../components/FilterBar";
import "./HomePage.css";

interface HomePageProps {
  hiddenIds: Set<number>;
  onHidePost: (postId: number) => void;
}

export default function HomePage({ hiddenIds, onHidePost }: HomePageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [postsData, usersData] = await Promise.all([
          fetchPosts(),
          fetchUsers(),
        ]);
        setPosts(postsData);
        setUsers(usersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const userMap = useMemo(
    () => new Map(users.map((u) => [u.id, u])),
    [users]
  );

  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter((p) => !hiddenIds.has(p.id));

    if (selectedUserId !== null) {
      result = result.filter((p) => p.userId === selectedUserId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q)
      );
    }

    switch (sortOption) {
      case "length-asc":
        result = [...result].sort((a, b) => a.body.length - b.body.length);
        break;
      case "length-desc":
        result = [...result].sort((a, b) => b.body.length - a.body.length);
        break;
      case "danger-asc":
        result = [...result].sort(
          (a, b) => calculateDangerScore(a.body) - calculateDangerScore(b.body)
        );
        break;
      case "danger-desc":
        result = [...result].sort(
          (a, b) => calculateDangerScore(b.body) - calculateDangerScore(a.body)
        );
        break;
    }

    return result;
  }, [posts, hiddenIds, selectedUserId, sortOption, searchQuery]);

  if (loading) {
    return <div className="page-status">Loading leaked data...</div>;
  }

  if (error) {
    return <div className="page-status error">Error: {error}</div>;
  }

  return (
    <div className="home-page">
      <FilterBar
        users={users}
        selectedUserId={selectedUserId}
        onUserChange={setSelectedUserId}
        sortOption={sortOption}
        onSortChange={setSortOption}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <p className="results-count">
        Showing {filteredAndSortedPosts.length} of {posts.length} leaked posts
        {hiddenIds.size > 0 && ` (${hiddenIds.size} hidden)`}
      </p>

      {filteredAndSortedPosts.length === 0 ? (
        <div className="page-status">No posts match your filters.</div>
      ) : (
        <div className="posts-grid">
          {filteredAndSortedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              user={userMap.get(post.userId)}
              actionLabel="🚫 Hide Post"
              onAction={onHidePost}
            />
          ))}
        </div>
      )}
    </div>
  );
}
