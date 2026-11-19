function Navbar({
  setPage,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
}) {
  const email = localStorage.getItem("email");

  const initial = email
    ? email.charAt(0).toUpperCase()
    : "U";

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,

          zIndex: 1000,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          gap: "12px",

          width: "100%",
          boxSizing: "border-box",

          padding: "12px 18px",

          backgroundColor: "#2563EB",

          boxShadow:
            "0 4px 15px rgba(0,0,0,0.15)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            flexShrink: 0,
            minWidth: "170px",
          }}
        >
          <h2
            style={{
              color: "white",
              margin: 0,
              fontSize: "30px",
              fontWeight: "bold",
            }}
          >
            🛒 ShopEase
          </h2>
        </div>

        {/* Search Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: "250px",
            maxWidth: "500px",
          }}
        >
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "25px",
              border:
                "1px solid #CBD5E1",
              backgroundColor:
                "#FFFFFF",
              color: "#000",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              backgroundColor:
                "#FFFFFF",
              cursor: "pointer",
              minWidth: "120px",
            }}
          >
            <option value="all">
              All Products
            </option>

            <option value="available">
              Available
            </option>

            <option value="outofstock">
              Out Of Stock
            </option>
          </select>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() =>
              setPage("products")
            }
            style={buttonStyle}
          >
            Products
          </button>

          <button
            onClick={() =>
              setPage("orders")
            }
            style={buttonStyle}
          >
            Orders
          </button>
        </div>

        {/* Right Side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <div
            onClick={() =>
              setPage("cart")
            }
            title="Cart"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor:
                "white",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              fontSize: "26px",
              cursor: "pointer",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            🛍️
          </div>

          <div
            onClick={() =>
              setPage("profile")
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                backgroundColor:
                  "white",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                fontWeight: "bold",
                fontSize: "18px",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {initial}
            </div>

            <span
              style={{
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              ▾
            </span>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              ...buttonStyle,
              backgroundColor:
                "#EF4444",
              color: "white",
              minWidth: "95px",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ height: "80px" }} />
    </>
  );
}

const buttonStyle = {
  backgroundColor: "white",
  color: "#2563EB",
  border: "none",
  borderRadius: "10px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
  minWidth: "95px",
};

export default Navbar;