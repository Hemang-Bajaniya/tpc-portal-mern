// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./tabs/Authontication/Login"
import Register from "./tabs/Authontication/Register"
import StudentHome from "./tabs/Student/StudentHome"
import HomePage from "./tabs/Student/HomePage"
import StudentProfileForm from "./tabs/Student/Profile"
import AcademicDetailsForm from "./tabs/Student/AcademicDetailsForm"
import Settings from "./tabs/Student/Settings"
import StudentDashboard from "./tabs/Student/Dashboard"
import TPCDashboard from "./tabs/TPC/Dashboard"
import TPODashboard from "./tabs/TPO/Dashboard"
import TPFDashboard from "./tabs/TPF/Dashboard"
import TPCApproveStudent from "./tabs/TPC/ApproveStudent"
import TPOApproveTPC from "./tabs/TPO/ApproveTPC"
import TPCLayout from "./tabs/TPC/Layout"
import TPCProfileForm from "./tabs/TPC/Profile"
// import StudentDashboard from "./Pages/StudentDashboard"
// import StudentCourses from "./Pages/StudentCourses"
// import StudentNotices from "./Pages/StudentNotices"

function App() {
  return (
    <Routes>
      <Route path="/auth">
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>


      {/* Student routes */}
      <Route path="/student" element={<StudentHome />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<StudentProfileForm />} />
        <Route path="academic-details" element={<AcademicDetailsForm />} />
        <Route path="settings" element={<Settings />} />
        <Route path="dashboard" element={<StudentDashboard />} />
      </Route>


      {/* TPC routes with sidebar layout */}
      <Route path="/tpc" element={<TPCLayout />}>
        <Route path="dashboard" element={<TPCDashboard />} />
        <Route path="approve-student" element={<TPCApproveStudent />} />
        <Route path="profile" element={<TPCProfileForm />} />
      </Route>

      {/* TPO routes */}
      <Route path="/tpo/dashboard" element={<TPODashboard />} />
      <Route path="/tpo/approve-tpc" element={<TPOApproveTPC />} />

      {/* TPF routes */}
      <Route path="/tpf/dashboard" element={<TPFDashboard />} />

      {/* Redirect root to /auth/login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}

export default App