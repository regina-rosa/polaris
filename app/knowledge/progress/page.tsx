import ProgressTracker from "@/components/ProgressTracker";
import Badge from "@/components/Badge";
import KnowledgeShell from "@/components/KnowledgeShell";

const courseProgress = [
  {
    title: "ISO 27002 Essentials",
    category: "Compliance",
    difficulty: "Intermediate",
    completion: 72,
    status: "In progress",
    skills: ["Control mapping", "Compliance audit", "Risk assessment"],
  },
  {
    title: "NIST CSF Fundamentals",
    category: "Frameworks",
    difficulty: "Beginner",
    completion: 0,
    status: "Not started",
    skills: ["Framework governance", "Risk management", "Program maturity"],
  },
  {
    title: "Audit Evidence Workflow",
    category: "Audit",
    difficulty: "Advanced",
    completion: 58,
    status: "In progress",
    skills: ["Evidence collection", "Documentation", "Quality assurance"],
  },
  {
    title: "Risk Assessment Canvas",
    category: "Risk",
    difficulty: "Intermediate",
    completion: 100,
    status: "Completed",
    skills: ["Threat modeling", "Vulnerability mapping", "Control selection"],
  },
  {
    title: "Policy Review Guide",
    category: "Policy",
    difficulty: "Beginner",
    completion: 43,
    status: "In progress",
    skills: ["Policy analysis", "Gap identification", "Remediation planning"],
  },
  {
    title: "Control Maturity Check",
    category: "Compliance",
    difficulty: "Advanced",
    completion: 0,
    status: "Not started",
    skills: ["Maturity assessment", "Process optimization", "Control testing"],
  },
];

const overallStats = {
  totalCourses: 6,
  completedCourses: 1,
  inProgressCourses: 3,
  averageProgress: 45,
  totalSkills: 18,
};

export default function LearningProgressPage() {
  return (
    <KnowledgeShell
      title="📊 Learning Progress"
      subtitle="Track your mastery across all audit, compliance, and risk management coursework."
      titleClassName="text-4xl"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.26em] text-slate-600 font-medium">Total progress</p>
          <h2 className="mt-3 text-4xl font-bold text-indigo-700">{overallStats.averageProgress}%</h2>
          <p className="mt-2 text-sm text-slate-600">Average across all courses</p>
        </div>

        <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.26em] text-slate-600 font-medium">Courses completed</p>
          <h2 className="mt-3 text-4xl font-bold text-slate-800">
            {overallStats.completedCourses} / {overallStats.totalCourses}
          </h2>
          <p className="mt-2 text-sm text-slate-600">On your learning journey</p>
        </div>

        <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.26em] text-slate-600 font-medium">Skills unlocked</p>
          <h2 className="mt-3 text-4xl font-bold text-slate-800">{overallStats.totalSkills}</h2>
          <p className="mt-2 text-sm text-slate-600">Audit & compliance expertise</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Course-by-course breakdown</h2>
        <div className="space-y-5">
          {courseProgress.map((course, idx) => (
            <div
              key={idx}
              className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-slate-800">{course.title}</h3>
                    <Badge label={course.status} variant="soft" />
                  </div>

                  <ProgressTracker
                    label="Course progress"
                    percentage={course.completion}
                    color="indigo"
                  />

                  <div className="mt-4 flex flex-wrap gap-2">
                    {course.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs text-indigo-700 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-slate-600 mb-2">
                    <Badge label={course.difficulty} variant="accent" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-[2rem] border border-blue-200 bg-gradient-to-r from-white to-blue-50 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Your learning insights</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-600 font-medium">Next to start</p>
            <p className="mt-2 font-semibold text-indigo-700">NIST CSF Fundamentals</p>
            <p className="mt-1 text-sm text-slate-600">Beginner • 12 minutes</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-600 font-medium">Almost done</p>
            <p className="mt-2 font-semibold text-slate-800">ISO 27002 Essentials</p>
            <p className="mt-1 text-sm text-slate-600">72% complete • 8 minutes left</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-600 font-medium">Just completed</p>
            <p className="mt-2 font-semibold text-slate-800">Risk Assessment Canvas</p>
            <p className="mt-1 text-sm text-slate-600">100% • Certificate earned ✨</p>
          </div>
        </div>
      </div>
    </KnowledgeShell>
  );
}
