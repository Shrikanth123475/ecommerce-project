function Navbar({ setPage }) {

  const email = localStorage.getItem("email");

  const initial = email
    ? email.charAt(0).toUpperCase()
    : "U";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#2563EB",
        padding: "15px 30px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Logo */}
      <h2
        style={{
          color: "white",
          margin: 0,
          fontSize: "36px",
          fontWeight: "bold",
        }}
      >
        🛒 ShopEase
      </h2>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        <button
          onClick={() => setPage("products")}
          style={buttonStyle}
        >
          Products
        </button>

        <button
          onClick={() => setPage("cart")}
          style={buttonStyle}
        >
          Cart
        </button>

        <button
          onClick={() => setPage("orders")}
          style={buttonStyle}
        >
          Orders
        </button>
      </div>

      {/* Profile + Logout */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <div
          onClick={() => setPage("profile")}
          title="Profile"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            backgroundColor: "white",
            color: "#2563EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "18px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {initial}
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          style={{
            ...buttonStyle,
            backgroundColor: "#EF4444",
            color: "white",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "white",
  color: "#2563EB",
  border: "none",
  borderRadius: "10px",
  padding: "10px 20px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};

export default Navbar;