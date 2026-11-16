
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

function Sidebar() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      console.error("Backend logout request failed:", error);
    } finally {
      navigate("/login", { replace: true });
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">
        Debug<span>Arena</span>
      </h2>

      <p className="menu-label">WORKSPACE</p>

      <nav>
        <NavLink to="/" end>▦ Dashboard</NavLink>
        <NavLink to="/assessments">▣ Assessments</NavLink>
        <NavLink to="/candidates">♧ Candidates</NavLink>
        <NavLink to="/submissions">◷ Submissions</NavLink>
        <NavLink to="/reports">▤ Reports</NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/settings">⚙ Settings</NavLink>
        <NavLink to="/help">ⓘ Help & Support</NavLink>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "↪ Logout"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
