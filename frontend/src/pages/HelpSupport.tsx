
import { useState } from "react";
import type { FormEvent } from "react";
import "../App.css";

interface SupportRequest {
  id: number;
  name: string;
  email: string;
  issue: string;
  submittedAt: string;
}

function HelpSupport() {
  const user = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("debugarena_user") || "{}"
      );
    } catch {
      return {};
    }
  })();

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [issue, setIssue] = useState("");
  const [message, setMessage] = useState("");

  const faqs = [
    {
      question: "How do I create a new assessment?",
      answer:
        "Navigate to Assessments and click Create Assessment. Enter the assessment details, select the required skills, and save your assessment.",
    },
    {
      question: "How can I add a candidate?",
      answer:
        "Open the Candidates section and click Add Candidate. Enter the candidate's details to add them to your workspace.",
    },
    {
      question: "Where can I view candidate submissions?",
      answer:
        "Navigate to the Submissions section to view candidate results, scores, and assessment statuses.",
    },
    {
      question: "Can I download assessment reports?",
      answer:
        "Yes. Open Reports & Analytics and click Download Report to export the available report as a CSV file.",
    },
    {
      question: "How do I change my password?",
      answer:
        "Navigate to Settings and use the Change Password option under the Security section. Actual password changes will be available after backend authentication is integrated.",
    },
    {
      question: "Can candidates run their code?",
      answer:
        "The candidate workspace currently provides a demo code editor. Actual code execution and automated evaluation require backend execution API integration.",
    },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!name.trim() || !email.trim() || !issue.trim()) {
      setMessage("Please complete all fields.");
      return;
    }

    const newRequest: SupportRequest = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      issue: issue.trim(),
      submittedAt: new Date().toLocaleString(),
    };

    try {
      const existingRequests: SupportRequest[] = JSON.parse(
        localStorage.getItem("debugarena_support_requests") || "[]"
      );

      localStorage.setItem(
        "debugarena_support_requests",
        JSON.stringify([...existingRequests, newRequest])
      );

      setMessage(
        "Your support request has been saved successfully in this browser demo."
      );

      setIssue("");
    } catch {
      setMessage(
        "Unable to save your request. Please try again."
      );
    }
  };

  return (
    <div className="main">
      <header className="topbar">
        <div>
          <p className="breadcrumb">
            Workspace / Help & Support
          </p>
          <h2>Help & Support</h2>
        </div>
      </header>

      {/* Welcome */}
      <section className="panel">
        <div className="panel-heading">
          <h3>Welcome to DebugArena Support</h3>
          <span>We're here to help you</span>
        </div>

        <p>
          Find answers to common questions and learn how
          to use DebugArena effectively.
        </p>
      </section>

      {/* FAQs */}
      <section className="panel">
        <div className="panel-heading">
          <h3>Frequently Asked Questions</h3>
          <span>Quick answers to common queries</span>
        </div>

        {faqs.map((faq, index) => (
          <details className="assessment" key={index}>
            <summary
              style={{
                cursor: "pointer",
                fontWeight: 600,
                padding: "5px 0",
              }}
            >
              {faq.question}
            </summary>

            <p style={{ marginTop: "12px", lineHeight: 1.7 }}>
              {faq.answer}
            </p>
          </details>
        ))}
      </section>

      {/* Contact Support */}
      <section className="panel">
        <div className="panel-heading">
          <h3>Contact Support</h3>
          <span>Need additional assistance?</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="assessment">
            <div style={{ width: "100%" }}>
              <h4>Your Name</h4>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "10px",
                  borderRadius: "8px",
                  background: "#101522",
                  color: "white",
                  border: "1px solid #303747",
                }}
              />
            </div>
          </div>

          <div className="assessment">
            <div style={{ width: "100%" }}>
              <h4>Email Address</h4>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "10px",
                  borderRadius: "8px",
                  background: "#101522",
                  color: "white",
                  border: "1px solid #303747",
                }}
              />
            </div>
          </div>

          <div className="assessment">
            <div style={{ width: "100%" }}>
              <h4>Describe Your Issue</h4>
              <textarea
                placeholder="Tell us how we can help..."
                rows={5}
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "10px",
                  borderRadius: "8px",
                  background: "#101522",
                  color: "white",
                  border: "1px solid #303747",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          <button type="submit">
            Submit Support Request
          </button>

          {message && (
            <p
              role="status"
              style={{
                marginTop: "15px",
                color: message.includes("successfully")
                  ? "#4ade80"
                  : "#f87171",
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>
          )}
        </form>

        <p style={{ color: "#94a3b8", marginTop: "15px" }}>
          Note: Support requests are stored locally in this
          browser demo. Sending them to a support team requires
          backend integration.
        </p>
      </section>

      {/* About */}
      <section className="panel">
        <div className="panel-heading">
          <h3>About DebugArena</h3>
          <span>Platform Information</span>
        </div>

        <div className="assessment">
          <div>
            <h4>Application Name</h4>
            <p>DebugArena</p>
          </div>
        </div>

        <div className="assessment">
          <div>
            <h4>Version</h4>
            <p>1.0.0</p>
          </div>
        </div>

        <div className="assessment">
          <div>
            <h4>Platform</h4>
            <p>
              Technical Assessment & Recruitment Platform
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HelpSupport;
