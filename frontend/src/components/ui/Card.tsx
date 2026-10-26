import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
};

function Card({
  children,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  const baseStyles =
    "rounded-xl border border-border bg-surface shadow-sm";

  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;