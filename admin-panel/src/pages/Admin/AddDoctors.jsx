import React, { useContext, useState } from "react";
import axios from "axios"
import {
  ImagePlus,
  User,
  Mail,
  Lock,
  Briefcase,
  MapPin,
  FileText,
} from "lucide-react";
import "./AddDoctors.css";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

function AddDoctors() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "",
    experience: "",
    fees: "",
    education: "",
    address1: "",
    address2: "",
    aboutMe: "",
  });

  const { backendUrl, aToken } = useContext(AdminContext);
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!imageFile) {
        return toast.error("Image not selected");
      }

      const submission = new FormData();
      submission.append('image', imageFile);
      submission.append('name', formData.name);
      submission.append('email', formData.email);
      submission.append('password', formData.password);
      submission.append('experience', formData.experience);
      submission.append('speciality', formData.speciality);
      submission.append('degree', formData.education);
      submission.append('about', formData.aboutMe);
      submission.append('fees', formData.fees);
      submission.append('address', JSON.stringify({
        line1: formData.address1,
        line2: formData.address2
      }));

      // Log FormData entries (if needed)
      for (let pair of submission.entries()) {
        console.log(`${pair[0]}, ${pair[1]}`);
      }

      const {data} = await axios.post(backendUrl + "/api/admin/add-doctor", submission, {
        headers: {
          'Authorization': `Bearer ${aToken}`
        }
      })

      if(data.success){
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }

      console.log("Form submission data:", Object.fromEntries(submission));
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while adding the doctor");
    }
  };

  return (
    <div className="add-doctors-container">
      <div className="page-header">
        <h1>Add Doctor</h1>
      </div>

      <form onSubmit={handleSubmit} className="add-doctor-form">
        <div className="profile-upload">
          <input
            type="file"
            id="profile-image"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="profile-image" className="profile-image-label">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-image" />
            ) : (
              <>
                <ImagePlus />
                <span>Upload doctor picture</span>
              </>
            )}
          </label>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <User className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <Mail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <Lock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <Briefcase className="input-icon" />
            <select
              name="speciality"
              value={formData.speciality}
              onChange={handleInputChange}
              required
            >
              <option value="">Speciality</option>
              <option value="General Physician">General Physician</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Dermatologist">Dermatologist</option>
            </select>
          </div>

          <div className="form-group">
            <Briefcase className="input-icon" />
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
            >
              <option value="">Experience</option>
              <option value="0-2">0-2 years</option>
              <option value="2-5">2-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          <div className="form-group">
            <div className="input-icon">₹</div>
            <input
              type="number"
              name="fees"
              placeholder="Your fees"
              value={formData.fees}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <FileText className="input-icon" />
            <input
              type="text"
              name="education"
              placeholder="Education"
              value={formData.education}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <MapPin className="input-icon" />
            <input
              type="text"
              name="address1"
              placeholder="Address 1"
              value={formData.address1}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <MapPin className="input-icon" />
            <input
              type="text"
              name="address2"
              placeholder="Address 2"
              value={formData.address2}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <textarea
            name="aboutMe"
            placeholder="Write about yourself"
            value={formData.aboutMe}
            onChange={handleInputChange}
            rows="4"
          ></textarea>
        </div>

        <button type="submit" className="submit-button">
          Add doctor
        </button>
      </form>
    </div>
  );
}

export default AddDoctors;