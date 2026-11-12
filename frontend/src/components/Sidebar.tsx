
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("debugarena_user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">
        Debug<span>Arena</span>
      </h2>

      <p className="menu-label">WORKSPACE</p>

      <nav>
        <NavLink to="/" end>
          ▦ Dashboard
        </NavLink>

        <NavLink to="/assessments">
          ▣ Assessments
        </NavLink>

        <NavLink to="/candidates">
          ♧ Candidates
        </NavLink>

        <NavLink to="/submissions">
          ◷ Submissions
        </NavLink>

        <NavLink to="/reports">
          ▤ Reports
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/settings">
          ⚙ Settings
        </NavLink>

        <NavLink to="/help">
          ⓘ Help & Support
        </NavLink>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          ↪ Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
