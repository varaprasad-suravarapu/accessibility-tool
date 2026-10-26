import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

function Button({
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700",
    secondary:
      "border border-border bg-surface text-text-primary hover:bg-surface-subtle",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;