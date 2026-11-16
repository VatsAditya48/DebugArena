
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  getCurrentUser,
  clearAuthUser,
} from "../services/auth";

import Dashboard from "../pages/Dashboard";
import Assessments from "../pages/Assessments";
import CreateAssessment from "../pages/CreateAssessment";
import Candidate from "../pages/Candidate";
import Submissions from "../pages/Submissions";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import HelpSupport from "../pages/HelpSupport";
import Login from "../pages/Login";
import CandidatePortal from "../pages/CandidatePortal";

import CandidateLayout from "../layouts/CandidateLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";

function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then(() => {
        if (active) setAuthenticated(true);
      })
      .catch(() => {
        clearAuthUser();
        if (active) setAuthenticated(false);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return (
      <div className="auth-page">
        <p>Verifying your session...</p>
      </div>
    );
  }

  return authenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
<Route
  path="/register"
  element={<Navigate to="/login" replace />}
/>
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

        <Route
          path="/candidate"
          element={<CandidateLayout />}
        >
          <Route index element={<CandidatePortal />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
