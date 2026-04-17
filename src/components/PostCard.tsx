import type { Post, User, Comment } from "../types";
import { calculateDangerScore } from "../services/dangerScore";
import { useState } from "react";
import { fetchComments } from "../services/api";
import "./PostCard.css";

interface PostCardProps {
  post: Post;
  user?: User;
  actionLabel: string;
  onAction: (postId: number) => void;
}

export default function PostCard({
  post,
  user,
  actionLabel,
  onAction,
}: PostCardProps) {
  const dangerScore = calculateDangerScore(post.body);
  const imageUrl = `https://placehold.co/600x300/1a1a2e/e94560?text=Post+${post.id}`;
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const handleToggleComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    if (comments.length === 0) {
      setLoadingComments(true);
      try {
        const data = await fetchComments(post.id);
        setComments(data);
      } catch {
        // silently fail
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(true);
  };

  return (
    <div className="post-card">
      <img src={imageUrl} alt={`Post ${post.id}`} className="post-image" />
      <div className="post-content">
        <div className="post-header">
          <h3 className="post-title">{post.title}</h3>
          <span
            className={`danger-badge ${dangerScore > 40 ? "high" : dangerScore > 20 ? "medium" : "low"}`}
          >
            ⚠ {dangerScore}
          </span>
        </div>
        {user && (
          <p className="post-author">
            By: <strong>{user.name}</strong> (@{user.username})
          </p>
        )}
        <p className="post-body">{post.body}</p>
        <div className="post-actions">
          <button
            className="btn btn-action"
            onClick={() => onAction(post.id)}
          >
            {actionLabel}
          </button>
          <button className="btn btn-comments" onClick={handleToggleComments}>
            {showComments ? "Hide Comments" : "Show Comments"}
          </button>
        </div>
        {showComments && (
          <div className="comments-section">
            {loadingComments ? (
              <p className="loading-text">Loading comments...</p>
            ) : comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id} className="comment">
                  <p className="comment-author">{c.email}</p>
                  <p className="comment-body">{c.body}</p>
                </div>
              ))
            ) : (
              <p className="loading-text">No comments found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
