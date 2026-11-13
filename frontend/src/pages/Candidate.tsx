
import { useState } from "react";
import "../App.css";

interface CandidateData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

function Candidate() {
  const [candidates, setCandidates] = useState<CandidateData[]>([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      role: "Frontend Developer",
      status: "Shortlisted",
    },
    {
      id: 2,
      name: "Priya Verma",
      email: "priya@example.com",
      role: "Python Developer",
      status: "Under Review",
    },
    {
      id: 3,
      name: "Aman Gupta",
      email: "aman@example.com",
      role: "Backend Developer",
      status: "Selected",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Under Review");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newCandidate: CandidateData = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      status,
    };

    setCandidates((previous) => [...previous, newCandidate]);

    setName("");
    setEmail("");
    setRole("");
    setStatus("Under Review");
    setShowForm(false);
  };

  return (
    <div className="main">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Candidates</p>
          <h2>Candidates</h2>
        </div>

        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Candidate"}
        </button>
      </header>

      {showForm && (
        <section className="panel create-form">
          <div className="create-form-heading">
            <h3>Add New Candidate</h3>
            <p>Enter the candidate's details below.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="create-form-grid">
              <div className="form-group">
                <label htmlFor="candidate-name">Full Name</label>
                <input
                  id="candidate-name"
                  type="text"
                  placeholder="Enter candidate name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="candidate-email">Email Address</label>
                <input
                  id="candidate-email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="candidate-role">Applied Role</label>
                <input
                  id="candidate-role"
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="candidate-status">Application Status</label>
                <select
                  id="candidate-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>Under Review</option>
                  <option>Shortlisted</option>
                  <option>Selected</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit">Save Candidate</button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="panel-heading">
          <h3>All Candidates</h3>
          <span>{candidates.length} applicants</span>
        </div>

        {candidates.map((candidate) => (
          <div className="assessment" key={candidate.id}>
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
