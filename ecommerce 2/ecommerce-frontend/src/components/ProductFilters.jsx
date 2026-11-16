import { useEffect, useState } from "react";
import api from "../services/api";

function ProductFilters() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const categoryResponse =
        await api.get("/products/categories");

      const brandResponse =
        await api.get("/products/brands");

      setCategories(categoryResponse.data);
      setBrands(brandResponse.data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        width: "250px",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          color: "#1E40AF",
          marginBottom: "20px",
        }}
      >
        Filters
      </h2>

      {/* Categories */}
      <div>
        <h3>Categories</h3>

        {categories.map((category) => (
          <div key={category}>
            <input type="checkbox" />
            <span style={{ marginLeft: "8px" }}>
              {category}
            </span>
          </div>
        ))}
      </div>

      <hr />

      {/* Brands */}
      <div>
        <h3>Brands</h3>

        {brands.map((brand) => (
          <div key={brand}>
            <input type="checkbox" />
            <span style={{ marginLeft: "8px" }}>
              {brand}
            </span>
          </div>
        ))}
      </div>

      <hr />

      {/* Future Price Filter */}
      <div>
        <h3>Price Range</h3>

        <p>Coming Soon...</p>
      </div>
    </div>
  );
}

export default ProductFilters;