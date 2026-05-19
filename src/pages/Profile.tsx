import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, Post, User } from "../services/api";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import PostCard from "../components/PostCard";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user: me, refresh } = useAuth();
  const [profile, setProfile] = useState<Omit<User, "password"> | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<"posts" | "replies" | "likes">("posts");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: "", bio: "" });

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!username) return;
      const u = await api.getUserByUsername(username);
      setProfile(u);
      if (u) {
        const p = await api.getPostsByUser(u._id);
        setPosts(p);
      }
      setLoading(false);
    })();
  }, [username]);

  const isMe = me && profile && me._id === profile._id;
  const isFollowing = me && profile && me.following.includes(profile._id);

  const handleFollow = async () => {
    if (!me || !profile) return;
    const updated = await api.toggleFollow(me._id, profile._id);
    setProfile(updated);
    await refresh();
  };

  const handleSave = async () => {
    if (!me) return;
    const updated = await api.updateProfile(me._id, { name: draft.name, bio: draft.bio });
    setProfile(updated);
    await refresh();
    setEditing(false);
  };

  const load = async () => {
    if (!profile) return;
    const p = await api.getPostsByUser(profile._id);
    setPosts(p);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">User not found</div>
          <div className="text-slate-400">The user @{username} doesn't exist.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <Sidebar />

        <main className="flex-1 min-w-0 max-w-2xl">
          {/* Banner */}
          <div className="bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-pink-600 h-40 rounded-t-2xl" />

          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-b-2xl p-5 -mt-12">
            <div className="flex items-end justify-between mb-4">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-28 h-28 rounded-full bg-slate-800 border-4 border-slate-950"
              />
              {isMe ? (
                <button
                  onClick={() => {
                    setDraft({ name: profile.name, bio: profile.bio });
                    setEditing(true);
                  }}
                  className="px-4 py-1.5 rounded-full border border-slate-600 hover:bg-slate-800 text-sm font-semibold"
                >
                  Edit profile
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`px-5 py-1.5 rounded-full font-semibold text-sm transition ${
                    isFollowing
                      ? "bg-white text-slate-900 hover:bg-red-500 hover:text-white"
                      : "bg-indigo-500 hover:bg-indigo-400 text-white"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <div className="text-slate-500 text-sm mb-2">@{profile.username}</div>

            {profile.bio && <p className="text-slate-200 mb-3">{profile.bio}</p>}

            <div className="flex gap-5 text-sm">
              <div>
                <span className="font-bold">{profile.following.length}</span>{" "}
                <span className="text-slate-500">Following</span>
              </div>
              <div>
                <span className="font-bold">{profile.followers.length}</span>{" "}
                <span className="text-slate-500">Followers</span>
              </div>
              <div>
                <span className="font-bold">{posts.length}</span>{" "}
                <span className="text-slate-500">Posts</span>
              </div>
            </div>
          </div>

          {/* Edit modal */}
          {editing && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Name</label>
                    <input
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Bio</label>
                    <textarea
                      value={draft.bio}
                      onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 py-2 rounded-xl border border-slate-700 hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 font-semibold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-slate-900/60 border-b border-slate-800 mt-5 flex">
            {(["posts", "replies", "likes"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition relative ${
                  tab === t ? "text-white" : "text-slate-400 hover:bg-slate-800/40"
                }`}
              >
                {t}
                {tab === t && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                @{profile.username} hasn't posted yet.
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
