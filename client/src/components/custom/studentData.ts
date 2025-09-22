// app/data/students.ts

// This type defines the flattened structure of our student data for the table
export type Student = {
  id: string;
  name: string;
  collegeId: string;
  email: string;
  department: "Computer" | "IT" | "Mechanical" | "Civil" | "Electrical";
  cgpa: number;
  isPlaced: boolean;
};

// Array of dummy student data
export const students: Student[] = [
  {
    id: "STU001",
    name: "Aarav Sharma",
    collegeId: "21CS001",
    email: "aarav.sharma@university.edu",
    department: "Computer",
    cgpa: 8.75,
    isPlaced: true,
  },
  {
    id: "STU002",
    name: "Diya Patel",
    collegeId: "21IT002",
    email: "diya.patel@university.edu",
    department: "IT",
    cgpa: 9.1,
    isPlaced: true,
  },
  {
    id: "STU003",
    name: "Rohan Mehta",
    collegeId: "21ME003",
    email: "rohan.mehta@university.edu",
    department: "Mechanical",
    cgpa: 7.2,
    isPlaced: false,
  },
  {
    id: "STU004",
    name: "Isha Singh",
    collegeId: "21CS004",
    email: "isha.singh@university.edu",
    department: "Computer",
    cgpa: 8.5,
    isPlaced: false,
  },
  {
    id: "STU005",
    name: "Kabir Gupta",
    collegeId: "21CV005",
    email: "kabir.gupta@university.edu",
    department: "Civil",
    cgpa: 6.9,
    isPlaced: true,
  },
  {
    id: "STU006",
    name: "Ananya Reddy",
    collegeId: "21IT006",
    email: "ananya.reddy@university.edu",
    department: "IT",
    cgpa: 9.5,
    isPlaced: true,
  },
  {
    id: "STU007",
    name: "Vivaan Joshi",
    collegeId: "21EE007",
    email: "vivaan.joshi@university.edu",
    department: "Electrical",
    cgpa: 8.1,
    isPlaced: false,
  },
  {
    id: "STU008",
    name: "Saanvi Rao",
    collegeId: "21CS008",
    email: "saanvi.rao@university.edu",
    department: "Computer",
    cgpa: 7.8,
    isPlaced: true,
  },
];