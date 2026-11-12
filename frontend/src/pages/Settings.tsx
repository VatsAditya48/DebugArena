
import { useEffect, useState } from "react";
import "../App.css";

interface UserData {
  name?: string;
  email?: string;
  role?: string;
}

interface Preferences {
  emailNotifications: boolean;
  assessmentNotifications: boolean;
}

function Settings() {
  const [user, setUser] = useState<UserData>(() => {
    try {
      return JSON.parse(localStorage.getItem("debugarena_user") || "{}");
    } catch {
      return {};
    }
  });

  const [fullName, setFullName] = useState(user.name || "Admin");
  const [savedMessage, setSavedMessage] = useState("");

  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("debugarena_preferences") || "{}"
      );

      return {
        emailNotifications: saved.emailNotifications ?? true,
        assessmentNotifications: saved.assessmentNotifications ?? true,
      };
    } catch {
      return {
        emailNotifications: true,
        assessmentNotifications: true,
      };
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "debugarena_preferences",
      JSON.stringify(preferences)
    );
  }, [preferences]);

  const handleSaveProfile = () => {
    if (!fullName.trim()) {
      setSavedMessage("Please enter your full name.");
      return;
    }

    const updatedUser = {
      ...user,
      name: fullName.trim(),
    };

    localStorage.setItem(
      "debugarena_user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setSavedMessage("Profile updated successfully!");

    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handlePreferenceChange = (
    key: keyof Preferences,
    value: boolean
  ) => {
    setPreferences((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  return (
    <div className="main">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Settings</p>
          <h2>Settings</h2>
        </div>
      </header>

      {/* Profile Settings */}
      <section className="panel">
        <div className="panel-heading">
          <h3>Profile Settings</h3>
          <span>Manage your recruiter account</span>
        </div>

        <div className="assessment">
          <div style={{ flex: 1 }}>
            <h4>Full Name</h4>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              style={{
                width: "100%",
                maxWidth: "400px",
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
          <div>
            <h4>Email Address</h4>
            <p>{user.email || "Not available"}</p>
          </div>
        </div>

        <div className="assessment">
          <div>
            <h4>Account Role</h4>
            <p>
              {user.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "Recruiter"}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button onClick={handleSaveProfile}>
            Save Profile
          </button>

          {savedMessage && (
            <p
              role="status"
              style={{
                marginTop: "12px",
                color: savedMessage.includes("successfully")
                  ? "#4ade80"
                  : "#f87171",
              }}
            >
              {savedMessage}
            </p>
          )}
        </div>
      </section>

      {/* Preferences */}
      <section className="panel">
        <div className="panel-heading">
          <h3>Preferences</h3>
          <span>Customize your experience</span>
        </div>

        <div className="assessment">
          <div>
            <h4>Email Notifications</h4>
            <p>Receive updates about candidate submissions</p>
          </div>

          <input
            type="checkbox"
            checked={preferences.emailNotifications}
            onChange={(e) =>
              handlePreferenceChange(
                "emailNotifications",
                e.target.checked
              )
            }
            aria-label="Email notifications"
          />
        </div>

        <div className="assessment">
          <div>
            <h4>Assessment Notifications</h4>
            <p>Get notified about completed assessments</p>
          </div>

          <input
            type="checkbox"
            checked={preferences.assessmentNotifications}
            onChange={(e) =>
              handlePreferenceChange(
                "assessmentNotifications",
                e.target.checked
              )
            }
            aria-label="Assessment notifications"
          />
        </div>

        <p style={{ color: "#94a3b8", marginTop: "12px" }}>
          Your preferences are saved in this browser.
        </p>
      </section>

      {/* Security */}
      <section className="panel">
        <div className="panel-heading">
          <h3>Security</h3>
          <span>Protect your account</span>
        </div>

        <div className="assessment">
          <div>
            <h4>Password</h4>
            <p>Manage your account password</p>
          </div>

          <button
            type="button"
            onClick={() =>
              alert(
                "Password management will be available after backend authentication is integrated."
              )
            }
          >
            Change Password
          </button>
        </div>
      </section>
    </div>
  );
}

export default Settings;
