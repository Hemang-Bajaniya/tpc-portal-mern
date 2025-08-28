import { Student } from "@/components/custom/Student";
import { TPC } from "@/components/custom/TPC";

const Students = [
  {
    id: "23CP001",
    name: "Krish Rana",
    positon: "Head",
    contact: "5457878454",
  },
  {
    id: "23CP001",
    name: "Suresh Meheta",
    positon: "Cordinator",
    contact: "5-5457878454",
  },
  {
    id: "23CP001",
    name: "Mahesh Shah",
    positon: "CO-Head",
    contact: "5457878454-7",
  },
];

export function ContactTpc() {
  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Students.map((items:any , key:number) => (
                <TPC
                    key={key}
                    studentId={items.id}
                    name={items.name}
                    positon={items.positon}
                    contact={items.contact}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
