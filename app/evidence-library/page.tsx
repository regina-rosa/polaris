"use client";

import { useState, useMemo } from "react";
import KnowledgeShell from "@/components/KnowledgeShell";
import HowToUse from "@/components/HowToUse";

type EvidenceCategory = "Policy & Procedure" | "Logs & Records" | "Configuration" | "Reports & Scans" | "Training" | "Contracts & Agreements";
type Framework = "ISO 27001" | "SOC 2" | "NIST CSF" | "General";

type EvidenceEntry = {
  id: string;
  name: string;
  category: EvidenceCategory;
  frameworks: Framework[];
  controlRef: string;
  description: string;
  whatToLookFor: string[];
  redFlags: string[];
  howToRequest: string;
  example: string;
};

const EVIDENCE: EvidenceEntry[] = [
  // ── POLICY & PROCEDURE ──
  {
    id: "P001",
    name: "Information Security Policy",
    category: "Policy & Procedure",
    frameworks: ["ISO 27001", "SOC 2", "General"],
    controlRef: "A.5.1.1 / CC2.2",
    description: "Top-level policy document defining management's direction and commitment to information security.",
    whatToLookFor: [
      "Approved and signed by senior management (CEO/CISO)",
      "Current version with effective date — reviewed within last 12 months",
      "Distributed to all employees (distribution evidence)",
      "Covers scope, objectives, roles, and consequences of non-compliance",
    ],
    redFlags: [
      "Last reviewed 2+ years ago (stale policy is a finding)",
      "No management signature or approval evidence",
      "Policy exists but employees haven't been notified / trained on it",
      "Generic template policy with placeholders still in it",
    ],
    howToRequest: "Request: 'Please provide the current Information Security Policy with version history, approval signature, and evidence of distribution to staff (e.g., email broadcast, acknowledgement log).'",
    example: "InfoSec-Policy-v2.4-Approved-2024-03-01.pdf with attached email showing all-staff distribution",
  },
  {
    id: "P002",
    name: "Access Control Policy",
    category: "Policy & Procedure",
    frameworks: ["ISO 27001", "SOC 2"],
    controlRef: "A.9.1.1 / CC6.1",
    description: "Policy defining how access to systems, data, and facilities is granted, reviewed, and revoked.",
    whatToLookFor: [
      "Defines access principles (least privilege, need-to-know, segregation of duties)",
      "Covers provisioning, modification, and de-provisioning processes",
      "References MFA requirements",
      "Specifies review frequency (typically quarterly for privileged, semi-annual for standard)",
    ],
    redFlags: [
      "No mention of privileged access controls or MFA",
      "Policy written by IT team without management approval",
      "Access review SLAs not defined",
      "No mention of remote access or third-party access",
    ],
    howToRequest: "Request: 'Please provide the Access Control Policy with version date, approver, and links to any associated procedures or standards it references.'",
    example: "AC-Policy-v1.8.pdf referencing PAM standard, MFA standard, and quarterly review schedule",
  },
  {
    id: "P003",
    name: "Incident Response Plan (IRP)",
    category: "Policy & Procedure",
    frameworks: ["ISO 27001", "SOC 2", "NIST CSF"],
    controlRef: "A.16.1.1 / CC7.3 / RS.RP",
    description: "Documented procedures for identifying, containing, investigating, and recovering from security incidents.",
    whatToLookFor: [
      "Covers all incident phases: detection → triage → containment → eradication → recovery → lessons learned",
      "Includes escalation matrix with named contacts and alternates",
      "Defines incident severity levels and SLA for each (e.g., P1 < 1hr response)",
      "Evidence of tabletop exercise or drill in last 12 months",
    ],
    redFlags: [
      "IRP exists on paper but team can't explain what they'd actually do",
      "No communication plan — who tells customers/regulators?",
      "No defined RTO/RPO for critical systems",
      "No post-incident review process (lessons learned)",
    ],
    howToRequest: "Request: 'Please provide the Incident Response Plan with last review date, approver, and records of any tabletop exercises or actual incident reports from the past 12 months.'",
    example: "IRP-v3.0.pdf + Tabletop Exercise Summary dated 2024-06 + Incident Report from phishing event 2024-08",
  },
  {
    id: "P004",
    name: "Cryptography / Encryption Policy",
    category: "Policy & Procedure",
    frameworks: ["ISO 27001", "General"],
    controlRef: "A.10.1.1",
    description: "Policy defining approved encryption algorithms, key lengths, and key management requirements.",
    whatToLookFor: [
      "Specifies minimum standards (e.g., AES-256 for data at rest, TLS 1.2+ for transit)",
      "Covers key management: generation, distribution, storage, rotation, destruction",
      "Explicitly prohibits weak algorithms (MD5, SHA-1, DES, RC4)",
      "References compliance standards driving requirements (PCI, GDPR, etc.)",
    ],
    redFlags: [
      "No minimum encryption standards defined",
      "Key management responsibilities not assigned",
      "No mention of certificate lifecycle management",
      "Policy doesn't cover cloud encryption (S3, database)",
    ],
    howToRequest: "Request: 'Please provide the Cryptography Policy or Encryption Standard with the approved algorithm list and key management procedures.'",
    example: "Crypto-Standard-v2.0.pdf specifying AES-256/RSA-2048 minimums, TLS 1.3 requirement, key rotation schedule",
  },

  // ── LOGS & RECORDS ──
  {
    id: "L001",
    name: "User Access Review Records",
    category: "Logs & Records",
    frameworks: ["ISO 27001", "SOC 2"],
    controlRef: "A.9.2.5 / CC6.2",
    description: "Evidence that managers have periodically reviewed and certified their team's access rights.",
    whatToLookFor: [
      "Review completed by access owners (managers), not IT",
      "Timestamps showing completion within required frequency (e.g., quarterly)",
      "Revocations were actioned within defined SLA",
      "Both active employees AND terminated employees were reviewed",
    ],
    redFlags: [
      "All access certified as 'approved' with no removals — rubber stamp review",
      "IT team self-certified their own access (independence violation)",
      "Review frequency missed — last review was 8 months ago for a quarterly control",
      "Terminated employees still showing active access at time of review",
    ],
    howToRequest: "Request: 'Please provide the last 3 access review completion reports showing reviewers, dates completed, and list of any access removed with action dates.'",
    example: "Q3-2024-UAR-Complete.xlsx showing 23 accounts reviewed, 4 revoked, 2 accounts flagged for follow-up within 3 business days",
  },
  {
    id: "L002",
    name: "User Provisioning / De-provisioning Logs",
    category: "Logs & Records",
    frameworks: ["ISO 27001", "SOC 2"],
    controlRef: "A.9.2.1 / CC6.2",
    description: "Records showing the process of granting and revoking system access for joiners and leavers.",
    whatToLookFor: [
      "HR termination date vs IT account disable date (gap should be < defined SLA)",
      "Approval workflow documented (manager approval before access granted)",
      "Access granted matches role (no excessive permissions relative to job function)",
      "Service accounts and shared accounts are documented and justified",
    ],
    redFlags: [
      "Terminated employee accounts active days/weeks after HR termination date",
      "Access granted without approval ticket or workflow",
      "New employees given broad access 'temporarily' that never gets restricted",
      "No process for role changes (employee moves from Finance to IT — Finance access not removed)",
    ],
    howToRequest: "Request: 'Please provide the joiner-mover-leaver access log for the past 6 months including HR termination dates, IT account disable dates, and any access change approvals.'",
    example: "IAM-Changes-H2-2024.csv exported from ServiceNow showing ticket #, approver, access type, and action date for 47 changes",
  },
  {
    id: "L003",
    name: "Security Incident Log",
    category: "Logs & Records",
    frameworks: ["ISO 27001", "SOC 2", "NIST CSF"],
    controlRef: "A.16.1.2 / CC7.3",
    description: "Record of all reported security events and incidents including resolution and lessons learned.",
    whatToLookFor: [
      "All incidents logged with date, reporter, severity, and status",
      "Response times meet defined SLAs",
      "Root cause analysis documented for significant incidents",
      "Lessons learned and control improvements tracked",
    ],
    redFlags: [
      "Incident log is empty — either no incidents (suspicious) or not being used",
      "Incidents logged but no resolution dates or closure",
      "Same root cause appearing multiple times — no remediation learning",
      "Major incidents (like phishing) missing from the log",
    ],
    howToRequest: "Request: 'Please provide the security incident register for the past 12 months, including severity, response timeline, root cause, and any resulting control changes.'",
    example: "Incident-Register-2024.xlsx with 12 entries including 2 phishing incidents, 1 malware detection, and 9 policy violations with resolutions",
  },
  {
    id: "L004",
    name: "System/Application Audit Logs",
    category: "Logs & Records",
    frameworks: ["ISO 27001", "SOC 2", "General"],
    controlRef: "A.12.4.1 / CC7.2",
    description: "Technical logs from systems showing user activity, privileged actions, and system events.",
    whatToLookFor: [
      "Logs capture: who, what, when, from where (source IP), outcome",
      "Privileged actions (admin changes, account creation/deletion) are logged",
      "Log retention meets policy requirements (typically 90 days online, 1 year archived)",
      "Logs are protected from modification (immutable storage, separate log account)",
    ],
    redFlags: [
      "Logs only kept for 7-30 days (too short for forensic investigation)",
      "Admins can delete their own audit logs",
      "No SIEM or alerting — logs exist but nobody reads them",
      "Critical systems (ERP, database, AD) not covered by logging policy",
    ],
    howToRequest: "Request: 'Please demonstrate the audit logging configuration for 3 critical systems, showing what events are captured, log retention period, and how logs are protected from tampering.'",
    example: "CloudTrail configuration screenshot showing all-region logging to dedicated Log Archive account with S3 object lock enabled",
  },

  // ── CONFIGURATION ──
  {
    id: "C001",
    name: "MFA Enforcement Configuration",
    category: "Configuration",
    frameworks: ["ISO 27001", "SOC 2"],
    controlRef: "A.9.4.2 / CC6.1",
    description: "Technical evidence that multi-factor authentication is enabled and enforced for appropriate accounts.",
    whatToLookFor: [
      "MFA enforced (not just available) via policy — users can't bypass",
      "Covers: privileged accounts, remote access (VPN), cloud console, email",
      "MFA enrollment rate > 95% for applicable users",
      "Recovery/bypass process is controlled and logged",
    ],
    redFlags: [
      "MFA is 'available' but optional — not enforced",
      "Break-glass / emergency accounts exempt from MFA with no compensating control",
      "MFA via SMS only (acceptable but weaker than authenticator app or hardware token)",
      "Service accounts exempt from MFA without documented risk acceptance",
    ],
    howToRequest: "Request: 'Please provide a screenshot of MFA enforcement policy in your IdP/IAM system, showing MFA is mandatory for all applicable user types, with enrollment report.'",
    example: "AWS IAM screenshot showing SCP requiring MFA, Okta policy screenshot showing MFA required for all users, 98% enrollment rate report",
  },
  {
    id: "C002",
    name: "Privileged User List with Justifications",
    category: "Configuration",
    frameworks: ["ISO 27001", "SOC 2"],
    controlRef: "A.9.2.3 / CC6.3",
    description: "List of all accounts with elevated/admin permissions and business justification for each.",
    whatToLookFor: [
      "Complete list including service accounts and shared accounts",
      "Each entry has named owner and business justification",
      "List was reviewed recently (last 3–6 months)",
      "Count is reasonable (principle of minimal admin accounts)",
    ],
    redFlags: [
      "Generic entries: 'admin1', 'admin_old', 'test_admin' with no owner",
      "Shared admin accounts (multiple people using same credentials)",
      "Number of admins disproportionately large relative to org size",
      "Privileged accounts used for daily work (not just admin tasks)",
    ],
    howToRequest: "Request: 'Please provide the current privileged access register for all critical systems including AWS IAM, Active Directory, database, and application admin accounts with named owner and business justification for each.'",
    example: "PAM-Register-2024Q4.xlsx with 12 admin accounts across AWS/AD/DB, each with owner, justification, and last review date",
  },
  {
    id: "C003",
    name: "Firewall / Security Group Rules",
    category: "Configuration",
    frameworks: ["ISO 27001", "NIST CSF"],
    controlRef: "A.13.1.1 / PR.AC-5",
    description: "Network access control rules defining permitted traffic between network segments and from/to internet.",
    whatToLookFor: [
      "No open rules allowing 0.0.0.0/0 on sensitive ports (22, 3389, 1433, 3306)",
      "Rules are named/documented with business justification",
      "Rules reviewed and cleaned up periodically (no 'temp' rules that are permanent)",
      "Inbound internet access restricted to necessary services only",
    ],
    redFlags: [
      "SSH (port 22) or RDP (port 3389) open to internet 0.0.0.0/0",
      "Database ports exposed to internet or to all internal subnets",
      "Hundreds of unused legacy rules with no documentation",
      "No egress filtering (anything can connect outbound)",
    ],
    howToRequest: "Request: 'Please export the firewall/security group rules for internet-facing and production systems, and confirm the process for reviewing and approving new rules.'",
    example: "AWS Security Group export showing only 443 open to 0.0.0.0/0, SSH restricted to VPN CIDR range, DB in private subnet with no internet access",
  },
  {
    id: "C004",
    name: "Backup Configuration and Test Records",
    category: "Configuration",
    frameworks: ["ISO 27001", "SOC 2"],
    controlRef: "A.12.3.1 / A1.2",
    description: "Configuration of backup systems showing what is backed up, frequency, retention, and test restoration results.",
    whatToLookFor: [
      "All critical data and systems covered in backup scope",
      "Backup frequency matches RTO/RPO requirements",
      "Backups stored offsite or in separate cloud region",
      "Restoration tested at least annually with documented results",
    ],
    redFlags: [
      "Backups exist but restoration has never been tested ('hope and prayer' DR)",
      "Backup stored in same location/account as production (ransomware will get both)",
      "Backup retention shorter than required by regulation (e.g., GDPR, HIPAA)",
      "Only some systems backed up — no coverage matrix showing what's excluded and why",
    ],
    howToRequest: "Request: 'Please provide backup configuration for critical systems showing coverage, frequency, and retention settings, plus the most recent backup restoration test results.'",
    example: "AWS Backup report showing daily snapshots of RDS/EBS to separate account, last restore test 2024-10-15 with RPO=1h verified",
  },

  // ── REPORTS & SCANS ──
  {
    id: "R001",
    name: "Vulnerability Scan Reports",
    category: "Reports & Scans",
    frameworks: ["ISO 27001", "NIST CSF", "General"],
    controlRef: "A.12.6.1 / DE.CM-8",
    description: "Output from vulnerability scanning tools showing identified vulnerabilities and their remediation status.",
    whatToLookFor: [
      "Scans conducted at required frequency (at minimum quarterly, ideally continuous)",
      "Full asset coverage — internal and external facing systems",
      "Findings tracked to closure with remediation dates",
      "Critical/High vulnerabilities addressed within policy SLAs",
    ],
    redFlags: [
      "Last scan was 6+ months ago",
      "Scan results exist but no remediation tracking (scan theater)",
      "Known critical CVEs on production systems with no exception or timeline",
      "Scan only covers perimeter — internal systems never scanned",
    ],
    howToRequest: "Request: 'Please provide the most recent vulnerability scan reports for production systems (internal + external), the remediation tracking register, and your patch management SLA policy.'",
    example: "Qualys scan export showing 3 Critical, 12 High findings; Jira board showing 2 Critical patched within 7 days, 1 critical with formal risk acceptance",
  },
  {
    id: "R002",
    name: "Penetration Test Report",
    category: "Reports & Scans",
    frameworks: ["ISO 27001", "SOC 2", "General"],
    controlRef: "A.14.2.8 / CC4.1",
    description: "Report from an authorized third-party ethical hacker attempting to find and exploit vulnerabilities.",
    whatToLookFor: [
      "Conducted by qualified third party (not internal team self-testing)",
      "Scope clearly defined and covers critical systems",
      "Findings include severity ratings and remediation recommendations",
      "Remediation of critical and high findings tracked to closure",
    ],
    redFlags: [
      "No pentest in last 12–24 months (or ever)",
      "Pentest scope was limited to a tiny subset of systems",
      "Critical findings unaddressed with no remediation plan",
      "Pentest conducted by the same team that built the system",
    ],
    howToRequest: "Request: 'Please provide the most recent penetration test report, scope of testing, tester qualifications, and evidence of remediation for critical and high findings.'",
    example: "External pentest by XYZ Security dated 2024-05, scope: web app + cloud infra, 1 Critical (SQLi) patched 2024-06, 3 High in remediation",
  },
  {
    id: "R003",
    name: "SOC 2 Type II Report (Vendor)",
    category: "Reports & Scans",
    frameworks: ["SOC 2", "General"],
    controlRef: "A.15.2.1 / CC9.2",
    description: "A SOC 2 report from a critical third-party vendor proving their controls operated effectively over a period.",
    whatToLookFor: [
      "Type II (not just Type I) — covers operating effectiveness over time",
      "Report period covers recent 12 months (not expired)",
      "Auditor opinion: unqualified or qualified with context",
      "Exception items in the report understood and accepted or compensated for",
    ],
    redFlags: [
      "Vendor provides only Type I (design only — doesn't prove it works)",
      "Report older than 12 months with no bridge letter",
      "Organization never looked at the exceptions section of vendor SOC 2",
      "Critical vendor has no SOC 2 and no alternative assurance",
    ],
    howToRequest: "Request: 'Please provide SOC 2 Type II reports for our top 5 critical vendors, covering the most recent 12-month period, including any subservice organization reports.'",
    example: "AWS SOC 2 Type II report (annual, publicly available), Salesforce SOC 2 Type II, SaaS payroll provider SOC 2 Type II — all reviewed and exceptions noted",
  },

  // ── TRAINING ──
  {
    id: "T001",
    name: "Security Awareness Training Records",
    category: "Training",
    frameworks: ["ISO 27001", "SOC 2"],
    controlRef: "A.7.2.2 / CC1.4",
    description: "Records showing all employees completed security awareness training with passing scores.",
    whatToLookFor: [
      "100% completion (or documented exceptions) within required period",
      "Training content covers relevant threats (phishing, password hygiene, data handling)",
      "Completion date within last 12 months",
      "New hires trained within 30 days of joining",
    ],
    redFlags: [
      "60-70% completion rate — significant portion of staff untrained",
      "Training last updated 3+ years ago (content not relevant to current threats)",
      "Training completion not tracked per individual (no accountability)",
      "No phishing simulation to test training effectiveness",
    ],
    howToRequest: "Request: 'Please provide the security awareness training completion report by employee, showing module completion date and score, plus your onboarding training procedure for new hires.'",
    example: "LMS export showing 72/75 employees completed training in 2024, 3 on approved LOA, phishing simulation results: 8% click rate (down from 22%)",
  },
  {
    id: "T002",
    name: "Phishing Simulation Results",
    category: "Training",
    frameworks: ["ISO 27001", "General"],
    controlRef: "A.7.2.2",
    description: "Results from simulated phishing campaigns sent to employees to test security awareness.",
    whatToLookFor: [
      "Regular cadence (quarterly minimum)",
      "Click rate trending downward over time",
      "Users who clicked receive immediate training intervention",
      "Results reviewed by management and fed back into training program",
    ],
    redFlags: [
      "No phishing simulations ever conducted",
      "Click rate remains high (>20%) with no improvement over multiple campaigns",
      "Results used punitively but no additional training offered",
      "Finance and C-suite excluded from simulation scope",
    ],
    howToRequest: "Request: 'Please provide phishing simulation results for the past 4 campaigns including click rate, credential submission rate, and actions taken for users who clicked.'",
    example: "KnowBe4 report: Q1 22% click → Q2 15% → Q3 10% → Q4 7%; all clickers enrolled in remedial training within 48h",
  },

  // ── CONTRACTS & AGREEMENTS ──
  {
    id: "A001",
    name: "Third-Party / Vendor Security Agreements",
    category: "Contracts & Agreements",
    frameworks: ["ISO 27001", "General"],
    controlRef: "A.15.1.2",
    description: "Contractual security requirements (DPA, NDA, security addendum) with critical vendors.",
    whatToLookFor: [
      "Data Processing Agreement (DPA) exists for vendors handling personal data",
      "Security requirements clearly stated (encryption, access control, incident notification)",
      "Breach notification obligation specified with timeline (e.g., 72 hours per GDPR)",
      "Right to audit clause for critical vendors",
    ],
    redFlags: [
      "Critical vendor processing sensitive data with no security agreement",
      "Agreement exists but hasn't been reviewed since vendor onboarding years ago",
      "No breach notification clause",
      "No vendor risk assessment conducted before onboarding",
    ],
    howToRequest: "Request: 'Please provide the security addendum or DPA for your top 3 critical data-processing vendors, plus your vendor onboarding security assessment checklist.'",
    example: "AWS DPA, Salesforce DPA, payroll provider Security Addendum — all with 72h breach notification and right-to-audit clause",
  },
];

const CATEGORIES: EvidenceCategory[] = [
  "Policy & Procedure",
  "Logs & Records",
  "Configuration",
  "Reports & Scans",
  "Training",
  "Contracts & Agreements",
];

const CAT_ICON: Record<EvidenceCategory, string> = {
  "Policy & Procedure": "📋",
  "Logs & Records": "📒",
  "Configuration": "⚙️",
  "Reports & Scans": "🔍",
  "Training": "🎓",
  "Contracts & Agreements": "🤝",
};

const CAT_COLOR: Record<EvidenceCategory, string> = {
  "Policy & Procedure": "bg-purple-100 text-purple-700 border-purple-200",
  "Logs & Records": "bg-orange-100 text-orange-700 border-orange-200",
  "Configuration": "bg-blue-100 text-blue-700 border-blue-200",
  "Reports & Scans": "bg-teal-100 text-teal-700 border-teal-200",
  "Training": "bg-pink-100 text-pink-700 border-pink-200",
  "Contracts & Agreements": "bg-green-100 text-green-700 border-green-200",
};

const FRAMEWORK_COLOR: Record<Framework, string> = {
  "ISO 27001": "bg-indigo-100 text-indigo-700",
  "SOC 2": "bg-amber-100 text-amber-700",
  "NIST CSF": "bg-cyan-100 text-cyan-700",
  "General": "bg-slate-100 text-slate-600",
};

export default function EvidenceLibrary() {
  const [activeCategory, setActiveCategory] = useState<EvidenceCategory | "All">("All");
  const [activeFramework, setActiveFramework] = useState<Framework | "All">("All");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return EVIDENCE.filter((e) => {
      if (activeCategory !== "All" && e.category !== activeCategory) return false;
      if (activeFramework !== "All" && !e.frameworks.includes(activeFramework)) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          e.name.toLowerCase().includes(s) ||
          e.description.toLowerCase().includes(s) ||
          e.controlRef.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [activeCategory, activeFramework, search]);

  return (
    <KnowledgeShell
      title="Evidence Library"
      subtitle="Referensi lengkap untuk tipe-tipe bukti audit — apa yang dicari, red flags, dan cara memintanya."
      titleClassName="text-4xl"
    >
      <HowToUse
        what="Panduan referensi untuk setiap jenis bukti audit yang umum dikumpulkan dalam IT audit. Setiap entry menjelaskan apa yang harus dicari, red flags yang menunjukkan masalah, dan cara meminta bukti ke auditee."
        when={[
          "Sedang melakukan audit dan butuh tahu evidence apa yang harus diminta",
          "Mau belajar apa yang membuat bukti audit 'cukup dan sesuai'",
          "Persiapan untuk fieldwork — buat Evidence Request List (ERL)",
          "Mau ngerti perbedaan antara evidence yang kuat vs lemah",
        ]}
        how={[
          "Filter berdasarkan kategori (Policy, Logs, Configuration, dll) atau framework (ISO 27001, SOC 2)",
          "Klik 'Lihat Detail' untuk melihat what to look for, red flags, dan cara request",
          "Gunakan 'How to Request' sebagai template email ke auditee",
          "Red flags = temuan potensial yang harus dicatat kalau kamu lihat",
        ]}
      />

      {/* ── Filters ── */}
      <div className="mt-8 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("All")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${activeCategory === "All" ? "bg-slate-800 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
          >
            All ({EVIDENCE.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${activeCategory === cat ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              {CAT_ICON[cat]} {cat} ({EVIDENCE.filter((e) => e.category === cat).length})
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", "ISO 27001", "SOC 2", "NIST CSF"] as const).map((fw) => (
            <button
              key={fw}
              onClick={() => setActiveFramework(fw)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${activeFramework === fw ? "bg-slate-700 text-white" : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}
            >
              {fw}
            </button>
          ))}
          <input
            type="text"
            placeholder="Cari nama atau control ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs text-slate-600 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none"
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">{filtered.length} evidence items</p>

      {/* ── Cards ── */}
      <div className="mt-4 space-y-4">
        {filtered.map((e) => {
          const isOpen = expanded[e.id];
          return (
            <div key={e.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${CAT_COLOR[e.category]}`}>
                        {CAT_ICON[e.category]} {e.category}
                      </span>
                      {e.frameworks.map((fw) => (
                        <span key={fw} className={`rounded-full px-2 py-0.5 text-xs font-medium ${FRAMEWORK_COLOR[fw]}`}>
                          {fw}
                        </span>
                      ))}
                      <span className="font-mono text-xs text-slate-400">{e.controlRef}</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-800">{e.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{e.description}</p>
                  </div>
                  <button
                    onClick={() => setExpanded((prev) => ({ ...prev, [e.id]: !prev[e.id] }))}
                    className="shrink-0 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                  >
                    {isOpen ? "Tutup ▲" : "Lihat Detail ▼"}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-slate-100 p-5 space-y-5 bg-slate-50">
                  {/* What to look for */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">✅ Yang harus dicari</p>
                    <ul className="space-y-1.5">
                      {e.whatToLookFor.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-slate-700">
                          <span className="text-green-500 shrink-0">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Red flags */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">🚩 Red Flags (potential findings)</p>
                    <ul className="space-y-1.5">
                      {e.redFlags.map((flag, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-red-700">
                          <span className="text-red-400 shrink-0">•</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* How to request */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">📧 Cara Minta ke Auditee</p>
                    <div className="rounded-xl bg-white border border-slate-200 p-4 text-sm text-slate-700 italic">
                      {e.howToRequest}
                    </div>
                  </div>

                  {/* Example */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">💡 Contoh Evidence yang Baik</p>
                    <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 text-sm text-indigo-800">
                      {e.example}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
            Tidak ada evidence yang cocok dengan filter ini.
          </div>
        )}
      </div>
    </KnowledgeShell>
  );
}
