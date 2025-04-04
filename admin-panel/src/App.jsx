import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminContext } from "./context/AdminContext";

// Component Imports
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Page Imports
import Dashboard from "./pages/Admin/Dashboard";
import Appointments from "./pages/Admin/Appointments";
import AddDoctors from "./pages/Admin/AddDoctors";
import DoctorsList from "./pages/Admin/DoctorsList";
import { DoctorContext } from "./context/DoctorContext";
import DoctorAppointments from "./pages/Doctors/DoctorAppointments";
import DoctorProfile from "./pages/Doctors/DoctorProfile";
import DoctorDashboard from "./pages/Doctors/DoctorDashboard";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {aToken || dToken ? (
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Sidebar />
            <main className="content-area">
              <Routes>
                {/* dminRoute */}
                <Route
                  path="/"
                  element={<Navigate to="/admin-dashboard" replace />}
                />
                <Route path="/admin-dashboard" element={<Dashboard />} />
                <Route path="/all-appointments" element={<Appointments />} />
                <Route path="/add-doctors" element={<AddDoctors />} />
                <Route path="/doctors-list" element={<DoctorsList />} />

                {/* Doctor Route */}
                <Route
                  path="/"
                  element={<Navigate to={dToken ? "/doctor-dashboard" : "/admin-dashboard"} replace />}
                />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route
                  path="/doctor-appointments"
                  element={<DoctorAppointments />}
                />
                <Route path="/doctor-profile" element={<DoctorProfile />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default App;
