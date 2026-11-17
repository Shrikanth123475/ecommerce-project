import { useState } from "react";
import api from "../services/api";

export default function Login({
  onLoginSuccess,
  onSwitchToRegister,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/users/login",
        formData
      );

      const data = response.data;

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "email",
        formData.email
      );

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed"
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
          width: "450px",
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
          Welcome back to your shopping world
        </p>

        <h2
          style={{
            textAlign: "center",
            color: "#1E40AF",
            marginBottom: "25px",
          }}
        >
          Login
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
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              fontSize: "16px",
              backgroundColor:"white",
              color: "#000000",
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              fontSize: "16px",
              backgroundColor:"white",
             color: "#000000"
            }}
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
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {error && (
          <p
            style={{
              color: "#DC2626",
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <p
          style={{
            marginTop: "25px",
            textAlign: "center",
            color: "#64748B",
          }}
        >
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={{
              background: "none",
              border: "none",
              color: "#2563EB",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}