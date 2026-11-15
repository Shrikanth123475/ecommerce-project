import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
            <h1
              style={{
                textAlign: "center",
                color: "#1E40AF",
                fontSize: "48px",
                fontWeight: "bold",
                marginTop: "30px",
                marginBottom: "30px",
                textShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              My Orders
            </h1>

      {orders.length === 0 ? (
        <h3>No Orders Found</h3>
      ) : (
        orders.map((order) => (
          <div
            key={order.orderId}
           style={{
             backgroundColor: "white",
             borderRadius: "20px",
             padding: "25px",
             marginBottom: "20px",
             boxShadow: "0 4px 15px rgba(37,99,235,0.15)",
             border: "1px solid #BFDBFE",
           }}
          >
            <h2
              style={{
                color: "#1E40AF",
                marginBottom: "10px",
              }}
            >
              Order #{order.orderId}
            </h2>

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
              }}
            >
              {order.status}
            </span>

            <p
              style={{
                color: "#2563EB",
                fontWeight: "bold",
                fontSize: "22px",
                marginTop: "15px",
              }}
            >
              Total Amount: ₹ {order.totalAmount}
            </p>

            {order.items?.map((item) => (
              <div
                key={`${order.orderId}-${item.productId}`}
                style={{
                  padding: "6px 0",
                  color: "#475569",
                }}
              >
                • {item.productName} × {item.quantity}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;