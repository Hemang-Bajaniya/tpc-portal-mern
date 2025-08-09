// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./tabs/Authontication/Login"
import Register from "./tabs/Authontication/Register"
import StudentHome from "./tabs/Student/StudentHome"
import HomePage from "./tabs/Student/HomePage"
import StudentProfileForm from "./tabs/Student/Profile"
import AcademicDetailsForm from "./tabs/Student/AcademicDetailsForm"
import Settings from "./tabs/Student/Settings"
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

      <Route path="/student" element={<StudentHome />}>
        <Route index element={<HomePage/>} />
        <Route path="profile" element={<StudentProfileForm />} />
        <Route path="academic-details" element={<AcademicDetailsForm/> } />
        <Route path="settings" element={<Settings />} />
        {/* <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="notices" element={<StudentNotices />} /> */}
        {/* Add more nested student pages here */}
      </Route>

      {/* Redirect root to /auth/login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}

export default App