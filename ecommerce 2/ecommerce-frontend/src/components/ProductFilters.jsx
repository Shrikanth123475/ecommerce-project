import { useEffect, useState } from "react";
import api from "../services/api";

function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
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

  return (
    <div
      style={{
        width: "280px",
        minWidth: "280px",
        backgroundColor: "#FFFFFF",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        height: "fit-content",
        position: "sticky",
        top: "100px",
      }}
    >
      {/* Header */}
      <h2
        style={{
          color: "#1E40AF",
          fontSize: "28px",
          marginBottom: "20px",
          borderBottom: "2px solid #DBEAFE",
          paddingBottom: "12px",
        }}
      >
        🔍 Filters
      </h2>

      {/* Categories */}
      <div>
        <h3
          style={{
            color: "#1E3A8A",
            fontSize: "20px",
            marginBottom: "15px",
          }}
        >
          Categories
        </h3>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
            cursor: "pointer",
            color: "#475569",
          }}
        >
          <input
            type="radio"
            name="category"
            checked={selectedCategory === ""}
            onChange={() =>
              setSelectedCategory("")
            }
          />

          <span
            style={{
              marginLeft: "10px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            All Categories
          </span>
        </label>

        {categories.map((category) => (
          <label
            key={category}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
              cursor: "pointer",
              color: "#475569",
            }}
          >
            <input
              type="radio"
              name="category"
              checked={
                selectedCategory === category
              }
              onChange={() =>
                setSelectedCategory(category)
              }
            />

            <span
              style={{
                marginLeft: "10px",
                fontSize: "16px",
              }}
            >
              {category}
            </span>
          </label>
        ))}
      </div>

      <div
        style={{
          height: "1px",
          backgroundColor: "#E2E8F0",
          margin: "20px 0",
        }}
      />

      {/* Brands */}
      <div>
        <h3
          style={{
            color: "#1E3A8A",
            fontSize: "20px",
            marginBottom: "15px",
          }}
        >
          Brands
        </h3>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
            cursor: "pointer",
            color: "#475569",
          }}
        >
          <input
            type="radio"
            name="brand"
            checked={selectedBrand === ""}
            onChange={() =>
              setSelectedBrand("")
            }
          />

          <span
            style={{
              marginLeft: "10px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            All Brands
          </span>
        </label>

        {brands.map((brand) => (
          <label
            key={brand}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
              cursor: "pointer",
              color: "#475569",
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
            />

            <span
              style={{
                marginLeft: "10px",
                fontSize: "16px",
              }}
            >
              {brand}
            </span>
          </label>
        ))}
      </div>

      <div
        style={{
          height: "1px",
          backgroundColor: "#E2E8F0",
          margin: "20px 0",
        }}
      />

      {/* Price Range */}
      <div>
        <h3
          style={{
            color: "#1E3A8A",
            fontSize: "20px",
            marginBottom: "15px",
          }}
        >
          Price Range
        </h3>

        <input
          type="range"
          min="0"
          max="100000"
          defaultValue="100000"
          style={{
            width: "100%",
            cursor: "pointer",
          }}
        />

        <div
          style={{
            marginTop: "12px",
            color: "#2563EB",
            fontWeight: "bold",
          }}
        >
          ₹0 - ₹100000
        </div>
      </div>

      <div
        style={{
          marginTop: "25px",
        }}
      >
        <button
          onClick={() => {
            setSelectedCategory("");
            setSelectedBrand("");
          }}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default ProductFilters;