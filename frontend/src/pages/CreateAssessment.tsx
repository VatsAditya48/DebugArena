
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { apiRequest, type Assessment, type AssessmentCreate } from "../services/api";
import "../App.css";

function CreateAssessment() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("Python");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [duration, setDuration] = useState("30");
  const [questions, setQuestions] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload: AssessmentCreate = {
      title: title.trim(),
      language,
      difficulty,
      duration_minutes: Number(duration),
      question_count: Number(questions),
    };

    try {
      await apiRequest<Assessment>("/assessments", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      navigate("/assessments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assessment creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <header className="topbar">
        <div><p className="breadcrumb">Workspace / Assessments / Create</p><h2>Create Assessment</h2></div>
      </header>
      <section className="panel create-form">
        <div className="create-form-heading">
          <h3>Assessment Details</h3>
          <p>Configure your new technical assessment.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="create-form-grid">
            <Input label="Assessment Title" type="text" placeholder="e.g. Python Debugging Challenge"
              value={title} onChange={e => setTitle(e.target.value)} required />
            <div className="form-group">
              <label htmlFor="language">Programming Language</label>
              <select id="language" value={language} onChange={e => setLanguage(e.target.value)}>
                <option>Python</option><option>Java</option><option>C++</option><option>JavaScript</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty Level</label>
              <select id="difficulty" value={difficulty}
                onChange={e => setDifficulty(e.target.value as typeof difficulty)}>
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
            </div>
            <Input label="Duration (minutes)" type="number" min="5" value={duration}
              onChange={e => setDuration(e.target.value)} required />
            <Input label="Number of Questions" type="number" min="1" value={questions}
              onChange={e => setQuestions(e.target.value)} required />
          </div>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <div className="form-actions">
            <Button type="button" variant="secondary" className="cancel-btn"
              onClick={() => navigate("/assessments")}>Cancel</Button>
            <Button type="submit" variant="primary">
              {loading ? "Creating..." : "+ Create Assessment"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateAssessment;
