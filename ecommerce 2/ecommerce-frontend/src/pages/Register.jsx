import { useState } from "react";
import api from "../services/api";

export default function Register({
  onSwitchToLogin,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await api.post(
        "/users/register",
        formData
      );

      setMessage(
        "Registration successful! Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
      });

      if (onSwitchToLogin) {
        setTimeout(() => {
          onSwitchToLogin();
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data ||
          err.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "500px",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 25px rgba(37,99,235,0.15)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2563EB",
            fontSize: "48px",
            marginBottom: "10px",
          }}
        >
          🛒 ShopEase
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748B",
            marginBottom: "30px",
          }}
        >
          Create your account and start shopping
        </p>

        <h2
          style={{
            textAlign: "center",
            color: "#1E40AF",
            marginBottom: "25px",
          }}
        >
          Register
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}

          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#2563EB",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",

            }}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        {message && (
          <p
            style={{
              color: "#16A34A",
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            {message}
          </p>
        )}

        {error && (
          <p
            style={{
              color: "#DC2626",
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            {error}
          </p>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#64748B",
          }}
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              color: "#2563EB",
              fontWeight: "bold",
              cursor: "pointer",

            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #CBD5E1",
  fontSize: "16px",
  backgroundColor:"white",
  color: "#000000",
};