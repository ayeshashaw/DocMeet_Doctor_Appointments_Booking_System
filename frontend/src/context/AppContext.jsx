import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
    const currencySymbol = "/-";
    const backendUrl = "https://docmeet-g0lg.onrender.com";

    // Fetch token only once to avoid redundant localStorage access
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [doctors, setDoctors] = useState([]);
    const [userData, setUserData] = useState(null);

    // Fetch doctors' data
    const getDoctorsData = useCallback(async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
            if (data.success) {
                // Filter out unavailable doctors
                const availableDoctors = data.doctors.filter(doctor => doctor.available);
                setDoctors(availableDoctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.response?.data?.message || "Failed to fetch doctors");
        }
    }, [backendUrl]);

    // Fetch user profile data
    const loadUserProfileData = useCallback(async () => {
        if (token) {
            const source = axios.CancelToken.source();
            try {
                const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                    cancelToken: source.token,
                    timeout: 10000
                });
                if (data.success) {
                    setUserData(data.data);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error("Error fetching user profile:", error);
                    toast.error(error.response?.data?.message || "Failed to fetch user profile");
                }
            }
            return () => source.cancel('Request canceled by component unmount');
        }
    }, [token, backendUrl]);

    // Effect to fetch doctors on mount
    useEffect(() => {
        getDoctorsData();
    }, [getDoctorsData]);

    // Effect to fetch user profile when token changes
    useEffect(() => {
        loadUserProfileData();
    }, [token, loadUserProfileData]);

    // Memoized context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        doctors,
        getDoctorsData,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData,
    }), [doctors, token, backendUrl, userData, getDoctorsData, loadUserProfileData]);

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppProvider;
