import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

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
        {products.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}

export default Products;