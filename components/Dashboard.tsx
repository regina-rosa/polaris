import Header from "./Header";

import MissionCard from "./dashboard/MissionCard";
import ProgressCard from "./dashboard/ProgressCard";
import RecentLearning from "./dashboard/RecentLearning";
import QuickActions from "./dashboard/QuickActions";

export default function Dashboard() {
  return (
    <main className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-10 text-slate-800">
      <Header />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <MissionCard />
        <ProgressCard />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RecentLearning />
        <QuickActions />
      </div>
    </main>
  );
}
