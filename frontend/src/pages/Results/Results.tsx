
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Info,
  Search,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

type Severity = "Critical" | "High" | "Medium" | "Low" | "Needs review";

interface AccessibilityIssue {
  id: string;
  title: string;
  wcag: string;
  severity: Severity;
  occurrences: number;
  description: string;
}

const sampleIssues: AccessibilityIssue[] = [
  {
    id: "1",
    title: "Images missing alternative text",
    wcag: "1.1.1 · A",
    severity: "Critical",
    occurrences: 4,
    description:
      "Some images may not have appropriate text alternatives for screen reader users.",
  },
  {
    id: "2",
    title: "Insufficient text contrast",
    wcag: "1.4.3 · AA",
    severity: "High",
    occurrences: 3,
    description:
      "Some text may not have sufficient contrast against its background.",
  },
  {
    id: "3",
    title: "Form field missing accessible name",
    wcag: "4.1.2 · A",
    severity: "High",
    occurrences: 2,
    description:
      "Some form controls may not expose an accessible name to assistive technologies.",
  },
  {
    id: "4",
    title: "Link purpose unclear",
    wcag: "2.4.4 · A",
    severity: "Medium",
    occurrences: 3,
    description:
      "Some links may not clearly communicate their purpose from their text or context.",
  },
];

const severityStyles: Record<Severity, string> = {
  Critical: "bg-critical-bg text-critical",
  High: "bg-high-bg text-high",
  Medium: "bg-medium-bg text-medium",
  Low: "bg-low-bg text-low",
  "Needs review": "bg-brand-50 text-brand-700",
};

const severityVariants: Record<
  Severity,
  "critical" | "high" | "medium" | "low" | "info"
> = {
  Critical: "critical",
  High: "high",
  Medium: "medium",
  Low: "low",
  "Needs review": "info",
};

function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const url = (location.state?.url as string | undefined) ?? "https://example.com";

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [wcagFilter, setWcagFilter] = useState("all");

  const filteredIssues = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return sampleIssues.filter((issue) => {
      const matchesSearch =
        !normalizedSearch ||
        issue.title.toLowerCase().includes(normalizedSearch) ||
        issue.wcag.toLowerCase().includes(normalizedSearch);

      const matchesSeverity =
        severityFilter === "all" ||
        issue.severity === severityFilter;

      const criterion = issue.wcag.split(" · ")[0];
      const matchesWcag =
        wcagFilter === "all" || criterion === wcagFilter;

      return matchesSearch && matchesSeverity && matchesWcag;
    });
  }, [search, severityFilter, wcagFilter]);

  const summaryCards = [
    {
      label: "Total issues",
      value: "12",
      description: "Across this page",
      valueClass: "text-text-primary",
    },
    {
      label: "Critical",
      value: "2",
      description: "Requires urgent attention",
      valueClass: "text-critical",
    },
    {
      label: "High",
      value: "5",
      description: "Prioritize these fixes",
      valueClass: "text-high",
    },
    {
      label: "Needs review",
      value: "3",
      description: "Confirm with human review",
      valueClass: "text-brand-600",
    },
  ];

  function handleViewDetails(issue: AccessibilityIssue) {
    navigate("/issue-details", {
      state: { issue, url },
    });
  }

  return (
    <main className="flex min-h-screen flex-col bg-surface">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <a
            href="/"
            aria-label="AccessAble home"
            className="inline-flex items-center gap-3 rounded-md text-lg font-bold text-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
          >
            <span
              className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white"
              aria-hidden="true"
            >
              <span className="text-xl font-bold">A</span>
            </span>
            AccessAble
          </a>

          <Button
            onClick={() => navigate("/")}
            className="shrink-0 px-3 py-2 sm:px-5 sm:py-3"
          >
            Scan Another URL
          </Button>
        </div>
      </header>

      {/* Results content */}
      <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Accessibility Results
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <p className="break-all text-text-secondary">{url}</p>

            <span className="inline-flex items-center rounded-md bg-low-bg px-3 py-1 font-medium text-low">
              Scan completed
            </span>

            <span className="text-text-secondary">
              Illustrative preview · Replace with real scan data
            </span>
          </div>
        </div>

        {/* Sample-data notice */}
        <div
          role="note"
          className="mb-6 flex items-start gap-3 rounded-lg bg-medium-bg px-4 py-4 text-sm text-high"
        >
          <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>
            <strong>Illustrative sample only</strong> — issue counts and rows
            below are not results from a real scan.
          </p>
        </div>

        {/* Summary cards */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => (
            <Card key={item.label} padding="md">
              <p className="text-sm font-medium text-text-secondary">
                {item.label}
              </p>

              <p
                className={`mt-2 text-3xl font-bold ${item.valueClass}`}
              >
                {item.value}
              </p>

              <p className="mt-2 text-xs text-text-secondary">
                {item.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Issues table */}
        <section
          aria-labelledby="detected-issues-heading"
          className="overflow-hidden rounded-xl border border-border bg-surface"
        >
          <div className="px-5 py-5 sm:px-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <h2
                id="detected-issues-heading"
                className="text-lg font-semibold text-text-primary"
              >
                Detected issues
              </h2>

              <p className="text-sm text-text-secondary" aria-live="polite">
                {filteredIssues.length} example{" "}
                {filteredIssues.length === 1 ? "issue" : "issues"}
              </p>
            </div>

            {/* Search and filters */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(220px,1fr)_215px_185px]">
              <div className="relative">
                <label htmlFor="issue-search" className="sr-only">
                  Search issues
                </label>

                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  aria-hidden="true"
                />

                <input
                  id="issue-search"
                  type="search"
                  placeholder="Search issues"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-md border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                />
              </div>

              <div>
                <label htmlFor="severity-filter" className="sr-only">
                  Filter by severity
                </label>

                <select
                  id="severity-filter"
                  value={severityFilter}
                  onChange={(event) => setSeverityFilter(event.target.value)}
                  className="w-full cursor-pointer rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <option value="all">All severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Needs review">Needs review</option>
                </select>
              </div>

              <div>
                <label htmlFor="wcag-filter" className="sr-only">
                  Filter by WCAG criterion
                </label>

                <select
                  id="wcag-filter"
                  value={wcagFilter}
                  onChange={(event) => setWcagFilter(event.target.value)}
                  className="w-full cursor-pointer rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <option value="all">All WCAG criteria</option>
                  <option value="1.1.1">1.1.1</option>
                  <option value="1.4.3">1.4.3</option>
                  <option value="2.4.4">2.4.4</option>
                  <option value="4.1.2">4.1.2</option>
                </select>
              </div>
            </div>
          </div>

          {/* Horizontally scrollable table on small screens */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <caption className="sr-only">
                Illustrative accessibility issues, WCAG criteria, severity,
                occurrence counts, and details actions
              </caption>

              <thead className="bg-surface-subtle">
                <tr className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  <th scope="col" className="px-6 py-4">
                    Issue
                  </th>
                  <th scope="col" className="px-5 py-4">
                    WCAG
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Severity
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Occurrences
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Details
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="transition-colors hover:bg-surface-subtle"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 text-sm font-medium text-text-primary"
                    >
                      {issue.title}
                    </th>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-text-primary">
                      {issue.wcag}
                    </td>

                    <td className="px-5 py-4">
                      <Badge
                        variant={severityVariants[issue.severity]}
                        className={`min-w-28 justify-center ${severityStyles[issue.severity]}`}
                      >
                        {issue.severity}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-sm text-text-primary">
                      {issue.occurrences}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(issue)}
                        aria-label={`View details: ${issue.title}`}
                        className="cursor-pointer rounded-sm text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredIssues.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center"
                    >
                      <p className="font-medium text-text-primary">
                        No matching issues found
                      </p>
                      <p className="mt-2 text-sm text-text-secondary">
                        Try another search term or change your filters.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setSeverityFilter("all");
                          setWcagFilter("all");
                        }}
                        className="mt-4 cursor-pointer text-sm font-semibold text-brand-600 underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="border-t border-border px-6 py-4 text-center text-xs text-text-secondary">
            Example rows only · Select an issue to view details
          </p>
        </section>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-6 py-5">
        <p className="text-center text-xs text-text-secondary">
          Built with accessibility in mind
        </p>
      </footer>
    </main>
  );
}

export default Results;