import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserMenu } from "@/components/common/user-menu";
import { Input } from "@/components/ui/input";

const links: [string, string][] = [
  ["/", "Dashboard"],
  ["/students", "Students"],
  ["/grades", "Grades"],
  ["/attendance", "Attendance"],
  ["/settings", "Settings"],
];

export function AppLayout() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <div className="app">
      <aside>
        <h2>SMS</h2>
        <nav aria-label="Main">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>
          ))}
        </nav>
      </aside>
      <main>
        <header>
          <Input
            aria-label="Search students"
            placeholder="Search students"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && nav("/students?q=" + encodeURIComponent(query))}
          />
          <UserMenu />
        </header>
        <Outlet />
      </main>
    </div>
  );
}
