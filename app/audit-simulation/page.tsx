"use client";

import { useState, useMemo } from "react";
import KnowledgeShell from "@/components/KnowledgeShell";
import HowToUse from "@/components/HowToUse";

// ─── CASE STUDY DATA ────────────────────────────────────────────────────────

const COMPANY = {
  name: "PT DataNusa Fintech",
  industry: "Financial Technology — Digital Payments",
  employees: 75,
  location: "Jakarta, Indonesia",
  infrastructure: "AWS (primary cloud) + 3 on-premises servers (legacy ERP)",
  dataTypes: "Customer PII, transaction records, API credentials, banking partner data",
  recentIncident:
    "Phishing attack targeting Finance team (Q3 2024) — 2 accounts compromised, credentials exposed for ~48 hours before detection",
  complianceGoal: "ISO 27001:2013 certification — target Q2 2025",
  auditScope:
    "ISMS gap assessment covering: Access Control (A.9), HR Security (A.7), Cryptography (A.10), Operations Security (A.12), Incident Management (A.16)",
  auditObjective:
    "Identify control gaps against ISO 27001 Annex A, quantify risk exposure, and provide remediation roadmap for certification readiness",
};

// ─── PRE-LOADED RISKS ───────────────────────────────────────────────────────

type Risk = {
  id: string;
  category: string;
  description: string;
  likelihood: number;
  impact: number;
  status: "Open" | "In Progress" | "Closed";
  owner: string;
  mitigation: string;
};

const INITIAL_RISKS: Risk[] = [
  {
    id: "R001",
    category: "Access Control",
    description: "No MFA enforced on AWS console and critical business applications",
    likelihood: 4,
    impact: 5,
    status: "Open",
    owner: "IT Team",
    mitigation: "Implement mandatory MFA via AWS IAM policies and SSO configuration",
  },
  {
    id: "R002",
    category: "Human Factor",
    description: "Finance team susceptible to phishing — confirmed by Q3 2024 incident",
    likelihood: 4,
    impact: 4,
    status: "In Progress",
    owner: "HR / IT",
    mitigation: "Mandatory security awareness training + quarterly phishing simulations",
  },
  {
    id: "R003",
    category: "Patch Management",
    description: "No formal patch management process — on-prem servers unpatched for 6+ months",
    likelihood: 3,
    impact: 4,
    status: "Open",
    owner: "IT Team",
    mitigation: "Establish monthly patching cycle, implement vulnerability scanning tool",
  },
  {
    id: "R004",
    category: "Data Protection",
    description: "Customer PII stored in unencrypted S3 buckets without access logging",
    likelihood: 3,
    impact: 5,
    status: "Open",
    owner: "Engineering",
    mitigation: "Enable S3 SSE-S3/KMS encryption + bucket policies + CloudTrail logging",
  },
  {
    id: "R005",
    category: "Incident Response",
    description: "No documented Incident Response Plan — team improvised during phishing incident",
    likelihood: 4,
    impact: 3,
    status: "Open",
    owner: "CISO / IT",
    mitigation: "Develop, test (tabletop exercise), and socialize IRP across all teams",
  },
  {
    id: "R006",
    category: "Access Control",
    description: "5 developers have unrestricted admin access to production database",
    likelihood: 2,
    impact: 5,
    status: "Open",
    owner: "Engineering Lead",
    mitigation: "Apply least-privilege principle; separate prod DB roles by job function",
  },
];

// ─── AUDIT CONTROLS ─────────────────────────────────────────────────────────

type ControlStatus = "compliant" | "partial" | "nonCompliant" | "na" | "notAssessed";

type Control = {
  id: string;
  domain: string;
  description: string;
};

const AUDIT_CONTROLS: Control[] = [
  { id: "A.5.1.1", domain: "Information Security Policies", description: "Policies for information security are defined, approved by management, published and communicated to all employees" },
  { id: "A.6.1.1", domain: "Organisation of InfoSec", description: "Roles and responsibilities for information security are clearly defined and allocated" },
  { id: "A.7.2.2", domain: "HR Security", description: "All staff and contractors receive regular security awareness education and training relevant to their role" },
  { id: "A.9.1.1", domain: "Access Control", description: "An access control policy is established, documented, reviewed, and updated based on business and security requirements" },
  { id: "A.9.2.1", domain: "Access Control", description: "A formal user registration and de-registration process exists to enable assignment and revocation of access rights" },
  { id: "A.9.2.3", domain: "Access Control", description: "Privileged access rights are restricted, controlled, reviewed regularly, and justified by business need" },
  { id: "A.9.4.2", domain: "Access Control", description: "Secure log-on procedures are implemented, including multi-factor authentication (MFA) where appropriate" },
  { id: "A.9.4.3", domain: "Access Control", description: "Password management system enforces quality passwords and prevents password reuse" },
  { id: "A.10.1.1", domain: "Cryptography", description: "A policy on the use of cryptographic controls is defined, implemented, and maintained" },
  { id: "A.12.1.1", domain: "Operations Security", description: "Operating procedures are documented, maintained, and available to all who need them" },
  { id: "A.12.6.1", domain: "Operations Security", description: "Information about technical vulnerabilities is obtained timely, exposure is evaluated, and appropriate measures are taken" },
  { id: "A.16.1.1", domain: "Incident Management", description: "Management responsibilities and procedures are established to ensure quick, effective, and orderly response to security incidents" },
  { id: "A.16.1.2", domain: "Incident Management", description: "Security events are reported through appropriate management channels as quickly as possible" },
  { id: "A.16.1.5", domain: "Incident Management", description: "Security incidents are responded to in accordance with documented procedures; lessons learned are captured" },
  { id: "A.18.1.1", domain: "Compliance", description: "All relevant legislative, regulatory, and contractual requirements are explicitly identified, documented, and kept up to date" },
];

// ─── EVIDENCE CHECKLIST ─────────────────────────────────────────────────────

type EvidenceStatus = "obtained" | "requested" | "missing" | "notStarted";

type EvidenceItem = {
  id: string;
  controlRef: string;
  item: string;
  category: "Policy" | "Configuration" | "Logs" | "Reports" | "Training";
};

const EVIDENCE_ITEMS: EvidenceItem[] = [
  { id: "E001", controlRef: "A.5.1.1", item: "Information Security Policy (signed, dated, version-controlled, approved by management)", category: "Policy" },
  { id: "E002", controlRef: "A.7.2.2", item: "Security awareness training records — completion rates by department (last 12 months)", category: "Training" },
  { id: "E003", controlRef: "A.9.1.1", item: "Access Control Policy document with last review date and approver signature", category: "Policy" },
  { id: "E004", controlRef: "A.9.2.1", item: "User provisioning / de-provisioning logs for last 3 months (joiner-mover-leaver process)", category: "Logs" },
  { id: "E005", controlRef: "A.9.2.3", item: "Privileged user list with justifications (AWS IAM admin roles, DB superusers)", category: "Configuration" },
  { id: "E006", controlRef: "A.9.4.2", item: "MFA enforcement screenshot / AWS IAM policy config proving MFA is mandatory", category: "Configuration" },
  { id: "E007", controlRef: "A.10.1.1", item: "Cryptography policy + AWS S3 encryption configuration (bucket-level settings)", category: "Configuration" },
  { id: "E008", controlRef: "A.12.6.1", item: "Vulnerability scan reports (last 90 days) + remediation tracking ticket evidence", category: "Reports" },
  { id: "E009", controlRef: "A.16.1.1", item: "Incident Response Plan (IRP) document — including escalation matrix and contact list", category: "Policy" },
  { id: "E010", controlRef: "A.16.1.2", item: "Incident ticket / log records for the Q3 2024 phishing incident including timeline", category: "Logs" },
];

// ─── STEP CONFIG ────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Scope & Planning", icon: "🗺️" },
  { id: 2, label: "Risk Assessment", icon: "⚠️" },
  { id: 3, label: "Control Assessment", icon: "✅" },
  { id: 4, label: "Evidence Collection", icon: "📂" },
  { id: 5, label: "Generate Report", icon: "📄" },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

function riskScore(l: number, i: number) {
  return l * i;
}

function riskLevel(score: number): { label: string; color: string; bg: string } {
  if (score >= 15) return { label: "Critical", color: "text-red-700", bg: "bg-red-100 border-red-300" };
  if (score >= 10) return { label: "High", color: "text-orange-700", bg: "bg-orange-100 border-orange-300" };
  if (score >= 5) return { label: "Medium", color: "text-yellow-700", bg: "bg-yellow-100 border-yellow-300" };
  return { label: "Low", color: "text-green-700", bg: "bg-green-100 border-green-300" };
}

const STATUS_STYLE: Record<ControlStatus, { label: string; btn: string; text: string }> = {
  compliant: { label: "Compliant ✅", btn: "bg-green-600 text-white", text: "text-green-700" },
  partial: { label: "Partial ⚠️", btn: "bg-yellow-500 text-white", text: "text-yellow-700" },
  nonCompliant: { label: "Non-Compliant ❌", btn: "bg-red-600 text-white", text: "text-red-700" },
  na: { label: "N/A", btn: "bg-slate-400 text-white", text: "text-slate-500" },
  notAssessed: { label: "Not Assessed", btn: "bg-white border border-slate-300 text-slate-500", text: "text-slate-400" },
};

const EVIDENCE_STYLE: Record<EvidenceStatus, { label: string; btn: string }> = {
  obtained: { label: "✅ Obtained", btn: "bg-green-600 text-white" },
  requested: { label: "📤 Requested", btn: "bg-blue-500 text-white" },
  missing: { label: "❌ Missing", btn: "bg-red-600 text-white" },
  notStarted: { label: "— Not Started", btn: "bg-white border border-slate-300 text-slate-500" },
};

function calcComplianceRate(controls: Record<string, ControlStatus>) {
  const assessed = AUDIT_CONTROLS.filter((c) => {
    const s = controls[c.id] ?? "notAssessed";
    return s !== "notAssessed" && s !== "na";
  });
  if (assessed.length === 0) return 0;
  const score = assessed.reduce((sum, c) => {
    const s = controls[c.id];
    if (s === "compliant") return sum + 1;
    if (s === "partial") return sum + 0.5;
    return sum;
  }, 0);
  return Math.round((score / assessed.length) * 100);
}

function auditOpinion(rate: number, criticalOpen: number): { label: string; color: string; explanation: string } {
  if (criticalOpen > 0 || rate < 50)
    return {
      label: "Adverse",
      color: "text-red-600",
      explanation: "Material weaknesses and critical open risks prevent the auditor from expressing a positive opinion. Significant remediation required before certification.",
    };
  if (rate < 70)
    return {
      label: "Qualified",
      color: "text-orange-600",
      explanation: "Control gaps have been identified that are significant but not pervasive. Specific findings noted require management action within agreed timelines.",
    };
  if (rate < 85)
    return {
      label: "Qualified (Minor Exceptions)",
      color: "text-yellow-600",
      explanation: "Controls are generally adequate. Minor exceptions noted — management should address findings to reach full certification readiness.",
    };
  return {
    label: "Unqualified (Clean)",
    color: "text-green-600",
    explanation: "Controls are operating effectively. No material weaknesses identified. Organization is ready to proceed with ISO 27001 certification audit.",
  };
}

// ─── REPORT GENERATOR ───────────────────────────────────────────────────────

function openReport(
  risks: Risk[],
  controls: Record<string, ControlStatus>,
  evidence: Record<string, EvidenceStatus>,
  notes: Record<string, string>,
) {
  const complianceRate = calcComplianceRate(controls);
  const criticalOpen = risks.filter(
    (r) => riskScore(r.likelihood, r.impact) >= 15 && r.status !== "Closed",
  ).length;
  const opinion = auditOpinion(complianceRate, criticalOpen);

  const riskRows = risks
    .map((r) => {
      const score = riskScore(r.likelihood, r.impact);
      const lvl = riskLevel(score);
      return `<tr>
        <td>${r.id}</td><td>${r.category}</td><td>${r.description}</td>
        <td>${r.likelihood}</td><td>${r.impact}</td>
        <td><strong>${score}</strong> — ${lvl.label}</td>
        <td>${r.status}</td><td>${r.mitigation}</td>
      </tr>`;
    })
    .join("");

  const controlRows = AUDIT_CONTROLS.map((c) => {
    const s = controls[c.id] ?? "notAssessed";
    const note = notes[c.id] ?? "";
    return `<tr>
      <td>${c.id}</td><td>${c.domain}</td><td>${c.description}</td>
      <td><strong>${STATUS_STYLE[s].label}</strong></td>
      <td>${note}</td>
    </tr>`;
  }).join("");

  const evidenceRows = EVIDENCE_ITEMS.map((e) => {
    const s = evidence[e.id] ?? "notStarted";
    return `<tr>
      <td>${e.id}</td><td>${e.controlRef}</td><td>${e.category}</td>
      <td>${e.item}</td><td><strong>${EVIDENCE_STYLE[s].label}</strong></td>
    </tr>`;
  }).join("");

  const obtainedCount = EVIDENCE_ITEMS.filter((e) => (evidence[e.id] ?? "notStarted") === "obtained").length;
  const missingCount = EVIDENCE_ITEMS.filter((e) => (evidence[e.id] ?? "notStarted") === "missing").length;

  const nonCompliantControls = AUDIT_CONTROLS.filter((c) => controls[c.id] === "nonCompliant");
  const partialControls = AUDIT_CONTROLS.filter((c) => controls[c.id] === "partial");

  const findingsSection =
    nonCompliantControls.length === 0 && partialControls.length === 0
      ? "<p><em>No findings identified.</em></p>"
      : [
          ...nonCompliantControls.map(
            (c) =>
              `<div class="finding critical"><strong>F-${c.id} [Non-Compliant]</strong> — ${c.description}<br/><em>Recommendation: ${notes[c.id] ?? "Implement control per ISO 27001 Annex A requirements."}</em></div>`,
          ),
          ...partialControls.map(
            (c) =>
              `<div class="finding moderate"><strong>F-${c.id} [Partial]</strong> — ${c.description}<br/><em>Recommendation: ${notes[c.id] ?? "Address identified gaps to achieve full compliance."}</em></div>`,
          ),
        ].join("");

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>IT Audit Report — ${COMPANY.name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Times New Roman", serif; font-size: 11pt; color: #111; max-width: 900px; margin: 0 auto; padding: 40px; background: white; }
    h1 { font-size: 22pt; text-align: center; margin-bottom: 4px; }
    h2 { font-size: 15pt; margin: 28px 0 10px; border-bottom: 2px solid #1e3a5f; padding-bottom: 4px; color: #1e3a5f; }
    h3 { font-size: 12pt; margin: 18px 0 8px; color: #1e3a5f; }
    .subtitle { text-align: center; color: #555; font-size: 12pt; }
    .header-block { text-align: center; border: 2px solid #1e3a5f; padding: 20px; margin: 24px 0; border-radius: 4px; }
    .header-block p { margin: 4px 0; font-size: 11pt; }
    .opinion-box { border: 3px solid; padding: 16px; border-radius: 4px; margin: 16px 0; }
    .opinion-box.adverse { border-color: #dc2626; background: #fef2f2; }
    .opinion-box.qualified { border-color: #d97706; background: #fffbeb; }
    .opinion-box.clean { border-color: #16a34a; background: #f0fdf4; }
    .opinion-box.minorex { border-color: #ca8a04; background: #fefce8; }
    .metric-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0; }
    .metric { border: 1px solid #ccc; padding: 12px; text-align: center; border-radius: 4px; }
    .metric .value { font-size: 22pt; font-weight: bold; color: #1e3a5f; }
    .metric .label { font-size: 9pt; color: #666; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 9.5pt; }
    th { background: #1e3a5f; color: white; padding: 7px 9px; text-align: left; }
    td { padding: 6px 9px; border-bottom: 1px solid #ddd; vertical-align: top; }
    tr:nth-child(even) td { background: #f9f9f9; }
    .finding { padding: 10px 14px; margin: 8px 0; border-left: 4px solid; border-radius: 2px; font-size: 10.5pt; }
    .finding.critical { border-color: #dc2626; background: #fef2f2; }
    .finding.moderate { border-color: #d97706; background: #fffbeb; }
    .sig-block { margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .sig-line { border-top: 1px solid #333; padding-top: 6px; margin-top: 40px; font-size: 10pt; }
    .disclaimer { font-size: 9pt; color: #666; margin-top: 24px; border-top: 1px solid #ccc; padding-top: 12px; }
    @media print { body { padding: 20px; } h2 { page-break-before: auto; } }
  </style>
</head>
<body>

  <h1>INFORMATION SECURITY AUDIT REPORT</h1>
  <p class="subtitle">Gap Assessment against ISO 27001:2013 Annex A Controls</p>

  <div class="header-block">
    <p><strong>Auditee:</strong> ${COMPANY.name}</p>
    <p><strong>Industry:</strong> ${COMPANY.industry}</p>
    <p><strong>Audit Scope:</strong> ${COMPANY.auditScope}</p>
    <p><strong>Report Date:</strong> ${today}</p>
    <p><strong>Auditor:</strong> Polaris Audit Simulation — IT Audit Portfolio</p>
  </div>

  <h2>1. Executive Summary</h2>
  <p><strong>Objective:</strong> ${COMPANY.auditObjective}</p>
  <br/>
  <p>This audit was conducted to assess the information security posture of ${COMPANY.name} against the ISO 27001:2013 Annex A control requirements. The audit covered ${AUDIT_CONTROLS.length} key controls across ${new Set(AUDIT_CONTROLS.map((c) => c.domain)).size} control domains, evaluated ${risks.length} identified risks, and assessed ${EVIDENCE_ITEMS.length} evidence items.</p>

  <h3>Overall Audit Opinion</h3>
  <div class="opinion-box ${opinion.label.includes("Adverse") ? "adverse" : opinion.label.includes("Unqualified (Clean)") ? "clean" : opinion.label.includes("Minor") ? "minorex" : "qualified"}">
    <strong>Opinion: ${opinion.label}</strong><br/><br/>
    ${opinion.explanation}
  </div>

  <h3>Key Metrics</h3>
  <div class="metric-row">
    <div class="metric"><div class="value">${complianceRate}%</div><div class="label">Control Compliance Rate</div></div>
    <div class="metric"><div class="value">${risks.filter((r) => r.status !== "Closed").length}</div><div class="label">Open Risks</div></div>
    <div class="metric"><div class="value">${criticalOpen}</div><div class="label">Critical Open Risks</div></div>
    <div class="metric"><div class="value">${obtainedCount}/${EVIDENCE_ITEMS.length}</div><div class="label">Evidence Obtained</div></div>
  </div>

  <h2>2. Scope & Background</h2>
  <table>
    <tr><th>Parameter</th><th>Detail</th></tr>
    <tr><td>Organization</td><td>${COMPANY.name}</td></tr>
    <tr><td>Industry</td><td>${COMPANY.industry}</td></tr>
    <tr><td>Employees</td><td>${COMPANY.employees}</td></tr>
    <tr><td>Infrastructure</td><td>${COMPANY.infrastructure}</td></tr>
    <tr><td>Data Assets</td><td>${COMPANY.dataTypes}</td></tr>
    <tr><td>Recent Incident</td><td>${COMPANY.recentIncident}</td></tr>
    <tr><td>Compliance Goal</td><td>${COMPANY.complianceGoal}</td></tr>
    <tr><td>Audit Scope</td><td>${COMPANY.auditScope}</td></tr>
  </table>

  <h2>3. Risk Register</h2>
  <p>The following risks were identified and assessed using a Likelihood × Impact scoring model (1–5 scale, max score 25).</p>
  <br/>
  <table>
    <thead>
      <tr><th>ID</th><th>Category</th><th>Description</th><th>L</th><th>I</th><th>Score</th><th>Status</th><th>Mitigation</th></tr>
    </thead>
    <tbody>${riskRows}</tbody>
  </table>

  <h2>4. Control Assessment</h2>
  <p>Each control was assessed against available evidence and interview responses. Status: Compliant ✅ | Partial ⚠️ | Non-Compliant ❌ | N/A</p>
  <br/>
  <table>
    <thead>
      <tr><th>Control</th><th>Domain</th><th>Requirement</th><th>Status</th><th>Auditor Notes</th></tr>
    </thead>
    <tbody>${controlRows}</tbody>
  </table>

  <h2>5. Findings & Recommendations</h2>
  <p>The following findings require management attention and remediation action:</p>
  <br/>
  ${findingsSection}

  <h2>6. Evidence Summary</h2>
  <p>Evidence obtained: <strong>${obtainedCount}</strong> | Requested/pending: <strong>${EVIDENCE_ITEMS.filter((e) => (evidence[e.id] ?? "notStarted") === "requested").length}</strong> | Missing: <strong>${missingCount}</strong></p>
  <br/>
  <table>
    <thead>
      <tr><th>ID</th><th>Control</th><th>Type</th><th>Evidence Item</th><th>Status</th></tr>
    </thead>
    <tbody>${evidenceRows}</tbody>
  </table>

  <h2>7. Conclusion</h2>
  <p>${COMPANY.name} has demonstrated ${complianceRate >= 70 ? "a reasonable baseline of" : "significant gaps in"} its information security controls relative to ISO 27001:2013 requirements. ${criticalOpen > 0 ? `<strong>Critical attention is required on ${criticalOpen} open critical risk(s) before certification can be pursued.</strong>` : "No critical risks remain open."} The organization is recommended to address all Non-Compliant findings within 90 days and Partial findings within 180 days to achieve certification readiness by the target date.</p>

  <div class="sig-block">
    <div>
      <div class="sig-line">Lead Auditor Signature</div>
      <p>Name: ____________________________</p>
      <p>Date: ____________________________</p>
    </div>
    <div>
      <div class="sig-line">Management Representative</div>
      <p>Name: ____________________________</p>
      <p>Date: ____________________________</p>
    </div>
  </div>

  <div class="disclaimer">
    This report was generated using the Polaris Audit Simulation tool. It is intended as a learning exercise and portfolio demonstration. All company names, scenarios, and data are fictional.
  </div>

  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function AuditSimulation() {
  const [step, setStep] = useState(1);
  const [risks, setRisks] = useState<Risk[]>(INITIAL_RISKS);
  const [controlStatus, setControlStatus] = useState<Record<string, ControlStatus>>({});
  const [controlNotes, setControlNotes] = useState<Record<string, string>>({});
  const [evidenceStatus, setEvidenceStatus] = useState<Record<string, EvidenceStatus>>({});
  const [editingRisk, setEditingRisk] = useState<string | null>(null);

  const complianceRate = useMemo(() => calcComplianceRate(controlStatus), [controlStatus]);
  const criticalOpen = useMemo(
    () => risks.filter((r) => riskScore(r.likelihood, r.impact) >= 15 && r.status !== "Closed").length,
    [risks],
  );
  const opinion = useMemo(() => auditOpinion(complianceRate, criticalOpen), [complianceRate, criticalOpen]);

  const assessedCount = AUDIT_CONTROLS.filter(
    (c) => (controlStatus[c.id] ?? "notAssessed") !== "notAssessed",
  ).length;

  const obtainedCount = EVIDENCE_ITEMS.filter(
    (e) => (evidenceStatus[e.id] ?? "notStarted") === "obtained",
  ).length;

  function setRiskField(id: string, field: keyof Risk, value: unknown) {
    setRisks((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  const nextControlStatus: Record<ControlStatus, ControlStatus> = {
    notAssessed: "compliant",
    compliant: "partial",
    partial: "nonCompliant",
    nonCompliant: "na",
    na: "notAssessed",
  };

  return (
    <KnowledgeShell
      title="Audit Simulation"
      subtitle="Jalankan audit end-to-end dengan studi kasus nyata — dari scoping sampai generate report."
      titleClassName="text-5xl"
    >
      <HowToUse
        what="Simulasi IT audit lengkap menggunakan studi kasus perusahaan fintech fiktif. Kamu akan menjalankan semua fase audit: scope, risk assessment, control testing, evidence collection, sampai generate audit report formal."
        when={[
          "Mau praktek alur audit sebelum wawancara kerja sebagai IT auditor",
          "Ingin punya bukti nyata kamu bisa menjalankan full audit lifecycle",
          "Belajar cara mengisi risk register, menilai kontrol, dan mengumpulkan bukti",
          "Perlu contoh laporan audit untuk portfolio",
        ]}
        how={[
          "Ikuti 5 langkah berurutan: Scope → Risk → Control → Evidence → Report",
          "Setiap langkah kamu bisa edit data (ubah skor risiko, centang kontrol, catat temuan)",
          "Di Step 5, klik 'Generate Report' untuk membuat laporan audit formal yang bisa di-print/disimpan sebagai PDF",
          "Laporan ini bisa ditunjukkan ke interviewer sebagai bukti kamu bisa menjalankan audit",
        ]}
      />

      {/* ── Step Progress Bar ── */}
      <div className="mt-8 flex items-center gap-2 overflow-x-auto">
        {STEPS.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                step === s.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : step > s.id
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-white border border-slate-200 text-slate-500"
              }`}
            >
              <span>{s.icon}</span>
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.id}</span>
            </button>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 w-6 rounded ${step > s.id ? "bg-green-400" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* STEP 1: SCOPE & PLANNING                                              */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Studi Kasus</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">{COMPANY.name}</h2>
            <p className="mt-1 text-slate-500">{COMPANY.industry}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Employees", value: `${COMPANY.employees} karyawan`, icon: "👥" },
              { label: "Location", value: COMPANY.location, icon: "📍" },
              { label: "Infrastructure", value: COMPANY.infrastructure, icon: "☁️" },
              { label: "Data Assets", value: COMPANY.dataTypes, icon: "🗄️" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{item.icon} {item.label}</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500">⚠️ Recent Incident</p>
            <p className="mt-2 text-sm text-red-800">{COMPANY.recentIncident}</p>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">🎯 Audit Scope</p>
            <p className="mt-2 text-sm font-semibold text-indigo-800">{COMPANY.auditScope}</p>
            <p className="mt-3 text-sm text-indigo-700">{COMPANY.auditObjective}</p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-green-600">✅ Compliance Goal</p>
            <p className="mt-2 text-sm text-green-800">{COMPANY.complianceGoal}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">📋 Audit Plan Summary</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• <strong>Framework:</strong> ISO 27001:2013 Annex A</li>
              <li>• <strong>Controls in scope:</strong> {AUDIT_CONTROLS.length} key controls across {new Set(AUDIT_CONTROLS.map((c) => c.domain)).size} domains</li>
              <li>• <strong>Evidence items:</strong> {EVIDENCE_ITEMS.length} items to collect</li>
              <li>• <strong>Methodology:</strong> Document review, configuration inspection, staff interview</li>
              <li>• <strong>Output:</strong> Gap assessment report with risk ratings and remediation roadmap</li>
            </ul>
          </div>

          <button
            onClick={() => setStep(2)}
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Lanjut ke Risk Assessment →
          </button>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* STEP 2: RISK ASSESSMENT                                               */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="mt-8 space-y-5">
          <div className="rounded-2xl border border-blue-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Risks sudah di-pre-load dari studi kasus. Kamu bisa <strong>edit Likelihood/Impact</strong> dan ubah
              <strong> Status</strong> setiap risk. Skor = Likelihood × Impact (max 25).
            </p>
            <div className="mt-4 flex gap-4 text-xs font-semibold">
              {[
                { label: "Critical ≥15", color: "bg-red-100 text-red-700 border-red-300" },
                { label: "High ≥10", color: "bg-orange-100 text-orange-700 border-orange-300" },
                { label: "Medium ≥5", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
                { label: "Low <5", color: "bg-green-100 text-green-700 border-green-300" },
              ].map((x) => (
                <span key={x.label} className={`rounded-full border px-3 py-1 ${x.color}`}>
                  {x.label}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {risks.map((r) => {
              const score = riskScore(r.likelihood, r.impact);
              const lvl = riskLevel(score);
              const isEditing = editingRisk === r.id;
              return (
                <div
                  key={r.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm ${isEditing ? "border-indigo-400 ring-2 ring-indigo-200" : "border-blue-200"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-bold text-slate-400">{r.id}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{r.category}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${lvl.bg} ${lvl.color}`}>
                          {lvl.label} — Score {score}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            r.status === "Closed"
                              ? "bg-green-100 text-green-700"
                              : r.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-slate-800">{r.description}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        <strong>Owner:</strong> {r.owner} — <strong>Mitigation:</strong> {r.mitigation}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingRisk(isEditing ? null : r.id)}
                      className="shrink-0 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                    >
                      {isEditing ? "Done" : "Edit"}
                    </button>
                  </div>

                  {isEditing && (
                    <div className="mt-4 border-t border-slate-100 pt-4 grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-500">
                          Likelihood (1–5): <span className="text-indigo-600">{r.likelihood}</span>
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={r.likelihood}
                          onChange={(e) => setRiskField(r.id, "likelihood", Number(e.target.value))}
                          className="mt-1 w-full accent-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">
                          Impact (1–5): <span className="text-indigo-600">{r.impact}</span>
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={r.impact}
                          onChange={(e) => setRiskField(r.id, "impact", Number(e.target.value))}
                          className="mt-1 w-full accent-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Status</label>
                        <select
                          value={r.status}
                          onChange={(e) => setRiskField(r.id, "status", e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm"
                        >
                          <option>Open</option>
                          <option>In Progress</option>
                          <option>Closed</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              ← Back
            </button>
            <button onClick={() => setStep(3)} className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
              Lanjut ke Control Assessment →
            </button>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* STEP 3: CONTROL ASSESSMENT                                             */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="mt-8 space-y-5">
          <div className="rounded-2xl border border-blue-200 bg-white p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm text-slate-600">
                  Klik tombol status di setiap kontrol untuk mengubah hasilnya. Tambah catatan/temuan di kolom notes.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Status cycling: Not Assessed → Compliant → Partial → Non-Compliant → N/A → Not Assessed
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">{complianceRate}%</div>
                <div className="text-xs text-slate-500">compliance rate ({assessedCount}/{AUDIT_CONTROLS.length} assessed)</div>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full transition-all ${complianceRate >= 80 ? "bg-green-500" : complianceRate >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${complianceRate}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {AUDIT_CONTROLS.map((c) => {
              const status = controlStatus[c.id] ?? "notAssessed";
              const style = STATUS_STYLE[status];
              return (
                <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-indigo-600">{c.id}</span>
                        <span className="text-xs text-slate-400">{c.domain}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-700">{c.description}</p>
                    </div>
                    <button
                      onClick={() =>
                        setControlStatus((prev) => ({
                          ...prev,
                          [c.id]: nextControlStatus[status],
                        }))
                      }
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${style.btn}`}
                    >
                      {style.label}
                    </button>
                  </div>
                  {(status === "partial" || status === "nonCompliant") && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Catatan temuan / rekomendasi..."
                        value={controlNotes[c.id] ?? ""}
                        onChange={(e) =>
                          setControlNotes((prev) => ({ ...prev, [c.id]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              ← Back
            </button>
            <button onClick={() => setStep(4)} className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
              Lanjut ke Evidence Collection →
            </button>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* STEP 4: EVIDENCE COLLECTION                                            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="mt-8 space-y-5">
          <div className="rounded-2xl border border-blue-200 bg-white p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm text-slate-600">
                  Tandai status pengumpulan bukti untuk setiap item. Klik tombol status untuk mengubah.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{obtainedCount}/{EVIDENCE_ITEMS.length}</div>
                <div className="text-xs text-slate-500">evidence obtained</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
              {(["obtained", "requested", "missing", "notStarted"] as EvidenceStatus[]).map((s) => (
                <span key={s} className={`rounded-full px-3 py-1 ${EVIDENCE_STYLE[s].btn}`}>
                  {EVIDENCE_STYLE[s].label}: {EVIDENCE_ITEMS.filter((e) => (evidenceStatus[e.id] ?? "notStarted") === s).length}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {EVIDENCE_ITEMS.map((e) => {
              const status = evidenceStatus[e.id] ?? "notStarted";
              const nextStatusMap: Record<EvidenceStatus, EvidenceStatus> = {
                notStarted: "obtained",
                obtained: "requested",
                requested: "missing",
                missing: "notStarted",
              };
              const catColor: Record<string, string> = {
                Policy: "bg-purple-100 text-purple-700",
                Configuration: "bg-blue-100 text-blue-700",
                Logs: "bg-orange-100 text-orange-700",
                Reports: "bg-teal-100 text-teal-700",
                Training: "bg-pink-100 text-pink-700",
              };
              return (
                <div key={e.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-400">{e.id}</span>
                        <span className="font-mono text-xs text-indigo-600">{e.controlRef}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${catColor[e.category]}`}>
                          {e.category}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-700">{e.item}</p>
                    </div>
                    <button
                      onClick={() =>
                        setEvidenceStatus((prev) => ({ ...prev, [e.id]: nextStatusMap[status] }))
                      }
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${EVIDENCE_STYLE[status].btn}`}
                    >
                      {EVIDENCE_STYLE[status].label}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              ← Back
            </button>
            <button onClick={() => setStep(5)} className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
              Lanjut ke Generate Report →
            </button>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* STEP 5: GENERATE REPORT                                                */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Audit Summary Preview</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-800">{COMPANY.name}</h2>
            <p className="text-slate-500 text-sm">{COMPANY.industry}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Control Compliance",
                value: `${complianceRate}%`,
                sub: `${assessedCount} of ${AUDIT_CONTROLS.length} assessed`,
                color: complianceRate >= 80 ? "text-green-600" : complianceRate >= 60 ? "text-yellow-600" : "text-red-600",
              },
              {
                label: "Open Risks",
                value: risks.filter((r) => r.status !== "Closed").length,
                sub: `${criticalOpen} critical`,
                color: criticalOpen > 0 ? "text-red-600" : "text-orange-600",
              },
              {
                label: "Evidence Obtained",
                value: `${obtainedCount}/${EVIDENCE_ITEMS.length}`,
                sub: `${EVIDENCE_ITEMS.filter((e) => (evidenceStatus[e.id] ?? "notStarted") === "missing").length} missing`,
                color: "text-blue-600",
              },
              {
                label: "Findings",
                value: AUDIT_CONTROLS.filter(
                  (c) => controlStatus[c.id] === "nonCompliant" || controlStatus[c.id] === "partial",
                ).length,
                sub: `${AUDIT_CONTROLS.filter((c) => controlStatus[c.id] === "nonCompliant").length} non-compliant`,
                color: "text-indigo-600",
              },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm text-center">
                <div className={`text-3xl font-bold ${m.color}`}>{m.value}</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">{m.label}</div>
                <div className="mt-0.5 text-xs text-slate-400">{m.sub}</div>
              </div>
            ))}
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              opinion.label.includes("Adverse")
                ? "border-red-300 bg-red-50"
                : opinion.label.includes("Clean")
                ? "border-green-300 bg-green-50"
                : "border-yellow-300 bg-yellow-50"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Audit Opinion</p>
            <p
              className={`mt-2 text-2xl font-bold ${
                opinion.label.includes("Adverse")
                  ? "text-red-700"
                  : opinion.label.includes("Clean")
                  ? "text-green-700"
                  : "text-yellow-700"
              }`}
            >
              {opinion.label}
            </p>
            <p className="mt-2 text-sm text-slate-700">{opinion.explanation}</p>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">📄 Tentang Report</p>
            <p className="mt-2 text-sm text-slate-700">
              Report yang dihasilkan adalah dokumen audit formal berbahasa Inggris yang mencakup:
              Executive Summary, Risk Register, Control Assessment Table, Findings & Recommendations,
              Evidence Summary, dan Conclusion dengan Audit Opinion.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Report akan terbuka di tab baru dan otomatis masuk ke mode print — kamu bisa save as PDF.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStep(4)}
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              ← Back
            </button>
            <button
              onClick={() => openReport(risks, controlStatus, evidenceStatus, controlNotes)}
              className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700 active:scale-95 transition-transform"
            >
              📄 Generate Audit Report
            </button>
            <button
              onClick={() => {
                setStep(1);
                setControlStatus({});
                setControlNotes({});
                setEvidenceStatus({});
                setRisks(INITIAL_RISKS);
                setEditingRisk(null);
              }}
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
            >
              🔄 Reset Simulasi
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">💡 Tips untuk Interview</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Tunjukkan report sebagai bukti kamu bisa menjalankan <strong>full audit lifecycle</strong></li>
              <li>• Jelaskan tiap fase: scoping → risk assessment → control testing → evidence → reporting</li>
              <li>• Audit opinion "Qualified" adalah hasil paling realistis — tunjukkan kamu mengerti artinya</li>
              <li>• Sebutkan frameworks yang digunakan: ISO 27001:2013 Annex A, risk scoring L×I</li>
              <li>• Kalau ditanya tools: sebutkan kamu bisa pakai Excel, GRC tools, atau custom tool seperti ini</li>
            </ul>
          </div>
        </div>
      )}
    </KnowledgeShell>
  );
}
