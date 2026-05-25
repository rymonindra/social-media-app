import { useEffect, useState } from "react";
import { api, User } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const trends = [
  { tag: "#MERNStack", posts: "12.4K" },
  { tag: "#WebDev", posts: "8.1K" },
  { tag: "#React", posts: "5.7K" },
  { tag: "#TypeScript", posts: "4.2K" },
  { tag: "#TailwindCSS", posts: "3.8K" },
];

export default function RightPanel() {
  const { user, refresh } = useAuth();
  const [suggested, setSuggested] = useState<Omit<User, "password">[]>([]);

  useEffect(() => {
    if (!user) return;
    api.getSuggestedUsers(4).then(setSuggested);
  }, [user]);

  const handleFollow = async (targetId: string) => {
    if (!user) return;
    await api.toggleFollow(user._id, targetId);
    setSuggested((prev) => prev.filter((u) => u._id !== targetId));
    await refresh();
  };

  if (!user) return null;

  return (
    <aside className="hidden xl:block w-80 shrink-0 space-y-5">
      {/* Search */}
      <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Search Nexus"
            className="w-full bg-slate-800/60 border border-slate-700 rounded-full pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Trends */}
      <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-lg mb-3">Trending now</h3>
        <div className="space-y-3">
          {trends.map((t) => (
            <button
              key={t.tag}
              className="w-full text-left group hover:bg-slate-800/40 -mx-2 px-2 py-1.5 rounded-lg transition"
            >
              <div className="font-semibold group-hover:text-indigo-400 transition">{t.tag}</div>
              <div className="text-xs text-slate-500">{t.posts} posts</div>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested */}
      <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-lg mb-3">Who to follow</h3>
        <div className="space-y-3">
          {suggested.map((u) => (
            <div key={u._id} className="flex items-center gap-3">
              <Link to={`/profile/${u.username}`} className="shrink-0">
                <img src={u.avatar} alt="" className="w-10 h-10 rounded-full bg-slate-800" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${u.username}`} className="font-semibold text-sm truncate block hover:underline">
                  {u.name}
                </Link>
                <div className="text-xs text-slate-500 truncate">@{u.username}</div>
              </div>
              <button
                onClick={() => handleFollow(u._id)}
                className="text-xs font-semibold px-3 py-1.5 bg-white text-slate-900 rounded-full hover:bg-slate-200 transition"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-600 px-2">
        Nexus © 2026 · Terms · Privacy · Cookies · About
      </div>
    </aside>
  );
}
