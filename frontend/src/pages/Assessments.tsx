
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, type Assessment } from "../services/api";
import "../App.css";

function Assessments() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest<Assessment[]>("/assessments")
      .then(data => { if (active) setAssessments(data); })
      .catch(err => {
        if (active) setError(err instanceof Error ? err.message : "Unable to load assessments.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const published = assessments.filter(a => a.status === "published").length;
  const drafts = assessments.filter(a => a.status === "draft").length;

  return (
    <div className="main">
      <header className="topbar">
        <div><p className="breadcrumb">Workspace / Assessments</p><h2>Assessments</h2></div>
        <button onClick={() => navigate("/create-assessment")}>+ Create Assessment</button>
      </header>

      <section className="stats">
        <div className="stat-card"><p>Total Assessments</p><h2>{assessments.length}</h2></div>
        <div className="stat-card"><p>Published</p><h2>{published}</h2></div>
        <div className="stat-card"><p>Completed</p><h2>—</h2></div>
        <div className="stat-card"><p>Drafts</p><h2>{drafts}</h2></div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h3>All Assessments</h3>
          <span>Manage your technical assessments</span>
        </div>
        {loading && <p>Loading assessments...</p>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        {!loading && !error && assessments.length === 0 && <p>No assessments created yet.</p>}
        {!loading && assessments.map(a => (
          <div className="assessment" key={a.id}>
            <div>
              <h4>{a.title}</h4>
              <p>{a.language} · {a.difficulty} · {a.duration_minutes} minutes · {a.question_count} questions</p>
            </div>
            <span className={`status ${a.status === "published" ? "active-status" : "draft"}`}>
              {a.status}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Assessments;
