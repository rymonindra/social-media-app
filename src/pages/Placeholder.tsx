import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";

interface Props {
  title: string;
  icon: string;
  description: string;
}

export default function Placeholder({ title, icon, description }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <Sidebar />
        <main className="flex-1 min-w-0 max-w-2xl">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">{icon}</div>
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-slate-400">{description}</p>
          </div>
        </main>
        <RightPanel />
      </div>
    </div>
  );
}
