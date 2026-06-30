import Header from "./Header";
import ToolGrid from "./dashboard/ToolGrid";
import LearningPath from "./dashboard/LearningPath";
import CareerBanner from "./dashboard/CareerBanner";

export default function Dashboard() {
  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 text-slate-800">
      <div className="max-w-5xl space-y-6">
        <Header />
        <CareerBanner />
        <ToolGrid />
        <LearningPath />
      </div>
    </main>
  );
}
