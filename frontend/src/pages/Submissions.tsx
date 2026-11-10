
import { useState } from "react";
import "../App.css";

function Submissions() {
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const submissions = [
    {
      candidate: "Rahul Sharma",
      assessment: "Python Debugging Challenge",
      date: "10 Nov 2026",
      score: "92%",
      status: "Passed",
    },
    {
      candidate: "Priya Verma",
      assessment: "Data Structures & Algorithms",
      date: "09 Nov 2026",
      score: "85%",
      status: "Passed",
    },
    {
      candidate: "Aman Gupta",
      assessment: "Java Code Evaluation",
      date: "08 Nov 2026",
      score: "45%",
      status: "Failed",
    },
  ];

  const total = submissions.length;
  const passed = submissions.filter(s => s.status === "Passed").length;
  const failed = submissions.filter(s => s.status === "Failed").length;
  const pending = submissions.filter(s => s.status === "Pending").length;

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.candidate.toLowerCase().includes(search.toLowerCase()) ||
      submission.assessment.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || submission.status === filter;

    return matchesSearch && matchesFilter;
  });

  const displayedSubmissions = showAll
    ? filteredSubmissions
    : submissions.slice(0, 2);

  return (
    <div className="main">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Submissions</p>
          <h2>Submissions</h2>
        </div>

        <button onClick={() => {
          setShowAll(!showAll);
          setSearch("");
          setFilter("All");
        }}>
          {showAll ? "View Recent Submissions" : "View All Submissions"}
        </button>
      </header>

      <section className="stats">
        <div className="stat-card">
          <p>Total Submissions</p>
          <h2>{total}</h2>
        </div>

        <div className="stat-card">
          <p>Passed</p>
          <h2>{passed}</h2>
        </div>

        <div className="stat-card">
          <p>Failed</p>
          <h2>{failed}</h2>
        </div>

        <div className="stat-card">
          <p>Pending Review</p>
          <h2>{pending}</h2>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h3>
            {showAll ? "All Submissions" : "Recent Submissions"}
          </h3>
          <span>Track candidate assessment results</span>
        </div>

        {showAll && (
          <div style={{
            display: "flex",
            gap: "12px",
            margin: "20px 0",
            flexWrap: "wrap"
          }}>
            <input
              type="text"
              placeholder="Search candidate or assessment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "12px",
                borderRadius: "8px",
                background: "#101522",
                color: "white",
                border: "1px solid #303747"
              }}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                background: "#101522",
                color: "white",
                border: "1px solid #303747"
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        )}

        {displayedSubmissions.length > 0 ? (
          displayedSubmissions.map((submission, index) => (
            <div className="assessment" key={index}>
              <div>
                <h4>{submission.candidate}</h4>
                <p>
                  {submission.assessment} · {submission.date} ·{" "}
                  {submission.score}
                </p>
              </div>

              <span
                className={`status ${
                  submission.status === "Passed"
                    ? "active-status"
                    : "draft"
                }`}
              >
                {submission.status}
              </span>
            </div>
          ))
        ) : (
          <p style={{
            padding: "25px",
            textAlign: "center",
            color: "#94a3b8"
          }}>
            No submissions found.
          </p>
        )}
      </section>
    </div>
  );
}

export default Submissions;
