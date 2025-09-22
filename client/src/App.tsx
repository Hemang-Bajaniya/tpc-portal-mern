import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./tabs/Authontication/Login";
import Register from "./tabs/Authontication/Register";
import StudentHome from "./tabs/Student/StudentHome";
import HomePage from "./tabs/Student/HomePage";
import AcademicDetailsForm from "./tabs/Student/AcademicDetailsForm";
import Settings from "./tabs/Student/Settings";
import TPODashboard from "./tabs/TPO/Dashboard";
import TPOApproveTPC from "./tabs/TPO/ApproveTPC";
import TPFDashboard from "./tabs/TPF/Dashboard";
import Companies from "./tabs/Student/Companies";
import { PlacedStudents } from "./tabs/Student/PlacedStudents";
import Applied from "./tabs/Student/Applied";
import { ContactTpc } from "./tabs/Student/ContactTpc";
import { Logout } from "./tabs/Authontication/Logout";
import TPCLayout from "./tabs/TPC/Layout";
import TPCDashboard from "./tabs/TPC/Dashboard";
import TPCApproveStudent from "./tabs/TPC/ApproveStudent";
import TPCProfileForm from "./tabs/TPC/Profile";
import StudentProfileView from "./tabs/Student/StudentProfile";
import { StudentManage } from "./tabs/TPC/StudentManage";

function App() {
  return (
    <Routes>
      <Route path="/auth">
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="logout" element={<Logout />} />
      </Route>

      {/* Student routes */}
      <Route path="/student/dashboard" element={<StudentHome />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<StudentProfileView allowUpdate={true} />} />
        <Route path="academic-details" element={<AcademicDetailsForm />} />
        <Route path="settings" element={<Settings />} />
        <Route path="companies" element={<Companies />} />
        <Route path="applied" element={<Applied />} />
        <Route path="placedstudents" element={<PlacedStudents />} />
        <Route path="contacttpc" element={<ContactTpc />} />
      </Route>

      {/* TPC routes with sidebar layout */}
      <Route path="/tpc" element={<TPCLayout />}>
        <Route path="dashboard" element={<TPCDashboard />} />
        <Route path="approve-student" element={<TPCApproveStudent />} />
        <Route path="profile" element={<TPCProfileForm allowUpdate={true} />} />
        <Route path="student-management" element={<StudentManage />} />"
        {/* <Route path="userview" element={<UserProfile allowUpdate={false}/>} /> */}
      </Route>

      {/* TPO routes */}
      <Route path="/tpo/dashboard" element={<TPODashboard />} />
      <Route path="/tpo/approve-tpc" element={<TPOApproveTPC />} />

      {/* TPF routes */}
      <Route path="/tpf/dashboard" element={<TPFDashboard />} />

      {/* Redirect root to /auth/login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}

export default App;
