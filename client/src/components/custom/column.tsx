// components/ui/column.tsx

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Student } from "@/components/custom/studentData"; // Import the Student type

// (Your existing column definitions like userListColumns, etc., would remain here)
// ...

// --- NEW: Column definitions for the student management table ---
export const studentColumns: ColumnDef<Student>[] = [
  // Checkbox column for row selection
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Student Name column (sortable)
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },

  // College ID column
  {
    accessorKey: "collegeId",
    header: "College ID",
    cell: ({ row }) => <div className="font-mono">{row.getValue("collegeId")}</div>,
  },

  // Email column (sortable)
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },

  // Department column
  {
    accessorKey: "department",
    header: "Department",
  },
  
  // CGPA column (sortable)
  {
    accessorKey: "cgpa",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CGPA
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => {
        const cgpa = parseFloat(row.getValue("cgpa"));
        return <div className="text-center font-medium">{cgpa.toFixed(2)}</div>
    }
  },

  // Placement Status column with custom badge
  {
    accessorKey: "isPlaced",
    header: "Placement Status",
    cell: ({ row }) => {
      const isPlaced = row.getValue("isPlaced");
      return (
        <Badge variant={isPlaced ? "default" : "secondary"}>
          {isPlaced ? "Placed" : "Not Placed"}
        </Badge>
      );
    },
  },

  // Actions column with a dropdown menu
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(student.email)}
            >
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/students/view/${student.id}`}>View Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`/students/edit/${student.id}`}>Edit Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];