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

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError(
        "Please enter a valid email address."
      );
      setLoading(false);
      return;
    }

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
      console.log(err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          "Invalid email or password."
        );
      } else {
        setError(
          "Unable to login. Please try again."
        );
      }
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
            type="text"
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
          <div
            style={{
              backgroundColor: "#FEE2E2",
              color: "#B91C1C",
              padding: "12px",
              borderRadius: "8px",
              marginTop: "15px",
              textAlign: "center",
              border: "1px solid #FCA5A5",
            }}
          >
            {error}
          </div>
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
