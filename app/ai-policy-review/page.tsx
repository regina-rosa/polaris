"use client";

import { useState, useMemo } from "react";
import KnowledgeShell from "@/components/KnowledgeShell";
import HowToUse from "@/components/HowToUse";

type RiskLevel = "Critical" | "High" | "Medium" | "Low";
type AICategory = "Governance" | "Data Privacy" | "Model Risk" | "Transparency" | "Security" | "Operations";

type AIRisk = {
  id: string;
  category: AICategory;
  risk: string;
  description: string;
  level: RiskLevel;
  auditQuestions: string[];
  controlExamples: string[];
  regulatoryRef: string;
};

type PolicyClause = {
  id: string;
  section: string;
  requiredLanguage: string;
  why: string;
  redFlag: string;
};

type ChecklistItem = {
  id: string;
  category: AICategory;
  question: string;
  guidance: string;
  evidenceToRequest: string;
};

const AI_RISKS: AIRisk[] = [
  {
    id: "AR01",
    category: "Governance",
    risk: "No AI governance framework",
    description: "Organization uses AI/ML models in business decisions without defined ownership, oversight, or approval process for AI systems.",
    level: "Critical",
    auditQuestions: [
      "Is there a named AI Governance Committee or AI Officer responsible for oversight?",
      "Is there an approved list (registry) of AI systems in production use?",
      "How are new AI tools approved before business use?",
    ],
    controlExamples: ["AI governance policy", "AI system registry", "AI steering committee with defined mandate", "Model risk management framework"],
    regulatoryRef: "EU AI Act (Art. 9–17), NIST AI RMF: GOVERN",
  },
  {
    id: "AR02",
    category: "Data Privacy",
    risk: "Personal data used in AI training without consent",
    description: "AI models trained on customer or employee personal data without appropriate legal basis, consent, or data minimization measures.",
    level: "Critical",
    auditQuestions: [
      "What data is used to train AI models? Is PII included?",
      "Is there documented legal basis (consent, legitimate interest) for using personal data in AI?",
      "Are training datasets anonymized or pseudonymized?",
    ],
    controlExamples: ["Data classification before AI use", "Anonymization process", "Privacy impact assessment (PIA) for AI systems", "Data retention limits for training data"],
    regulatoryRef: "GDPR Art. 5, 13, 22 — Indonesia PDP Law (UU PDP) Art. 20",
  },
  {
    id: "AR03",
    category: "Model Risk",
    risk: "AI model producing biased or discriminatory outputs",
    description: "AI systems making decisions (credit, hiring, pricing) that exhibit systematic bias against protected groups, creating legal and reputational exposure.",
    level: "High",
    auditQuestions: [
      "Has bias testing been conducted on AI models used in customer-facing decisions?",
      "Are demographic disparities in AI outputs monitored?",
      "What is the escalation path when bias is detected?",
    ],
    controlExamples: ["Bias assessment during model development", "Fairness metrics monitoring in production", "Human review override for high-impact decisions", "Periodic model audit by independent team"],
    regulatoryRef: "EU AI Act High-Risk AI (Annex III), US EEOC guidance on algorithmic tools",
  },
  {
    id: "AR04",
    category: "Transparency",
    risk: "Lack of explainability for AI decisions",
    description: "AI decisions affecting customers, employees, or compliance cannot be explained in human-understandable terms, violating regulatory requirements and trust.",
    level: "High",
    auditQuestions: [
      "Can the organization explain in plain language why the AI made a specific decision?",
      "Are there processes for customers to request explanation of AI-driven decisions?",
      "Is explainability a requirement in AI vendor contracts?",
    ],
    controlExamples: ["Explainability requirement in AI development standards", "XAI (explainable AI) techniques (SHAP, LIME)", "Human-in-the-loop for high-stakes decisions", "Customer disclosure about AI decision-making"],
    regulatoryRef: "GDPR Art. 22 (right to explanation), EU AI Act Art. 13",
  },
  {
    id: "AR05",
    category: "Security",
    risk: "AI systems vulnerable to adversarial attacks",
    description: "AI models susceptible to prompt injection, model poisoning, data poisoning, or adversarial examples that produce malicious outputs.",
    level: "High",
    auditQuestions: [
      "Has adversarial testing (red-teaming) been conducted on AI systems?",
      "Are AI APIs protected from prompt injection attacks?",
      "Is training data integrity verified before use?",
    ],
    controlExamples: ["AI red-teaming and adversarial testing", "Input validation for AI endpoints", "Training data integrity controls", "Output filtering for generative AI", "Access controls on model APIs"],
    regulatoryRef: "NIST AI RMF: MANAGE, NIST SP 1270 (adversarial ML)",
  },
  {
    id: "AR06",
    category: "Security",
    risk: "Sensitive data leakage via generative AI tools",
    description: "Employees inputting confidential customer data, IP, or trade secrets into public LLMs (ChatGPT, Claude, etc.) without realizing it may be used for training or exposed to other users.",
    level: "High",
    auditQuestions: [
      "Is there a policy governing acceptable use of external AI tools (ChatGPT, Copilot)?",
      "Are employees trained on what data can/cannot be input into AI tools?",
      "Are DLP controls in place to detect or block sensitive data in AI tool submissions?",
    ],
    controlExamples: ["Acceptable use policy for AI tools", "Data classification training for employees", "DLP rules for AI tool URLs", "Enterprise-licensed AI tools with no training data retention", "Approved AI tool list"],
    regulatoryRef: "ISO 27001 A.8.1 / A.7.2.2, GDPR Art. 32",
  },
  {
    id: "AR07",
    category: "Operations",
    risk: "AI model performance degradation without monitoring",
    description: "AI models deployed in production drift from their intended behavior over time due to changing data distributions, without detection mechanisms in place.",
    level: "Medium",
    auditQuestions: [
      "How is model performance monitored in production?",
      "What triggers a model review or retraining?",
      "Who owns model performance monitoring and what are SLAs?",
    ],
    controlExamples: ["Model monitoring dashboards (accuracy, drift metrics)", "Automated alerts for performance thresholds", "Model retraining schedule", "Version control for production models", "Rollback procedures"],
    regulatoryRef: "NIST AI RMF: MEASURE, Basel III model risk guidance",
  },
  {
    id: "AR08",
    category: "Governance",
    risk: "Third-party AI vendor risk not assessed",
    description: "Organization relies on third-party AI services without assessing the vendor's AI governance, security, and data handling practices.",
    level: "Medium",
    auditQuestions: [
      "Are AI vendors included in the vendor risk assessment process?",
      "Do AI vendor contracts include data processing, model security, and IP ownership clauses?",
      "Are vendor SOC 2 / AI audit reports reviewed?",
    ],
    controlExamples: ["AI vendor due diligence questionnaire", "Contractual AI-specific security requirements", "Annual vendor AI risk review", "Data processing agreements with AI vendors"],
    regulatoryRef: "ISO 27001 A.15, EU AI Act Art. 25 (deployer obligations)",
  },
];

const POLICY_CLAUSES: PolicyClause[] = [
  {
    id: "PC01",
    section: "1. Scope and Definitions",
    requiredLanguage: "This policy applies to all AI and machine learning systems developed, procured, or operated by [Organization], including but not limited to: automated decision-making systems, generative AI tools, recommendation engines, fraud detection models, and natural language processing applications.",
    why: "Without a clear scope definition, AI systems can be built or procured outside policy controls. The enumerated list closes common loopholes.",
    redFlag: "Scope limited only to 'AI built internally' — excludes all SaaS AI tools employees use daily.",
  },
  {
    id: "PC02",
    section: "2. AI System Registration",
    requiredLanguage: "All AI systems must be registered in the organizational AI System Registry prior to production deployment. The registry shall capture: system name, purpose, data inputs, model type, risk classification, accountable owner, and last review date.",
    why: "You can't govern what you don't know exists. A registry is the foundation of all AI governance — it answers 'what AI do we use?'",
    redFlag: "No registry, or registry exists but is voluntarily updated so it's incomplete.",
  },
  {
    id: "PC03",
    section: "3. Risk Classification",
    requiredLanguage: "AI systems shall be classified by risk level: Critical (decisions affecting individual rights, safety, or regulatory compliance), High (significant business impact or customer-facing decisions), Medium (operational automation), Low (assistive tools with human review). Risk level determines required governance controls.",
    why: "Risk-tiered governance prevents both under-governing critical AI and over-governing low-risk tools.",
    redFlag: "All AI treated equally regardless of impact — either nothing is governed or everything requires the same burdensome process.",
  },
  {
    id: "PC04",
    section: "4. Data Governance for AI",
    requiredLanguage: "Personal data used in AI training or inference must have documented legal basis per applicable privacy law. Training datasets must be reviewed for quality, representativeness, and potential bias. Data lineage must be maintained for all AI training data.",
    why: "AI models inherit the quality and compliance status of their training data. No data governance = no AI governance.",
    redFlag: "Policy references data governance but defers entirely to the privacy policy with no AI-specific requirements.",
  },
  {
    id: "PC05",
    section: "5. Human Oversight",
    requiredLanguage: "AI systems classified as Critical or High risk must include a human review mechanism before decisions take effect. Automated decisions affecting individuals must include a process for human appeal and override. Fully automated final decisions on Critical matters are prohibited.",
    why: "Human oversight is required by EU AI Act for high-risk AI and by GDPR Art. 22. It also provides accountability when AI makes errors.",
    redFlag: "Policy mentions human oversight but provides no mechanism or responsibility for it.",
  },
  {
    id: "PC06",
    section: "6. Acceptable Use of External AI Tools",
    requiredLanguage: "Employees may only use AI tools from the approved AI tool list. Confidential information, personal data, trade secrets, and non-public business information must not be inputted into external AI tools not on the approved list. Violations are subject to disciplinary action.",
    why: "ChatGPT data leakage is the most common AI security incident — this clause closes the 'I didn't know' gap.",
    redFlag: "Policy doesn't address external AI tools — the highest-risk AI behavior employees engage in daily.",
  },
  {
    id: "PC07",
    section: "7. Transparency and Explainability",
    requiredLanguage: "AI systems must be capable of providing a human-understandable explanation of material decisions upon request. Customer-facing AI that makes decisions affecting their relationship with the organization must disclose the use of AI in writing.",
    why: "Transparency builds trust and is a legal requirement in many jurisdictions. Unexplainable AI decisions are a governance and legal liability.",
    redFlag: "Policy requires explainability without defining what that means or who is responsible for implementing it.",
  },
  {
    id: "PC08",
    section: "8. Monitoring and Model Performance",
    requiredLanguage: "All production AI systems must be monitored for performance degradation, distribution drift, and behavioral anomalies. Performance thresholds and monitoring frequency must be defined for each system. Model owners are responsible for initiating retraining or retirement when thresholds are breached.",
    why: "AI models degrade silently in production. Without monitoring, the organization doesn't know when AI is making bad decisions.",
    redFlag: "Policy covers model development but says nothing about post-deployment monitoring.",
  },
];

const CHECKLIST: ChecklistItem[] = [
  { id: "CK01", category: "Governance", question: "Does the organization have a documented AI policy approved by senior management?", guidance: "Check for board/executive sign-off and review date within 12 months.", evidenceToRequest: "AI Policy document with approval signature and date" },
  { id: "CK02", category: "Governance", question: "Is there an AI System Registry tracking all AI in production use?", guidance: "Registry should include: system name, purpose, risk classification, data inputs, owner, last review.", evidenceToRequest: "AI System Registry export" },
  { id: "CK03", category: "Governance", question: "Is there a defined process for approving new AI systems before deployment?", guidance: "Look for approval workflow covering risk assessment, privacy review, and security review.", evidenceToRequest: "AI approval workflow documentation and sample approved AI request" },
  { id: "CK04", category: "Data Privacy", question: "Are privacy impact assessments (PIA/DPIA) conducted for AI systems processing personal data?", guidance: "Required under GDPR for high-risk processing. Check that AI is included in PIA scope.", evidenceToRequest: "Completed DPIA for highest-risk AI system" },
  { id: "CK05", category: "Data Privacy", question: "Is there a policy prohibiting input of personal/confidential data into external AI tools?", guidance: "Acceptable Use Policy should explicitly name common tools (ChatGPT, Copilot) and data restrictions.", evidenceToRequest: "Acceptable Use Policy, employee training records on AI data handling" },
  { id: "CK06", category: "Model Risk", question: "Has bias testing been performed on AI systems used in decision-making?", guidance: "Look for disparate impact analysis across demographic groups for any decision-making AI.", evidenceToRequest: "Bias assessment report for highest-risk AI system" },
  { id: "CK07", category: "Security", question: "Have AI systems been included in the penetration testing scope?", guidance: "AI APIs and interfaces should be tested for prompt injection, unauthorized model access, and output manipulation.", evidenceToRequest: "Pentest report confirming AI system scope" },
  { id: "CK08", category: "Transparency", question: "Can the organization explain in plain language how key AI systems make decisions?", guidance: "Request a walkthrough of a customer-impacting AI decision. If no one can explain it, that's a finding.", evidenceToRequest: "Documentation of AI decision logic or explainability method" },
  { id: "CK09", category: "Operations", question: "Is model performance monitored in production with defined thresholds?", guidance: "Check for dashboards, alerts, and a responsible owner. Ask what happened the last time a model underperformed.", evidenceToRequest: "Model monitoring configuration and last performance report" },
  { id: "CK10", category: "Governance", question: "Are AI vendors subject to the same vendor risk assessment process as other third parties?", guidance: "AI vendor risk may include training data privacy, model IP ownership, and availability of vendor AI audit reports.", evidenceToRequest: "Vendor risk assessment completed for top AI vendors (OpenAI, cloud AI APIs)" },
];

const RISK_COLOR: Record<RiskLevel, string> = {
  Critical: "border-red-300 bg-red-50 text-red-700",
  High: "border-orange-300 bg-orange-50 text-orange-700",
  Medium: "border-yellow-300 bg-yellow-50 text-yellow-700",
  Low: "border-green-300 bg-green-50 text-green-700",
};

const CAT_ICON: Record<AICategory, string> = {
  Governance: "🏛️",
  "Data Privacy": "🔒",
  "Model Risk": "🤖",
  Transparency: "👁️",
  Security: "🛡️",
  Operations: "⚙️",
};

type Tab = "risks" | "policy" | "checklist";

export default function AIPolicyReview() {
  const [tab, setTab] = useState<Tab>("risks");
  const [checklistStatus, setChecklistStatus] = useState<Record<string, "yes" | "no" | "partial" | "na">>({});
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const [expandedClause, setExpandedClause] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<AICategory | "All">("All");

  const filteredRisks = useMemo(
    () => (activeCategory === "All" ? AI_RISKS : AI_RISKS.filter((r) => r.category === activeCategory)),
    [activeCategory],
  );

  const filteredChecklist = useMemo(
    () => (activeCategory === "All" ? CHECKLIST : CHECKLIST.filter((c) => c.category === activeCategory)),
    [activeCategory],
  );

  const yesCount = Object.values(checklistStatus).filter((v) => v === "yes").length;
  const noCount = Object.values(checklistStatus).filter((v) => v === "no").length;
  const assessedCount = Object.values(checklistStatus).filter((v) => v !== undefined).length;

  const CATEGORIES: AICategory[] = ["Governance", "Data Privacy", "Model Risk", "Transparency", "Security", "Operations"];

  return (
    <KnowledgeShell
      title="AI Policy Review"
      subtitle="Audit framework untuk AI governance — risiko, kebijakan, dan checklist untuk era AI."
      titleClassName="text-4xl"
    >
      <HowToUse
        what="Framework khusus untuk mengaudit penggunaan AI di organisasi. Mencakup: AI-specific risks (prompt injection, bias, data leakage), template policy clauses yang harus ada, dan audit checklist berdasarkan EU AI Act & NIST AI RMF."
        when={[
          "Klien atau perusahaan menggunakan AI dan kamu perlu audit AI governance mereka",
          "Organisasi mau membuat kebijakan AI tapi belum tahu apa yang harus ada",
          "Interview untuk role IT Audit / GRC di perusahaan yang AI-heavy",
          "Ingin mengerti risiko AI dari perspektif auditor, bukan hanya dari perspektif engineer",
        ]}
        how={[
          "Tab 'AI Risks' — pelajari risiko-risiko utama dan pertanyaan audit untuk tiap risiko",
          "Tab 'Policy Template' — lihat klausul apa yang harus ada di AI Policy yang baik",
          "Tab 'Audit Checklist' — jalankan penilaian AI governance dengan centang Yes/No/Partial",
          "Filter by category untuk fokus pada area tertentu (Security, Privacy, dll)",
        ]}
      />

      {/* ── Tabs ── */}
      <div className="mt-8 flex gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 w-fit">
        {([["risks", "⚠️ AI Risks"], ["policy", "📋 Policy Template"], ["checklist", "✅ Audit Checklist"]] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all ${tab === t ? "bg-white shadow-sm text-indigo-600 border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Category Filter ── */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("All")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${activeCategory === "All" ? "bg-slate-800 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${activeCategory === cat ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
          >
            {CAT_ICON[cat]} {cat}
          </button>
        ))}
      </div>

      {/* ─────────────────── TAB: AI RISKS ─────────────────── */}
      {tab === "risks" && (
        <div className="mt-6 space-y-4">
          {filteredRisks.map((r) => {
            const isOpen = expandedRisk === r.id;
            return (
              <div key={r.id} className={`rounded-2xl border bg-white shadow-sm overflow-hidden`}>
                <div
                  className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedRisk(isOpen ? null : r.id)}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${RISK_COLOR[r.level]}`}>
                          {r.level}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                          {CAT_ICON[r.category]} {r.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{r.regulatoryRef}</span>
                      </div>
                      <h3 className="font-semibold text-slate-800">{r.risk}</h3>
                      <p className="mt-1 text-sm text-slate-500">{r.description}</p>
                    </div>
                    <span className="text-slate-400 text-lg">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50 space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">❓ Pertanyaan Audit</p>
                      <ul className="space-y-2">
                        {r.auditQuestions.map((q, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-700">
                            <span className="text-indigo-400 shrink-0">{i + 1}.</span> {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">🛡️ Contoh Controls</p>
                      <ul className="space-y-1">
                        {r.controlExamples.map((c, i) => (
                          <li key={i} className="text-sm text-slate-700">• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─────────────────── TAB: POLICY TEMPLATE ─────────────────── */}
      {tab === "policy" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Cara pakai:</strong> Setiap klausul di bawah adalah bagian yang <em>harus ada</em> di AI Policy yang baik.
              Saat audit, cek apakah setiap klausul ini ada dan apakah bahasanya cukup spesifik.
              Contoh bahasa yang ada bisa langsung dipakai sebagai template atau evaluasi terhadap kebijakan klien.
            </p>
          </div>

          {POLICY_CLAUSES.map((clause) => {
            const isOpen = expandedClause === clause.id;
            return (
              <div key={clause.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div
                  className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedClause(isOpen ? null : clause.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono text-slate-400">{clause.id}</span>
                      <h3 className="font-semibold text-slate-800 mt-1">{clause.section}</h3>
                    </div>
                    <span className="text-slate-400">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50 space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">📝 Contoh Bahasa Kebijakan</p>
                      <div className="rounded-xl bg-white border border-slate-200 p-4 text-sm text-slate-700 leading-7 italic">
                        "{clause.requiredLanguage}"
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">💡 Kenapa penting</p>
                        <p className="text-sm text-indigo-800">{clause.why}</p>
                      </div>
                      <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">🚩 Red Flag</p>
                        <p className="text-sm text-red-800">{clause.redFlag}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─────────────────── TAB: AUDIT CHECKLIST ─────────────────── */}
      {tab === "checklist" && (
        <div className="mt-6 space-y-5">
          <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {assessedCount}/{CHECKLIST.length} dinilai
                </p>
                <div className="mt-1 flex gap-4 text-xs">
                  <span className="text-green-600">✅ Yes: {yesCount}</span>
                  <span className="text-red-600">❌ No: {noCount}</span>
                  <span className="text-yellow-600">⚠️ Partial: {Object.values(checklistStatus).filter((v) => v === "partial").length}</span>
                </div>
              </div>
              <button
                onClick={() => setChecklistStatus({})}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-green-500 transition-all"
                style={{ width: assessedCount > 0 ? `${(yesCount / assessedCount) * 100}%` : "0%" }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredChecklist.map((item) => {
              const status = checklistStatus[item.id];
              const statusOptions: { value: "yes" | "no" | "partial" | "na"; label: string; style: string }[] = [
                { value: "yes", label: "✅ Yes", style: "bg-green-500 text-white" },
                { value: "partial", label: "⚠️ Partial", style: "bg-yellow-500 text-white" },
                { value: "no", label: "❌ No", style: "bg-red-500 text-white" },
                { value: "na", label: "N/A", style: "bg-slate-400 text-white" },
              ];
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border bg-white p-4 shadow-sm ${
                    status === "no" ? "border-red-200 bg-red-50/30" : status === "yes" ? "border-green-200" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400">{item.id}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                          {CAT_ICON[item.category]} {item.category}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-800">{item.question}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.guidance}</p>
                      {status === "no" && (
                        <p className="mt-2 text-xs font-semibold text-red-600">
                          📋 Evidence to request: {item.evidenceToRequest}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() =>
                            setChecklistStatus((prev) => ({
                              ...prev,
                              [item.id]: prev[item.id] === opt.value ? undefined as unknown as "yes" : opt.value,
                            }))
                          }
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                            status === opt.value ? opt.style : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </KnowledgeShell>
  );
}
