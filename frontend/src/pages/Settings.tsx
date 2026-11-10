
import "../App.css";

function Settings() {
  return (
    <div className="main">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Settings</p>
          <h2>Settings</h2>
        </div>
      </header>

      <section className="panel">
        <div className="panel-heading">
          <h3>Profile Settings</h3>
          <span>Manage your recruiter account</span>
        </div>

        <div className="assessment">
          <div>
            <h4>Full Name</h4>
            <p>Admin</p>
          </div>
        </div>

        <div className="assessment">
          <div>
            <h4>Email Address</h4>
            <p>admin@debugarena.com</p>
          </div>
        </div>

        <div className="assessment">
          <div>
            <h4>Account Role</h4>
            <p>Administrator</p>
          </div>
        </div>
      </section>

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
          <input type="checkbox" defaultChecked />
        </div>

        <div className="assessment">
          <div>
            <h4>Assessment Notifications</h4>
            <p>Get notified about completed assessments</p>
          </div>
          <input type="checkbox" defaultChecked />
        </div>
      </section>

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
          <button onClick={() => alert("Password settings coming soon!")}>
            Change Password
          </button>
        </div>
      </section>
    </div>
  );
}

export default Settings;

