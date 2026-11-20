import { useEffect, useState } from "react";
import api from "../services/api";

function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  maxPrice,
  setMaxPrice,
}) {
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

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setMaxPrice(1000000);
  };

  return (
    <div
      style={{
        width: "280px",
        minWidth: "280px",

        position: "sticky",
        top: "110px",

        alignSelf: "flex-start",

        background:
          "linear-gradient(to bottom, #FFFFFF, #F8FBFF)",

        border: "1px solid #DCEAFE",

        borderRadius: "16px",

        padding: "24px",

        boxShadow:
          "0 8px 24px rgba(37,99,235,0.08)",

        zIndex: 100,

        height: "fit-content",
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: "20px",
          color: "#1E3A8A",
          fontSize: "32px",
          fontWeight: "700",
        }}
      >
        🔍 Filters
      </h2>

      <hr />

      {/* Categories */}
      <div style={{ marginTop: "20px" }}>
        <h3
          style={{
            color: "#1E3A8A",
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "15px",
          }}
        >
          Categories
        </h3>

        <label
          style={{
            display: "block",
            marginBottom: "10px",
            cursor: "pointer",
          }}
        >
          <input
            type="radio"
            name="category"
            checked={selectedCategory === ""}
            onChange={() =>
              setSelectedCategory("")
            }
          />{" "}
          All Categories
        </label>

        {categories.map((category) => (
          <label
            key={category}
            style={{
              display: "block",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="category"
              checked={
                selectedCategory === category
              }
              onChange={() =>
                setSelectedCategory(
                  category
                )
              }
            />{" "}
            {category}
          </label>
        ))}
      </div>

      <hr
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      />

      {/* Brands */}
      <div>
        <h3
          style={{
            color: "#1E3A8A",
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "15px",
          }}
        >
          Brands
        </h3>

        <label
          style={{
            display: "block",
            marginBottom: "10px",
            cursor: "pointer",
          }}
        >
          <input
            type="radio"
            name="brand"
            checked={selectedBrand === ""}
            onChange={() =>
              setSelectedBrand("")
            }
          />{" "}
          All Brands
        </label>

        {brands.map((brand) => (
          <label
            key={brand}
            style={{
              display: "block",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="brand"
              checked={
                selectedBrand === brand
              }
              onChange={() =>
                setSelectedBrand(brand)
              }
            />{" "}
            {brand}
          </label>
        ))}
      </div>

      <hr
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      />

      {/* Price Range */}
      <div>
        <h3
          style={{
            color: "#1E3A8A",
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "15px",
          }}
        >
          Price Range
        </h3>

        <input
          type="range"
          min="0"
          max="1000000"
          step="1000"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(
              Number(e.target.value)
            )
          }
          style={{
            width: "100%",
            cursor: "pointer",
          }}
        />

        <p
          style={{
            color: "#2563EB",
            fontWeight: "bold",
            fontSize: "18px",
            marginTop: "12px",
          }}
        >
          ₹0 - ₹
          {Number(maxPrice).toLocaleString(
            "en-IN"
          )}
        </p>
      </div>

      <button
        onClick={clearFilters}
        style={{
          width: "100%",
          marginTop: "25px",
          padding: "14px",
          backgroundColor: "#2563EB",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "10px",
          fontWeight: "bold",
          fontSize: "15px",
          cursor: "pointer",
          boxShadow:
            "0 4px 12px rgba(37,99,235,0.3)",
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}

export default ProductFilters;