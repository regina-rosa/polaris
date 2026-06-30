"use client";

import { useState, useMemo } from "react";
import KnowledgeShell from "@/components/KnowledgeShell";
import HowToUse from "@/components/HowToUse";

type CheckItem = {
  id: string;
  control: string;
  description: string;
  checked: boolean;
};

type Domain = {
  name: string;
  items: CheckItem[];
};

type Framework = {
  id: string;
  label: string;
  domains: Domain[];
};

// ─── ISO 27001:2013 — all 114 Annex A controls ────────────────────────────
const iso27001Domains: Domain[] = [
  {
    name: "A.5 — Information Security Policies",
    items: [
      { id: "a5.1.1", control: "A.5.1.1", description: "Policies for information security are defined, approved by management, published, and communicated to all employees and relevant external parties.", checked: false },
      { id: "a5.1.2", control: "A.5.1.2", description: "Policies are reviewed at planned intervals or when significant changes occur to ensure continuing suitability, adequacy, and effectiveness.", checked: false },
    ],
  },
  {
    name: "A.6 — Organization of Information Security",
    items: [
      { id: "a6.1.1", control: "A.6.1.1", description: "Information security roles and responsibilities are defined and allocated.", checked: false },
      { id: "a6.1.2", control: "A.6.1.2", description: "Conflicting duties and areas of responsibility are segregated to reduce opportunities for unauthorized or unintentional modification.", checked: false },
      { id: "a6.1.3", control: "A.6.1.3", description: "Appropriate contacts with relevant authorities (law enforcement, regulators) are maintained.", checked: false },
      { id: "a6.1.4", control: "A.6.1.4", description: "Appropriate contacts with special interest groups, security forums, and professional associations are maintained.", checked: false },
      { id: "a6.1.5", control: "A.6.1.5", description: "Information security is addressed in project management regardless of the type of the project.", checked: false },
      { id: "a6.2.1", control: "A.6.2.1", description: "A policy and supporting security measures are adopted to manage the risks introduced by using mobile devices.", checked: false },
      { id: "a6.2.2", control: "A.6.2.2", description: "A policy and supporting security measures are implemented to protect information accessed, processed, or stored at teleworking sites.", checked: false },
    ],
  },
  {
    name: "A.7 — Human Resource Security",
    items: [
      { id: "a7.1.1", control: "A.7.1.1", description: "Background verification checks on all candidates for employment are carried out in accordance with relevant laws, regulations, and ethics.", checked: false },
      { id: "a7.1.2", control: "A.7.1.2", description: "Contractual agreements with employees and contractors state their and the organization's responsibilities for information security.", checked: false },
      { id: "a7.2.1", control: "A.7.2.1", description: "Management requires all employees and contractors to apply information security in accordance with the organization's policies.", checked: false },
      { id: "a7.2.2", control: "A.7.2.2", description: "All employees and, where relevant, contractors receive appropriate awareness education and training in information security.", checked: false },
      { id: "a7.2.3", control: "A.7.2.3", description: "A formal and communicated disciplinary process exists to take action against employees who have committed an information security breach.", checked: false },
      { id: "a7.3.1", control: "A.7.3.1", description: "Information security responsibilities and duties that remain valid after termination or change of employment are defined, communicated, and enforced.", checked: false },
    ],
  },
  {
    name: "A.8 — Asset Management",
    items: [
      { id: "a8.1.1", control: "A.8.1.1", description: "Assets associated with information and information processing facilities are identified and an inventory is drawn up and maintained.", checked: false },
      { id: "a8.1.2", control: "A.8.1.2", description: "Assets maintained in the inventory have an assigned owner.", checked: false },
      { id: "a8.1.3", control: "A.8.1.3", description: "Rules for acceptable use of information and assets are identified, documented, and implemented.", checked: false },
      { id: "a8.1.4", control: "A.8.1.4", description: "All employees and external party users return all organizational assets upon termination of employment, contract, or agreement.", checked: false },
      { id: "a8.2.1", control: "A.8.2.1", description: "Information is classified in terms of legal requirements, value, criticality, and sensitivity to unauthorized disclosure or modification.", checked: false },
      { id: "a8.2.2", control: "A.8.2.2", description: "An appropriate set of procedures for information labelling is developed and implemented in accordance with the information classification scheme.", checked: false },
      { id: "a8.2.3", control: "A.8.2.3", description: "Procedures for handling assets are developed and implemented in accordance with the information classification scheme.", checked: false },
      { id: "a8.3.1", control: "A.8.3.1", description: "Procedures are implemented for the management of removable media in accordance with the classification scheme.", checked: false },
      { id: "a8.3.2", control: "A.8.3.2", description: "Media is disposed of securely when no longer required, using formal procedures.", checked: false },
      { id: "a8.3.3", control: "A.8.3.3", description: "Media containing information is protected against unauthorized access, misuse, or corruption during transportation.", checked: false },
    ],
  },
  {
    name: "A.9 — Access Control",
    items: [
      { id: "a9.1.1", control: "A.9.1.1", description: "An access control policy is established, documented, and reviewed based on business and information security requirements.", checked: false },
      { id: "a9.1.2", control: "A.9.1.2", description: "Users are only provided access to the network and network services they have been authorized to use.", checked: false },
      { id: "a9.2.1", control: "A.9.2.1", description: "A formal user registration and de-registration process is implemented to enable assignment of access rights.", checked: false },
      { id: "a9.2.2", control: "A.9.2.2", description: "A formal user access provisioning process is implemented to assign or revoke access rights for all user types to all systems.", checked: false },
      { id: "a9.2.3", control: "A.9.2.3", description: "The allocation and use of privileged access rights is restricted and controlled.", checked: false },
      { id: "a9.2.4", control: "A.9.2.4", description: "The allocation of secret authentication information is controlled through a formal management process.", checked: false },
      { id: "a9.2.5", control: "A.9.2.5", description: "Asset owners review users' access rights at regular intervals.", checked: false },
      { id: "a9.2.6", control: "A.9.2.6", description: "Access rights of all employees and external party users to information and information processing facilities are removed upon termination.", checked: false },
      { id: "a9.3.1", control: "A.9.3.1", description: "Users are required to follow the organization's practices in the use of secret authentication information.", checked: false },
      { id: "a9.4.1", control: "A.9.4.1", description: "Access to information and application system functions is restricted in accordance with the access control policy.", checked: false },
      { id: "a9.4.2", control: "A.9.4.2", description: "Secure log-on procedures are implemented where required by the access control policy.", checked: false },
      { id: "a9.4.3", control: "A.9.4.3", description: "Password management systems are interactive and ensure quality passwords.", checked: false },
      { id: "a9.4.4", control: "A.9.4.4", description: "The use of utility programs that might override system and application controls is restricted and tightly controlled.", checked: false },
      { id: "a9.4.5", control: "A.9.4.5", description: "Access to program source code is restricted.", checked: false },
    ],
  },
  {
    name: "A.10 — Cryptography",
    items: [
      { id: "a10.1.1", control: "A.10.1.1", description: "A policy on the use of cryptographic controls for protection of information is developed and implemented.", checked: false },
      { id: "a10.1.2", control: "A.10.1.2", description: "A policy on the use, protection, and lifetime of cryptographic keys is developed and implemented through their whole lifecycle.", checked: false },
    ],
  },
  {
    name: "A.11 — Physical and Environmental Security",
    items: [
      { id: "a11.1.1", control: "A.11.1.1", description: "Security perimeters are defined and used to protect areas that contain either sensitive or critical information and processing facilities.", checked: false },
      { id: "a11.1.2", control: "A.11.1.2", description: "Secure areas are protected by appropriate entry controls to ensure only authorized personnel are allowed access.", checked: false },
      { id: "a11.1.3", control: "A.11.1.3", description: "Physical security for offices, rooms, and facilities is designed and applied.", checked: false },
      { id: "a11.1.4", control: "A.11.1.4", description: "Physical protection against natural disasters, malicious attack, or accidents is designed and applied.", checked: false },
      { id: "a11.1.5", control: "A.11.1.5", description: "Procedures for working in secure areas are designed and applied.", checked: false },
      { id: "a11.1.6", control: "A.11.1.6", description: "Access points such as delivery and loading areas and other points where unauthorized persons could enter are controlled.", checked: false },
      { id: "a11.2.1", control: "A.11.2.1", description: "Equipment is sited and protected to reduce risks from environmental threats and hazards, and unauthorized access.", checked: false },
      { id: "a11.2.2", control: "A.11.2.2", description: "Equipment is protected from power failures and other disruptions caused by failures in supporting utilities.", checked: false },
      { id: "a11.2.3", control: "A.11.2.3", description: "Power and telecommunications cabling carrying data or supporting information services is protected from interception or damage.", checked: false },
      { id: "a11.2.4", control: "A.11.2.4", description: "Equipment is correctly maintained to ensure its continued availability and integrity.", checked: false },
      { id: "a11.2.5", control: "A.11.2.5", description: "Equipment, information, or software is not taken off-site without prior authorization.", checked: false },
      { id: "a11.2.6", control: "A.11.2.6", description: "Security is applied to off-site assets taking into account the different risks of working outside the organization's premises.", checked: false },
      { id: "a11.2.7", control: "A.11.2.7", description: "All items of equipment containing storage media are verified to ensure that any sensitive data and licensed software has been removed prior to disposal.", checked: false },
      { id: "a11.2.8", control: "A.11.2.8", description: "Users ensure that unattended equipment has appropriate protection.", checked: false },
      { id: "a11.2.9", control: "A.11.2.9", description: "A clear desk policy for papers and removable storage media and a clear screen policy for information processing facilities is adopted.", checked: false },
    ],
  },
  {
    name: "A.12 — Operations Security",
    items: [
      { id: "a12.1.1", control: "A.12.1.1", description: "Operating procedures are documented and made available to all users who need them.", checked: false },
      { id: "a12.1.2", control: "A.12.1.2", description: "Changes to the organization, business processes, information processing facilities, and systems are controlled.", checked: false },
      { id: "a12.1.3", control: "A.12.1.3", description: "The use of resources is monitored, tuned, and projections made of future capacity requirements.", checked: false },
      { id: "a12.1.4", control: "A.12.1.4", description: "Development, testing, and operational environments are separated to reduce risks of unauthorized access or changes.", checked: false },
      { id: "a12.2.1", control: "A.12.2.1", description: "Detection, prevention, and recovery controls to protect against malware are implemented, combined with appropriate user awareness.", checked: false },
      { id: "a12.3.1", control: "A.12.3.1", description: "Backup copies of information, software, and system images are taken and tested regularly in accordance with an agreed backup policy.", checked: false },
      { id: "a12.4.1", control: "A.12.4.1", description: "Event logs recording user activities, exceptions, faults, and information security events are produced, kept, and regularly reviewed.", checked: false },
      { id: "a12.4.2", control: "A.12.4.2", description: "Logging facilities and log information are protected against tampering and unauthorized access.", checked: false },
      { id: "a12.4.3", control: "A.12.4.3", description: "System administrator and system operator activities are logged and the logs protected and regularly reviewed.", checked: false },
      { id: "a12.4.4", control: "A.12.4.4", description: "The clocks of all relevant information processing systems within an organization or security domain are synchronized to a single reference time source.", checked: false },
      { id: "a12.5.1", control: "A.12.5.1", description: "Procedures are implemented to control the installation of software on operational systems.", checked: false },
      { id: "a12.6.1", control: "A.12.6.1", description: "Information about technical vulnerabilities is obtained in a timely fashion, exposure evaluated, and appropriate measures taken.", checked: false },
      { id: "a12.6.2", control: "A.12.6.2", description: "Rules governing the installation of software by users are established and implemented.", checked: false },
      { id: "a12.7.1", control: "A.12.7.1", description: "Audit requirements and activities involving verification of operational systems are carefully planned and agreed to minimize disruptions.", checked: false },
    ],
  },
  {
    name: "A.13 — Communications Security",
    items: [
      { id: "a13.1.1", control: "A.13.1.1", description: "Networks are managed and controlled to protect information in systems and applications.", checked: false },
      { id: "a13.1.2", control: "A.13.1.2", description: "Security mechanisms, service levels, and management requirements of all network services are identified and included in agreements.", checked: false },
      { id: "a13.1.3", control: "A.13.1.3", description: "Groups of information services, users, and information systems are segregated on networks.", checked: false },
      { id: "a13.2.1", control: "A.13.2.1", description: "Formal transfer policies, procedures, and controls are in place to protect the transfer of information through the use of all types of facilities.", checked: false },
      { id: "a13.2.2", control: "A.13.2.2", description: "Agreements address the secure transfer of business information between the organization and external parties.", checked: false },
      { id: "a13.2.3", control: "A.13.2.3", description: "Information involved in electronic messaging is appropriately protected.", checked: false },
      { id: "a13.2.4", control: "A.13.2.4", description: "Requirements for confidentiality or non-disclosure agreements reflecting the organization's needs are identified and regularly reviewed.", checked: false },
    ],
  },
  {
    name: "A.14 — System Acquisition, Development and Maintenance",
    items: [
      { id: "a14.1.1", control: "A.14.1.1", description: "Information security related requirements are included in the requirements for new information systems or enhancements to existing systems.", checked: false },
      { id: "a14.1.2", control: "A.14.1.2", description: "Information involved in application services passing over public networks is protected from fraudulent activity, contract dispute, and unauthorized disclosure.", checked: false },
      { id: "a14.1.3", control: "A.14.1.3", description: "Information involved in application service transactions is protected to prevent incomplete transmission, mis-routing, unauthorized message alteration, and unauthorized disclosure.", checked: false },
      { id: "a14.2.1", control: "A.14.2.1", description: "Rules for the development of software and systems are established and applied to developments within the organization.", checked: false },
      { id: "a14.2.2", control: "A.14.2.2", description: "Changes to systems within the development lifecycle are controlled by the use of formal change control procedures.", checked: false },
      { id: "a14.2.3", control: "A.14.2.3", description: "When operating platforms are changed, business critical applications are reviewed and tested to ensure there is no adverse impact.", checked: false },
      { id: "a14.2.4", control: "A.14.2.4", description: "Modifications to software packages are discouraged, limited to necessary changes, and all changes are strictly controlled.", checked: false },
      { id: "a14.2.5", control: "A.14.2.5", description: "Principles for engineering secure systems are established, documented, maintained, and applied to any information system implementation.", checked: false },
      { id: "a14.2.6", control: "A.14.2.6", description: "Organizations establish and appropriately protect secure development environments for system development and integration efforts.", checked: false },
      { id: "a14.2.7", control: "A.14.2.7", description: "The organization supervises and monitors the activity of outsourced system development.", checked: false },
      { id: "a14.2.8", control: "A.14.2.8", description: "Testing of security functionality is carried out during development.", checked: false },
      { id: "a14.2.9", control: "A.14.2.9", description: "Acceptance testing programs and related criteria are established for new information systems, upgrades, and new versions.", checked: false },
      { id: "a14.3.1", control: "A.14.3.1", description: "Test data is selected carefully, protected, and controlled.", checked: false },
    ],
  },
  {
    name: "A.15 — Supplier Relationships",
    items: [
      { id: "a15.1.1", control: "A.15.1.1", description: "Information security requirements for mitigating the risks associated with supplier's access to the organization's assets are agreed and documented.", checked: false },
      { id: "a15.1.2", control: "A.15.1.2", description: "All relevant information security requirements are established and agreed with each supplier that may access, process, store, communicate, or provide IT infrastructure components.", checked: false },
      { id: "a15.1.3", control: "A.15.1.3", description: "Agreements with suppliers include requirements to address the information security risks associated with information and communications technology services.", checked: false },
      { id: "a15.2.1", control: "A.15.2.1", description: "Organizations regularly monitor, review, and audit supplier service delivery.", checked: false },
      { id: "a15.2.2", control: "A.15.2.2", description: "Changes to the provision of services by suppliers are managed, taking into account the criticality of business information and systems.", checked: false },
    ],
  },
  {
    name: "A.16 — Information Security Incident Management",
    items: [
      { id: "a16.1.1", control: "A.16.1.1", description: "Management responsibilities and procedures are established to ensure a quick, effective, and orderly response to information security incidents.", checked: false },
      { id: "a16.1.2", control: "A.16.1.2", description: "Information security events are reported through appropriate management channels as quickly as possible.", checked: false },
      { id: "a16.1.3", control: "A.16.1.3", description: "Employees and contractors using the organization's systems are required to note and report any observed or suspected information security weakness.", checked: false },
      { id: "a16.1.4", control: "A.16.1.4", description: "Information security events are assessed and it is decided if they are to be classified as information security incidents.", checked: false },
      { id: "a16.1.5", control: "A.16.1.5", description: "Information security incidents are responded to in accordance with the documented procedures.", checked: false },
      { id: "a16.1.6", control: "A.16.1.6", description: "Knowledge gained from analyzing and resolving information security incidents is used to reduce the likelihood or impact of future incidents.", checked: false },
      { id: "a16.1.7", control: "A.16.1.7", description: "Procedures for the identification, collection, acquisition, and preservation of information are defined for use as evidence.", checked: false },
    ],
  },
  {
    name: "A.17 — Business Continuity Management",
    items: [
      { id: "a17.1.1", control: "A.17.1.1", description: "The organization determines its requirements for information security and the continuity of information security management in adverse situations.", checked: false },
      { id: "a17.1.2", control: "A.17.1.2", description: "The organization establishes, documents, implements, and maintains processes, procedures, and controls to ensure the required level of continuity for information security.", checked: false },
      { id: "a17.1.3", control: "A.17.1.3", description: "The organization verifies the established and implemented information security continuity controls at regular intervals to ensure they are valid and effective.", checked: false },
      { id: "a17.2.1", control: "A.17.2.1", description: "Information processing facilities are implemented with redundancy sufficient to meet availability requirements.", checked: false },
    ],
  },
  {
    name: "A.18 — Compliance",
    items: [
      { id: "a18.1.1", control: "A.18.1.1", description: "All relevant legislative statutory, regulatory, and contractual requirements and the organization's approach to meet these requirements are explicitly identified and kept up to date.", checked: false },
      { id: "a18.1.2", control: "A.18.1.2", description: "Appropriate procedures are implemented to ensure compliance with legislative, regulatory, and contractual requirements related to intellectual property rights.", checked: false },
      { id: "a18.1.3", control: "A.18.1.3", description: "Records are protected from loss, destruction, falsification, unauthorized access, and unauthorized release, in accordance with legislative, regulatory, contractual, and business requirements.", checked: false },
      { id: "a18.1.4", control: "A.18.1.4", description: "Privacy and protection of personally identifiable information is ensured as required in relevant legislation and regulations.", checked: false },
      { id: "a18.1.5", control: "A.18.1.5", description: "Cryptographic controls are used in compliance with all relevant agreements, legislation, and regulations.", checked: false },
      { id: "a18.2.1", control: "A.18.2.1", description: "The organization's approach to managing information security and its implementation (controls, objectives, policies) are reviewed independently at planned intervals.", checked: false },
      { id: "a18.2.2", control: "A.18.2.2", description: "Managers regularly review the compliance of information processing and procedures within their area of responsibility with appropriate security policies, standards, and other security requirements.", checked: false },
      { id: "a18.2.3", control: "A.18.2.3", description: "Information systems are regularly reviewed for compliance with the organization's information security policies and standards.", checked: false },
    ],
  },
];

// ─── NIST CSF 1.1 ─────────────────────────────────────────────────────────
const nistDomains: Domain[] = [
  {
    name: "ID.AM — Asset Management",
    items: [
      { id: "id.am1", control: "ID.AM-1", description: "Physical devices and systems within the organization are inventoried.", checked: false },
      { id: "id.am2", control: "ID.AM-2", description: "Software platforms and applications within the organization are inventoried.", checked: false },
      { id: "id.am3", control: "ID.AM-3", description: "Organizational communication and data flows are mapped.", checked: false },
      { id: "id.am4", control: "ID.AM-4", description: "External information systems are catalogued.", checked: false },
      { id: "id.am5", control: "ID.AM-5", description: "Resources (hardware, devices, data, time, personnel, software) are prioritized based on their classification, criticality, and business value.", checked: false },
      { id: "id.am6", control: "ID.AM-6", description: "Cybersecurity roles and responsibilities for the entire workforce and third-party stakeholders are established.", checked: false },
    ],
  },
  {
    name: "ID.BE — Business Environment",
    items: [
      { id: "id.be1", control: "ID.BE-1", description: "The organization's role in the supply chain is identified and communicated.", checked: false },
      { id: "id.be2", control: "ID.BE-2", description: "The organization's place in critical infrastructure and its industry sector is identified and communicated.", checked: false },
      { id: "id.be3", control: "ID.BE-3", description: "Priorities for organizational mission, objectives, stakeholders, and activities are established and communicated.", checked: false },
      { id: "id.be4", control: "ID.BE-4", description: "Dependencies and critical functions for delivery of critical services are established.", checked: false },
      { id: "id.be5", control: "ID.BE-5", description: "Resilience requirements to support delivery of critical services are established for all operating states.", checked: false },
    ],
  },
  {
    name: "ID.GV — Governance",
    items: [
      { id: "id.gv1", control: "ID.GV-1", description: "Organizational cybersecurity policy is established and communicated.", checked: false },
      { id: "id.gv2", control: "ID.GV-2", description: "Cybersecurity roles and responsibilities are coordinated and aligned with internal roles and external partners.", checked: false },
      { id: "id.gv3", control: "ID.GV-3", description: "Legal and regulatory requirements regarding cybersecurity are understood and managed.", checked: false },
      { id: "id.gv4", control: "ID.GV-4", description: "Governance and risk management processes address cybersecurity risks.", checked: false },
    ],
  },
  {
    name: "ID.RA — Risk Assessment",
    items: [
      { id: "id.ra1", control: "ID.RA-1", description: "Asset vulnerabilities are identified and documented.", checked: false },
      { id: "id.ra2", control: "ID.RA-2", description: "Cyber threat intelligence is received from information sharing forums and sources.", checked: false },
      { id: "id.ra3", control: "ID.RA-3", description: "Threats, both internal and external, are identified and documented.", checked: false },
      { id: "id.ra4", control: "ID.RA-4", description: "Potential business impacts and likelihoods are identified.", checked: false },
      { id: "id.ra5", control: "ID.RA-5", description: "Threats, vulnerabilities, likelihoods, and impacts are used to determine risk.", checked: false },
      { id: "id.ra6", control: "ID.RA-6", description: "Risk responses are identified and prioritized.", checked: false },
    ],
  },
  {
    name: "ID.RM — Risk Management Strategy",
    items: [
      { id: "id.rm1", control: "ID.RM-1", description: "Risk management processes are established, managed, and agreed to by organizational stakeholders.", checked: false },
      { id: "id.rm2", control: "ID.RM-2", description: "Organizational risk tolerance is determined and clearly expressed.", checked: false },
      { id: "id.rm3", control: "ID.RM-3", description: "The organization's determination of risk tolerance is informed by its role in critical infrastructure and sector-specific risk analysis.", checked: false },
    ],
  },
  {
    name: "ID.SC — Supply Chain Risk Management",
    items: [
      { id: "id.sc1", control: "ID.SC-1", description: "Cyber supply chain risk management processes are identified, established, assessed, managed, and agreed to by organizational stakeholders.", checked: false },
      { id: "id.sc2", control: "ID.SC-2", description: "Suppliers and third-party partners of information systems, components, and services are identified, prioritized, and assessed.", checked: false },
      { id: "id.sc3", control: "ID.SC-3", description: "Contracts with suppliers and third-party partners are used to implement appropriate measures designed to meet the objectives of an organization's cybersecurity program.", checked: false },
      { id: "id.sc4", control: "ID.SC-4", description: "Suppliers and third-party partners are routinely assessed using audits, test results, or other forms of evaluations.", checked: false },
      { id: "id.sc5", control: "ID.SC-5", description: "Response and recovery planning and testing are conducted with suppliers and third-party providers.", checked: false },
    ],
  },
  {
    name: "PR.AC — Identity Management & Access Control",
    items: [
      { id: "pr.ac1", control: "PR.AC-1", description: "Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users, and processes.", checked: false },
      { id: "pr.ac2", control: "PR.AC-2", description: "Physical access to assets is managed and protected.", checked: false },
      { id: "pr.ac3", control: "PR.AC-3", description: "Remote access is managed.", checked: false },
      { id: "pr.ac4", control: "PR.AC-4", description: "Access permissions and authorizations are managed, incorporating principles of least privilege and separation of duties.", checked: false },
      { id: "pr.ac5", control: "PR.AC-5", description: "Network integrity is protected, incorporating network segregation where appropriate.", checked: false },
      { id: "pr.ac6", control: "PR.AC-6", description: "Identities are proofed and bound to credentials and asserted in interactions.", checked: false },
      { id: "pr.ac7", control: "PR.AC-7", description: "Users, devices, and other assets are authenticated (e.g., single-factor, multi-factor) commensurate with the risk.", checked: false },
    ],
  },
  {
    name: "PR.AT — Awareness & Training",
    items: [
      { id: "pr.at1", control: "PR.AT-1", description: "All users are informed and trained.", checked: false },
      { id: "pr.at2", control: "PR.AT-2", description: "Privileged users understand their roles and responsibilities.", checked: false },
      { id: "pr.at3", control: "PR.AT-3", description: "Third-party stakeholders (e.g., suppliers, customers, partners) understand their roles and responsibilities.", checked: false },
      { id: "pr.at4", control: "PR.AT-4", description: "Senior executives understand their roles and responsibilities.", checked: false },
      { id: "pr.at5", control: "PR.AT-5", description: "Physical and cybersecurity personnel understand their roles and responsibilities.", checked: false },
    ],
  },
  {
    name: "PR.DS — Data Security",
    items: [
      { id: "pr.ds1", control: "PR.DS-1", description: "Data-at-rest is protected.", checked: false },
      { id: "pr.ds2", control: "PR.DS-2", description: "Data-in-transit is protected.", checked: false },
      { id: "pr.ds3", control: "PR.DS-3", description: "Assets are formally managed throughout removal, transfers, and disposition.", checked: false },
      { id: "pr.ds4", control: "PR.DS-4", description: "Adequate capacity to ensure availability is maintained.", checked: false },
      { id: "pr.ds5", control: "PR.DS-5", description: "Protections against data leaks are implemented.", checked: false },
      { id: "pr.ds6", control: "PR.DS-6", description: "Integrity checking mechanisms are used to verify software, firmware, and information integrity.", checked: false },
      { id: "pr.ds7", control: "PR.DS-7", description: "The development and testing environment(s) are separate from the production environment.", checked: false },
      { id: "pr.ds8", control: "PR.DS-8", description: "Integrity checking mechanisms are used to verify hardware integrity.", checked: false },
    ],
  },
  {
    name: "PR.IP — Information Protection Processes",
    items: [
      { id: "pr.ip1", control: "PR.IP-1", description: "A baseline configuration of IT/OT systems is created and maintained.", checked: false },
      { id: "pr.ip2", control: "PR.IP-2", description: "A System Development Life Cycle to manage systems is implemented.", checked: false },
      { id: "pr.ip3", control: "PR.IP-3", description: "Configuration change control processes are in place.", checked: false },
      { id: "pr.ip4", control: "PR.IP-4", description: "Backups of information are conducted, maintained, and tested.", checked: false },
      { id: "pr.ip5", control: "PR.IP-5", description: "Policy and regulations regarding the physical operating environment for organizational assets are met.", checked: false },
      { id: "pr.ip6", control: "PR.IP-6", description: "Data is destroyed according to policy.", checked: false },
      { id: "pr.ip7", control: "PR.IP-7", description: "Protection processes are improved.", checked: false },
      { id: "pr.ip8", control: "PR.IP-8", description: "Effectiveness of protection technologies is shared with appropriate parties.", checked: false },
      { id: "pr.ip9", control: "PR.IP-9", description: "Response plans (Incident Response and Business Continuity) and recovery plans (Incident Recovery and Disaster Recovery) are in place and managed.", checked: false },
      { id: "pr.ip10", control: "PR.IP-10", description: "Response and recovery plans are tested.", checked: false },
      { id: "pr.ip11", control: "PR.IP-11", description: "Cybersecurity is included in human resources practices (e.g., deprovisioning, personnel screening).", checked: false },
      { id: "pr.ip12", control: "PR.IP-12", description: "A vulnerability management plan is developed and implemented.", checked: false },
    ],
  },
  {
    name: "PR.MA — Maintenance",
    items: [
      { id: "pr.ma1", control: "PR.MA-1", description: "Maintenance and repair of organizational assets are performed and logged, with approved and controlled tools.", checked: false },
      { id: "pr.ma2", control: "PR.MA-2", description: "Remote maintenance of organizational assets is approved, logged, and performed in a manner that prevents unauthorized access.", checked: false },
    ],
  },
  {
    name: "PR.PT — Protective Technology",
    items: [
      { id: "pr.pt1", control: "PR.PT-1", description: "Audit/log records are determined, documented, implemented, and reviewed in accordance with policy.", checked: false },
      { id: "pr.pt2", control: "PR.PT-2", description: "Removable media is protected and its use restricted according to policy.", checked: false },
      { id: "pr.pt3", control: "PR.PT-3", description: "The principle of least functionality is incorporated by configuring systems to provide only essential capabilities.", checked: false },
      { id: "pr.pt4", control: "PR.PT-4", description: "Communications and control networks are protected.", checked: false },
      { id: "pr.pt5", control: "PR.PT-5", description: "Mechanisms (e.g., failsafe, load balancing, hot swap) are implemented to achieve resilience requirements in normal and adverse situations.", checked: false },
    ],
  },
  {
    name: "DE.AE — Anomalies and Events",
    items: [
      { id: "de.ae1", control: "DE.AE-1", description: "A baseline of network operations and expected data flows for users and systems is established and managed.", checked: false },
      { id: "de.ae2", control: "DE.AE-2", description: "Detected events are analyzed to understand attack targets and methods.", checked: false },
      { id: "de.ae3", control: "DE.AE-3", description: "Event data are collected and correlated from multiple sources and sensors.", checked: false },
      { id: "de.ae4", control: "DE.AE-4", description: "Impact of events is determined.", checked: false },
      { id: "de.ae5", control: "DE.AE-5", description: "Incident alert thresholds are established.", checked: false },
    ],
  },
  {
    name: "DE.CM — Security Continuous Monitoring",
    items: [
      { id: "de.cm1", control: "DE.CM-1", description: "The network is monitored to detect potential cybersecurity events.", checked: false },
      { id: "de.cm2", control: "DE.CM-2", description: "The physical environment is monitored to detect potential cybersecurity events.", checked: false },
      { id: "de.cm3", control: "DE.CM-3", description: "Personnel activity is monitored to detect potential cybersecurity events.", checked: false },
      { id: "de.cm4", control: "DE.CM-4", description: "Malicious code is detected.", checked: false },
      { id: "de.cm5", control: "DE.CM-5", description: "Unauthorized mobile code is detected.", checked: false },
      { id: "de.cm6", control: "DE.CM-6", description: "External service provider activity is monitored to detect potential cybersecurity events.", checked: false },
      { id: "de.cm7", control: "DE.CM-7", description: "Monitoring for unauthorized personnel, connections, devices, and software is performed.", checked: false },
      { id: "de.cm8", control: "DE.CM-8", description: "Vulnerability scans are performed.", checked: false },
    ],
  },
  {
    name: "DE.DP — Detection Processes",
    items: [
      { id: "de.dp1", control: "DE.DP-1", description: "Roles and responsibilities for detection are well defined to ensure accountability.", checked: false },
      { id: "de.dp2", control: "DE.DP-2", description: "Detection activities comply with all applicable requirements.", checked: false },
      { id: "de.dp3", control: "DE.DP-3", description: "Detection processes are tested.", checked: false },
      { id: "de.dp4", control: "DE.DP-4", description: "Event detection information is communicated.", checked: false },
      { id: "de.dp5", control: "DE.DP-5", description: "Detection processes are continuously improved.", checked: false },
    ],
  },
  {
    name: "RS.RP — Response Planning",
    items: [
      { id: "rs.rp1", control: "RS.RP-1", description: "Response plan is executed during or after an incident.", checked: false },
    ],
  },
  {
    name: "RS.CO — Communications",
    items: [
      { id: "rs.co1", control: "RS.CO-1", description: "Personnel know their roles and order of operations when a response is needed.", checked: false },
      { id: "rs.co2", control: "RS.CO-2", description: "Incidents are reported consistent with established criteria.", checked: false },
      { id: "rs.co3", control: "RS.CO-3", description: "Information is shared consistent with response plans.", checked: false },
      { id: "rs.co4", control: "RS.CO-4", description: "Coordination with stakeholders occurs consistent with response plans.", checked: false },
      { id: "rs.co5", control: "RS.CO-5", description: "Voluntary information sharing occurs with external stakeholders to achieve broader cybersecurity situational awareness.", checked: false },
    ],
  },
  {
    name: "RS.AN — Analysis",
    items: [
      { id: "rs.an1", control: "RS.AN-1", description: "Notifications from detection systems are investigated.", checked: false },
      { id: "rs.an2", control: "RS.AN-2", description: "The impact of the incident is understood.", checked: false },
      { id: "rs.an3", control: "RS.AN-3", description: "Forensics are performed.", checked: false },
      { id: "rs.an4", control: "RS.AN-4", description: "Incidents are categorized consistent with response plans.", checked: false },
      { id: "rs.an5", control: "RS.AN-5", description: "Processes are established to receive, analyze, and respond to vulnerabilities disclosed to the organization from internal and external sources.", checked: false },
    ],
  },
  {
    name: "RS.MI — Mitigation",
    items: [
      { id: "rs.mi1", control: "RS.MI-1", description: "Incidents are contained.", checked: false },
      { id: "rs.mi2", control: "RS.MI-2", description: "Incidents are mitigated.", checked: false },
      { id: "rs.mi3", control: "RS.MI-3", description: "Newly identified vulnerabilities are mitigated or documented as accepted risks.", checked: false },
    ],
  },
  {
    name: "RS.IM — Improvements",
    items: [
      { id: "rs.im1", control: "RS.IM-1", description: "Response plans incorporate lessons learned.", checked: false },
      { id: "rs.im2", control: "RS.IM-2", description: "Response strategies are updated.", checked: false },
    ],
  },
  {
    name: "RC.RP — Recovery Planning",
    items: [
      { id: "rc.rp1", control: "RC.RP-1", description: "Recovery plan is executed during or after a cybersecurity incident.", checked: false },
    ],
  },
  {
    name: "RC.IM — Improvements",
    items: [
      { id: "rc.im1", control: "RC.IM-1", description: "Recovery plans incorporate lessons learned.", checked: false },
      { id: "rc.im2", control: "RC.IM-2", description: "Recovery strategies are updated.", checked: false },
    ],
  },
  {
    name: "RC.CO — Communications",
    items: [
      { id: "rc.co1", control: "RC.CO-1", description: "Public relations are managed.", checked: false },
      { id: "rc.co2", control: "RC.CO-2", description: "Reputation is repaired after an incident.", checked: false },
      { id: "rc.co3", control: "RC.CO-3", description: "Recovery activities are communicated to internal and external stakeholders as well as executive and management teams.", checked: false },
    ],
  },
];

// ─── SOC 2 Trust Service Criteria ─────────────────────────────────────────
const soc2Domains: Domain[] = [
  {
    name: "CC1 — Control Environment",
    items: [
      { id: "cc1.1", control: "CC1.1", description: "COSO Principle 1: The entity demonstrates a commitment to integrity and ethical values.", checked: false },
      { id: "cc1.2", control: "CC1.2", description: "COSO Principle 2: The board of directors demonstrates independence from management and exercises oversight.", checked: false },
      { id: "cc1.3", control: "CC1.3", description: "COSO Principle 3: Management establishes, with board oversight, structures, reporting lines, and authorities.", checked: false },
      { id: "cc1.4", control: "CC1.4", description: "COSO Principle 4: The entity demonstrates a commitment to attract, develop, and retain competent individuals.", checked: false },
      { id: "cc1.5", control: "CC1.5", description: "COSO Principle 5: The entity holds individuals accountable for their internal control responsibilities.", checked: false },
    ],
  },
  {
    name: "CC2 — Communication and Information",
    items: [
      { id: "cc2.1", control: "CC2.1", description: "COSO Principle 13: The entity obtains or generates and uses relevant, quality information to support the functioning of internal control.", checked: false },
      { id: "cc2.2", control: "CC2.2", description: "COSO Principle 14: The entity internally communicates information, including objectives and responsibilities for internal control.", checked: false },
      { id: "cc2.3", control: "CC2.3", description: "COSO Principle 15: The entity communicates with external parties regarding matters affecting the functioning of internal control.", checked: false },
    ],
  },
  {
    name: "CC3 — Risk Assessment",
    items: [
      { id: "cc3.1", control: "CC3.1", description: "COSO Principle 6: The entity specifies objectives with sufficient clarity to enable identification and assessment of risks relating to objectives.", checked: false },
      { id: "cc3.2", control: "CC3.2", description: "COSO Principle 7: The entity identifies risks to the achievement of its objectives across the entity and analyzes risks as a basis for determining how the risks should be managed.", checked: false },
      { id: "cc3.3", control: "CC3.3", description: "COSO Principle 8: The entity considers the potential for fraud in assessing risks to the achievement of objectives.", checked: false },
      { id: "cc3.4", control: "CC3.4", description: "COSO Principle 9: The entity identifies and assesses changes that could significantly impact the system of internal control.", checked: false },
    ],
  },
  {
    name: "CC4 — Monitoring Activities",
    items: [
      { id: "cc4.1", control: "CC4.1", description: "COSO Principle 16: The entity selects, develops, and performs ongoing and/or separate evaluations to ascertain whether the components of internal control are present and functioning.", checked: false },
      { id: "cc4.2", control: "CC4.2", description: "COSO Principle 17: The entity evaluates and communicates internal control deficiencies in a timely manner to those parties responsible for taking corrective action.", checked: false },
    ],
  },
  {
    name: "CC5 — Control Activities",
    items: [
      { id: "cc5.1", control: "CC5.1", description: "COSO Principle 10: The entity selects and develops control activities that contribute to the mitigation of risks to the achievement of objectives.", checked: false },
      { id: "cc5.2", control: "CC5.2", description: "COSO Principle 11: The entity also selects and develops general control activities over technology to support the achievement of objectives.", checked: false },
      { id: "cc5.3", control: "CC5.3", description: "COSO Principle 12: The entity deploys control activities through policies and procedures.", checked: false },
    ],
  },
  {
    name: "CC6 — Logical and Physical Access Controls",
    items: [
      { id: "cc6.1", control: "CC6.1", description: "The entity implements logical access security software, infrastructure, and architectures over protected information assets.", checked: false },
      { id: "cc6.2", control: "CC6.2", description: "Prior to issuing system credentials and granting system access, the entity registers and authorizes new internal and external users.", checked: false },
      { id: "cc6.3", control: "CC6.3", description: "The entity authorizes, modifies, or removes access to data, software, functions, and other protected information assets based on approved access requests.", checked: false },
      { id: "cc6.4", control: "CC6.4", description: "The entity restricts physical access to facilities and protected information assets (for example, data center facilities, backup media storage) to authorized personnel.", checked: false },
      { id: "cc6.5", control: "CC6.5", description: "The entity discontinues logical and physical protections over physical assets only after the ability to read or recover data and software from those assets has been diminished.", checked: false },
      { id: "cc6.6", control: "CC6.6", description: "The entity implements logical access security measures to protect against threats from sources outside its system boundaries.", checked: false },
      { id: "cc6.7", control: "CC6.7", description: "The entity restricts the transmission, movement, and removal of information to authorized internal and external users and processes.", checked: false },
      { id: "cc6.8", control: "CC6.8", description: "The entity implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software.", checked: false },
    ],
  },
  {
    name: "CC7 — System Operations",
    items: [
      { id: "cc7.1", control: "CC7.1", description: "To meet its objectives, the entity uses detection and monitoring procedures to identify changes to configurations or the introduction of new vulnerabilities.", checked: false },
      { id: "cc7.2", control: "CC7.2", description: "The entity monitors system components and the operation of those components for anomalies that are indicative of malicious acts, natural disasters, and errors.", checked: false },
      { id: "cc7.3", control: "CC7.3", description: "The entity evaluates security events to determine whether they could or have resulted in a failure of the entity to meet its objectives.", checked: false },
      { id: "cc7.4", control: "CC7.4", description: "The entity responds to identified security incidents by executing a defined incident-response program.", checked: false },
      { id: "cc7.5", control: "CC7.5", description: "The entity identifies, develops, and implements activities to recover from identified security incidents.", checked: false },
    ],
  },
  {
    name: "CC8 — Change Management",
    items: [
      { id: "cc8.1", control: "CC8.1", description: "The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures.", checked: false },
    ],
  },
  {
    name: "CC9 — Risk Mitigation",
    items: [
      { id: "cc9.1", control: "CC9.1", description: "The entity identifies, selects, and develops risk mitigation activities for risks arising from potential business disruptions.", checked: false },
      { id: "cc9.2", control: "CC9.2", description: "The entity assesses and manages risks associated with vendors and business partners.", checked: false },
    ],
  },
  {
    name: "A1 — Availability",
    items: [
      { id: "a1.1", control: "A1.1", description: "The entity maintains, monitors, and evaluates current processing capacity and use of system components to manage capacity demand.", checked: false },
      { id: "a1.2", control: "A1.2", description: "The entity authorizes, designs, develops or acquires, implements, operates, approves, maintains, and monitors environmental protections, software, data backup processes, and recovery infrastructure.", checked: false },
      { id: "a1.3", control: "A1.3", description: "The entity tests recovery plan procedures supporting system recovery to meet its objectives.", checked: false },
    ],
  },
  {
    name: "C1 — Confidentiality",
    items: [
      { id: "c1.1", control: "C1.1", description: "The entity identifies and maintains confidential information to meet the entity's objectives related to confidentiality.", checked: false },
      { id: "c1.2", control: "C1.2", description: "The entity disposes of confidential information to meet the entity's objectives related to confidentiality.", checked: false },
    ],
  },
  {
    name: "PI1 — Processing Integrity",
    items: [
      { id: "pi1.1", control: "PI1.1", description: "The entity obtains or generates, uses, and communicates relevant, quality information regarding the objectives related to processing, including definitions of data processed.", checked: false },
      { id: "pi1.2", control: "PI1.2", description: "The entity implements policies and procedures over system inputs, including controls over completeness and accuracy.", checked: false },
      { id: "pi1.3", control: "PI1.3", description: "The entity implements policies and procedures over system processing to result in products, services, and reporting to meet the entity's objectives.", checked: false },
      { id: "pi1.4", control: "PI1.4", description: "The entity implements policies and procedures to make available or deliver output completely, accurately, and timely.", checked: false },
      { id: "pi1.5", control: "PI1.5", description: "The entity implements policies and procedures to store inputs, items in processing, and outputs completely, accurately, and timely.", checked: false },
    ],
  },
];

const frameworksData: Framework[] = [
  { id: "iso27001", label: "ISO 27001:2013", domains: iso27001Domains },
  { id: "nistcsf", label: "NIST CSF 1.1", domains: nistDomains },
  { id: "soc2", label: "SOC 2 TSC", domains: soc2Domains },
];

function totalItems(fw: Framework) {
  return fw.domains.reduce((s, d) => s + d.items.length, 0);
}
function checkedItems(fw: Framework) {
  return fw.domains.reduce((s, d) => s + d.items.filter((i) => i.checked).length, 0);
}

export default function AuditToolkitPage() {
  const [activeFramework, setActiveFramework] = useState("iso27001");
  const [fws, setFws] = useState<Framework[]>(frameworksData);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggle(fwId: string, itemId: string) {
    setFws((prev) =>
      prev.map((fw) =>
        fw.id !== fwId ? fw : {
          ...fw,
          domains: fw.domains.map((d) => ({
            ...d,
            items: d.items.map((i) => i.id === itemId ? { ...i, checked: !i.checked } : i),
          })),
        }
      )
    );
  }

  function toggleDomain(fwId: string, domainName: string, checked: boolean) {
    setFws((prev) =>
      prev.map((fw) =>
        fw.id !== fwId ? fw : {
          ...fw,
          domains: fw.domains.map((d) =>
            d.name !== domainName ? d : { ...d, items: d.items.map((i) => ({ ...i, checked })) }
          ),
        }
      )
    );
  }

  function toggleCollapse(domainName: string) {
    setCollapsed((prev) => ({ ...prev, [domainName]: !prev[domainName] }));
  }

  function resetFramework(fwId: string) {
    setFws((prev) =>
      prev.map((fw) =>
        fw.id !== fwId ? fw : {
          ...fw,
          domains: fw.domains.map((d) => ({
            ...d,
            items: d.items.map((i) => ({ ...i, checked: false })),
          })),
        }
      )
    );
  }

  const fw = fws.find((f) => f.id === activeFramework)!;
  const total = totalItems(fw);
  const checked = checkedItems(fw);
  const pct = total === 0 ? 0 : Math.round((checked / total) * 100);

  const filteredDomains = useMemo(() => {
    if (!search.trim()) return fw.domains;
    const q = search.toLowerCase();
    return fw.domains
      .map((d) => ({
        ...d,
        items: d.items.filter(
          (i) =>
            i.control.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q)
        ),
      }))
      .filter((d) => d.items.length > 0);
  }, [fw.domains, search]);

  return (
    <KnowledgeShell
      title="Audit Toolkit"
      subtitle="Complete control checklists for ISO 27001:2013, NIST CSF 1.1, and SOC 2 Trust Service Criteria."
    >
      <HowToUse
        what="Audit Toolkit adalah kumpulan checklist kontrol dari tiga framework utama IT audit (ISO 27001, NIST CSF, SOC 2). Dipakai untuk memverifikasi apakah sebuah organisasi sudah mengimplementasikan kontrol-kontrol yang diperlukan."
        when={[
          "Saat melakukan gap analysis — cek mana kontrol yang belum ada",
          "Saat audit fieldwork — centang kontrol yang sudah diverifikasi ada evidencenya",
          "Saat persiapan sertifikasi ISO 27001 atau audit SOC 2",
          "Saat membuat audit plan — tentukan scope kontrol mana yang akan diuji",
        ]}
        how={[
          "Pilih framework yang relevan dengan engagement kamu (tab di atas)",
          "Gunakan search untuk cari kontrol spesifik by ID atau keyword",
          "Centang kontrol yang sudah diverifikasi ada evidence-nya",
          "Klik header domain untuk expand/collapse",
          "Monitor progress lewat bar di atas — target 100% sebelum closing meeting",
        ]}
      />

      {/* Framework tabs */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {fws.map((f) => {
          const t = totalItems(f);
          const c = checkedItems(f);
          const p = t === 0 ? 0 : Math.round((c / t) * 100);
          return (
            <button
              key={f.id}
              onClick={() => setActiveFramework(f.id)}
              className={`flex flex-col items-start rounded-2xl border px-5 py-4 text-left transition min-w-[160px] ${
                activeFramework === f.id
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                  : "border-blue-200 bg-white text-slate-700 hover:border-indigo-300"
              }`}
            >
              <span className="text-sm font-semibold">{f.label}</span>
              <span className={`mt-1 text-xs ${activeFramework === f.id ? "text-indigo-200" : "text-slate-400"}`}>
                {c}/{t} controls · {p}%
              </span>
              <div className={`mt-2 h-1 w-full overflow-hidden rounded-full ${activeFramework === f.id ? "bg-indigo-400" : "bg-blue-100"}`}>
                <div
                  className={`h-full rounded-full transition-all ${activeFramework === f.id ? "bg-white" : "bg-indigo-500"}`}
                  style={{ width: `${p}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Overall progress + search */}
      <div className="mb-6 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-700 font-semibold">{fw.label} — Audit Progress</p>
            <p className="mt-1 text-3xl font-bold text-slate-800">{pct}% complete</p>
            <p className="mt-0.5 text-sm text-slate-500">{checked} of {total} controls verified</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="search"
              placeholder="Search by control ID or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full border border-blue-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 w-64 focus:border-indigo-400 focus:outline-none"
            />
            <button
              onClick={() => resetFramework(fw.id)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 hover:border-red-300 hover:text-red-500 transition"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-blue-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Domains */}
      {search && filteredDomains.length === 0 && (
        <div className="rounded-2xl border border-blue-200 bg-white p-8 text-center text-slate-400">
          No controls match &quot;{search}&quot;
        </div>
      )}

      <div className="space-y-3">
        {filteredDomains.map((domain) => {
          const dTotal = domain.items.length;
          const dChecked = domain.items.filter((i) => i.checked).length;
          const allChecked = dChecked === dTotal && dTotal > 0;
          const dPct = dTotal === 0 ? 0 : Math.round((dChecked / dTotal) * 100);
          const isCollapsed = !search && collapsed[domain.name];

          return (
            <div key={domain.name} className="rounded-2xl border border-blue-200 bg-white shadow-sm overflow-hidden">
              {/* Domain header */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border-b border-blue-100">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => {
                    const realDomain = fw.domains.find((d) => d.name === domain.name);
                    if (realDomain) toggleDomain(fw.id, domain.name, e.target.checked);
                  }}
                  className="h-4 w-4 rounded accent-indigo-600 cursor-pointer shrink-0"
                  title="Select all"
                />
                <button
                  onClick={() => toggleCollapse(domain.name)}
                  className="flex flex-1 items-center justify-between gap-4 text-left"
                >
                  <span className="font-semibold text-slate-800 text-sm">{domain.name}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-500">{dChecked}/{dTotal}</span>
                    <div className="w-20 h-1.5 overflow-hidden rounded-full bg-blue-100">
                      <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${dPct}%` }} />
                    </div>
                    <span className="text-slate-400 text-sm">{isCollapsed ? "▼" : "▲"}</span>
                  </div>
                </button>
              </div>

              {/* Control items */}
              {!isCollapsed && (
                <div className="divide-y divide-blue-50">
                  {domain.items.map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-4 px-5 py-3.5 hover:bg-slate-50 transition"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggle(fw.id, item.id)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded accent-indigo-600"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-mono font-bold text-indigo-600 mr-2">{item.control}</span>
                        <span className={`text-sm leading-relaxed ${item.checked ? "line-through text-slate-400" : "text-slate-700"}`}>
                          {item.description}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-slate-400">
        ISO 27001:2013 — 114 controls · NIST CSF 1.1 — 108 subcategories · SOC 2 TSC — 33 criteria. Progress resets on page reload.
      </p>
    </KnowledgeShell>
  );
}
