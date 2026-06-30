# Polaris

Portfolio project untuk perjalanan career switch dari cybersecurity engineering ke IT auditing. Dibuat untuk belajar sekaligus punya sesuatu yang bisa ditunjukkan — bukan cuma teori di kepala.

## Isi project

**Tools interaktif:**
- **Audit Simulation** — simulasi audit end-to-end dengan studi kasus PT DataNusa Fintech. Ada 5 step (scoping → risk assessment → control testing → evidence → report) dan bisa generate audit report formal yang bisa di-print/save PDF
- **Audit Toolkit** — checklist ISO 27001 (114 controls), NIST CSF (108 subcategories), SOC 2 TSC (33 criteria) dengan search dan progress tracking
- **Risk Register** — buat dan kelola risk register dengan scoring Likelihood × Impact, filter severity, tambah/hapus risiko
- **Evidence Library** — referensi 17 jenis bukti audit: apa yang dicari, red flags, dan template request ke auditee
- **AI Policy Review** — framework untuk audit AI governance: risiko, template kebijakan, checklist berbasis EU AI Act dan NIST AI RMF
- **Interview Lab** — 30+ Q&A persiapan interview IT auditor di 6 kategori, ada progress tracker per soal

**Knowledge modules:**
- ISO 27002 — semua 14 domain (A.5–A.18) dengan kontrol kunci dan pertanyaan audit per domain
- NIST CSF — 5 fungsi lengkap dengan categories, maturity tiers, dan mapping ke ISO 27001
- Audit Evidence Workflow — 4 tipe evidence, 5-step workflow, quality criteria, common mistakes
- Risk Assessment Canvas — risk matrix interaktif, 5-step process, 4 strategi treatment

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Run locally

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

> Set nama dan preferensi belajar di halaman Settings — data disimpan di localStorage browser.
