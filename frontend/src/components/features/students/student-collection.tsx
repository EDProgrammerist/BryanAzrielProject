import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/axios";
import { deleteStudentService, getStudentsService } from "@/services/student-service";
import type { Student, StudentList } from "@/types";

const PAGE_SIZE = 5;

export function StudentCollection() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<StudentList>({ data: [], total: 0, pages: 1 });
  const [error, setError] = useState("");

  const loadStudents = useCallback(async function loadStudents() {
    try {
      setResult(await getStudentsService(q, page, PAGE_SIZE));
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [q, page]);

  useEffect(function resetPage() { setPage(1); }, [q]);
  useEffect(function fetchStudents() { loadStudents(); }, [loadStudents]);

  async function handleDelete(student: Student) {
    if (!confirm(`Delete ${student.firstName} ${student.lastName}?`)) return;
    try {
      await deleteStudentService(student.id);
      loadStudents();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <>
      {error && <p role="alert" className="bad">{error}</p>}
      <table>
        <thead>
          <tr><th>#</th><th>Name</th><th>Grades</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {result.data.map((s, index) => (
            <tr key={s.id}>
              <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
              <td>{s.firstName} {s.lastName}</td>
              <td className={"letter-" + s.grade}>{s.grade}</td>
              <td className={s.status === "Active" ? "ok" : "warn"}>{s.status === "Active" ? "✓ Active" : "○ Inactive"}</td>
              <td><Button variant="ghost" onClick={() => handleDelete(s)}>Delete</Button></td>
            </tr>
          ))}
          {!result.data.length && <tr><td colSpan={5}>No students found.</td></tr>}
        </tbody>
      </table>
      <div className="pager">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
        {Array.from({ length: result.pages }, (_, i) => (
          <button key={i} aria-current={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</button>
        ))}
        <Button disabled={page === result.pages} onClick={() => setPage(page + 1)}>Next</Button>
      </div>
    </>
  );
}