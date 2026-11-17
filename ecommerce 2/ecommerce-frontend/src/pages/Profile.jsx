import { useEffect, useState } from "react";
import api from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("/users/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));

    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete("/users/delete");

      localStorage.removeItem("token");
      localStorage.removeItem("email");

      alert("Account deleted successfully");

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put("/users/profile", {
        name: profile.name,
        address: profile.address,
      });

      alert("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (!profile) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        paddingTop: "50px",
        paddingBottom: "50px",
      }}
    >
      <div
        style={{
          width: "700px",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          padding: "35px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        }}
      >
        {/* Profile Header */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              backgroundColor: "#2563EB",
              color: "white",
              fontSize: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 15px",
            }}
          >
            {profile.name?.charAt(0).toUpperCase()}
          </div>

          <h1
            style={{
              margin: 0,
              color: "#1E40AF",
            }}
          >
            My Profile
          </h1>
        </div>

        {/* Profile Details */}

        {editing ? (
          <>
            <div style={{ marginBottom: "15px" }}>
              <label>
                <strong>Name</strong>
              </label>

              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "5px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>
                <strong>Email</strong>
              </label>

              <input
                type="text"
                value={profile.email}
                disabled
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "5px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#F1F5F9",
                  color: "#000000",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>
                <strong>Address</strong>
              </label>

              <input
                type="text"
                value={profile.address || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    address: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "5px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                }}
              />
            </div>
          </>
        ) : (
          <div
            style={{
              fontSize: "18px",
              lineHeight: "2",
            }}
          >
            <p>
              <strong>Name:</strong> {profile.name}
            </p>

            <p>
              <strong>Email:</strong> {profile.email}
            </p>

            <p>
              <strong>Address:</strong> {profile.address}
            </p>
          </div>
        )}

        {/* Buttons */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "25px",
          }}
        >
          {editing ? (
            <button
              onClick={handleUpdate}
              style={{
                backgroundColor: "#10B981",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              style={{
                backgroundColor: "#2563EB",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "#EF4444",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Delete Account
          </button>
        </div>

        {/* Orders Section */}

        <hr
          style={{
            margin: "35px 0",
            border: "none",
            borderTop: "1px solid #E5E7EB",
          }}
        />

        <h2
          style={{
            color: "#1E40AF",
            marginBottom: "10px",
          }}
        >
          📦 Recent Orders
        </h2>

        <p
          style={{
            color: "#64748B",
            marginBottom: "20px",
          }}
        >
          Total Orders: {orders.length}
        </p>

        {orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "30px",
              backgroundColor: "#F8FAFC",
              borderRadius: "12px",
            }}
          >
            <h3>📦 No Orders Yet</h3>
            <p>Start shopping to see your orders here.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.orderId}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "18px",
                marginBottom: "16px",
                boxShadow: "0 4px 12px rgba(37,99,235,0.08)",
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#1E40AF",
                  }}
                >
                  📦 Order #{order.orderId}
                </h3>

                <span
                  style={{
                    backgroundColor: "#DCFCE7",
                    color: "#166534",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  ✅ {order.status}
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#64748B",
                  fontSize: "14px",
                }}
              >
                Total Amount
              </p>

              <h2
                style={{
                  margin: "5px 0 0 0",
                  color: "#2563EB",
                }}
              >
                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
              </h2>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
