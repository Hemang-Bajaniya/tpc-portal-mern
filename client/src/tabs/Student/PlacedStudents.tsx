import { Student } from "@/components/custom/Student";

const Students = [
  {
    id: "23CP001",
    name: "Krish",
    companie: "Roima",
    ctc: "5-7",
  },
  {
    id: "23CP001",
    name: "Krish",
    companie: "Roima",
    ctc: "5-7",
  },
  {
    id: "23CP001",
    name: "Krish",
    companie: "Roima",
    ctc: "5-7",
  },
];

export function PlacedStudents() {
  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Students.map((items:any , key:number) => (
                <Student
                    key={key}
                    studentId={items.id}
                    name={items.name}
                    companie={items.companie}
                    ctc={items.ctc}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
