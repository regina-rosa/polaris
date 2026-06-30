"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Badge from "@/components/Badge";
import KnowledgeShell from "@/components/KnowledgeShell";
import LearningCard from "@/components/LearningCard";

const categories = ["All", "Compliance", "Frameworks", "Risk", "Audit", "Policy"];

const courses = [
  {
    title: "ISO 27002 Essentials",
    description: "Master security controls and auditor-ready implementation patterns.",
    category: "Compliance",
    difficulty: "Intermediate",
    time: "8 min",
    status: "In progress",
    completion: 72,
    href: "/knowledge/iso27002",
  },
  {
    title: "NIST CSF Fundamentals",
    description: "Understand the core functions for cybersecurity risk management.",
    category: "Frameworks",
    difficulty: "Beginner",
    time: "12 min",
    status: "Not started",
    completion: 0,
    href: "/knowledge/nist-csf",
  },
  {
    title: "Audit Evidence Workflow",
    description: "Collect and organize evidence with audit efficiency in mind.",
    category: "Audit",
    difficulty: "Advanced",
    time: "15 min",
    status: "In progress",
    completion: 58,
    href: "/knowledge/audit-evidence",
  },
  {
    title: "Risk Assessment Canvas",
    description: "Map threats, vulnerabilities, and controls for audit planning.",
    category: "Risk",
    difficulty: "Intermediate",
    time: "10 min",
    status: "Completed",
    completion: 100,
    href: "/knowledge/risk-assessment",
  },
  {
    title: "Policy Review Guide",
    description: "Evaluate policy strength through a compliance-first lens.",
    category: "Policy",
    difficulty: "Beginner",
    time: "7 min",
    status: "In progress",
    completion: 43,
    href: "/knowledge/policy-review",
  },
  {
    title: "Control Maturity Check",
    description: "Rate control effectiveness using audit-grade criteria.",
    category: "Compliance",
    difficulty: "Advanced",
    time: "14 min",
    status: "Not started",
    completion: 0,
    href: "/knowledge/control-maturity",
  },
];

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  // Live time tracker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <KnowledgeShell
      title="📚 Knowledge Hub"
      subtitle="A premium learning workspace for IT Audit, GRC, and cybersecurity consultants."
      titleClassName="text-4xl"
    >
      <div className="grid gap-6">
        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <section className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-indigo-700 font-semibold">
                  Learning workspace
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-800">
                  Build audit knowledge with confidence.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  Search across curated controls, frameworks, and audit templates while tracking your progress.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href="/knowledge/iso27002"
                    className="inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Continue ISO 27002
                  </Link>
                  <Link
                    href="#courses"
                    className="inline-flex rounded-full border border-indigo-300 bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                  >
                    Explore courses
                  </Link>
                </div>
              </div>

              <div className="relative flex-shrink-0">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  🔍
                </span>
                <input
                  type="search"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-3xl border border-blue-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 outline-none ring-1 ring-indigo-100/30 transition focus:border-indigo-400 focus:ring-indigo-200"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === category
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-blue-200 bg-white text-slate-700 hover:border-indigo-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
            </div>
          </section>

          <section className="grid gap-4">
            <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.26em] text-indigo-700 font-semibold">
                    Learning progress
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold text-slate-800">72% complete</h3>
                </div>
                <Badge label="Premium" variant="accent" />
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-indigo-50 p-4">
                  <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                    <span>Courses completed</span>
                    <span className="font-semibold text-slate-800">4 / 6</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
                    <div className="h-full w-[72%] rounded-full bg-indigo-600" />
                  </div>
                </div>

                <div className="grid gap-3 rounded-3xl bg-indigo-50 p-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-blue-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-600 font-medium">Focus sessions</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-800">3</p>
                  </div>
                  <div className="rounded-3xl border border-blue-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-600 font-medium">Avg. reading time</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-800">10 min</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.26em] text-slate-600 font-medium">Live tracker</p>
                  <h3 className="mt-3 text-3xl font-mono font-bold text-indigo-700">{timeLeft}</h3>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="rounded-3xl border border-blue-200 bg-white p-4">
                  <p className="font-medium text-slate-800">Current session</p>
                  <p className="mt-1">ISO 27002 • 12 min left</p>
                </div>
                <div className="rounded-3xl border border-blue-200 bg-white p-4">
                  <p className="font-medium text-slate-800">Next milestone</p>
                  <p className="mt-1">Complete Policy Review Guide</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div id="courses" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <LearningCard key={course.title} {...course} />
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-blue-200 bg-white p-8 text-center">
              <p className="text-slate-600">No courses found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </KnowledgeShell>
  );
}

