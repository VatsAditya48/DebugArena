
import "../App.css";

function Dashboard() {
  return (
    <>
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Dashboard</p>
          <h2>Dashboard</h2>
        </div>

        <div className="profile">
          <span>Admin</span>
          <div className="avatar">A</div>
        </div>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Welcome to DebugArena 👋</h1>
          <p>Evaluate skills. Identify talent. Hire with confidence.</p>
        </div>

        <button>+ Create Assessment</button>
      </section>

      <section className="stats">
        <div className="stat-card">
          <p>Total Assessments</p>
          <h2>24</h2>
          <span>Across all roles</span>
        </div>

        <div className="stat-card">
          <p>Total Candidates</p>
          <h2>186</h2>
          <span>Registered candidates</span>
        </div>

        <div className="stat-card">
          <p>Completed Tests</p>
          <h2>142</h2>
          <span>Submissions received</span>
        </div>

        <div className="stat-card">
          <p>Pending Reviews</p>
          <h2>18</h2>
          <span>Awaiting evaluation</span>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-heading">
            <h3>Recent Assessments</h3>
            <a>View all →</a>
          </div>

          <div className="assessment">
            <div>
              <h4>Python Debugging Challenge</h4>
              <p>Software Engineering · 45 minutes</p>
            </div>

            <span className="status active-status">Active</span>
          </div>

          <div className="assessment">
            <div>
              <h4>Data Structures & Algorithms</h4>
              <p>Technical Screening · 60 minutes</p>
            </div>

            <span className="status completed">Completed</span>
          </div>

          <div className="assessment">
            <div>
              <h4>Java Code Evaluation</h4>
              <p>Backend Development · 30 minutes</p>
            </div>

            <span className="status draft">Draft</span>
          </div>
        </div>

        <div className="panel activity">
          <h3>Platform Overview</h3>

          <div className="activity-item">
            <span className="activity-dot"></span>
            <div>
              <h4>AI-powered evaluation</h4>
              <p>Automated code analysis and scoring</p>
            </div>
          </div>

          <div className="activity-item">
            <span className="activity-dot"></span>
            <div>
              <h4>Real-world challenges</h4>
              <p>Evaluate practical debugging skills</p>
            </div>
          </div>

          <div className="activity-item">
            <span className="activity-dot"></span>
            <div>
              <h4>Secure assessments</h4>
              <p>Proctored technical examinations</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        DebugArena © 2026 · AI-Powered Technical Assessment Platform
      </footer>
    </>
  );
}

export default Dashboard;
