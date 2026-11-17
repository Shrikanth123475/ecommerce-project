import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      await api.put(`/orders/${orderId}/cancel`);

      alert("Order cancelled successfully");

      fetchOrders();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to cancel order"
      );
    }
  };

  return (
    <div style={{ padding: "25px" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#1E40AF",
          fontSize: "48px",
          fontWeight: "bold",
          marginTop: "20px",
          marginBottom: "30px",
          textShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        My Orders
      </h1>

      {orders.length === 0 ? (
        <h3
          style={{
            textAlign: "center",
            color: "#64748B",
          }}
        >
          No Orders Found
        </h3>
      ) : (
        orders.map((order) => (
          <div
            key={order.orderId}
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "25px",
              marginBottom: "20px",
              boxShadow:
                "0 4px 15px rgba(37,99,235,0.15)",
              border: "1px solid #BFDBFE",
            }}
          >
            {/* Header */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h2
                style={{
                  color: "#1E40AF",
                  margin: 0,
                }}
              >
                Order #{order.orderId}
              </h2>

              {order.status === "PLACED" && (
                <button
                  onClick={() =>
                    cancelOrder(order.orderId)
                  }
                  style={{
                    backgroundColor: "#EF4444",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Status */}

            <span
              style={{
                backgroundColor:
                  order.status === "PLACED"
                    ? "#DCFCE7"
                    : "#FEE2E2",
                color:
                  order.status === "PLACED"
                    ? "#166534"
                    : "#991B1B",
                padding: "8px 14px",
                borderRadius: "20px",
                fontWeight: "bold",
                display: "inline-block",
                marginBottom: "15px",
              }}
            >
              {order.status === "PLACED"
                ? "✅ PLACED"
                : "❌ CANCELLED"}
            </span>

            {/* Amount */}

            <p
              style={{
                color: "#2563EB",
                fontWeight: "bold",
                fontSize: "22px",
                marginBottom: "15px",
              }}
            >
              Total Amount: ₹
              {Number(
                order.totalAmount
              ).toLocaleString("en-IN")}
            </p>

            {/* Products */}

            <div>
              {order.items?.map((item) => (
                <div
                  key={`${order.orderId}-${item.productId}`}
                  style={{
                    padding: "6px 0",
                    color: "#475569",
                    fontSize: "17px",
                  }}
                >
                  • {item.productName} × {item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;