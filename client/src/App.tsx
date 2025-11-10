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
import Jobs from "./tabs/Student/Jobs";
import { PlacedStudents } from "./tabs/Student/PlacedStudents";
import Applied from "./tabs/Student/Applied";
import { ContactTpc } from "./tabs/Student/ContactTpc";
import Logout from "./tabs/Authontication/Logout";
import TPCLayout from "./tabs/TPC/Layout";
import TPCApproveStudent from "./tabs/TPC/ApproveStudent";
import TPCProfileForm from "./tabs/TPC/Profile";
import StudentProfileView from "./tabs/Student/StudentProfile";
import { StudentManage } from "./tabs/TPC/StudentManage";
import CompletedDrive from "./tabs/Student/CompletedDrive";
import { StudentsInPlacementDrive } from "./tabs/Student/StudentsInPlacementDrive";
import JobDetailsPage from "./tabs/Student/JobDetailsPage";
import StudentProfileManage from "./tabs/TPC/StudentProfileManage";
import { CompanyManagement } from "./tabs/TPC/CompanyManagement";
import AddCompanyForm from "./tabs/TPC/AddCompanyForm";
import UpdateCompanyForm from "./tabs/TPC/UpdateCompany";
import { JobProfileManagement } from "./tabs/TPC/JobProfileManage";
import AddJobProfileForm from "./tabs/TPC/AddJobProfile";
import ViewJobProfileForm from "./tabs/TPC/ViewJobProfile";
import { ApplicationManagement } from "./tabs/TPC/ApplicationManagement";
import { Toaster } from "sonner";
import ManageAcadmicDetails from "./tabs/TPC/ManageAcadmicDetails";
import { PlacementDriveListJobs } from "./tabs/TPC/PlacementDriveListJobs";
import { JobApplications } from "./tabs/TPC/JobApplications";
import { AddPlacementDrive } from "./tabs/TPC/AddPlacementDrive";
import { RoundInfoForm } from "./tabs/TPC/RoundInfoFrom";
import PlacementDriveDetails from "./tabs/Student/Shedule";
import { RoundApplicationsManager } from "./tabs/TPC/RoundApplicationManager";
import TPOLayout from "./tabs/TPO/Layout";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
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
          <Route path="home">
            <Route path="selected" element={<StudentsInPlacementDrive />} />
            <Route path="applicants" element={<StudentsInPlacementDrive />} />
            <Route
              path="applicants-from-department"
              element={<StudentsInPlacementDrive />}
            />
          </Route>
          <Route
            path="profile"
            element={<StudentProfileView allowUpdate={true} />}
          />
          <Route path="academic-details" element={<AcademicDetailsForm />} />
          <Route path="settings" element={<Settings />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="applied" element={<Applied />} />
          <Route
            path="placedstudents"
            element={<PlacedStudents backgroundColor="bg-gray-50" />}
          />
          <Route
            path="contacttpc"
            element={<ContactTpc backgroundColor="bg-gray-50" />}
          />
          <Route path="completed-drive" element={<CompletedDrive />} />
          <Route path="jobs/:id" element={<JobDetailsPage />} />
          <Route path=":id/jobs/:id" element={<JobDetailsPage />} />
          <Route path="drive/:driveId" element={<PlacementDriveDetails/>} />
        </Route>

        {/* TPC routes with sidebar layout */}
        <Route path="/tpc" element={<TPCLayout />}>
          <Route index element={<TPCApproveStudent />} />
          <Route path="approve-student" element={<TPCApproveStudent />} />
          <Route
            path="approve-acadmic-details"
            element={<ManageAcadmicDetails />}
          />
          <Route
            path="profile"
            element={<TPCProfileForm allowUpdate={true} />}
          />
          <Route path="student-management" element={<StudentManage />}>
            <Route
              path="student-profile/:userId/:studentId"
              element={<StudentProfileManage allowUpdate={false} />}
            />
            <Route
              path="student-profile-update/:userId/:studentId"
              element={<StudentProfileManage allowUpdate={true} />}
            />
          </Route>
          <Route path="company-management" element={<CompanyManagement />}>
            <Route path="add-company" element={<AddCompanyForm />} />
            <Route
              path="view-company/:id"
              element={<UpdateCompanyForm allowUpdate={false} />}
            />
            <Route
              path="update-company/:id"
              element={<UpdateCompanyForm allowUpdate={true} />}
            />
          </Route>
          <Route
            path="job-profile-management"
            element={<JobProfileManagement />}
          >
            <Route path="add-job-profile" element={<AddJobProfileForm />} />
            <Route
              path="view-job-profile/:id"
              element={<ViewJobProfileForm allowUpdate={false} />}
            />
          </Route>
          <Route
            path="/tpc/placement-drives-management"
            element={<PlacementDriveListJobs />}
          >
            <Route
              path="manage/:job_id"
              element={<AddPlacementDrive allowUpdate={true} />}
            />
            <Route path="round-manage/:drive_id"
              element={<RoundInfoForm />}
              />
            <Route path="round-application-manager/:driveId/:roundId"
              element={<RoundApplicationsManager />}
              />
          </Route>
          <Route
            path="/tpc/application-management"
            element={<ApplicationManagement />}
          >
          </Route>
          <Route
              path="/tpc/application-management/pending-applications/:job_id"
              element={<JobApplications />}
            ></Route>

          <Route
            path="contact-tpc"
            element={<ContactTpc backgroundColor="bg-white" />}
          />
          <Route
            path="placedstudents"
            element={<PlacedStudents backgroundColor="bg-white" />}
          />
        </Route>

        {/* TPO routes */}
        <Route path="/tpo" element={<TPOLayout/>} >
          <Route index element={<TPOApproveTPC />} />
          <Route path="approve-tpc" element={<TPOApproveTPC />} />
          <Route
            path="approve-acadmic-details"
            element={<ManageAcadmicDetails />}
          />
          <Route
            path="profile"
            element={<TPCProfileForm allowUpdate={true} />}
          />
          <Route path="student-management" element={<StudentManage />}>
            <Route
              path="student-profile/:userId/:studentId"
              element={<StudentProfileManage allowUpdate={false} />}
            />
            <Route
              path="student-profile-update/:userId/:studentId"
              element={<StudentProfileManage allowUpdate={true} />}
            />
          </Route>
          <Route path="company-management" element={<CompanyManagement />}>
            <Route path="add-company" element={<AddCompanyForm />} />
            <Route
              path="view-company/:id"
              element={<UpdateCompanyForm allowUpdate={false} />}
            />
            <Route
              path="update-company/:id"
              element={<UpdateCompanyForm allowUpdate={true} />}
            />
          </Route>
          <Route
            path="job-profile-management"
            element={<JobProfileManagement />}
          >
            <Route path="add-job-profile" element={<AddJobProfileForm />} />
            <Route
              path="view-job-profile/:id"
              element={<ViewJobProfileForm allowUpdate={false} />}
            />
          </Route>
          <Route
            path="/tpo/placement-drives-management"
            element={<PlacementDriveListJobs />}
          >
            <Route
              path="manage/:job_id"
              element={<AddPlacementDrive allowUpdate={true} />}
            />
            <Route path="round-manage/:drive_id"
              element={<RoundInfoForm />}
              />
            <Route path="round-application-manager/:driveId/:roundId"
              element={<RoundApplicationsManager />}
              />
          </Route>
          <Route
            path="/tpo/application-management"
            element={<ApplicationManagement />}
          >
          </Route>
          <Route
              path="/tpo/application-management/pending-applications/:job_id"
              element={<JobApplications />}
            ></Route>

          <Route
            path="contact-tpc"
            element={<ContactTpc backgroundColor="bg-white" />}
          />
          <Route
            path="placedstudents"
            element={<PlacedStudents backgroundColor="bg-white" />}
          />
        </Route>

        {/* TPF routes */}
        <Route path="/tpf/dashboard" element={<TPFDashboard />} />

        {/* Redirect root to /auth/login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
