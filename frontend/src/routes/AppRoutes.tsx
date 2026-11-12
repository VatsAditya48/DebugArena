
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Assessments from "../pages/Assessments";
import CreateAssessment from "../pages/CreateAssessment";
import Candidate from "../pages/Candidate";
import Submissions from "../pages/Submissions";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import HelpSupport from "../pages/HelpSupport";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CandidatePortal from "../pages/CandidatePortal";

import CandidateLayout from "../layouts/CandidateLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";

function ProtectedRoute() {
  const user = localStorage.getItem("debugarena_user");

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected recruiter routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RecruiterLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="assessments" element={<Assessments />} />
            <Route path="create-assessment" element={<CreateAssessment />} />
            <Route path="candidates" element={<Candidate />} />
            <Route path="submissions" element={<Submissions />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<HelpSupport />} />
          </Route>
        </Route>

        {/* Candidate Portal */}
        <Route
          path="/candidate"
          element={<CandidateLayout />}
        >
          <Route index element={<CandidatePortal />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
