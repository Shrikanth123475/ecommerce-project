import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/OrdersPage";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";

import Navbar from "./components/Navbar";

function App() {
  const [page, setPage] = useState(() => {
    const token =
      localStorage.getItem("token");

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
      localStorage.setItem(
        "page",
        page
      );
    }
  }, [page]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor:
          "#F0F9FF",
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
        <Navbar
          setPage={setPage}
          searchTerm={searchTerm}
          setSearchTerm={
            setSearchTerm
          }
          filter={filter}
          setFilter={setFilter}
        />
      )}

      {page === "products" &&
        (selectedProductId ? (
          <ProductDetails
            productId={
              selectedProductId
            }
            setSelectedProductId={
              setSelectedProductId
            }
          />
        ) : (
          <Products
            searchTerm={searchTerm}
            filter={filter}
            setSelectedProductId={
              setSelectedProductId
            }
          />
        ))}

      {page === "cart" && <Cart />}

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