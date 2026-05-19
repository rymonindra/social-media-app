import { useState, FormEvent } from "react";
import { api, Post, getUserSync } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

interface Props {
  post: Post;
  onChange: () => void;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString();
}

export default function PostCard({ post, onChange }: Props) {
  const { user } = useAuth();
  const author = getUserSync(post.authorId);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const liked = user && post.likes.includes(user._id);

  const toggleLike = async () => {
    if (!user) return;
    await api.toggleLike(post._id, user._id);
    onChange();
  };

  const handleComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    setSubmitting(true);
    await api.addComment(post._id, user._id, commentText.trim());
    setCommentText("");
    setSubmitting(false);
    onChange();
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!confirm("Delete this post?")) return;
    await api.deletePost(post._id, user._id);
    onChange();
  };

  if (!author) return null;

  return (
    <article className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
      <header className="flex items-start gap-3">
        <Link to={`/profile/${author.username}`} className="shrink-0">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-11 h-11 rounded-full bg-slate-800"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${author.username}`} className="font-semibold hover:underline truncate">
              {author.name}
            </Link>
            <span className="text-slate-500 text-sm truncate">@{author.username}</span>
            <span className="text-slate-600 text-sm">·</span>
            <span className="text-slate-500 text-sm">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        {user?._id === post.authorId && (
          <button
            onClick={handleDelete}
            className="text-slate-500 hover:text-red-400 text-sm px-2"
            title="Delete"
          >
            ×
          </button>
        )}
      </header>

      <p className="mt-3 text-slate-100 whitespace-pre-wrap leading-relaxed">{post.text}</p>

      {post.image && (
        <div className="mt-3 rounded-2xl overflow-hidden border border-slate-800">
          <img src={post.image} alt="" className="w-full max-h-[500px] object-cover" />
        </div>
      )}

      <div className="mt-4 flex items-center gap-6 text-sm text-slate-400">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 hover:text-pink-400 transition ${
            liked ? "text-pink-400" : ""
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {post.likes.length}
        </button>

        <button
          onClick={() => setCommentOpen((v) => !v)}
          className="flex items-center gap-2 hover:text-indigo-400 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          {post.comments.length}
        </button>

        <button className="flex items-center gap-2 hover:text-cyan-400 transition">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share
        </button>
      </div>

      {commentOpen && (
        <div className="mt-4 space-y-3 pt-4 border-t border-slate-800">
          {post.comments.map((c) => {
            const cAuthor = getUserSync(c.authorId);
            return (
              <div key={c._id} className="flex gap-3">
                <img src={cAuthor?.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
                <div className="flex-1 bg-slate-800/40 rounded-2xl px-4 py-2">
                  <div className="text-sm">
                    <span className="font-semibold">{cAuthor?.name ?? "Unknown"}</span>{" "}
                    <span className="text-slate-500 text-xs">· {timeAgo(c.createdAt)}</span>
                  </div>
                  <div className="text-sm text-slate-200 mt-0.5">{c.text}</div>
                </div>
              </div>
            );
          })}

          <form onSubmit={handleComment} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-slate-800/60 border border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 rounded-full text-sm font-semibold"
            >
              {submitting ? "..." : "Post"}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
