import { useState } from "react";
import axios from "axios";
import "./AdminLogin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1/admin" 

export default function AdminLogin() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: ""
  });

  // Email validation pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Password requirements: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const validateField = (name, value) => {
    let error = "";
    
    if (name === "email" && value) {
      if (!emailRegex.test(value)) {
        error = "Invalid email format";
      }
    }
    
    if (name === "password" && value) {
      if (value.length < 8) {
        error = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(value)) {
        error = "Password must contain an uppercase letter";
      } else if (!/[a-z]/.test(value)) {
        error = "Password must contain a lowercase letter";
      } else if (!/\d/.test(value)) {
        error = "Password must contain a number";
      } else if (!/[#?!@$%^&*-]/.test(value)) {
        error = "Password must contain a special character (#?!@$%^&*-)";
      }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Live validation
    const error = validateField(name, value);
    setValidationErrors({ ...validationErrors, [name]: error });
  };

  // Check if form has any errors or empty required fields
  const hasErrors = () => {
    if (isVerifying) {
      return !formData.code || formData.code.length !== 6;
    } else {
      return !formData.email || !formData.password || 
             validationErrors.email || validationErrors.password;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate before submission
    if (hasErrors()) {
      setError("Please fix validation errors before submitting");
      return;
    }

    try {
      if (isVerifying) {
        // Verify email with OTP
        await axios.put(`${API_URL}/verify`, {
          code: formData.code
        }, {
          headers: { token }
        });
        setSuccess("Email verified successfully! Redirecting...");
        setTimeout(() => {
          window.location.hash = "/livechatadmin";
        }, 1500);
      } else {
        // Sign In
        const res = await axios.post(`${API_URL}/signIn`, {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem("token", res.data.token);
        setSuccess("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.hash = "/livechatadmin";
        }, 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "An error occurred";
      setError(errorMsg);
      console.error("Auth error:", err);
    }
  };

  return (
    <div className="admin-page">
      <div className="logo-brand">
        <div className="logo-icon">💬</div>
        <span>ChatHub</span>
      </div>

      <div className="login-wrapper">
        <div className="login-card">
          <div className="card-header">
            <div className="card-icon">🔐</div>
            <span>{isVerifying ? "Verify" : "Login"}</span>
          </div>

          <h2>{isVerifying ? "Verify Email" : "Admin Portal"}</h2>
          <p className="subtitle">
            {isVerifying 
              ? "Enter the OTP sent to your email." 
              : "Sign in to access the live chat dashboard."}
          </p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            {isVerifying ? (
              <div className="form-group">
                <label>OTP Code</label>
                <input 
                  type="text" 
                  name="code" 
                  value={formData.code} 
                  onChange={handleChange} 
                  placeholder="123456" 
                  maxLength="6"
                  required 
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="admin@example.com" 
                    required 
                  />
                  {validationErrors.email && <span className="validation-error">⚠ {validationErrors.email}</span>}
                  {formData.email && !validationErrors.email && <span className="validation-success">✓ Valid email</span>}
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="••••••••" 
                    required 
                  />
                  {validationErrors.password && <span className="validation-error">⚠ {validationErrors.password}</span>}
                  {formData.password && !validationErrors.password && <span className="validation-success">✓ Valid password</span>}
                </div>

                <div style={{ textAlign: "right", marginTop: "10px" }}>
                  <a href="#/forgot-password" style={{ color: "#128c7e", textDecoration: "none", fontSize: "14px" }}>
                    Forgot Password?
                  </a>
                </div>
              </>
            )}

            <button className="login-btn" type="submit" disabled={hasErrors()}>
              {isVerifying ? "Verify Email" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
