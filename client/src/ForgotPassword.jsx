import { useState } from "react";
import axios from "axios";
import "./AdminLogin.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // email, code, reset
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(`${API_URL}/forgotPassword`, {
        email: formData.email
      });
      setSuccess("Reset code sent to your email!");
      setTimeout(() => {
        setStep("code");
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordRegex.test(formData.newPassword)) {
      setError("Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char");
      return;
    }

    setLoading(true);

    try {
      await axios.put(`${API_URL}/resetPassword`, {
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword
      });
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.hash = "/adminlogin";
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
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
            <div className="card-icon">🔑</div>
            <span>Reset Password</span>
          </div>

          <h2>Password Reset</h2>
          <p className="subtitle">
            {step === "email" && "Enter your email to receive a reset code"}
            {step === "code" && "Enter the reset code sent to your email"}
            {step === "reset" && "Create your new password"}
          </p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {step === "email" && (
            <form onSubmit={handleSendCode}>
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
              </div>
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={(e) => { e.preventDefault(); setStep("reset"); }}>
              <div className="form-group">
                <label>Reset Code (6 digits)</label>
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
              <button className="login-btn" type="submit">
                Verify Code
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <small>8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char</small>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <a href="#/adminlogin" style={{ color: "#128c7e", textDecoration: "none" }}>
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
