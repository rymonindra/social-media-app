import { useEffect, useState, useCallback } from "react";
import { api, Post } from "../services/api";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import PostComposer from "../components/PostComposer";
import PostCard from "../components/PostCard";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<"forYou" | "following">("forYou");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await api.getFeed();
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-20 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center font-black">
            N
          </div>
          <span className="font-bold">Nexus</span>
        </div>
        <Link to={`/profile/${user?.username ?? ""}`}>
          <img src={user?.avatar} alt="" className="w-9 h-9 rounded-full bg-slate-800" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <Sidebar />

        <main className="flex-1 min-w-0 max-w-2xl">
          {/* Tabs */}
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl mb-5 flex">
            <button
              onClick={() => setTab("forYou")}
              className={`flex-1 py-3 text-sm font-semibold transition relative ${
                tab === "forYou" ? "text-white" : "text-slate-400 hover:bg-slate-800/40 rounded-l-2xl"
              }`}
            >
              For you
              {tab === "forYou" && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setTab("following")}
              className={`flex-1 py-3 text-sm font-semibold transition relative ${
                tab === "following" ? "text-white" : "text-slate-400 hover:bg-slate-800/40 rounded-r-2xl"
              }`}
            >
              Following
              {tab === "following" && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-t-full" />
              )}
            </button>
          </div>

          <PostComposer onCreated={load} />

          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-500">Loading...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No posts yet. Be the first to share something!
              </div>
            ) : (
              posts.map((p) => <PostCard key={p._id} post={p} onChange={load} />)
            )}
          </div>
        </main>

        <RightPanel />
      </div>
    </div>
  );
}
