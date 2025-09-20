import { Link, Outlet, useLocation } from "react-router-dom";

const sidebarLinks = [
    { label: "Dashboard", to: "/tpc/dashboard" },
    { label: "Approve Students", to: "/tpc/approve-student" },
    { label: "Profile", to: "/tpc/profile" },
];

export default function TPCLayout() {
    const location = useLocation();
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-white border-r flex flex-col p-4">
                <h2 className="text-xl font-bold mb-8">TPC Panel</h2>
                <nav className="flex flex-col gap-2">
                    {sidebarLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`px-4 py-2 rounded hover:bg-gray-100 font-medium ${location.pathname === link.to ? "bg-gray-200" : ""}`}
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
