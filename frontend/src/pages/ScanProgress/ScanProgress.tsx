import {
  ArrowLeft,
  ArrowRight,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

import { useNavigate } from "react-router-dom";

interface ScanProgressProps {
  url: string;
  onCancel: () => void;
}

function ScanProgress({ url, onCancel }: ScanProgressProps) {

  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col bg-surface-subtle">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-7xl items-center px-6 py-5">
          <a
            href="/"
            aria-label="AccessAble home"
            className="inline-flex items-center gap-2 rounded-md text-lg font-bold text-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <ScanSearch size={21} aria-hidden="true" />
            </span>
            AccessAble
          </a>
        </div>
      </header>

      {/* Main content */}
      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          <Card padding="lg" className="text-center shadow-md">
            {/* Status icon */}
            <div
              className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"
              aria-hidden="true"
            >
              <ScanSearch size={32} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Checking your website
            </h1>

            <p className="mt-3 text-base leading-7 text-text-secondary">
              Your website is ready for an accessibility check.
            </p>

            {/* Submitted URL */}
            <div className="mt-8 rounded-lg border border-border bg-surface-subtle p-4 text-left">
              <p className="mb-2 text-sm font-medium text-text-secondary">
                Website URL
              </p>

              <p className="break-all text-sm font-medium text-text-primary">
                {url}
              </p>
            </div>

            {/* Indeterminate progress indicator */}
            <div className="mt-8 text-left">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-text-primary">
                  Scan status
                </span>

                <span className="text-sm text-text-secondary">
                  Preparing scan
                </span>
              </div>

              <div
                className="h-2 w-full overflow-hidden rounded-full bg-brand-100"
                role="status"
                aria-label="Scan interface status"
              >
                <div className="h-full w-2/5 rounded-full bg-brand-600" />
              </div>

              <p className="mt-4 text-sm leading-6 text-text-secondary">
                The scanning service is not connected yet. No accessibility
                scan is running in this preview.
              </p>
            </div>

            {/* Automated-check limitation */}
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-surface p-4 text-left">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-text-secondary"
                aria-hidden="true"
              />

              <p className="text-sm leading-6 text-text-secondary">
                Automated checks can identify many common accessibility
                issues, but some problems require manual testing.
              </p>
            </div>

            {/* Cancel action */}
            <div className="mt-8 flex justify-center gap-2">
              <Button variant="secondary" onClick={onCancel}>
                <ArrowLeft size={18} aria-hidden="true" />
                Cancel scan
              </Button>

              <Button variant="secondary" 
              onClick={() => navigate("/results", { state: { url } })}
              >
                View sample results
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface px-6 py-4">
        <p className="text-center text-sm text-text-secondary">
          AccessAble · Accessibility insights for the web
        </p>
      </footer>
    </main>
  );
}

export default ScanProgress;