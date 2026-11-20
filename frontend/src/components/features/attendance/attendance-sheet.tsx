import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/axios";
import { getAttendanceService, saveAttendanceService } from "@/services/attendance-service";
import type { AttendanceRow, AttendanceStatus } from "@/types";

const ICON: Record<AttendanceStatus, string> = { Present: "✓", Absent: "✗", Late: "◔" };
const STATUSES = Object.keys(ICON) as AttendanceStatus[];

export function AttendanceSheet() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(function fetchAttendance() {
    let active = true;
    async function loadAttendance() {
      try {
        const data = await getAttendanceService(date);
        if (active) { setRows(data); setError(""); }
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      }
    }
    setMessage("");
    loadAttendance();
    return function cleanup() { active = false; };
  }, [date]);

  function setAll(status: AttendanceStatus) {
    setRows(rows.map((r) => ({ ...r, status })));
  }
  function setOne(id: number, status: AttendanceStatus) {
    setRows(rows.map((r) => (r.studentId === id ? { ...r, status } : r)));
  }
  function count(status: AttendanceStatus) {
    return rows.filter((r) => r.status === status).length;
  }

  async function handleSave() {
    try {
      await saveAttendanceService(date, rows);
      setMessage("Attendance saved");
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <>
      <div className="bar">
        <label>Date<Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <div>
          <Button onClick={() => setAll("Present")}>Mark all present</Button>{" "}
          <Button onClick={() => setAll("Absent")}>Mark all absent</Button>
        </div>
      </div>
      <div className="cards three">
        {STATUSES.map((s) => <Card key={s} className={s} label={`${ICON[s]} ${s}`} value={count(s)} />)}
      </div>
      {error && <p role="alert" className="bad">{error}</p>}
      <table>
        <tbody>
          {rows.map((r) => (
            <tr key={r.studentId}>
              <td>{r.name}</td>
              <td className={r.status}>{ICON[r.status]} {r.status}</td>
              <td>
                <Select aria-label={"Status for " + r.name} value={r.status} onChange={(e) => setOne(r.studentId, e.target.value as AttendanceStatus)}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="actions">
        {message && <span role="status">{message}</span>}
        <Button variant="primary" onClick={handleSave}>Save attendance</Button>
      </div>
    </>
  );
}
