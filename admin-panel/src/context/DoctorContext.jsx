import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = "https://docmeet-g0lg.onrender.com";

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const[dashData,setDashData] = useState(false)
  const[profileData, setProfileData] = useState(false)

  const getAppointments = async () => {
    if (!dToken) {
      toast.error("Doctor authentication token is missing!");
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: {
          Authorization: `Bearer ${dToken}`,
        },
      });

      if (data.success) {
        setAppointments([...data.appointments].reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    }
  };

  const completeAppointments = async (docId, appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/appointment-completed`,
        { docId, appointmentId }, // ✅ Pass docId along with appointmentId
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
  
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error(error.response?.data?.message || "Failed to update appointment");
    }
  };
  

  const cancelAppointments = async (docId, appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/appointment-cancelled`,
        { docId, appointmentId }, // ✅ Pass docId along with appointmentId
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
  
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error(error.response?.data?.message || "Failed to update appointment");
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/dashboard`,
        
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
  
      if (data.success) {
        setDashData(data);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  };
  

  const getProfileData= async()=>{
    try {

      const { data } = await axios.get(
        `${backendUrl}/api/doctor/profile`,
        
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
  
      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      } else {
        toast.error(data.message);
      }
  
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }

  }
  
  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    cancelAppointments,
    completeAppointments,
    dashData,
    setDashData,
    getDashData,
    setProfileData,
    getProfileData,
    profileData
  };

  return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};

export default DoctorContextProvider;
