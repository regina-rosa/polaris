import InfoCard from "@/components/InfoCard";
import KnowledgeShell from "@/components/KnowledgeShell";

const sections = [
  {
    title: "📖 Background",
    description: "ISO 27002 provides practical guidance on information security controls, organized by control families for governance, risk, infrastructure, and operations.",
  },
  {
    title: "🧠 CIA Triad",
    description: "Confidentiality, Integrity, and Availability are the foundation of every control family and every strong information security program.",
  },
  {
    title: "⚠️ Risk Management",
    description: "Identify assets, threats, and vulnerabilities before selecting aligned controls from ISO 27002 to reduce audit findings.",
  },
  {
    title: "🔧 Control Families",
    description: "Learn the 14 control domains such as Access Control, Asset Management, and Security Operations.",
  },
  {
    title: "📑 Audit Mapping",
    description: "Map ISO 27002 controls directly to evidence, policy reviews, and audit report expectations.",
  },
  {
    title: "⏱ Reading Time",
    description: "Estimated 12 minutes of guided learning, with check-in summaries and action notes for trusted practice.",
  },
];

const essentials = [
  "A.5 Information security policies",
  "A.6 Organization of information security",
  "A.8 Asset management",
  "A.9 Access control",
  "A.12 Operations security",
];

const notes = [
  "ISO 27002 is guidance, not a certifiable standard. Use it to support ISO 27001 compliance requirements.",
  "Control implementation should align with risk appetite and audit evidence requirements.",
  "Build narrative around control objectives, responsible teams, and measurable outcomes.",
];

export default function ISO27002() {
  return (
    <KnowledgeShell
      title="ISO 27002"
      subtitle="A complete reference for information security controls and audit-ready implementation guidance."
      titleClassName="text-5xl"
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-5">
          <InfoCard
            title="Why ISO 27002 matters"
            description="ISO 27002 is the primary reference for control selection and implementation guidance in security, risk, and compliance programs."
          >
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Provides control guidance for people, processes, and technology.</li>
              <li>• Supports ISO 27001 by describing how to implement a control framework.</li>
              <li>• Helps auditors compare evidence against best practice controls.</li>
            </ul>
          </InfoCard>

          <InfoCard
            title="Core sections to master"
            description="Focus on the most used control families for audit readiness and executive reporting."
          >
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {essentials.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard
            title="Implementation insight"
            description="ISO 27002 is strongest when translated into clear processes, owner responsibilities, and evidence artifacts."
          >
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {notes.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </InfoCard>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-600 font-medium">Quick guide</p>
            <h3 className="mt-4 text-2xl font-semibold text-indigo-700">Fast ISO 27002 overview</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Estimated reading time: <strong className="text-slate-800">12 min</strong></p>
              <p>Difficulty: <strong className="text-slate-800">Intermediate</strong></p>
              <p>Status: <strong className="text-slate-800">Study mode</strong></p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-600 font-medium">Next step</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-800">Deep dive: control families</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Explore the families that matter most for ISO assessment readiness: assets, access, operations, and supplier security.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <InfoCard key={section.title} title={section.title} description={section.description} />
        ))}
      </div>
    </KnowledgeShell>
  );
}
