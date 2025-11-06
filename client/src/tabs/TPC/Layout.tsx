import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, LogOut } from "lucide-react";

const sidebarLinks = [
  { label: "Approve Student", to: "/tpc/approve-student" },
  { label: "Approve Acadmic Details", to: "/tpc/approve-acadmic-details" },
  { label: "Student Management", to: "/tpc/student-management" },
  { label: "Company Management", to: "/tpc/company-management" },
  { label: "Job Profile Management", to: "/tpc/job-profile-management" },
  { label: "Placement Drives", to: "/tpc/placement-drives-management" },
  { label: "Applications", to: "/tpc/application-management" },
  { label: "Results", to: "/tpc/placedstudents" },
  { label: "Reports", to: "/tpc/reports" },
  { label: "Contact TPC", to: "/tpc/contact-tpc" },
];

export default function TPCLayout() {
  const location = useLocation();

  return (
    <div className="grid h-screen w-full pl-[280px]">
      <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r w-[280px]">
        <div className="border-b p-2 h-[57px] flex items-center">
          <h1 className="text-xl font-semibold ml-2">TPC Panel</h1>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-80px)] pb-10 pl-6">
          <nav className="grid gap-1 p-2">
            {sidebarLinks.map((link) => (
              <Link to={link.to} key={link.label}>
                <Button
                  variant={
                    location.pathname.startsWith(link.to)
                      ? "secondary"
                      : "ghost"
                  }
                  className="w-full justify-start"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" aria-label="User Profile">
                <User className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2" align="end">
              <div className="flex flex-col gap-1">
                <Link
                  to="/tpc/profile"
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted text-sm"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  to="/auth/logout"
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </header>

        {/* Main Content */}
        <main className="grid flex-1 gap-4 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
