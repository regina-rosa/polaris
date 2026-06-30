import InfoCard from "@/components/InfoCard";
import KnowledgeShell from "@/components/KnowledgeShell";

const coreComponents = [
  {
    name: "Identify",
    icon: "🔍",
    description: "Develop understanding of organization assets, business environment, and risk management strategy.",
  },
  {
    name: "Protect",
    icon: "🛡️",
    description: "Implement safeguards to deliver core infrastructure and resource services.",
  },
  {
    name: "Detect",
    icon: "🚨",
    description: "Develop capability to identify and analyze potential cybersecurity events.",
  },
  {
    name: "Respond",
    icon: "⚡",
    description: "Take action against detected cybersecurity incidents to mitigate immediate impact.",
  },
  {
    name: "Recover",
    icon: "🔄",
    description: "Restore normal operations and rebuild systems following a cybersecurity incident.",
  },
];

const categories = [
  "Governance",
  "Asset Management",
  "Business Environment",
  "Risk Assessment",
  "Risk Management",
  "Supply Chain Risk",
];

const auditTips = [
  "Map NIST CSF categories to ISO 27002 controls for dual-framework compliance.",
  "Use NIST CSF maturity levels (Partial, Risk Informed, Repeatable, Adaptive) for audit findings.",
  "Focus on governance and identify components first—they set the foundation for all other functions.",
];

export default function NISTCSFPage() {
  return (
    <KnowledgeShell
      title="NIST Cybersecurity Framework"
      subtitle="Master the five core functions and categories for enterprise risk management auditing."
      titleClassName="text-5xl"
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-5">
          <InfoCard
            title="Why NIST CSF matters"
            description="NIST CSF is the most widely adopted risk management framework, especially in regulated industries."
          >
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• Flexible framework that works across industries and organizational sizes.</li>
              <li>• Aligns with ISO 27001, CIS Controls, and sector-specific standards.</li>
              <li>• Audit-friendly: clear maturity levels and measurable outcomes.</li>
            </ul>
          </InfoCard>

          <InfoCard
            title="The five core functions"
            description="Each function represents a strategic pillar of your cybersecurity program."
          >
            <div className="mt-4 grid gap-3">
              {coreComponents.slice(0, 3).map((component) => (
                <div
                  key={component.name}
                  className="rounded-lg border border-slate-700 bg-slate-950/50 p-3"
                >
                  <p className="text-sm font-semibold text-amber-100">
                    {component.icon} {component.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{component.description}</p>
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard
            title="Audit readiness checklist"
            description="Questions to ask when auditing NIST CSF implementation."
          >
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {auditTips.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </InfoCard>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-6 shadow-[0_25px_90px_rgba(15,15,40,0.35)]">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Quick guide</p>
            <h3 className="mt-4 text-2xl font-semibold text-amber-100">NIST CSF at a glance</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Estimated reading time: <strong className="text-white">12 min</strong></p>
              <p>Difficulty: <strong className="text-white">Beginner</strong></p>
              <p>Status: <strong className="text-white">Study mode</strong></p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-6 shadow-[0_25px_90px_rgba(15,15,40,0.35)]">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Key insight</p>
            <h3 className="mt-4 text-xl font-semibold text-white">Integration with ISO 27002</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Use NIST CSF to organize governance; use ISO 27002 for detailed control specification.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {coreComponents.map((component) => (
          <InfoCard
            key={component.name}
            title={`${component.icon} ${component.name}`}
            description={component.description}
            className="text-center"
            titleClassName="text-xl font-semibold text-amber-100 text-center"
          />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Core categories</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category}
              className="rounded-xl border border-slate-700 bg-slate-900/95 p-4 text-center text-sm font-medium text-slate-200"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </KnowledgeShell>
  );
}
