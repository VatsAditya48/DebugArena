
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function RecruiterLayout() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default RecruiterLayout;
