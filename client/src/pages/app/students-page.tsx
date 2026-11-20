import { Link } from "react-router-dom";
import { PageHeader } from "@/components/common/page-header";
import { StudentCollection } from "@/components/features/students/student-collection";

export function StudentsPage() {
  return (
    <>
      <PageHeader title="Students" action={<Link className="primary btn" to="/students/new">+ Add Student</Link>} />
      <StudentCollection />
    </>
  );
}
