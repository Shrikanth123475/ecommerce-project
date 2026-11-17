import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";

function Products() {
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [selectedBrand, setSelectedBrand] =
    useState("");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredProducts = products.filter(
    (product) => {
      const categoryMatch =
        !selectedCategory ||
        product.category === selectedCategory;

      const brandMatch =
        !selectedBrand ||
        product.brand === selectedBrand;

      return categoryMatch && brandMatch;
    }
  );

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
          textShadow:
            "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        Products
      </h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "20px",
          alignItems: "flex-start",
        }}
      >
        <ProductFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={
            setSelectedCategory
          }
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map(
              (product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                />
              )
            )
          ) : (
            <h2
              style={{
                color: "#64748B",
                marginTop: "50px",
              }}
            >
              No products found
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;