import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, LogIn, RefreshCcw } from "lucide-react";
import "./Login.css";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setAtoken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const loginTypes = ["Admin", "Doctor"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prevent API call if fields are empty
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required!");
      setLoading(false);
      return;
    }

    try {
      let response;
      let loginUrl = `${backendUrl}/api/${state.toLowerCase()}/login`;

      response = await axios.post(loginUrl, { email, password });
      const { data } = response;

      if (data.success) {
        if (state === "Admin") {
          localStorage.setItem("aToken", data.token);
          setAtoken(data.token);
          navigate("/admin-dashboard");
        } else {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          navigate("/doctor-dashboard"); // ✅ Fixed typo
        }
        toast.success(`${state} logged in successfully`);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Login Type Selector */}
        <div className="login-type-selector">
          {loginTypes.map((type) => (
            <button
              key={type}
              onClick={() => setState(type)}
              className={`login-type-button ${state === type ? "active" : ""}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-header">
            <User className="login-icon" />
            <h2>{state} Login</h2>
            <p>
              Enter your credentials to access the {state.toLowerCase()}{" "}
              dashboard
            </p>
          </div>

          {/* Email Input */}
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {/* Forgot Password */}
          <div className="form-actions">
            <label className="remember-me">
              <input type="checkbox" className="checkbox" />
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? (
              <RefreshCcw className="button-loader" />
            ) : (
              <LogIn className="button-icon" />
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
