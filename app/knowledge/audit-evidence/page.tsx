import InfoCard from "@/components/InfoCard";
import KnowledgeShell from "@/components/KnowledgeShell";

const workflowSteps = [
  {
    step: 1,
    title: "Plan & Scope",
    description: "Define audit objectives, timeline, and evidence requirements based on controls to test.",
  },
  {
    step: 2,
    title: "Identify & Request",
    description: "Identify evidence owners and request artifacts (logs, policies, test results, attestations).",
  },
  {
    step: 3,
    title: "Collect & Organize",
    description: "Gather evidence and organize by control, location, and evidence type in a centralized log.",
  },
  {
    step: 4,
    title: "Analyze & Document",
    description: "Evaluate evidence against audit criteria and document findings with clear cross-references.",
  },
  {
    step: 5,
    title: "Report & Close",
    description: "Prepare audit report, present findings, and close evidence with sign-off from auditor and auditee.",
  },
];

const evidenceTypes = [
  { type: "Policy & Procedure", icon: "📋", example: "Access control policy, incident response plan" },
  { type: "System Evidence", icon: "💾", example: "Logs, configurations, scan results" },
  { type: "Process Evidence", icon: "⚙️", example: "Meeting notes, approval records, test reports" },
  { type: "Attestation", icon: "✋", example: "Signed confirmations, certifications" },
];

const bestPractices = [
  "Use a tracking spreadsheet or audit tool to log all evidence with dates and owner names.",
  "Request evidence in writing with clear deadlines; document when evidence is received.",
  "Keep evidence organized by control or testing objective for easy reference during reporting.",
  "Photograph or scan physical evidence; maintain digital copies in a secure shared folder.",
];

export default function AuditEvidenceWorkflow() {
  return (
    <KnowledgeShell
      title="Audit Evidence Workflow"
      subtitle="A structured approach to collecting, organizing, and documenting evidence with precision."
      titleClassName="text-5xl"
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-5">
          <InfoCard
            title="Evidence is the backbone of auditing"
            description="Your audit findings are only as strong as the evidence that supports them. A clear workflow ensures you collect everything needed."
          >
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• Avoid evidence gaps that lead to inconclusive audit findings.</li>
              <li>• Create a defensible audit trail for stakeholders and regulators.</li>
              <li>• Speed up the audit process and reduce back-and-forth requests.</li>
            </ul>
          </InfoCard>

          <InfoCard
            title="Types of audit evidence"
            description="Different evidence types support different assertions."
          >
            <div className="mt-4 grid gap-3">
              {evidenceTypes.slice(0, 2).map((item) => (
                <div
                  key={item.type}
                  className="rounded-lg border border-slate-700 bg-slate-950/50 p-3"
                >
                  <p className="text-sm font-semibold text-amber-100">
                    {item.icon} {item.type}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{item.example}</p>
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard
            title="Best practices for evidence management"
            description="Avoid common pitfalls and keep your audit organized."
          >
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {bestPractices.map((practice) => (
                <li key={practice}>• {practice}</li>
              ))}
            </ul>
          </InfoCard>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-6 shadow-[0_25px_90px_rgba(15,15,40,0.35)]">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Quick guide</p>
            <h3 className="mt-4 text-2xl font-semibold text-amber-100">Evidence workflow overview</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Estimated reading time: <strong className="text-white">15 min</strong></p>
              <p>Difficulty: <strong className="text-white">Advanced</strong></p>
              <p>Status: <strong className="text-white">Study mode</strong></p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-6 shadow-[0_25px_90px_rgba(15,15,40,0.35)]">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Next step</p>
            <h3 className="mt-4 text-xl font-semibold text-white\">Tools to try</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Use a spreadsheet, audit management tool, or Notion database to track evidence collection status.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold text-white mb-6">The five-step workflow</h2>
        <div className="space-y-4">
          {workflowSteps.map((item) => (
            <div
              key={item.step}
              className="flex gap-4 rounded-xl border border-slate-700 bg-slate-900/95 p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 font-bold text-slate-950 shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-slate-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {evidenceTypes.map((item) => (
          <InfoCard
            key={item.type}
            title={`${item.icon} ${item.type}`}
            description={item.example}
          />
        ))}
      </div>
    </KnowledgeShell>
  );
}
