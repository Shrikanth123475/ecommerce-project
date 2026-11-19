import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";

function Products({
  searchTerm = "",
  filter = "all",
}) {
  const [products, setProducts] =
    useState([]);

  const [sortBy, setSortBy] =
    useState("featured");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const [
    selectedBrand,
    setSelectedBrand,
  ] = useState("");

  const [maxPrice, setMaxPrice] =
    useState(1000000);

  useEffect(() => {
    loadProducts();
  }, [
    selectedCategory,
    selectedBrand,
    maxPrice,
    sortBy,
    searchTerm,
  ]);

  const loadProducts = async () => {
    try {
      const response = await api.get(
        "/products/filter",
        {
          params: {
            category:
              selectedCategory ||
              undefined,

            brand:
              selectedBrand ||
              undefined,

            maxPrice,

            sort: sortBy,

            search:
              searchTerm ||
              undefined,
          },
        }
      );

      let data = response.data;

      // Only stock filter remains in frontend
      if (filter === "available") {
        data = data.filter(
          (product) =>
            product.quantity > 0
        );
      }

      if (filter === "outofstock") {
        data = data.filter(
          (product) =>
            product.quantity === 0
        );
      }

      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };
return (
  <div>
    <h1
      style={{
        textAlign: "center",
        color: "#1E40AF",
        fontSize: "48px",
        fontWeight: "bold",
        marginTop: "30px",
        marginBottom: "40px",
        textShadow:
          "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      Products
    </h1>

    <div
      style={{
        display: "flex",
        gap: "24px",
        padding: "20px",
        alignItems: "flex-start",
      }}
    >
      <ProductFilters
        selectedCategory={
          selectedCategory
        }
        setSelectedCategory={
          setSelectedCategory
        }
        selectedBrand={
          selectedBrand
        }
        setSelectedBrand={
          setSelectedBrand
        }
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
        {/* Product Section Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            position: "sticky",
            top: "95px",

            zIndex: 500,

            marginBottom: "24px",

            background: "#FFFFFF",

            padding: "20px 25px",

            borderRadius: "14px",

            boxShadow:
              "0 6px 20px rgba(0,0,0,0.06)",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#1E3A8A",
                fontSize: "32px",
                fontWeight: "700",
              }}
            >
              All Products
            </h2>

            <p
              style={{
                margin: "6px 0 0 0",
                color: "#64748B",
                fontSize: "15px",
              }}
            >
              {products.length} results found
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                color: "#1E293B",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Sort By:
            </span>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              style={{
                padding: "12px 16px",
                minWidth: "220px",
                borderRadius: "12px",

                border:
                  "1px solid #BFDBFE",

                background:
                  "linear-gradient(to bottom, #ffffff, #f8fbff)",

                color: "#1E293B",

                fontWeight: "500",

                fontSize: "15px",

                cursor: "pointer",

                boxShadow:
                  "0 4px 12px rgba(37,99,235,0.08)",

                outline: "none",
              }}
            >
              <option value="featured">
                Featured
              </option>

              <option value="priceLow">
                Price: Low to High
              </option>

              <option value="priceHigh">
                Price: High to Low
              </option>

              <option value="newest">
                Newest Arrivals
              </option>

              <option value="stock">
                Availability / Stock
              </option>
            </select>
          </div>
        </div>
        {/* Product Grid */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fill, minmax(260px, 1fr))",

          gap: "24px",

          width: "100%",

          paddingBottom: "30px",
        }}
      >
        {products.length === 0 ? (
          <h2
            style={{
              color: "#64748B",
              marginTop: "40px",
            }}
          >
            No products found
          </h2>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        )}
      </div>
      </div>
    </div>
  </div>
);
}
export default Products;