import { useEffect, useState } from "react";
import { api, User } from "../services/api";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import { Link } from "react-router-dom";

export default function Explore() {
  const [users, setUsers] = useState<Omit<User, "password">[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getSuggestedUsers(20).then(setUsers);
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <Sidebar />

        <main className="flex-1 min-w-0 max-w-2xl">
          <h1 className="text-3xl font-bold mb-5">Explore</h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl px-5 py-3 mb-5 focus:outline-none focus:border-indigo-500"
          />
          <div className="space-y-3">
            {filtered.map((u) => (
              <Link
                key={u._id}
                to={`/profile/${u.username}`}
                className="block bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt="" className="w-12 h-12 rounded-full bg-slate-800" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{u.name}</div>
                    <div className="text-sm text-slate-500 truncate">@{u.username}</div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {u.followers.length} followers
                  </div>
                </div>
                {u.bio && <p className="text-sm text-slate-400 mt-2">{u.bio}</p>}
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500">No users found.</div>
            )}
          </div>
        </main>

        <RightPanel />
      </div>
    </div>
  );
}
