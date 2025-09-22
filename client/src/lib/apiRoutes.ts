// src/lib/apiRoutes.ts
export const API_BASE_URL = 'http://localhost:3000/api'

export const API_ROUTES = {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    DEPARTMENTS: `${API_BASE_URL}/department`,
    PENDING: `${API_BASE_URL}/tpc/student/pending`,
    APPROVE: `${API_BASE_URL}/tpc/student/approve`,
    TPC_PROFILE: `${API_BASE_URL}/tpc/profile`,
    STUDENT_PROFILE: `${API_BASE_URL}/student/profile`,
    STUDENT_ACAD_PROFILE: `${API_BASE_URL}/student/academic/profile`,
    STUDENT_COMPANIES: `${API_BASE_URL}/student/companies`,
    ALL_TPC_PROFILE: `${API_BASE_URL}/student/profile/all`,
    ALL_COMPANIES_DEPT: `${API_BASE_URL}/student/companies`,
};