"use client";

import { useState, useMemo } from "react";
import KnowledgeShell from "@/components/KnowledgeShell";
import HowToUse from "@/components/HowToUse";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type Category =
  | "Frameworks"
  | "Risk & Controls"
  | "Evidence & Reporting"
  | "Audit Process"
  | "Behavioral"
  | "Technical";

type Question = {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  answer: string;
  tip?: string;
  keywords: string[];
};

const QUESTIONS: Question[] = [
  // ── FRAMEWORKS ──
  {
    id: "F01",
    category: "Frameworks",
    difficulty: "Beginner",
    question: "What is ISO 27001 and why is it important for IT auditors?",
    answer:
      "ISO 27001 is an international standard for Information Security Management Systems (ISMS). It provides a systematic framework for managing sensitive information through people, processes, and technology. For IT auditors, it's important because it defines control requirements that can be audited — organizations seeking certification must demonstrate their ISMS is implemented, maintained, and continually improved. Auditors verify that the organization has implemented Annex A controls appropriate to their risk profile.",
    tip: "Always distinguish: ISO 27001 = certifiable standard (the ISMS requirements). ISO 27002 = guidance on how to implement the controls.",
    keywords: ["ISMS", "Annex A", "certification", "risk-based"],
  },
  {
    id: "F02",
    category: "Frameworks",
    difficulty: "Beginner",
    question: "What is the difference between ISO 27001 and ISO 27002?",
    answer:
      "ISO 27001 is the certifiable standard — it defines what an organization MUST do to establish and maintain an ISMS. It is audited for certification. ISO 27002 is the code of practice — it provides guidance on HOW to implement the controls listed in ISO 27001 Annex A. Organizations cannot certify against ISO 27002 alone. In audits, 27001 drives the scope and 27002 informs the implementation testing.",
    tip: "Common interview trick question. Answer: 27001 = the 'what' (requirements), 27002 = the 'how' (guidance).",
    keywords: ["certifiable", "guidance", "Annex A", "implementation"],
  },
  {
    id: "F03",
    category: "Frameworks",
    difficulty: "Beginner",
    question: "Explain the 5 functions of the NIST Cybersecurity Framework.",
    answer:
      "NIST CSF organizes cybersecurity activities into 5 functions: (1) Identify — understand assets, business context, and risk; (2) Protect — implement safeguards for critical services; (3) Detect — develop capabilities to identify security events; (4) Respond — take action on detected incidents; (5) Recover — restore capabilities after an incident. Together they cover the full security lifecycle. Auditors use these to assess organizational maturity across each function.",
    tip: "Remember the order: ID → PR → DE → RS → RC. Each has categories and subcategories that map to specific controls.",
    keywords: ["Identify", "Protect", "Detect", "Respond", "Recover", "maturity"],
  },
  {
    id: "F04",
    category: "Frameworks",
    difficulty: "Intermediate",
    question: "What is SOC 2 and who is it relevant for?",
    answer:
      "SOC 2 (System and Organization Controls 2) is an audit standard developed by AICPA for service organizations. It evaluates controls related to the 5 Trust Service Criteria: Security (CC — Common Criteria), Availability, Processing Integrity, Confidentiality, and Privacy. It's most relevant for SaaS companies, cloud providers, and any organization that handles customer data. Clients and their auditors use SOC 2 Type II reports to verify that a vendor's controls are operating effectively over time (minimum 6 months).",
    tip: "Type I = design of controls at a point in time. Type II = operating effectiveness over a period. Type II is far more valuable.",
    keywords: ["AICPA", "Trust Service Criteria", "Type I", "Type II", "service organizations"],
  },
  {
    id: "F05",
    category: "Frameworks",
    difficulty: "Advanced",
    question: "How would you map NIST CSF to ISO 27001 controls in a dual-framework audit?",
    answer:
      "The NIST CSF and ISO 27001 have significant overlap. For mapping: use the NIST Cybersecurity Framework to ISO/IEC 27001:2013 mapping document (available from NIST). Key mappings: Identify/Asset Management → A.8; Protect/Access Control → A.9; Detect/Anomalies → A.12; Respond/Incident Management → A.16; Recover/Recovery Planning → A.17. In a dual-framework audit, test evidence once and map it to both frameworks — this reduces auditee burden and is efficient for organizations pursuing multiple certifications.",
    tip: "Demonstrate added value: dual-mapping reduces audit fatigue for the auditee. Mention the NIST→ISO mapping document specifically.",
    keywords: ["mapping", "dual-framework", "evidence reuse", "overlap"],
  },
  {
    id: "F06",
    category: "Frameworks",
    difficulty: "Intermediate",
    question: "What is COBIT and when would an IT auditor use it?",
    answer:
      "COBIT (Control Objectives for Information and Related Technologies) is a framework developed by ISACA for IT governance and management. Unlike ISO 27001 which focuses on information security, COBIT covers the full IT governance spectrum — strategy, value delivery, resource optimization, risk management, and performance measurement. IT auditors use COBIT when auditing IT governance maturity, board-level IT oversight, or when assessing whether IT is aligned with business objectives. It's commonly used in financial sector audits and Sarbanes-Oxley (SOX) compliance reviews.",
    tip: "COBIT 2019 replaced COBIT 5. ISACA certified professionals (CISA, CGEIT) frequently reference it. Know that it complements rather than replaces ISO 27001.",
    keywords: ["ISACA", "governance", "SOX", "maturity", "IT alignment"],
  },

  // ── RISK & CONTROLS ──
  {
    id: "R01",
    category: "Risk & Controls",
    difficulty: "Beginner",
    question: "What is the difference between inherent risk and residual risk?",
    answer:
      "Inherent risk is the level of risk that exists BEFORE any controls are applied — the raw exposure to a threat given the organization's context. Residual risk is the risk that REMAINS after controls have been implemented. The relationship is: Inherent Risk − Control Effectiveness = Residual Risk. Auditors assess both: inherent risk drives scope prioritization, residual risk determines whether the organization's control environment is adequate to meet its risk appetite.",
    tip: "Most orgs aim for residual risk to fall within risk tolerance. If controls are inadequate, residual risk remains above tolerance — that's a finding.",
    keywords: ["inherent", "residual", "control effectiveness", "risk appetite"],
  },
  {
    id: "R02",
    category: "Risk & Controls",
    difficulty: "Beginner",
    question: "What are the three types of controls? Give examples.",
    answer:
      "Controls are classified by their purpose: (1) Preventive — stop incidents from occurring (e.g., MFA, access control policies, firewalls, encryption); (2) Detective — identify incidents that have occurred (e.g., IDS/SIEM alerts, log monitoring, access reviews, audit logs); (3) Corrective — respond to and fix incidents after detection (e.g., patch management, incident response procedures, backup restoration). A strong control environment layers all three — prevention first, then detection, then correction.",
    tip: "Some frameworks add 'Deterrent' (warning signs, policies) and 'Compensating' (alternative controls when primary can't be implemented). Know these exist.",
    keywords: ["preventive", "detective", "corrective", "compensating", "layered"],
  },
  {
    id: "R03",
    category: "Risk & Controls",
    difficulty: "Intermediate",
    question: "How do you calculate a risk score, and what do you do with it?",
    answer:
      "The most common method is Likelihood × Impact on a consistent scale (e.g., 1–5 each, giving a max of 25). Likelihood = probability the threat occurs given current vulnerabilities. Impact = business consequence if it does. The resulting score determines risk rating — Critical (≥15), High (10–14), Medium (5–9), Low (<5). Risk scores drive prioritization: Critical/High risks get immediate remediation attention; Medium risks go into a risk treatment plan with a timeline; Low risks may be accepted. Auditors verify that risk scores are defensible and that treatments are appropriate to the rating.",
    tip: "In practice, also consider control effectiveness in your scoring. A high likelihood threat with strong controls in place may have lower inherent-to-residual delta.",
    keywords: ["likelihood", "impact", "risk rating", "prioritization", "treatment"],
  },
  {
    id: "R04",
    category: "Risk & Controls",
    difficulty: "Intermediate",
    question: "What is risk appetite vs risk tolerance?",
    answer:
      "Risk appetite is the broad-level amount and type of risk an organization is willing to pursue or accept in the pursuit of its objectives — a strategic, qualitative statement (e.g., 'We have zero appetite for regulatory non-compliance'). Risk tolerance is the acceptable variation around risk appetite — the quantitative threshold before escalation is required (e.g., 'No more than 3 critical vulnerabilities may remain unpatched for more than 30 days'). Auditors compare residual risks against the organization's stated tolerance thresholds to identify where the organization exceeds its own acceptable risk levels.",
    tip: "If the organization can't articulate their risk appetite/tolerance, that itself is an audit finding under governance controls.",
    keywords: ["appetite", "tolerance", "threshold", "governance", "escalation"],
  },
  {
    id: "R05",
    category: "Risk & Controls",
    difficulty: "Advanced",
    question: "What is a compensating control and when is it acceptable?",
    answer:
      "A compensating control is an alternative security measure used when the primary control cannot be implemented due to technical, operational, or business constraints. It must provide equivalent or greater protection than the original control it replaces. Compensating controls are acceptable when: (1) There is a documented and justified reason the primary control can't be implemented; (2) The compensating control addresses the same risk and achieves the same objective; (3) It is formally approved by management and documented in the risk register. PCI DSS explicitly defines a formal compensating control worksheet. In ISO 27001 audits, the Statement of Applicability must document any controls excluded and justify them.",
    tip: "The key test: does the compensating control address the same risk objective? If not, it's not truly compensating — it's just an excuse.",
    keywords: ["compensating", "SOA", "Statement of Applicability", "PCI DSS", "equivalent protection"],
  },

  // ── EVIDENCE & REPORTING ──
  {
    id: "E01",
    category: "Evidence & Reporting",
    difficulty: "Beginner",
    question: "What types of audit evidence exist?",
    answer:
      "Audit evidence types include: (1) Documentary — policies, procedures, contracts, logs, reports, screenshots; (2) Physical — observation of physical controls (server room access, clean desk); (3) Testimonial — interviews and written confirmations from staff; (4) Analytical — results from auditor's analysis of data (e.g., user access review, log analysis); (5) Confirmatory — third-party confirmations (external scan reports, vendor SOC 2 reports). The strongest evidence combines multiple types — e.g., policy + configuration screenshot + log showing it's enforced.",
    tip: "IAASB (International Auditing Standards) ranks evidence by reliability: auditor-obtained > external > internal > verbal. Always try to obtain the strongest form available.",
    keywords: ["documentary", "physical", "testimonial", "analytical", "sufficiency"],
  },
  {
    id: "E02",
    category: "Evidence & Reporting",
    difficulty: "Beginner",
    question: "What makes audit evidence 'sufficient and appropriate'?",
    answer:
      "These are the two core quality dimensions from auditing standards. Sufficient = enough quantity — the amount of evidence needed to support the audit conclusion (driven by risk level; higher risk = more evidence needed). Appropriate = the right quality — evidence must be relevant (addresses the control being tested), reliable (from a credible source), and timely (covers the audit period). For example, a policy document alone is sufficient evidence that a policy exists but not that it's being followed — you'd need logs or test results to demonstrate operating effectiveness.",
    tip: "Always ask: 'Does this evidence prove the control is operating effectively, or just that it exists?' Design vs operating effectiveness is the key distinction.",
    keywords: ["sufficient", "appropriate", "relevant", "reliable", "operating effectiveness"],
  },
  {
    id: "E03",
    category: "Evidence & Reporting",
    difficulty: "Intermediate",
    question: "How do you write an audit finding?",
    answer:
      "A well-structured audit finding has 4 components: (1) Condition — what the auditor observed (the 'what is'); (2) Criteria — what the standard, policy, or requirement says should be (the 'what should be'); (3) Cause — why the gap exists (root cause, not symptom); (4) Effect/Risk — the business impact or risk if the gap is not addressed. Optionally add: Recommendation — what management should do. This structure (4Cs or 5Cs) is used consistently in Big4 and internal audit practice because it forces the auditor to prove the gap with evidence and connect it to business risk.",
    tip: "Avoid vague findings like 'controls are inadequate.' Always state the specific condition, cite the specific criteria violated, and quantify the risk where possible.",
    keywords: ["condition", "criteria", "cause", "effect", "recommendation", "4Cs"],
  },
  {
    id: "E04",
    category: "Evidence & Reporting",
    difficulty: "Intermediate",
    question: "What is the difference between a finding and an observation in an audit report?",
    answer:
      "A finding is a material gap where a required control is missing, ineffective, or not operating as intended — it requires management response and remediation with a target date. An observation (or 'advisory') is a noted risk or improvement opportunity that doesn't rise to the level of a control deficiency — the control technically works but could be strengthened. The distinction matters for stakeholder communication: findings escalate to senior management and trigger formal remediation plans; observations are lower-priority improvements. Auditors must be consistent in how they classify across engagements.",
    tip: "Some organizations differentiate further: Exception (clear control failure) > Finding (notable gap) > Observation (improvement opportunity). Know the client's terminology.",
    keywords: ["finding", "observation", "materiality", "management response", "remediation"],
  },
  {
    id: "E05",
    category: "Evidence & Reporting",
    difficulty: "Advanced",
    question: "What is an audit opinion and what are the types?",
    answer:
      "An audit opinion is the auditor's formal conclusion on whether the subject matter (controls, financial statements, ISMS) meets the stated criteria. For IT/security audits: (1) Unqualified (Clean) — controls are effective, no material weaknesses; (2) Qualified — controls are generally effective but specific material exceptions were noted; (3) Adverse — controls are fundamentally flawed or the ISMS is not operating effectively; (4) Disclaimer — the auditor was unable to obtain sufficient evidence to form an opinion. For ISO 27001 certification audits, it's a pass/fail recommendation to the certification body. For SOC 2, it's an opinion on whether controls were suitably designed and operating effectively.",
    tip: "In practice, most IT audits result in Qualified opinions with findings — a Clean opinion means either the organization is exceptional or the audit wasn't rigorous enough.",
    keywords: ["unqualified", "qualified", "adverse", "disclaimer", "material weakness"],
  },

  // ── AUDIT PROCESS ──
  {
    id: "A01",
    category: "Audit Process",
    difficulty: "Beginner",
    question: "What are the phases of an IT audit?",
    answer:
      "A standard IT audit follows 5 phases: (1) Planning — define scope, objectives, team, timeline, audit methodology, and preliminary risk assessment; (2) Fieldwork — execute audit procedures: document review, interviews, control testing, evidence collection; (3) Analysis — evaluate evidence against criteria, identify gaps, classify findings; (4) Reporting — draft audit report with findings, ratings, recommendations, and management responses; (5) Follow-up — verify that management has remediated findings within agreed timelines. Some frameworks add a 'kick-off meeting' phase and a 'closing meeting' before the report is finalized.",
    tip: "Planning is the most important phase — a poorly scoped audit wastes everyone's time and misses the highest-risk areas.",
    keywords: ["planning", "fieldwork", "analysis", "reporting", "follow-up"],
  },
  {
    id: "A02",
    category: "Audit Process",
    difficulty: "Intermediate",
    question: "What is a risk-based audit approach and why is it preferred?",
    answer:
      "A risk-based audit approach prioritizes audit effort on areas of highest risk to the organization — rather than checking every control equally, auditors focus time and resources where potential impact is greatest. This is preferred because: (1) Resources are finite — risk-based approach maximizes coverage of critical areas; (2) It aligns with how management thinks about risk; (3) It produces more actionable findings than checklist-driven audits; (4) It's required by most professional standards (IIA, ISACA). In practice: start with a risk assessment to identify high-risk domains → design audit procedures focused there → apply lower effort to low-risk areas.",
    tip: "A purely compliance-based audit (checking every box equally) can miss critical emerging risks. Always ask: 'Where could something really go wrong?'",
    keywords: ["risk-based", "prioritization", "IIA", "materiality", "resource allocation"],
  },
  {
    id: "A03",
    category: "Audit Process",
    difficulty: "Intermediate",
    question: "What is a Statement of Applicability (SoA) in ISO 27001?",
    answer:
      "The Statement of Applicability (SoA) is a mandatory document in ISO 27001 that lists ALL Annex A controls and for each one states: (1) whether it is applicable or excluded; (2) the justification for inclusion or exclusion; (3) the implementation status. For excluded controls, the organization must justify why the associated risk is acceptable without it. The SoA is central to ISO 27001 audits — certification auditors review it to ensure the organization hasn't arbitrarily excluded controls without justification. It's also the auditor's roadmap for deciding which controls to test.",
    tip: "You cannot exclude a control just because it's hard to implement. The exclusion must be justified by a risk assessment showing the associated risk is acceptable.",
    keywords: ["SoA", "Annex A", "exclusion", "justification", "certification"],
  },
  {
    id: "A04",
    category: "Audit Process",
    difficulty: "Advanced",
    question: "What is the difference between an internal audit and an external audit?",
    answer:
      "Internal audits are conducted by the organization's own audit function (or hired consultants acting as internal auditors). They report to the audit committee or senior management and focus on ongoing assurance, process improvement, and pre-certification readiness. External audits are conducted by independent third parties — either certification bodies (for ISO 27001), CPA firms (for SOC 2), or regulatory examiners. External auditors must maintain independence from the organization. For ISO 27001, internal audits are a mandatory requirement (Clause 9.2) before the external certification audit. For SOC 2, only a licensed CPA firm can issue a valid report.",
    tip: "Key difference: internal auditors serve management; external auditors serve stakeholders (customers, regulators, board). Independence is the distinguishing factor.",
    keywords: ["independence", "internal", "external", "certification body", "CPA", "assurance"],
  },

  // ── BEHAVIORAL ──
  {
    id: "B01",
    category: "Behavioral",
    difficulty: "Beginner",
    question: "Why are you transitioning from cybersecurity engineering to IT auditing?",
    answer:
      "Strong answer structure: (1) Connect — explain how your engineering background gives you technical depth that auditors often lack; (2) Motivate — you want to have strategic impact beyond individual systems, influencing governance and risk management at an organizational level; (3) Add value — your hands-on security experience means you can see through surface-level compliance theater and identify real technical risks; (4) Vision — IT auditing aligns with your interest in combining technical rigor with business impact and stakeholder communication. Be authentic — reference specific experiences where you saw the audit side of security and found it compelling.",
    tip: "Interviewers love this transition story because hands-on security engineers make excellent auditors — they know what attackers actually do. Own this as a strength, not a pivot.",
    keywords: ["transition", "technical depth", "strategic impact", "governance", "authenticity"],
  },
  {
    id: "B02",
    category: "Behavioral",
    difficulty: "Intermediate",
    question: "Tell me about a time you identified a security gap. How did you handle it?",
    answer:
      "Use the STAR format: Situation — describe the context (project, team, system); Task — what you were responsible for; Action — specifically what you did to identify and address the gap (technical analysis, stakeholder communication, remediation recommendation); Result — measurable outcome (risk reduced, control implemented, incident prevented). From your cybersecurity engineering background, you likely have real examples. Key points interviewers look for: did you communicate the risk in business terms? Did you follow a process (not just fix it unilaterally)? Did you document it?",
    tip: "Auditors care about process and communication as much as the technical finding. Show that you escalated, documented, and tracked the issue — not just fixed it silently.",
    keywords: ["STAR", "documentation", "escalation", "risk communication", "process"],
  },
  {
    id: "B03",
    category: "Behavioral",
    difficulty: "Intermediate",
    question: "How do you handle pushback from an auditee who disagrees with your finding?",
    answer:
      "Professional approach: (1) Stay objective — separate the evidence from the person; (2) Acknowledge their perspective — ask them to present additional evidence or context that supports their position; (3) Re-evaluate — if they provide valid evidence that changes the picture, update your finding accordingly (intellectual honesty is respected); (4) Escalate appropriately — if the disagreement can't be resolved at the working level, escalate to management on both sides; (5) Document everything — record the disagreement and management's response in the audit file. Never cave to pressure without evidence. Your credibility depends on the defensibility of your findings.",
    tip: "The worst thing you can do is remove a finding because someone was upset. The second worst is doubling down without being open to new evidence. Stay professional and evidence-based.",
    keywords: ["pushback", "evidence-based", "escalation", "intellectual honesty", "independence"],
  },
  {
    id: "B04",
    category: "Behavioral",
    difficulty: "Advanced",
    question: "How do you explain a technical security finding to a non-technical executive?",
    answer:
      "Key principles: (1) Lead with business impact, not technical detail — 'This vulnerability could result in customer data exposure and regulatory fines' not 'The TLS certificate uses SHA-1'; (2) Use analogies they recognize — compare server access controls to building key card access; (3) Quantify where possible — 'If this is exploited, remediation and regulatory notification could cost $X'; (4) Give clear, actionable recommendations without jargon; (5) Be brief — executives want the 'so what' in 2 minutes. Technical depth belongs in the appendix of the report, not the executive summary.",
    tip: "Practice the 'elevator test': can you explain the finding and its business impact in 60 seconds to someone who doesn't know what a firewall is? If not, simplify.",
    keywords: ["executive communication", "business impact", "non-technical", "translation", "clarity"],
  },
  {
    id: "B05",
    category: "Behavioral",
    difficulty: "Beginner",
    question: "What does professional skepticism mean to you as an auditor?",
    answer:
      "Professional skepticism means maintaining a questioning mind and critically assessing audit evidence rather than accepting it at face value. In practice: (1) Don't assume management is telling the truth — corroborate verbal statements with documented evidence; (2) Question whether the evidence you received is complete — ask 'what am I not seeing?'; (3) Be alert to unusual patterns that might indicate error or fraud; (4) Don't let a good relationship with the auditee compromise your objectivity. Professional skepticism doesn't mean being adversarial — it means being rigorously independent. It's what separates a real audit from a rubber stamp.",
    tip: "Two modes of skepticism: 'neutral' (no assumption of fraud but questions everything) vs 'presumptive' (assumes possibility of manipulation). Internal audits are usually neutral; fraud investigations lean presumptive.",
    keywords: ["skepticism", "independence", "objectivity", "corroboration", "questioning"],
  },

  // ── TECHNICAL ──
  {
    id: "T01",
    category: "Technical",
    difficulty: "Beginner",
    question: "What is the CIA Triad and how does it apply in IT audits?",
    answer:
      "The CIA Triad is the foundational model for information security: (1) Confidentiality — information is accessible only to those authorized (controls: encryption, access control, DLP); (2) Integrity — information is accurate and complete, protected from unauthorized modification (controls: checksums, digital signatures, change management); (3) Availability — information is accessible when needed by authorized users (controls: redundancy, backups, disaster recovery). IT auditors use CIA as a lens for every control they test — for each control, ask: which CIA property does it protect, and what evidence proves it's effective?",
    tip: "Some frameworks add 'Non-repudiation' (proof that an action was taken by a specific party) and 'Authenticity.' For CISA exam, know the extended model.",
    keywords: ["confidentiality", "integrity", "availability", "control mapping"],
  },
  {
    id: "T02",
    category: "Technical",
    difficulty: "Intermediate",
    question: "What is privileged access management (PAM) and why is it critical to audit?",
    answer:
      "Privileged Access Management (PAM) refers to the processes and technologies used to control, monitor, and audit access by privileged accounts (admins, root users, service accounts). These accounts have elevated access and represent high-value targets for attackers. In audits, PAM is critical because: privileged account abuse is one of the most common attack vectors in breaches; ISO 27001 A.9.2.3 specifically requires controlling privileged access; SOC 2 CC6 focuses on logical access. Key audit tests: review list of privileged users and justifications; check for shared admin accounts; verify MFA enforcement on privileged accounts; review logs for anomalous privileged activity.",
    tip: "Ask to see the 'break-glass' account policy — emergency admin accounts with no accountability are a common critical finding.",
    keywords: ["PAM", "privileged accounts", "A.9.2.3", "least privilege", "monitoring"],
  },
  {
    id: "T03",
    category: "Technical",
    difficulty: "Intermediate",
    question: "How do you audit a patch management process?",
    answer:
      "Patch management audit typically tests: (1) Policy — does a written patch management policy exist with defined SLAs (e.g., critical patches within 24h)? (2) Inventory — does the organization know all its assets that need patching? (3) Scanning — are vulnerability scans conducted regularly (monthly minimum, weekly for critical systems)? (4) Prioritization — are patches prioritized by CVSS score or business risk? (5) Testing — is there a process to test patches before production deployment? (6) Deployment tracking — is there evidence patches were applied? (7) Exception management — are unpatched systems documented with risk acceptance? Evidence to request: scan reports, patch deployment logs, exception register.",
    tip: "Ask for the 'mean time to patch' (MTTP) metric for critical vulnerabilities. If they don't track it, that's a finding. Benchmark: CISA says critical vulns should be patched within 15 days.",
    keywords: ["patch", "vulnerability", "CVSS", "SLA", "exception management", "MTTP"],
  },
  {
    id: "T04",
    category: "Technical",
    difficulty: "Advanced",
    question: "What is a user access review (UAR) and how do you audit one?",
    answer:
      "A User Access Review (UAR) is a periodic process where managers verify that their team members' access rights are still appropriate and necessary — a key control for enforcing least privilege. To audit a UAR: (1) Verify it occurs at the required frequency (typically quarterly for privileged, semi-annual for standard); (2) Confirm the review is performed by access owners/managers, not IT (IT shouldn't self-certify); (3) Check that revocations are actioned within SLA (e.g., 5 business days); (4) Look for 'rubber stamp' reviews where all access is approved without evidence of actual review; (5) Test a sample: pick 10 users, verify their current access matches their role, look for terminated employees or role-changed employees with lingering access.",
    tip: "The most common finding: access reviews happen on paper but terminated employees still have active accounts. Always run a joiner-mover-leaver test by comparing HR termination list against active directory.",
    keywords: ["UAR", "least privilege", "joiner-mover-leaver", "manager certification", "frequency"],
  },
  {
    id: "T05",
    category: "Technical",
    difficulty: "Advanced",
    question: "What would you look for when auditing cloud security on AWS?",
    answer:
      "Key areas for AWS security audit: (1) IAM — are root account MFA enabled? No long-term access keys for humans? Least privilege roles? (2) Logging — is CloudTrail enabled in all regions? Are logs shipped to a separate immutable account? (3) Network — are security groups following least-privilege inbound rules? No 0.0.0.0/0 on port 22/3389? (4) Data — are S3 buckets private by default? Is S3 Block Public Access enabled at org level? Is encryption enabled on RDS and EBS? (5) Config — is AWS Config enabled to detect drift? (6) GuardDuty — is threat detection enabled? (7) Backup — is there a backup policy covering critical data? Evidence: AWS Config rules report, IAM credential report, CloudTrail logs.",
    tip: "The IAM credential report in AWS is the fastest way to identify security hygiene issues — it shows MFA status, key rotation, root account usage in one CSV.",
    keywords: ["IAM", "CloudTrail", "S3", "GuardDuty", "Config", "least privilege", "encryption"],
  },
];

const CATEGORIES: Category[] = [
  "Frameworks",
  "Risk & Controls",
  "Evidence & Reporting",
  "Audit Process",
  "Behavioral",
  "Technical",
];

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Beginner: "bg-green-100 text-green-700 border-green-200",
  Intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Advanced: "bg-red-100 text-red-700 border-red-200",
};

const CAT_ICON: Record<Category, string> = {
  Frameworks: "📋",
  "Risk & Controls": "⚠️",
  "Evidence & Reporting": "📄",
  "Audit Process": "🔄",
  Behavioral: "🎤",
  Technical: "💻",
};

export default function InterviewLab() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | "All">("All");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [known, setKnown] = useState<Record<string, boolean>>({});
  const [reviewMode, setReviewMode] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return QUESTIONS.filter((q) => {
      if (activeCategory !== "All" && q.category !== activeCategory) return false;
      if (activeDifficulty !== "All" && q.difficulty !== activeDifficulty) return false;
      if (reviewMode && known[q.id]) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          q.question.toLowerCase().includes(s) ||
          q.keywords.some((k) => k.toLowerCase().includes(s))
        );
      }
      return true;
    });
  }, [activeCategory, activeDifficulty, revealed, known, reviewMode, search]);

  const knownCount = Object.values(known).filter(Boolean).length;
  const progress = Math.round((knownCount / QUESTIONS.length) * 100);

  function toggleReveal(id: string) {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleKnown(id: string) {
    setKnown((prev) => ({ ...prev, [id]: !prev[id] }));
    setRevealed((prev) => ({ ...prev, [id]: false }));
  }

  return (
    <KnowledgeShell
      title="Interview Lab"
      subtitle="Latih jawaban interview IT auditor dengan flashcard Q&A — dari framework sampai behavioral."
      titleClassName="text-4xl"
    >
      <HowToUse
        what="Kumpulan pertanyaan interview IT auditor dengan jawaban terstruktur. Tersedia 30+ pertanyaan di 6 kategori: Frameworks, Risk & Controls, Evidence, Audit Process, Behavioral, dan Technical."
        when={[
          "Persiapan wawancara kerja IT auditor / GRC / risk management",
          "Ingin hafal konsep audit dengan cara yang lebih efektif dari baca buku",
          "Mau tau apa yang sering ditanyain interviewer Big4 atau internal audit",
          "Review konsep sebelum ujian CISA / ISO 27001 Lead Auditor",
        ]}
        how={[
          "Pilih kategori dan tingkat kesulitan yang ingin dilatih",
          "Baca pertanyaan → coba jawab sendiri dulu → klik 'Tampilkan Jawaban'",
          "Kalau sudah paham klik '✓ Sudah Tahu' untuk tandai dan skip di session berikutnya",
          "Aktifkan 'Review Mode' untuk fokus di soal yang belum dikuasai",
        ]}
      />

      {/* ── Progress ── */}
      <div className="mt-8 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Progress: <span className="text-indigo-600">{knownCount}/{QUESTIONS.length}</span> pertanyaan dikuasai
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Tandai "Sudah Tahu" di tiap kartu untuk track progress</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setReviewMode((p) => !p)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${reviewMode ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              {reviewMode ? "✓ Review Mode ON" : "Review Mode"}
            </button>
            <button
              onClick={() => { setRevealed({}); setKnown({}); }}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-indigo-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="mt-5 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("All")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${activeCategory === "All" ? "bg-slate-800 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
          >
            All ({QUESTIONS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${activeCategory === cat ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              {CAT_ICON[cat]} {cat} ({QUESTIONS.filter((q) => q.category === cat).length})
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setActiveDifficulty(d)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                activeDifficulty === d
                  ? "bg-slate-700 text-white"
                  : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {d}
            </button>
          ))}
          <input
            type="text"
            placeholder="Cari keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs text-slate-600 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none"
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">{filtered.length} pertanyaan ditampilkan</p>

      {/* ── Question Cards ── */}
      <div className="mt-4 space-y-4">
        {filtered.map((q) => {
          const isRevealed = revealed[q.id];
          const isKnown = known[q.id];
          return (
            <div
              key={q.id}
              className={`rounded-2xl border bg-white shadow-sm transition-all ${
                isKnown
                  ? "border-green-200 opacity-70"
                  : isRevealed
                  ? "border-indigo-300 ring-1 ring-indigo-100"
                  : "border-slate-200"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">{q.id}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {CAT_ICON[q.category]} {q.category}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${DIFFICULTY_COLOR[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                    {isKnown && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
                        ✓ Dikuasai
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleKnown(q.id)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                        isKnown
                          ? "bg-green-500 text-white"
                          : "border border-green-200 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {isKnown ? "✓ Dikuasai" : "+ Sudah Tahu"}
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-base font-semibold text-slate-800">{q.question}</p>

                {!isRevealed && (
                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="mt-4 rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    Tampilkan Jawaban
                  </button>
                )}

                {isRevealed && (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl bg-indigo-50 p-4 text-sm leading-7 text-slate-700">
                      {q.answer}
                    </div>
                    {q.tip && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs font-semibold text-amber-700">💡 Pro Tip</p>
                        <p className="mt-1 text-xs leading-5 text-amber-800">{q.tip}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {q.keywords.map((k) => (
                        <span key={k} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                          {k}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => toggleReveal(q.id)}
                      className="text-xs text-slate-400 underline hover:text-slate-600"
                    >
                      Sembunyikan jawaban
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
            Tidak ada pertanyaan yang cocok dengan filter ini.
          </div>
        )}
      </div>
    </KnowledgeShell>
  );
}
