// src/lib/apiRoutes.ts
export const API_BASE_URL = 'http://localhost:3000/api'
export const API_BASE_URL_DOC = 'http://localhost:3000'

export const API_ROUTES = {
    // Auth
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,

    // Department
    DEPARTMENTS: `${API_BASE_URL}/department`,

    // TPC (Training & Placement Cell)
    PENDING: `${API_BASE_URL}/tpc/student/pending`,
    APPROVE: `${API_BASE_URL}/tpc/student/approve`,
    TPC_PROFILE: `${API_BASE_URL}/tpc/profile`,
    PENDING_ACADMIC_APPROVALS: `${API_BASE_URL}/tpc/acadmicdetails/pending`,
    GET_ALL_STUDENTS: `${API_BASE_URL}/tpc/allStudents`,
    DELETE_STUDENT: `${API_BASE_URL}/tpc/students`,
    UPDATE_ACADMIC_APPROVAL: `${API_BASE_URL}/tpc/acadmicdetails/update-approved`,
    GET_PENDING_APPLICATIONS: `${API_BASE_URL}/tpc/pending-applications`,
    UPDATE_APPLICATION_STATUS: `${API_BASE_URL}/tpc/update-application-status`,
    ADD_DRIVE: `${API_BASE_URL}/tpc/add-drive`,
    GET_DRIVE: `${API_BASE_URL}/tpc/get-drive`,
    GET_DRIVE_DRIVEID: `${API_BASE_URL}/tpc/get-drive-driveId`,
    UPDATE_DRIVE: `${API_BASE_URL}/tpc/update-drive`,
    GET_DRIVE_ROUNDS: `${API_BASE_URL}/tpc/placement-drives/rounds`,
    UPDATE_DELETE_ROUND: `${API_BASE_URL}/tpc/placement-drives`,
    ADD_ROUND: `${API_BASE_URL}/tpc/placement-drives`,

    // Student
    STUDENT_PROFILE: `${API_BASE_URL}/student/profile`,
    STUDENT_ACAD_PROFILE: `${API_BASE_URL}/student/academic/profile`,
    STUDENT_COMPANIES: `${API_BASE_URL}/student/companies`,
    GET_TPC_CONTACT: `${API_BASE_URL}/student/profile/tpc-contact`,
    UPDATE_STUDENT_ACADMIC_DETAILS: `${API_BASE_URL}/student/academic/profile/update`,
    UPDATE_STUDENT_PASSWORD: `${API_BASE_URL}/student/change-password`,
    ADD_APPLICATION: `${API_BASE_URL}/student/add-application`,
    CHECK_APPLICATION: `${API_BASE_URL}/student/check-application`,
    GET_APPLICATION: `${API_BASE_URL}/student/get-application`,


    // Companies & Jobs
    ALL_COMPANIES_DEPT: `${API_BASE_URL}/companies`,
    COMPANIES: `${API_BASE_URL}/companies`,
    JOBS: `${API_BASE_URL}/jobs`,
    ACTIVE_JOBS: `${API_BASE_URL}/jobs/active`,
    GET_JOBS: `${API_BASE_URL}/jobs`,

    //Users
    DELETE_USER: `${API_BASE_URL}/users/user/delete`,

    // Common
    OFFER_INFO: `${API_BASE_URL}/common/offerinfo`,
    USER_SKILLS: `${API_BASE_URL}/common/studentskills`,
};