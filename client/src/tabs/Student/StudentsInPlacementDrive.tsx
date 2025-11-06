import { Student } from "@/components/custom/Student";

const Students = [
  {
    college_id: "23CP001",
    name: "Krish Patel",
    dept_name: "Computer",
  },
  {
    college_id: "23CP002",
    name: "Anaya Shah",
    dept_name: "Computer",
  },
  {
    college_id: "23CP003",
    name: "Rohan Mehta",
    dept_name: "Computer",
  },
  {
    college_id: "23CP004",
    name: "Ishita Desai",
    dept_name: "Computer",
  },
  {
    college_id: "23CP005",
    name: "Aarav Joshi",
    dept_name: "Computer",
  },
  {
    college_id: "23CP006",
    name: "Mira Thakkar",
    dept_name: "Computer",
  },
];

export function StudentsInPlacementDrive() {
  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Students.map((items:any , key:number) => (
                <Student
                    key={key}
                    studentId={items.college_id}
                    name={items.name}
                    department={items.dept_name}
                    companie={items.companie}
                    ctc={items.ctc}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
