import InfoCard from "@/components/InfoCard";
import KnowledgeShell from "@/components/KnowledgeShell";

const riskMatrix = [
  { threat: "Unauthorized access", vulnerability: "Weak passwords", control: "MFA, password policy" },
  { threat: "Data breach", vulnerability: "Unencrypted data", control: "Data encryption, DLP" },
  { threat: "Malware infection", vulnerability: "Unpatched systems", control: "Patch management, endpoint protection" },
  { threat: "Service disruption", vulnerability: "No backup", control: "Backup & recovery, redundancy" },
  { threat: "Insider threat", vulnerability: "Excessive access", control: "Least privilege, monitoring" },
];

const assessmentSteps = [
  {
    phase: "1. Asset identification",
    details: "List critical assets (data, systems, processes) and map their business value.",
  },
  {
    phase: "2. Threat identification",
    details: "Identify realistic threats (actors, vectors, motivations) that could impact assets.",
  },
  {
    phase: "3. Vulnerability assessment",
    details: "Discover weaknesses in controls, configurations, and processes.",
  },
  {
    phase: "4. Risk rating",
    details: "Calculate risk = Likelihood × Impact using a consistent scale (Low, Medium, High, Critical).",
  },
  {
    phase: "5. Control mapping",
    details: "Select ISO 27002 controls or NIST CSF functions to mitigate identified risks.",
  },
];

const auditQuestions = [
  "Are critical assets clearly identified and documented?",
  "Is the threat assessment based on recent security incidents or industry benchmarks?",
  "Are vulnerabilities validated through testing or vulnerability scans?",
  "Is risk rating consistent and defensible across the organization?",
  "Do selected controls directly address identified threats and vulnerabilities?",
];

export default function RiskAssessmentCanvas() {
  return (
    <KnowledgeShell
      title="Risk Assessment Canvas"
      subtitle="Map threats, vulnerabilities, and controls to build a defensible audit narrative."
      titleClassName="text-5xl"
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-5">
          <InfoCard
            title="Risk assessment is the foundation"
            description="Before selecting controls, you must understand what risks you're trying to mitigate."
          >
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• Risk assessment drives control selection and implementation.</li>
              <li>• Auditors verify that controls match the identified risks.</li>
              <li>• A strong risk narrative justifies both spending and control gaps.</li>
            </ul>
          </InfoCard>

          <InfoCard
            title="The Risk-Control-Evidence triangle"
            description="Every audit finding should fit into this relationship."
          >
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>
                <strong className="text-amber-100">Risk:</strong> What could go wrong? (e.g., unauthorized data access)
              </p>
              <p>
                <strong className="text-amber-100">Control:</strong> What prevents or detects it? (e.g., MFA, monitoring)
              </p>
              <p>
                <strong className="text-amber-100">Evidence:</strong> How do we prove the control works? (e.g., logs, test results)
              </p>
            </div>
          </InfoCard>

          <InfoCard
            title="Audit checklist"
            description="Questions to validate risk assessment quality."
          >
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {auditQuestions.map((q) => (
                <li key={q}>✓ {q}</li>
              ))}
            </ul>
          </InfoCard>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-6 shadow-[0_25px_90px_rgba(15,15,40,0.35)]">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Quick guide</p>
            <h3 className="mt-4 text-2xl font-semibold text-amber-100">Risk canvas at a glance</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Estimated reading time: <strong className="text-white">10 min</strong></p>
              <p>Difficulty: <strong className="text-white">Intermediate</strong></p>
              <p>Status: <strong className="text-white">Study mode</strong></p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-6 shadow-[0_25px_90px_rgba(15,15,40,0.35)]">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Pro tip</p>
            <h3 className="mt-4 text-xl font-semibold text-white">Build a risk matrix</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Organize assets, threats, and controls in a spreadsheet or matrix to visualize coverage gaps.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold text-white mb-6">Five-step assessment process</h2>
        <div className="space-y-4">
          {assessmentSteps.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-700 bg-slate-900/95 p-6"
            >
              <h3 className="text-lg font-semibold text-amber-100">{item.phase}</h3>
              <p className="mt-2 text-slate-300">{item.details}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold text-white mb-6">Sample threat-control mapping</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-lg">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 bg-slate-900/95">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-amber-100">Threat</th>
                <th className="px-6 py-4 text-left font-semibold text-amber-100">Vulnerability</th>
                <th className="px-6 py-4 text-left font-semibold text-amber-100">Control</th>
              </tr>
            </thead>
            <tbody>
              {riskMatrix.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800 bg-slate-950/50 hover:bg-slate-900/70">
                  <td className="px-6 py-4 text-slate-200">{row.threat}</td>
                  <td className="px-6 py-4 text-slate-300">{row.vulnerability}</td>
                  <td className="px-6 py-4 text-amber-100 font-medium">{row.control}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </KnowledgeShell>
  );
}
