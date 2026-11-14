import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../styles/CandidatePortal.css";

export default function CandidateLayout() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("debugarena_user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="candidate-shell">
      <aside className="candidate-sidebar">
        <div className="candidate-brand">Debug<span>Arena</span></div>
        <p className="candidate-menu-label">CANDIDATE PORTAL</p>
        <nav className="candidate-nav">
          <NavLink to="/candidate">⌂ <span>Workspace</span></NavLink>
        </nav>
        <button className="candidate-logout" onClick={logout}>↪ <span>Log out</span></button>
      </aside>
      <main className="candidate-main">
        <header className="candidate-topbar">
          <div><span className="candidate-eyebrow">TECHNICAL ASSESSMENT PLATFORM</span><h1>Candidate Workspace</h1></div>
          <div className="candidate-user"><span className="candidate-avatar">C</span> Candidate</div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
