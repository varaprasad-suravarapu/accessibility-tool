
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

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

interface IssueDetailsLocationState {
  issue?: AccessibilityIssue;
  url?: string;
}

const fallbackIssue: AccessibilityIssue = {
  id: "1",
  title: "Images missing alternative text",
  wcag: "1.1.1 · A",
  severity: "Critical",
  occurrences: 4,
  description:
    "One or more images may be missing an appropriate text alternative.",
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

const issueGuidance: Record<
  string,
  { name: string; level: string; fix: string; example: string }
> = {
  "1.1.1": {
    name: "Non-text Content",
    level: "Level A · Perceivable",
    fix:
      "Add concise, context-appropriate alternative text that conveys the image's purpose. Avoid repeating nearby text. If the image is purely decorative, use an empty alt attribute.",
    example: '<img src="product.jpg" alt="Blue running shoes">',
  },
  "1.4.3": {
    name: "Contrast (Minimum)",
    level: "Level AA · Perceivable",
    fix:
      "Adjust the foreground and background colors to meet the required contrast ratio. Normal text generally needs at least 4.5:1 contrast; large text needs at least 3:1.",
    example: "Choose text and background colors with sufficient contrast.",
  },
  "2.4.4": {
    name: "Link Purpose (In Context)",
    level: "Level A · Operable",
    fix:
      "Use link text that describes its destination or purpose. If necessary, provide additional context programmatically associated with the link.",
    example: '<a href="/products">View all products</a>',
  },
  "4.1.2": {
    name: "Name, Role, Value",
    level: "Level A · Robust",
    fix:
      "Give each form control an accessible name, such as a visible label associated with the control. Verify that its name, role, and value are available to assistive technologies.",
    example: '<label for="email">Email address</label>\n<input id="email" type="email">',
  },
};

function IssueDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as IssueDetailsLocationState | null;

  const issue = state?.issue ?? fallbackIssue;
  const url = state?.url ?? "https://example.com/products";

  const criterion = issue.wcag.split(" · ")[0];
  const guidance = issueGuidance[criterion] ?? {
    name: "Accessibility criterion",
    level: "Review the applicable WCAG requirement",
    fix:
      "Review the affected element and verify the issue against the applicable WCAG criterion. Confirm the appropriate fix through manual testing.",
    example: "Example code will depend on the affected element.",
  };

  const isIllustrative = !state?.issue;

  function handleBack() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/results", { state: { url } });
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-surface">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
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

          <Button variant="secondary" onClick={handleBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to results
          </Button>
        </div>
      </header>

      {/* Issue details */}
      <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5 text-xs sm:text-sm">
          <button
            type="button"
            onClick={handleBack}
            className="cursor-pointer font-medium text-brand-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
          >
            Accessibility Results
          </button>

          <span className="mx-4 text-text-secondary" aria-hidden="true">
            /
          </span>

          <span className="text-text-secondary">Issue Details</span>
        </nav>

        {/* Title and metadata */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {issue.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Badge variant={severityVariants[issue.severity]}>
              {issue.severity}
            </Badge>

            <span className="text-sm text-text-secondary">
              WCAG 2.2 · {criterion} {guidance.name}
            </span>

            <span className="break-all text-sm text-text-secondary sm:ml-5">
              {url}
            </span>
          </div>
        </div>

        {/* Sample data notice */}
        <div
          role="note"
          className="mb-6 rounded-lg bg-medium-bg px-4 py-3.5 text-sm text-high"
        >
          <strong>Illustrative example only</strong> — this is not a finding
          from a real scan.
        </div>

        {/* Main content and sidebar */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1.85fr)_minmax(280px,1fr)]">
          <div className="flex min-w-0 flex-col gap-4">
            <Card padding="md">
              <h2 className="text-base font-semibold text-text-primary">
                What was detected
              </h2>

              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {issue.description}
              </p>

              {criterion === "1.1.1" && (
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Screen readers may announce the image without meaningful
                  information, or skip context that sighted users receive
                  visually.
                </p>
              )}
            </Card>

            <Card padding="md">
              <h2 className="text-base font-semibold text-text-primary">
                Why it matters
              </h2>

              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {criterion === "1.1.1"
                  ? "People who use screen readers may not understand the purpose or content of informative images. Alternative text should communicate the image's relevant meaning in its context; decorative images may need an empty alt attribute."
                  : criterion === "1.4.3"
                    ? "People with low vision or color-vision deficiencies may struggle to read text when contrast is insufficient. Adequate contrast helps make content more readable."
                    : criterion === "2.4.4"
                      ? "People using screen readers or navigating quickly between links need to understand each link's purpose to navigate confidently."
                      : criterion === "4.1.2"
                        ? "Assistive technologies rely on accessible names and roles to identify controls and communicate their purpose to users."
                        : "Accessibility barriers can make content or functionality difficult to understand or operate. Verify the issue and its impact with appropriate testing."}
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-base font-semibold text-text-primary">
                Affected element
              </h2>

              <p className="mt-3 text-sm text-text-secondary">
                Example element snippet (illustrative)
              </p>

              <pre className="mt-2 overflow-x-auto rounded-lg bg-[#111827] p-4 text-sm leading-6 text-slate-100">
                <code>
                  {criterion === "1.1.1"
                    ? '<img src="product.jpg">'
                    : criterion === "1.4.3"
                      ? '<p class="low-contrast">Important text</p>'
                      : criterion === "2.4.4"
                        ? '<a href="/products">Click here</a>'
                        : criterion === "4.1.2"
                          ? '<input type="email">'
                          : "Example element (not supplied by a scanner)"}
                </code>
              </pre>

              <p className="mt-3 text-xs leading-5 text-text-secondary">
                Selector / source location: available when provided by the
                scanner.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-base font-semibold text-text-primary">
                How to fix it
              </h2>

              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {guidance.fix}
              </p>

              <pre className="mt-3 overflow-x-auto rounded-lg bg-brand-50 p-4 text-sm leading-6 text-text-primary">
                <code>{guidance.example}</code>
              </pre>

              <p className="mt-3 text-xs leading-5 text-text-secondary">
                Example code is illustrative. Adapt the fix to the actual
                element and verify it with manual accessibility testing.
              </p>
            </Card>
          </div>

          {/* Sidebar */}
          <aside aria-label="Issue summary" className="flex flex-col gap-4">
            <Card padding="md">
              <h2 className="text-sm font-semibold text-text-primary">
                Occurrences
              </h2>

              <p className="mt-2 text-2xl font-bold text-text-primary">
                {issue.occurrences}{" "}
                {issue.occurrences === 1 ? "instance" : "instances"}
              </p>

              <p className="mt-2 text-xs leading-5 text-text-secondary">
                Example count · verify against scan output
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-sm font-semibold text-text-primary">
                WCAG reference
              </h2>

              <p className="mt-3 text-sm font-medium text-text-primary">
                {criterion} — {guidance.name}
              </p>

              <p className="mt-2 text-sm text-text-secondary">
                {guidance.level}
              </p>

              <a
                href={`https://www.w3.org/WAI/WCAG22/Understanding/${
                  criterion === "1.1.1"
                    ? "non-text-content"
                    : criterion === "1.4.3"
                      ? "contrast-minimum"
                      : criterion === "2.4.4"
                        ? "link-purpose-in-context"
                        : criterion === "4.1.2"
                          ? "name-role-value"
                          : ""
                }.html`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
              >
                Read WCAG guidance
                <ArrowUpRight size={15} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Card>

            <Card padding="md">
              <h2 className="text-sm font-semibold text-text-primary">
                Detection confidence
              </h2>

              <div className="mt-3">
                <Badge variant="high">Needs human review</Badge>
              </div>

              <p className="mt-3 text-sm leading-5 text-text-secondary">
                Automated tools cannot determine the correct alternative text
                for every image. Review the element and surrounding context
                before confirming the fix.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-sm font-semibold text-text-primary">
                Next step
              </h2>

              <Button
                className="mt-3 w-full"
                onClick={handleBack}
              >
                Back to Results
              </Button>
            </Card>
          </aside>
        </div>

        {isIllustrative && (
          <p className="sr-only" role="status">
            Showing an illustrative example issue because no issue was
            supplied through navigation.
          </p>
        )}
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

export default IssueDetails;
