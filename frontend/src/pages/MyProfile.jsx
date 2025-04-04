import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assetsDoc";
import axios from "axios";
import { toast } from "react-toastify";
import "./MyProfile.css"; 

const MyProfile = () => {
  const { userData, setUserData, backendUrl, token, loadUserProfileData } =
    useContext(AppContext);
  const [isEdited, setEdited] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewImage(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Cleanup object URL
    }
  }, [image]);

  const updateUserProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData?.name || "");
      formData.append("phone", userData?.phone || "");
      formData.append("address", JSON.stringify(userData?.address || {}));
      formData.append("gender", userData?.gender || "");
      formData.append("dob", userData?.dob || "");

      if (image) formData.append("image", image);

      const { data } = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Profile updated successfully!");
        await loadUserProfileData();
        setEdited(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed.");
    }
  };

  const getImageSource = () => {
    if (previewImage) return previewImage;
    if (userData?.image) return userData.image;
    return assets.default_profile || "https://via.placeholder.com/120";
  };

  return (
    userData && (
      <div className="profile-container">
        <div className="profile-card">
          {/* Profile Header with Image */}
          <div className="profile-header">
            {isEdited ? (
              <label htmlFor="image" className="profile-image-container">
                <img src={getImageSource()} alt="Profile" className="profile-image" />
                <div className="upload-overlay">
                  <div className="upload-icon">
                    <img src={assets.upload_icon} alt="Upload" />
                  </div>
                </div>
                <input
                  type="file"
                  id="image"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            ) : (
              <div className="profile-image-container">
                <img src={getImageSource()} alt="Profile" className="profile-image" />
              </div>
            )}
            
            <div className="profile-name">
              {isEdited ? (
                <input
                  type="text"
                  className="name-input"
                  value={userData?.name || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your Name"
                />
              ) : (
                <h1>{userData?.name || "No Name"}</h1>
              )}
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="profile-body">
            {/* Contact Information Section */}
            <div className="profile-section">
              <h2 className="section-name">Contact Information</h2>
              <div className="divider"></div>
              
              <div className="info-group">
                <div className="info-field">
                  <span className="info-label">Email</span>
                  <span className="info-value">{userData?.email || "Not provided"}</span>
                </div>

                <div className="info-field">
                  <span className="info-label">Phone</span>
                  {isEdited ? (
                    <input
                      type="text"
                      className="form-input"
                      value={userData?.phone || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="Your Phone Number"
                    />
                  ) : (
                    <span className="info-value">{userData?.phone || "Not provided"}</span>
                  )}
                </div>

                <div className="info-field address-field">
                  <span className="info-label">Address</span>
                  {isEdited ? (
                    <div className="address-inputs">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Address Line 1"
                        value={userData?.address?.line1 || ""}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line1: e.target.value },
                          }))
                        }
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Address Line 2"
                        value={userData?.address?.line2 || ""}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line2: e.target.value },
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <span className="info-value">
                      {userData?.address?.line1 || userData?.address?.line2 
                        ? `${userData?.address?.line1 || ""} ${
                            userData?.address?.line1 && userData?.address?.line2 ? ", " : ""
                          } ${userData?.address?.line2 || ""}`
                        : "Not provided"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Basic Information Section */}
            <div className="profile-section">
              <h2 className="section-name">Basic Information</h2>
              <div className="divider"></div>
              
              <div className="info-group">
                <div className="info-field">
                  <span className="info-label">Gender</span>
                  {isEdited ? (
                    <select
                      className="form-select"
                      value={userData?.gender || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({ ...prev, gender: e.target.value }))
                      }
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <span className="info-value">{userData?.gender || "Not provided"}</span>
                  )}
                </div>

                <div className="info-field">
                  <span className="info-label">Birthday</span>
                  {isEdited ? (
                    <input
                      type="date"
                      className="form-input"
                      value={userData?.dob || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({ ...prev, dob: e.target.value }))
                      }
                    />
                  ) : (
                    <span className="info-value">{userData?.dob || "Not provided"}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="profile-actions">
              {isEdited ? (
                <>
                  <button className="save-button" onClick={updateUserProfile}>
                    Save Changes
                  </button>
                  <button className="cancel-button" onClick={() => setEdited(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="edit-button" onClick={() => setEdited(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
