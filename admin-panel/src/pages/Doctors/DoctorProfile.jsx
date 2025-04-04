import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios"; // ✅ Import axios
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import "./DoctorProfile.css";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, setProfileData, profileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currencySymbol } = useContext(AppContext);
  const [isEdit, setEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData?.address || { line1: "", line2: "" },
        fees: profileData?.fees || 0,
        available: profileData?.available || false,
      };

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.success);
        setEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Memoize getProfileData to avoid unnecessary re-renders
  const fetchProfileData = useCallback(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken, getProfileData]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (!profileData) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="image-container">
            <img
              src={profileData?.image || "/default-profile.png"}
              alt={`Dr. ${profileData?.name || "Unknown"}`}
              className="profile-image"
            />
          </div>

          <div className="profile-header-info">
            <h1 className="doctor-name">{profileData?.name || "Unknown"}</h1>
            <div className="credentials">
              <p className="specialization">
                {profileData?.degree || "N/A"} - {profileData?.speciality || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="profile-body">
          <div className="about-section">
            <h2 className="section-title">About</h2>
            <p className="about-text">{profileData?.about || "No details available."}</p>
          </div>

          <div className="details-section">
            <div className="fees-container">
              <h3 className="detail-title">Consultation Fee</h3>
              <p className="fees">
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData?.fees || ""}
                  />
                ) : (
                  profileData?.fees || "0"
                )}
                {currencySymbol}
              </p>
            </div>

            <div className="address-container">
              <h3 className="detail-title">Clinic Address</h3>
              <p className="address">
                {isEdit ? (
                  <>
                    <input
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: {
                            ...(prev.address || { line1: "", line2: "" }),
                            line1: e.target.value,
                          },
                        }))
                      }
                      value={profileData?.address?.line1 || ""}
                      placeholder="Address Line 1"
                    />
                    <br />
                    <input
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: {
                            ...(prev.address || { line1: "", line2: "" }),
                            line2: e.target.value,
                          },
                        }))
                      }
                      value={profileData?.address?.line2 || ""}
                      placeholder="Address Line 2"
                    />
                  </>
                ) : (
                  <>
                    {profileData?.address?.line1 || "Not provided"} <br />
                    {profileData?.address?.line2 || ""}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="profile-actions">
            <div className="availability-toggle">
              <input
                type="checkbox"
                id="availability"
                className="toggle-input"
                checked={profileData?.available || false}
                onChange={(e) =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: e.target.checked,
                  }))
                }
              />
              <label htmlFor="availability" className="toggle-label">
                Available for Appointments
              </label>
            </div>

            {isEdit ? (
              <button className="edit-button" onClick={updateProfile}>
                Save
              </button>
            ) : (
              <button className="edit-button" onClick={() => setEdit(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
