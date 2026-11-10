
import "../App.css";

function Reports() {
  const reports = [
    {
      title: "Python Debugging Challenge",
      candidates: 45,
      average: "86%",
      passed: 38,
      failed: 7,
    },
    {
      title: "Data Structures & Algorithms",
      candidates: 32,
      average: "78%",
      passed: 25,
      failed: 7,
    },
    {
      title: "Java Code Evaluation",
      candidates: 28,
      average: "65%",
      passed: 18,
      failed: 10,
    },
  ];

  const totalCandidates = reports.reduce(
    (sum, report) => sum + report.candidates, 0
  );

  const totalPassed = reports.reduce(
    (sum, report) => sum + report.passed, 0
  );

  const totalFailed = reports.reduce(
    (sum, report) => sum + report.failed, 0
  );

  const averageScore = Math.round(
    reports.reduce(
      (sum, report) =>
        sum + parseInt(report.average) * report.candidates, 0
    ) / totalCandidates
  );

  const downloadReport = () => {
    const content = [
      ["Assessment", "Candidates", "Average Score", "Passed", "Failed"],
      ...reports.map(r => [
        r.title, r.candidates, r.average, r.passed, r.failed
      ])
    ];

    const csv = content.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "DebugArena_Report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="main">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Reports</p>
          <h2>Reports & Analytics</h2>
        </div>

        <button onClick={downloadReport}>
          Download Report
        </button>
      </header>

      <section className="stats">
        <div className="stat-card">
          <p>Total Candidates</p>
          <h2>{totalCandidates}</h2>
        </div>

        <div className="stat-card">
          <p>Passed</p>
          <h2>{totalPassed}</h2>
        </div>

        <div className="stat-card">
          <p>Failed</p>
          <h2>{totalFailed}</h2>
        </div>

        <div className="stat-card">
          <p>Average Score</p>
          <h2>{averageScore}%</h2>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h3>Assessment Performance</h3>
          <span>Performance across all assessments</span>
        </div>

        {reports.map((report, index) => (
          <div className="assessment" key={index}>
            <div>
              <h4>{report.title}</h4>
              <p>
                {report.candidates} candidates ·
                Average Score: {report.average}
              </p>
              <p>
                Passed: {report.passed} ·
                Failed: {report.failed}
              </p>
            </div>

            <span className="status active-status">
              {report.average}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Reports;
