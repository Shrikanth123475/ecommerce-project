import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products({ searchTerm, filter }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "available"
        ? product.quantity > 0
        : product.quantity === 0;

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
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
        Products
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {filteredProducts.length === 0 ? (
          <h2
            style={{
              color: "#64748B",
              marginTop: "40px",
            }}
          >
            No products found
          </h2>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Products;