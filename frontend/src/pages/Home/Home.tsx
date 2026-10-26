import {useState, type FormEvent} from "react"
import {ArrowRight, ScanSearch, ShieldCheck} from "lucide-react"
import {useNavigate} from "react-router-dom"

import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Card from "../../components/ui/Card"

function Home() {
  const navigate = useNavigate()

  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setStatus("")

    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      setError("Enter a website URL to continue.")
      return
    }

    let parsedUrl: URL

    try {
      parsedUrl = new URL(trimmedUrl)
    } catch {
      setError("Enter a valid URL, such as https://example.com.")
      return
    }

    if (
      !["http:", "https:"].includes(parsedUrl.protocol) ||
      !parsedUrl.hostname.includes(".")
    ) {
      setError("Enter a valid website URL starting with https://.")
      return
    }

    setError("")
    navigate("/scan-progress", {
      state: {url: parsedUrl.href},
    })
    setStatus(
      "The URL is valid. Accessibility scanning will be available when the scanner is connected.",
    )

    // Temporary: the backend scanner will be connected later.
    console.log("URL submitted for scanning:", parsedUrl.href)
  }

  return (
    <main className="flex min-h-screen flex-col bg-surface-subtle">
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

      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <div
              className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"
              aria-hidden="true"
            >
              <ScanSearch size={32} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Make your website more accessible.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
              Check a website for common accessibility issues and discover what
              needs improvement.
            </p>
          </div>

          <Card padding="lg" className="shadow-md">
            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="Website URL"
                name="url"
                type="url"
                placeholder="https://example.com"
                autoComplete="url"
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value)
                  if (error) setError("")
                }}
                hint="Enter the full URL of the website you want to check."
                error={error}
                required
              />

              <Button type="submit" className="mt-5 w-full sm:w-auto">
                Check Accessibility
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </form>

            {status && (
              <p
                className="mt-4 text-sm text-text-secondary"
                role="status"
                aria-live="polite"
              >
                {status}
              </p>
            )}

            <div className="mt-5 flex items-start gap-2 border-t border-border pt-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-text-secondary"
                aria-hidden="true"
              />
              <p className="text-sm text-text-secondary">
                No account required. Automated checks can identify common
                issues, but they cannot confirm complete accessibility.
              </p>
            </div>
          </Card>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Start with a URL. Discover what you can improve.
          </p>
        </div>
      </section>

      <footer className="border-t border-border bg-surface px-6 py-4">
        <p className="text-center text-sm text-text-secondary">
          AccessAble · Accessibility insights for the web
        </p>
      </footer>
    </main>
  )
}

export default Home
