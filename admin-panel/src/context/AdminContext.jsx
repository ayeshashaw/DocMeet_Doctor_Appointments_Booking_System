import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAtoken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const[appointments,setAppointments] = useState([])
  const[dashData,setDashData] = useState(false)

  const backendUrl = "https://docmeet-g0lg.onrender.com";

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/all-doctors",
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch doctors"
      );
    }
  };



  const changeAvailablity = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availablity`,
        { docId },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
  
      if (data.success) {
        toast.success(data.message);
        getAllDoctors(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error changing availability:", error);
      toast.error(error.response?.data?.message || "Failed to change availability");
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });
  
      if (data.success) {
        setAppointments(data.appointments);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    }
  };
  

  const cancelAppointments = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointments`,
        { appointmentId }, // Correct payload
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
  
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
  
      if (data.success) {
        toast.success(data.message);
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
    }
  };
  
  
  
  const value = {
    aToken,
    setAtoken,
    backendUrl,
    doctors, // Include doctors in context
    getAllDoctors, // Now added correctly
    changeAvailablity,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointments,
    dashData,
    getDashData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
