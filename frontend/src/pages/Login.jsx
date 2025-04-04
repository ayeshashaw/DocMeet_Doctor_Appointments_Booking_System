import React, { useContext, useEffect, useState } from 'react';
import { Lock, Mail, User, EyeOff, Eye, UserPlus } from 'lucide-react';
import './Login.css';
import { AppContext } from '../context/AppContext';
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { backendUrl, token,setToken } = useContext(AppContext);
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true); 
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isLogin) { // Signup
        if (formData.password !== formData.confirmPassword) {
          return toast.error("Passwords do not match");
        }

        const { data } = await axios.post(backendUrl + '/api/user/register', {
          name: formData.username,
          email: formData.email,
          password: formData.password
        });

        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Signup successful!");
        } else {
          toast.error(data.message);
        }
      } else { // Login
        const { data } = await axios.post(backendUrl + '/api/user/login', {
          email: formData.email,
          password: formData.password
        });

        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Login successful!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(()=>{
    if(token){
      navigate("/")
    }
  },[token])

  return (
    <div className="login-registration-container">
      <div className="login-card">
        <div className="form-toggle">
          <button 
            onClick={() => setIsLogin(true)}
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <input 
                type="text" 
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <input 
              type="email" 
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {!isLogin && (
            <div className="form-group">
              <input 
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {isLogin && (
            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Register'}
            {isLogin ? <Lock className="btn-icon" /> : <UserPlus className="btn-icon" />}
          </button>
        </form>

        {isLogin && (
          <div className="register-prompt">
            <p>
              Don't have an account? 
              <button 
                onClick={() => setIsLogin(false)}
                className="register-link"
              >
                Register
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
