
import "../App.css";

function Candidate() {
  const candidates = [
    {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      role: "Frontend Developer",
      status: "Shortlisted",
    },
    {
      name: "Priya Verma",
      email: "priya@example.com",
      role: "Python Developer",
      status: "Under Review",
    },
    {
      name: "Aman Gupta",
      email: "aman@example.com",
      role: "Backend Developer",
      status: "Selected",
    },
  ];

  return (
    <div className="main">
      <header className="topbar">
        <div>
          <p className="breadcrumb">
            Workspace / Candidates
          </p>
          <h2>Candidates</h2>
        </div>

        <button>+ Add Candidate</button>
      </header>

      <section className="panel">
        <div className="panel-heading">
          <h3>All Candidates</h3>
          <span>Manage your applicants</span>
        </div>

        {candidates.map((candidate, index) => (
          <div className="assessment" key={index}>
            <div>
              <h4>{candidate.name}</h4>
              <p>
                {candidate.email} · {candidate.role}
              </p>
            </div>

            <span className="status active-status">
              {candidate.status}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Candidate;
