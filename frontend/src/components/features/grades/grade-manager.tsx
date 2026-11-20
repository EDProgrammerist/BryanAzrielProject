import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/axios";
import {
  createGradeService,
  deleteGradeService,
  getGradesService,
  updateGradeService,
} from "@/services/grade-service";
import { getStudentsService } from "@/services/student-service";
import type { Grade, GradeFormValues, GradeResult, Student } from "@/types";

const emptyForm: GradeFormValues = { subject: "", assignment: "", score: "" };

export function GradeManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [semester, setSemester] = useState("1st Semester");
  const [result, setResult] = useState<GradeResult>({ data: [], gpa: 0, average: 0 });
  const [form, setForm] = useState<GradeFormValues>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<GradeFormValues>(emptyForm);
  const [error, setError] = useState("");

  useEffect(function fetchStudents() {
    let active = true;
    async function loadStudents() {
      try {
        const list = await getStudentsService("", 1, 100);
        if (!active) return;
        setStudents(list.data);
        if (list.data.length > 0) setStudentId(list.data[0].id);
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      }
    }
    loadStudents();
    return function cleanup() { active = false; };
  }, []);

  const loadGrades = useCallback(async function loadGrades() {
    if (studentId === null) return;
    try {
      setResult(await getGradesService(studentId, semester));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [studentId, semester]);

  useEffect(function fetchGrades() {
    setEditingId(null);
    setError("");
    loadGrades();
  }, [loadGrades]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (studentId === null) return;
    setError("");
    try {
      await createGradeService({ ...form, studentId, term: semester });
      setForm(emptyForm);
      loadGrades();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function startEdit(grade: Grade) {
    setEditingId(grade.id);
    setEditForm({ subject: grade.subject, assignment: grade.assignment, score: grade.score });
    setError("");
  }

  async function saveEdit() {
    if (editingId === null) return;
    try {
      await updateGradeService(editingId, editForm);
      setEditingId(null);
      loadGrades();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(grade: Grade) {
    if (!confirm(`Delete "${grade.assignment}"?`)) return;
    try {
      await deleteGradeService(grade.id);
      loadGrades();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <>
      <div className="pill">Current GPA: {result.gpa} &nbsp; Average: {result.average}</div>

      <div className="grid2">
        <label>Student
          <Select value={studentId ?? ""} onChange={(e) => setStudentId(Number(e.target.value))}>
            {students.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
          </Select>
        </label>
        <label>Semester
          <Select value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option>1st Semester</option>
            <option>2nd Semester</option>
          </Select>
        </label>
      </div>

      <form className="addrow" onSubmit={handleAdd}>
        <label>Subject<Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></label>
        <label>Assignment<Input value={form.assignment} onChange={(e) => setForm({ ...form, assignment: e.target.value })} /></label>
        <label>Score (0-100)<Input type="number" min="0" max="100" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} /></label>
        <Button type="submit" variant="primary">Add grade</Button>
      </form>

      {error && <p role="alert" className="bad">{error}</p>}

      <table>
        <thead>
          <tr><th>Subject</th><th>Assignment</th><th>Score</th><th>Grade</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {result.data.map((g) =>
            editingId === g.id ? (
              <tr key={g.id}>
                <td><Input value={editForm.subject} onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })} /></td>
                <td><Input value={editForm.assignment} onChange={(e) => setEditForm({ ...editForm, assignment: e.target.value })} /></td>
                <td><Input type="number" min="0" max="100" value={editForm.score} onChange={(e) => setEditForm({ ...editForm, score: e.target.value })} /></td>
                <td>-</td>
                <td>
                  <Button variant="primary" onClick={saveEdit}>Save</Button>
                  <Button onClick={() => setEditingId(null)}>Cancel</Button>
                </td>
              </tr>
            ) : (
              <tr key={g.id}>
                <td>{g.subject}</td>
                <td>{g.assignment}</td>
                <td>{g.score}</td>
                <td className={"letter-" + g.grade}>{g.grade}</td>
                <td>
                  <Button onClick={() => startEdit(g)}>Edit</Button>
                  <Button variant="ghost" onClick={() => handleDelete(g)}>Delete</Button>
                </td>
              </tr>
            )
          )}
          {result.data.length === 0 && (
            <tr><td colSpan={5}>No grades for this semester yet. Add one above.</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}
