import { Link, Outlet, useLocation } from "react-router-dom";

const sidebarLinks = [
  { label: "Dashboard", to: "/tpc/dashboard" },

  // Main functional modules
  { label: "Student Management", to: "/tpc/student-management" },
  { label: "Company Management", to: "/tpc/company-management" },
  { label: "Placement Drives", to: "/tpc/placement-drives" },
  { label: "Applications", to: "/tpc/applications" },
  { label: "Results", to: "/tpc/results" },
  { label: "Reports", to: "/tpc/reports" },
  { label: "Notifications", to: "/tpc/notifications" },
  { label: "Profile", to: "/tpc/profile" },
];

export default function TPCLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r flex flex-col p-4">
        <h2 className="text-xl font-bold mb-8">TPC Panel</h2>
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded hover:bg-gray-100 font-medium ${
                location.pathname === link.to ? "bg-gray-200" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
