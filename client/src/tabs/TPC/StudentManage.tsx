// app/pages/StudentDashboard.tsx

import { students } from "@/components/custom/studentData";
import { studentColumns } from "@/components/custom/column";
import { DataTable } from "@/components/custom/data-table";

export function StudentManage() {
  // In a real application, you would fetch this data from an API.
  // For this example, we are importing it directly from our dummy data file.
  const data = students;

  return (
    <div className="container mx-auto py-10 bg-white p-10">
      <h1 className="text-3xl font-bold mb-6">Student Management Dashboard</h1>
      <DataTable columns={studentColumns} data={data} />
    </div>
  );
}