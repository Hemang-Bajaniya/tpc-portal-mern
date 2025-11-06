import { useEffect, useState } from "react";
import { Student } from "@/components/custom/Student";

interface PlacedStudent {
  college_id: string;
  name: string;
  dept_name: string;
  companie: string;
  ctc: string;
}

export function PlacedStudents({backgroundColor}: {backgroundColor: string}) {
  const [students, setStudents] = useState<PlacedStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlacedStudents = async () => {
      try {
        // Simulate async delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Dummy data
        const dummyData: PlacedStudent[] = [
          {
            college_id: "23CP001",
            name: "Krish Patel",
            dept_name: "Computer",
            companie: "Roima",
            ctc: "6.5 LPA",
          },
          {
            college_id: "23CP002",
            name: "Anaya Shah",
            dept_name: "Computer",
            companie: "Google",
            ctc: "30 LPA",
          },
          {
            college_id: "23CP003",
            name: "Rohan Mehta",
            dept_name: "Computer",
            companie: "TCS",
            ctc: "7 LPA",
          },
          {
            college_id: "23CP004",
            name: "Ishita Desai",
            dept_name: "Computer",
            companie: "Microsoft",
            ctc: "28 LPA",
          },
          {
            college_id: "23CP005",
            name: "Aarav Joshi",
            dept_name: "Computer",
            companie: "Infosys",
            ctc: "5.5 LPA",
          },
          {
            college_id: "23CP006",
            name: "Mira Thakkar",
            dept_name: "Computer",
            companie: "Amazon",
            ctc: "27 LPA",
          },
        ];

        // Set data
        setStudents(dummyData);

        // You can later replace this with actual API call
        /*
        const token = localStorage.getItem("token");
        const response = await fetch("/api/placed-students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Failed to fetch");
        setStudents(result.data.students || []);
        */
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlacedStudents();
  }, []);

  return (
    <div className={`h-full ${backgroundColor} p-2`}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Placed Students</h1>

      {loading && (
        <p className="text-center text-gray-600">Loading students...</p>
      )}

      {error && !loading && (
        <p className="text-center text-red-500 mt-4">Error: {error}</p>
      )}

      {!loading && !error && students.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No placed students found.
        </p>
      )}

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {!loading &&
            !error &&
            students.map((student, index) => (
              <Student
                key={index}
                studentId={student.college_id}
                name={student.name}
                department={student.dept_name}
                companie={student.companie}
                ctc={student.ctc}
              />
            ))}
        </div>
      </div>
    </div>
  );
}