import { useState } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function StudentHome() {
  const [profileOpen, setProfileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 bg-white shadow">
        {/* Left: Avatar + Student Info */}
        <div className="flex items-center gap-3">
          {/* User Avatar triggers profile sidebar */}
          <Drawer open={profileOpen} onOpenChange={setProfileOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setProfileOpen(true)}>
                <Avatar>
                  <AvatarImage src="/user-photo.jpg" alt="User" className="w-10 h-10 object-cover"/>
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerTitle className="sr-only">Profile Menu</DrawerTitle>
              <DrawerDescription className="sr-only">Navigation links for student profile and settings.</DrawerDescription>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-6">
                  <Avatar>
                    <AvatarImage src="/user-photo.jpg" alt="User" />
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Student Name</div>
                    <div className="text-xs text-gray-500">ID: 22XX123</div>
                  </div>
                </div>
                <nav className="flex flex-col gap-3">
                  <Link to="profile" className="text-gray-700 hover:text-blue-700" onClick={() => setProfileOpen(false)}>Profile</Link>
                  <Link to="academic-details" className="text-gray-700 hover:text-blue-700" onClick={() => setProfileOpen(false)}>Acadmic Details</Link>
                  <Link to="settings" className="text-gray-700 hover:text-blue-700" onClick={() => setProfileOpen(false)}>Settings</Link>
                  <Button variant="outline" className="mt-4 w-full" onClick={() => navigate("/auth/logout")}>Logout</Button>
                </nav>
              </div>
            </DrawerContent>
          </Drawer>
          {/* Student Info (visible always) */}
          <div className="flex flex-col">
            <span className="font-semibold text-base leading-tight">Student Name</span>
            <span className="text-xs text-gray-500 leading-tight">ID: 22XX123</span>
          </div>
        </div>
        {/* Right: Links (desktop) and Menu (mobile) */}
        <div className="flex items-center gap-2">
          {/* Desktop Links */}
          <div className="hidden md:flex gap-2">
            <Link to="" className="text-gray-700 hover:text-blue-700 px-3">Home</Link>
            <Link to="companies" className="text-gray-700 hover:text-blue-700 px-3">Companies</Link>
            <Link to="applied" className="text-gray-700 hover:text-blue-700 px-3">Applied</Link>
            <Link to="notices" className="text-gray-700 hover:text-blue-700 px-3">Completed</Link>
            <Link to="placedstudents" className="text-gray-700 hover:text-blue-700 px-3">Placed Students</Link>
            <Link to="contacttpc" className="text-gray-700 hover:text-blue-700 px-3">TPC</Link>
          </div>
          {/* Mobile Menu Button */}
          <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMenuOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerTitle className="sr-only">Main Menu</DrawerTitle>
              <DrawerDescription className="sr-only">Main navigation links for the application.</DrawerDescription>
              <nav className="flex flex-col gap-4 mt-8 p-4">
                <Link to="" className="text-gray-700 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="companies" className="text-gray-700 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Companies</Link>
                <Link to="applied" className="text-gray-700 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Applied</Link>
                <Link to="notices" className="text-gray-700 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Completed</Link>
                <Link to="placedstudents" className="text-gray-700 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Placed Students</Link>
                <Link to="contacttpc" className="text-gray-700 hover:text-blue-700" onClick={() => setMenuOpen(false)}>TPC</Link>
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 pt-20">
        <Outlet />
      </main>
    </div>
  )
}