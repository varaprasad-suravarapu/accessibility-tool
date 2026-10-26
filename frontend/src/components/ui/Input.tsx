import { useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

function Input({
  label,
  hint,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy = [
    hint ? hintId : undefined,
    error ? errorId : undefined,
    props["aria-describedby"],
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-medium text-text-primary"
      >
        {label}
      </label>

      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full rounded-md border bg-surface px-4 py-3 text-text-primary placeholder:text-text-muted ${
          error
            ? "border-critical"
            : "border-border"
        } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${className}`}
        {...props}
      />

      {hint && (
        <p id={hintId} className="mt-2 text-sm text-text-secondary">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 text-sm font-medium text-critical"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;