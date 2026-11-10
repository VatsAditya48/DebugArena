
import "../App.css";

function HelpSupport() {
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
        "Navigate to Settings and use the Change Password option under the Security section.",
    },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("Your support request has been submitted successfully!");
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

      <section className="panel">
        <div className="panel-heading">
          <h3>Frequently Asked Questions</h3>
          <span>Quick answers to common queries</span>
        </div>

        {faqs.map((faq, index) => (
          <details className="assessment" key={index}>
            <summary>
              <strong>{faq.question}</strong>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </section>

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
                required
              />
            </div>
          </div>

          <div className="assessment">
            <div style={{ width: "100%" }}>
              <h4>Email Address</h4>
              <input
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="assessment">
            <div style={{ width: "100%" }}>
              <h4>Describe Your Issue</h4>
              <textarea
                placeholder="Tell us how we can help..."
                rows={4}
                required
              />
            </div>
          </div>

          <button type="submit">
            Submit Support Request
          </button>
        </form>
      </section>

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
            <p>Technical Assessment & Recruitment Platform</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HelpSupport;
