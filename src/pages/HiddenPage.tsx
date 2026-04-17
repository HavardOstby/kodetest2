import { useState, useEffect, useMemo } from "react";
import type { Post, User } from "../types";
import { fetchPosts, fetchUsers } from "../services/api";
import PostCard from "../components/PostCard";
import "./HiddenPage.css";

interface HiddenPageProps {
  hiddenIds: Set<number>;
  onUnhidePost: (postId: number) => void;
}

export default function HiddenPage({
  hiddenIds,
  onUnhidePost,
}: HiddenPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [postsData, usersData] = await Promise.all([
          fetchPosts(),
          fetchUsers(),
        ]);
        setPosts(postsData);
        setUsers(usersData);
      } catch {
        // silently fail
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

  const hiddenPosts = useMemo(
    () => posts.filter((p) => hiddenIds.has(p.id)),
    [posts, hiddenIds]
  );

  if (loading) {
    return <div className="page-status">Loading...</div>;
  }

  return (
    <div className="hidden-page">
      <h2 className="hidden-title">
        🔒 Hidden Posts ({hiddenPosts.length})
      </h2>
      <p className="hidden-subtitle">
        These posts have been hidden from the main feed. Unhide them to restore
        visibility.
      </p>

      {hiddenPosts.length === 0 ? (
        <div className="page-status">
          No hidden posts. All leaked data is currently visible!
        </div>
      ) : (
        <div className="posts-grid">
          {hiddenPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              user={userMap.get(post.userId)}
              actionLabel="👁 Unhide Post"
              onAction={onUnhidePost}
            />
          ))}
        </div>
      )}
    </div>
  );
}
