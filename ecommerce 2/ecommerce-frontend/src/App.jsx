import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/OrdersPage";
import Navbar from "./components/Navbar";
import profile from "./pages/Profile";

function App() {

  const [page, setPage] = useState("login");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F0F9FF",
      }}
    >
      {page === "login" && (
        <Login
          onLoginSuccess={() => setPage("products")}
          onSwitchToRegister={() => setPage("register")}
        />
      )}

      {page === "register" && (
        <Register
          onSwitchToLogin={() => setPage("login")}
        />
      )}

      {(page === "products" ||
        page === "cart" ||
        page === "orders" ||
        page === "profile") && (
        <Navbar setPage={setPage} />
      )}

      {page === "products" && <Products />}

      {page === "cart" && <Cart />}

      {page === "orders" && <Orders />}

      {page === "profile" && <Profile />}
    </div>
  );
}

export default App;