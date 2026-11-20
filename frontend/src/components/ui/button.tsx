import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "ghost";
}

export function Button({ variant = "default", className = "", type = "button", ...props }: ButtonProps) {
  const variantClass = variant === "default" ? "" : variant;
  return <button type={type} className={`${variantClass} ${className}`.trim()} {...props} />;
}
