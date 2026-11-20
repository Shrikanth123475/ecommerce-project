import { useEffect, useState } from "react";
import api from "../services/api";

function Cart() {
  const [cart, setCart] = useState(null);

  const loadCart = () => {
    api
      .get("/cart")
      .then((res) => {
        setCart(res.data);
      })
      .catch((err) => {
        console.error("Error loading cart:", err);
      });
  };

  useEffect(() => {
    loadCart();
  }, []);

  const placeOrder = async () => {
    try {
      await api.post("/orders/place");

      alert("Order placed successfully");

      loadCart();
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    }
  };

  const incrementItem = async (cartItemId) => {
    try {
      await api.put(
        `/cart-items/${cartItemId}/increment`
      );

      loadCart();
    } catch (error) {
      console.error(error);
      alert("Increment failed");
    }
  };

  const decrementItem = async (cartItemId) => {
    try {
      await api.put(
        `/cart-items/${cartItemId}/decrement`
      );

      loadCart();
    } catch (error) {
      console.error(error);
      alert("Decrement failed");
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await api.delete(
        `/cart-items/${cartItemId}`
      );

      loadCart();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  if (!cart) {
    return <h2>Loading Cart...</h2>;
  }

  const total = (cart.items || []).reduce(
    (sum, item) =>
      sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#1E40AF",
          fontSize: "48px",
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        My Cart
      </h1>

      <h3
        style={{
          textAlign: "center",
          color: "#64748B",
          marginBottom: "30px",
        }}
      >
        Email: {cart.email}
      </h3>

      {!cart.items || cart.items.length === 0 ? (
        <h2
          style={{
            textAlign: "center",
            color: "#1E40AF",
          }}
        >
          Cart is Empty
        </h2>
      ) : (
        <>
          {cart.items.map((item) => (
            <div
              key={item.cartItemId}
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "25px",
                marginBottom: "25px",
                boxShadow:
                  "0 4px 15px rgba(37,99,235,0.15)",
                border: "1px solid #BFDBFE",
              }}
            >
              <h2
                style={{
                  color: "#1E40AF",
                  marginBottom: "10px",
                }}
              >
                {item.productName}
              </h2>

              <p
                style={{
                  color: "#64748B",
                  marginBottom: "10px",
                }}
              >
                {item.description}
              </p>

              <p
                style={{
                  color: "#2563EB",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
              >
                ₹ {item.price}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "15px",
                }}
              >
                <button
                  onClick={() =>
                    decrementItem(item.cartItemId)
                  }
                  style={quantityButton}
                >
                  -
                </button>

                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    incrementItem(item.cartItemId)
                  }
                  style={quantityButton}
                >
                  +
                </button>

                <button
                  onClick={() =>
                    removeItem(item.cartItemId)
                  }
                  style={removeButton}
                >
                  Remove
                </button>
              </div>

              <p
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                  color: "#1E40AF",
                  fontSize: "18px",
                }}
              >
                Subtotal: ₹{" "}
                {(item.price || 0) * item.quantity}
              </p>
            </div>
          ))}

          <div
            style={{
              textAlign: "right",
              marginTop: "30px",
            }}
          >
            <h2
              style={{
                color: "#1E40AF",
                fontSize: "34px",
                marginBottom: "15px",
              }}
            >
              Total: ₹ {total}
            </h2>

            <button
              onClick={placeOrder}
              style={{
                backgroundColor: "#22C55E",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "14px 28px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const quantityButton = {
  backgroundColor: "#2563EB",
  color: "white",
  border: "none",
  borderRadius: "8px",
  width: "36px",
  height: "36px",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "bold",
};

const removeButton = {
  backgroundColor: "#EF4444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  cursor: "pointer",
  marginLeft: "15px",
  fontWeight: "bold",
};

export default Cart;