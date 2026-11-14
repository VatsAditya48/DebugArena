
import { useState } from "react";
import "../App.css";

interface Submission {
  id: number;
  candidate: string;
  assessment: string;
  date: string;
  score: string;
  status: "Passed" | "Failed" | "Pending";
}

function Submissions() {
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Demo data. Real submission records will come from the backend API.
  const submissions: Submission[] = [
    {
      id: 1,
      candidate: "Rahul Sharma",
      assessment: "Python Debugging Challenge",
      date: "10 Nov 2026",
      score: "92%",
      status: "Passed",
    },
    {
      id: 2,
      candidate: "Priya Verma",
      assessment: "Data Structures & Algorithms",
      date: "09 Nov 2026",
      score: "85%",
      status: "Passed",
    },
    {
      id: 3,
      candidate: "Aman Gupta",
      assessment: "Java Code Evaluation",
      date: "08 Nov 2026",
      score: "45%",
      status: "Failed",
    },
  ];

  const total = submissions.length;
  const passed = submissions.filter(
    (submission) => submission.status === "Passed"
  ).length;
  const failed = submissions.filter(
    (submission) => submission.status === "Failed"
  ).length;
  const pending = submissions.filter(
    (submission) => submission.status === "Pending"
  ).length;

  const filteredSubmissions = submissions.filter((submission) => {
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch =
      submission.candidate.toLowerCase().includes(searchTerm) ||
      submission.assessment.toLowerCase().includes(searchTerm);

    const matchesFilter =
      filter === "All" || submission.status === filter;

    return matchesSearch && matchesFilter;
  });

  const displayedSubmissions = showAll
    ? filteredSubmissions
    : submissions.slice(0, 2);

  const handleViewToggle = () => {
    setShowAll((previous) => !previous);
    setSearch("");
    setFilter("All");
  };

  return (
    <>
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Submissions</p>
          <h2>Submissions</h2>
        </div>

        <button type="button" onClick={handleViewToggle}>
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
          <div
            style={{
              display: "flex",
              gap: "12px",
              margin: "20px 0",
              flexWrap: "wrap",
            }}
          >
            <input
              type="search"
              placeholder="Search candidate or assessment..."
              aria-label="Search candidate or assessment"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "12px",
                borderRadius: "8px",
                background: "#101522",
                color: "white",
                border: "1px solid #303747",
              }}
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter submissions by status"
              style={{
                padding: "12px",
                borderRadius: "8px",
                background: "#101522",
                color: "white",
                border: "1px solid #303747",
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
          displayedSubmissions.map((submission) => (
            <div className="assessment" key={submission.id}>
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
                    : submission.status === "Failed"
                    ? "draft"
                    : "pending-status"
                }`}
              >
                {submission.status}
              </span>
            </div>
          ))
        ) : (
          <p
            style={{
              padding: "25px",
              textAlign: "center",
              color: "#94a3b8",
            }}
            role="status"
          >
            No submissions found.
          </p>
        )}
      </section>
    </>
  );
}

export default Submissions;
