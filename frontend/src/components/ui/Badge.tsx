type BadgeVariant = "critical" | "high" | "medium" | "low" | "info";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

function Badge({
  variant,
  children,
  className = "",
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold";

  const variants: Record<BadgeVariant, string> = {
    critical: "bg-critical-bg text-critical",
    high: "bg-high-bg text-high",
    medium: "bg-medium-bg text-medium",
    low: "bg-low-bg text-low",
    info: "bg-brand-50 text-brand-700",
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;