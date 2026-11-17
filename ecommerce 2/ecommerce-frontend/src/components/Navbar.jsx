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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#2563EB",
        padding: "20px 35px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Logo */}
      <h2
        style={{
          color: "white",
          margin: 0,
          fontSize: "42px",
          fontWeight: "bold",
        }}
      >
        🛒 ShopEase
      </h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "350px",
            padding: "12px 18px",
            borderRadius: "25px",
            border: "1px solid #CBD5E1",
            backgroundColor: "#FFFFFF",
            color: "#000000",
            outline: "none",
            fontSize: "15px",
          }}
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            color: "black",
            cursor: "pointer",
            backgroundColor: "#FFFFFF",
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
          gap: "15px",
        }}
      >
       <button onClick={() => setPage("products")}
           style={buttonStyle}
           >
         Products
       </button>

       <button onClick={() => setPage("orders")}
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
          onClick={() => setPage("cart")}
          title="Cart"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: "white",
            color: "#2563EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "35px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          🛍️
        </div>

        <div
          onClick={() => setPage("profile")}
          title="Profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
            fontSize: "35px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "white",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {initial}
          </div>

          <span
            style={{
              color: "white",
              fontSize: "45px",
              fontWeight: "bold",
            }}
          >
            ▾
          </span>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            setPage("login");
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
  borderRadius: "12px",
  padding: "12px 24px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "17px",
};

export default Navbar;