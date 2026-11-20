import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/axios";
import { createStudentService } from "@/services/student-service";
import type { NewStudent } from "@/types";

const fields: [keyof NewStudent, string, string?][] = [
  ["firstName", "First Name"],
  ["lastName", "Last Name"],
  ["email", "Email", "email"],
  ["enrollmentDate", "Enrollment Date", "date"],
  ["gradeLevel", "Grade Level"],
  ["address", "Address"],
];

const empty: NewStudent = { firstName: "", lastName: "", email: "", enrollmentDate: "", gradeLevel: "", address: "" };

export function StudentForm() {
  const nav = useNavigate();
  const [form, setForm] = useState<NewStudent>(empty);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await createStudentService(form);
      nav("/students");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid2">
        {fields.map(([key, label, type = "text"]) => (
          <label key={key}>{label}
            <Input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </label>
        ))}
      </div>
      {error && <p role="alert" className="bad">{error}</p>}
      <div className="actions">
        <Button onClick={() => nav("/students")}>Cancel</Button>
        <Button type="submit" variant="primary">Save student</Button>
      </div>
    </form>
  );
}
