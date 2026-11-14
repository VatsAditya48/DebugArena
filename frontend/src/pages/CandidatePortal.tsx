import { useMemo, useState } from "react";
import "../styles/CandidatePortal.css";

type Assessment = { id: string; title: string; skill: string; duration: number; tasks: number; due: string; status: "Available" | "In progress" | "Completed" };
const initial: Assessment[] = [
  { id: "DA-101", title: "Python Debugging Challenge", skill: "Python", duration: 45, tasks: 3, due: "15 Nov 2026", status: "Available" },
  { id: "DA-102", title: "Data Structures & Algorithms", skill: "Java", duration: 60, tasks: 2, due: "18 Nov 2026", status: "In progress" },
  { id: "DA-103", title: "Java Fundamentals", skill: "Java", duration: 30, tasks: 15, due: "Completed", status: "Completed" },
];

export default function CandidatePortal() {
  const [items, setItems] = useState(initial);
  const [active, setActive] = useState<Assessment | null>(null);
  const [tab, setTab] = useState<"overview" | "assessments" | "results">("overview");
  const [code, setCode] = useState("// Write your solution here\n");
  const [language, setLanguage] = useState("Python");
  const [notice, setNotice] = useState("");
  const results = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("debugarena_candidate_submissions") || "[]") as { title: string; submittedAt: string }[]; }
    catch { return []; }
  }, []);
  const completed = items.filter(x => x.status === "Completed").length;

  const start = (item: Assessment) => { setActive(item); setCode("// Write your solution here\n"); setLanguage(item.skill); setNotice(""); };
  const submit = () => {
    if (!active) return;
    const previous = JSON.parse(localStorage.getItem("debugarena_candidate_submissions") || "[]");
    localStorage.setItem("debugarena_candidate_submissions", JSON.stringify([{ title: active.title, submittedAt: new Date().toLocaleString(), language, code }, ...previous]));
    setItems(old => old.map(x => x.id === active.id ? { ...x, status: "Completed" } : x));
    setActive(null); setTab("results");
  };

  if (active) return <section className="candidate-content">
    <button className="candidate-back" onClick={() => setActive(null)}>← Back to assessments</button>
    <div className="candidate-page-heading"><div><span className="candidate-eyebrow">ASSESSMENT WORKSPACE</span><h2>{active.title}</h2><p>{active.duration} minutes · {active.tasks} tasks · {active.skill}</p></div><span className="candidate-pill">Demo workspace</span></div>
    <div className="candidate-instructions"><strong>Instructions</strong><p>Read the task provided by your recruiter and write your solution below.</p><p><strong>Demo limitation:</strong> Code execution, test cases, proctoring and server-side evaluation are not connected yet. These require backend integration.</p></div>
    <div className="candidate-editor-toolbar"><label htmlFor="candidate-language">Language</label><select id="candidate-language" value={language} onChange={e => setLanguage(e.target.value)}>{["Python", "Java", "C++", "JavaScript"].map(x => <option key={x}>{x}</option>)}</select><span>Local demo editor</span></div>
    <textarea className="candidate-code-editor" spellCheck={false} aria-label="Code editor" value={code} onChange={e => setCode(e.target.value)} />
    <div className="candidate-editor-actions"><button className="candidate-secondary" onClick={() => setNotice("Code execution will be enabled after the execution API is integrated.")}>Run code</button><button className="candidate-primary" disabled={!code.trim()} onClick={submit}>Submit assessment</button></div>
    {notice && <p className="candidate-notice">{notice}</p>}
  </section>;

  const list = (values: Assessment[]) => values.length ? <div className="candidate-assessment-list">{values.map(item => <article className="candidate-assessment-card" key={item.id}><div className="candidate-card-main"><span className="candidate-eyebrow">{item.id} · {item.skill}</span><h4>{item.title}</h4><p>{item.duration} min · {item.tasks} tasks · Due: {item.due}</p></div><div className="candidate-card-actions"><span className={`candidate-status ${item.status === "Completed" ? "done" : item.status === "In progress" ? "progress" : ""}`}>{item.status}</span>{item.status !== "Completed" && <button className="candidate-primary" onClick={() => start(item)}>{item.status === "In progress" ? "Continue" : "Start assessment"}</button>}</div></article>)}</div> : <div className="candidate-empty"><strong>No assessments here</strong><p>You're all caught up.</p></div>;

  return <section className="candidate-content">
    <div className="candidate-welcome"><div><span className="candidate-eyebrow">YOUR EVALUATION SPACE</span><h2>Welcome back!</h2><p>Track your assigned technical assessments and submissions.</p></div><div className="candidate-welcome-mark">DA</div></div>
    <div className="candidate-tabs"><button className={tab === "overview" ? "selected" : ""} onClick={() => setTab("overview")}>Overview</button><button className={tab === "assessments" ? "selected" : ""} onClick={() => setTab("assessments")}>My assessments</button><button className={tab === "results" ? "selected" : ""} onClick={() => setTab("results")}>My results</button></div>
    {tab === "overview" && <><div className="candidate-stats"><article><span>Assigned</span><strong>{items.length}</strong></article><article><span>Awaiting completion</span><strong>{items.length - completed}</strong></article><article><span>Completed</span><strong>{completed}</strong></article></div><div className="candidate-section-heading"><div><h3>Upcoming assessments</h3><p>Continue or start an assessment.</p></div><button className="candidate-text-button" onClick={() => setTab("assessments")}>View all →</button></div>{list(items.filter(x => x.status !== "Completed"))}</>}
    {tab === "assessments" && <><div className="candidate-section-heading"><div><h3>My assessments</h3><p>Assessments assigned to your account.</p></div></div>{list(items)}</>}
    {tab === "results" && <><div className="candidate-section-heading"><div><h3>Submission history</h3><p>Submissions saved in this browser demo.</p></div></div>{results.length ? results.map((r, i) => <article className="candidate-assessment-card" key={i}><div><h4>{r.title}</h4><p>Submitted {r.submittedAt}</p></div><span className="candidate-pill">Submitted</span></article>) : <div className="candidate-empty"><strong>No submissions yet</strong><p>Your submitted assessments will appear here.</p></div>}<p className="candidate-disclaimer">Scores and evaluation feedback require backend evaluation integration.</p></>}
  </section>;
}
