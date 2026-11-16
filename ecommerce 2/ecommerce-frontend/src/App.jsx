import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/OrdersPage";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";

function App() {

  const [page, setPage] = useState(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      return "login";
    }

    return (
      localStorage.getItem("page") ||
      "products"
    );
  });

  useEffect(() => {

    if (
      page !== "login" &&
      page !== "register"
    ) {
      localStorage.setItem("page", page);
    }

  }, [page]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F0F9FF",
      }}
    >
      {page === "login" && (
        <Login
          onLoginSuccess={() => {

            localStorage.setItem(
              "page",
              "products"
            );

            setPage("products");
          }}
          onSwitchToRegister={() =>
            setPage("register")
          }
        />
      )}

      {page === "register" && (
        <Register
          onSwitchToLogin={() =>
            setPage("login")
          }
        />
      )}

      {(page === "products" ||
        page === "cart" ||
        page === "orders" ||
        page === "profile") && (
        <Navbar setPage={setPage} />
      )}

      {page === "products" && (
        <Products />
      )}

      {page === "cart" && (
        <Cart />
      )}

      {page === "orders" && (
        <Orders />
      )}

      {page === "profile" && (
        <Profile />
      )}
    </div>
  );
}

export default App;