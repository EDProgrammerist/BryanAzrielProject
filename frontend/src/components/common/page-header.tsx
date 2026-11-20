import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  action?: ReactNode;
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="bar">
      <h1>{title}</h1>
      {action}
    </div>
  );
}
