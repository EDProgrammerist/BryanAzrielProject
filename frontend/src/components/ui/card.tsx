import type { ReactNode } from "react";

export function Card({ label, value, className = "" }: { label: ReactNode; value: ReactNode; className?: string }) {
  return (
    <div className={`card ${className}`.trim()}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
