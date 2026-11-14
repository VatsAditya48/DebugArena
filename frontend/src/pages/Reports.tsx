
import "../App.css";

interface AssessmentReport {
  id: number;
  title: string;
  candidates: number;
  average: string;
  passed: number;
  failed: number;
}

function Reports() {
  // Demo data. Real analytics will be supplied by the backend API.
  const reports: AssessmentReport[] = [
    {
      id: 1,
      title: "Python Debugging Challenge",
      candidates: 45,
      average: "86%",
      passed: 38,
      failed: 7,
    },
    {
      id: 2,
      title: "Data Structures & Algorithms",
      candidates: 32,
      average: "78%",
      passed: 25,
      failed: 7,
    },
    {
      id: 3,
      title: "Java Code Evaluation",
      candidates: 28,
      average: "65%",
      passed: 18,
      failed: 10,
    },
  ];

  const totalCandidates = reports.reduce(
    (sum, report) => sum + report.candidates,
    0
  );

  const totalPassed = reports.reduce(
    (sum, report) => sum + report.passed,
    0
  );

  const totalFailed = reports.reduce(
    (sum, report) => sum + report.failed,
    0
  );

  const averageScore =
    totalCandidates > 0
      ? Math.round(
          reports.reduce(
            (sum, report) =>
              sum + Number.parseInt(report.average, 10) * report.candidates,
            0
          ) / totalCandidates
        )
      : 0;

  const downloadReport = () => {
    const content = [
      ["Assessment", "Candidates", "Average Score", "Passed", "Failed"],
      ...reports.map((report) => [
        report.title,
        report.candidates,
        report.average,
        report.passed,
        report.failed,
      ]),
    ];

    // Escape CSV values so commas and quotation marks are handled correctly.
    const csv = content
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    // Add a BOM to improve compatibility with spreadsheet applications.
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "DebugArena_Report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <>
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Reports</p>
          <h2>Reports & Analytics</h2>
        </div>

        <button type="button" onClick={downloadReport}>
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

        {reports.length > 0 ? (
          reports.map((report) => (
            <div className="assessment" key={report.id}>
              <div>
                <h4>{report.title}</h4>

                <p>
                  {report.candidates} candidates · Average Score:{" "}
                  {report.average}
                </p>

                <p>
                  Passed: {report.passed} · Failed: {report.failed}
                </p>
              </div>

              <span className="status active-status">
                {report.average}
              </span>
            </div>
          ))
        ) : (
          <p role="status" style={{ padding: "20px", color: "#94a3b8" }}>
            No assessment reports are available yet.
          </p>
        )}
      </section>

      <p
        style={{
          marginTop: "16px",
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        Demo analytics: figures are sample data until backend integration.
      </p>
    </>
  );
}

export default Reports;
