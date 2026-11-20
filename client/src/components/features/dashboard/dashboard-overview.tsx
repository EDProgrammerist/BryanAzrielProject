import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/axios";
import { getDashboardService } from "@/services/dashboard-service";
import type { DashboardStats } from "@/types";

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(function fetchDashboard() {
    let active = true;
    async function loadDashboard() {
      try {
        const data = await getDashboardService();
        if (active) setStats(data);
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      }
    }
    loadDashboard();
    return function cleanup() { active = false; };
  }, []);

  if (error) return <p role="alert" className="bad">{error}</p>;
  if (!stats) return <p>Loading…</p>;

  return (
    <>
      <div className="cards">
        <Card label="Total Students" value={stats.totalStudents} />
        <Card label="Active Now" value={stats.activeNow} />
        <Card label="Avg. Grade" value={stats.avgGrade} />
        <Card label="Attendance Rate" value={stats.attendanceRate + "%"} />
      </div>
      <section className="panel">
        <h2>Recent Activity</h2>
        {stats.recent.length ? (
          <ul>
            {stats.recent.map((a, i) => (
              <li key={i}>{a.msg} <small>{new Date(a.at).toLocaleTimeString()}</small></li>
            ))}
          </ul>
        ) : (
          <p>No activity yet. Add a student or save attendance to get started.</p>
        )}
      </section>
    </>
  );
}
