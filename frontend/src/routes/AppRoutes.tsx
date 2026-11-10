
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Assessments from "../pages/Assessments";
import CreateAssessment from "../pages/CreateAssessment";
import Candidate from "../pages/Candidate";
import Submissions from "../pages/Submissions";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import HelpSupport from "../pages/HelpSupport";

import RecruiterLayout from "../layouts/RecruiterLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RecruiterLayout />}>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/assessments"
            element={<Assessments />}
          />

          <Route
            path="/create-assessment"
            element={<CreateAssessment />}
          />

          <Route
            path="/candidates"
            element={<Candidate />}
          />
          <Route
            path="/submissions"
            element={<Submissions />}
          />
          <Route
            path="/reports"
            element={<Reports />}
          />
          <Route
            path="/settings"
            element={<Settings />}
          />
          <Route
            path="/help"
            element={<HelpSupport />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
