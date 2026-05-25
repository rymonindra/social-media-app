import { useState, FormEvent } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  onCreated: () => void;
}

export default function PostComposer({ onCreated }: Props) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !image.trim()) return;
    setSubmitting(true);
    await api.createPost({
      authorId: user._id,
      text: text.trim(),
      image: image.trim() || undefined,
    });
    setText("");
    setImage("");
    setShowImage(false);
    setSubmitting(false);
    onCreated();
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5">
      <form onSubmit={submit}>
        <div className="flex gap-3">
          <img src={user.avatar} alt="" className="w-11 h-11 rounded-full bg-slate-800" />
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`What's on your mind, ${user.name.split(" ")[0]}?`}
              rows={2}
              className="w-full bg-transparent placeholder:text-slate-500 focus:outline-none resize-none text-lg"
            />

            {showImage && (
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste an image URL (optional)"
                className="w-full mt-2 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setShowImage((v) => !v)}
              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
              title="Add image"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
              title="Add emoji"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">{text.length}/500</span>
            <button
              type="submit"
              disabled={submitting || (!text.trim() && !image.trim())}
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-full text-sm font-semibold transition"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
