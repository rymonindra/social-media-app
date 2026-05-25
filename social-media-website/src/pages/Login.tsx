import { useState, FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await login(form.username || form.email, form.password);
      } else {
        if (!form.username || !form.email || !form.password || !form.name) {
          throw new Error("Please fill in all fields");
        }
        if (form.password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        await register(form);
      }
      navigate("/feed");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const quickLogin = async (username: string) => {
    setError("");
    setBusy(true);
    try {
      await login(username, "password123");
      navigate("/feed");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden flex">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Left branding panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-2xl font-black">
            N
          </div>
          <span className="text-2xl font-bold tracking-tight">Nexus</span>
        </div>

        <div>
          <h1 className="text-5xl font-black leading-tight mb-6">
            Where ideas <br />
            <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              come to life.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            Join a community of creators, developers, and dreamers. Share your moments,
            discover inspiring people, and connect with the world.
          </p>

          <div className="mt-10 flex items-center gap-6">
            <div>
              <div className="text-3xl font-bold">2.4M+</div>
              <div className="text-sm text-slate-400">Active users</div>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div>
              <div className="text-3xl font-bold">180+</div>
              <div className="text-sm text-slate-400">Countries</div>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div>
              <div className="text-3xl font-bold">∞</div>
              <div className="text-sm text-slate-400">Possibilities</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-500">
          © 2026 Nexus Social. Built on the MERN stack.
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-xl font-black">
              N
            </div>
            <span className="text-xl font-bold">Nexus</span>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign up
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-1">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              {mode === "login"
                ? "Enter your credentials to continue"
                : "Start sharing your story today"}
            </p>

            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
                    placeholder="Jane Doe"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                  {mode === "login" ? "Username or email" : "Username"}
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
                  placeholder="janedoe"
                />
              </div>

              {mode === "signup" && (
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
                    placeholder="jane@example.com"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-slate-400">Password</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-2.5">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-500/20"
              >
                {busy
                  ? mode === "login"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              </button>
            </form>

            {mode === "login" && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="text-xs text-slate-500 mb-3 text-center">
                  Try a demo account (password: <code>password123</code>)
                </div>
                <div className="flex gap-2">
                  {["janedoe", "alexchen", "miajones"].map((u) => (
                    <button
                      key={u}
                      type="button"
                      disabled={busy}
                      onClick={() => quickLogin(u)}
                      className="flex-1 text-xs py-2 bg-slate-800/60 hover:bg-slate-700 border border-slate-700 rounded-lg transition disabled:opacity-50"
                    >
                      @{u}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-slate-500 mt-6">
            By continuing, you agree to Nexus' Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
