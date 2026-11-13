
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Assessments() {
  const navigate = useNavigate();

  // Existing sample assessments
  const sampleAssessments = [
    {
      id: "sample-1",
      title: "Python Debugging Challenge",
      category: "Software Engineering",
      duration: 45,
      questions: 10,
      status: "Active",
    },
    {
      id: "sample-2",
      title: "Data Structures & Algorithms",
      category: "Technical Screening",
      duration: 60,
      questions: 15,
      status: "Completed",
    },
    {
      id: "sample-3",
      title: "Java Code Evaluation",
      category: "Backend Development",
      duration: 30,
      questions: 8,
      status: "Draft",
    },
  ];

  // Get newly created assessments from localStorage
  const [assessments] = useState(() => {
    const savedAssessments = JSON.parse(
      localStorage.getItem("assessments") || "[]"
    );

    return [
      ...sampleAssessments,
      ...savedAssessments,
    ];
  });

  // Calculate statistics automatically
  const total = assessments.length;

  const active = assessments.filter(
    (a) => a.status === "Active"
  ).length;

  const completed = assessments.filter(
    (a) => a.status === "Completed"
  ).length;

  const drafts = assessments.filter(
    (a) => a.status === "Draft"
  ).length;

  return (
    <div className="main">
      <header className="topbar">
        <div>
          <p className="breadcrumb">
            Workspace / Assessments
          </p>
          <h2>Assessments</h2>
        </div>

        <button
          onClick={() => navigate("/create-assessment")}
        >
          + Create Assessment
        </button>
      </header>

      {/* Assessment Statistics */}
      <section className="stats">
        <div className="stat-card">
          <p>Total Assessments</p>
          <h2>{total}</h2>
        </div>

        <div className="stat-card">
          <p>Active</p>
          <h2>{active}</h2>
        </div>

        <div className="stat-card">
          <p>Completed</p>
          <h2>{completed}</h2>
        </div>

        <div className="stat-card">
          <p>Drafts</p>
          <h2>{drafts}</h2>
        </div>
      </section>

      {/* All Assessments */}
      <section className="panel">
        <div className="panel-heading">
          <h3>All Assessments</h3>
          <span>
            Manage your technical assessments
          </span>
        </div>

        {assessments.length === 0 ? (
          <p>No assessments created yet.</p>
        ) : (
          assessments.map((assessment) => (
            <div
              className="assessment"
              key={assessment.id}
            >
              <div>
                <h4>{assessment.title}</h4>

                <p>
                  {assessment.category ||
                    `${assessment.language} · ${assessment.difficulty}`}
                  {" · "}
                  {assessment.duration} minutes
                  {" · "}
                  {assessment.questions} questions
                </p>
              </div>

              <span
                className={`status ${
                  assessment.status === "Active"
                    ? "active-status"
                    : assessment.status === "Completed"
                    ? "completed"
                    : "draft"
                }`}
              >
                {assessment.status}
              </span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Assessments;
