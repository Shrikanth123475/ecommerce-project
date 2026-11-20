import { useEffect, useState } from "react";
import api from "../services/api";

function ProductDetails({
  productId,
  setSelectedProductId,
}) {
  const [product, setProduct] =
    useState(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const response =
        await api.get(
          `/products/${productId}`
        );

      setProduct(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async () => {
    try {
      await api.post("/cart/add", {
        productId: product.id,
        quantity: 1,
      });

      alert(
        "Product added to cart"
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data
          ?.message ||
          "Failed to add product"
      );
    }
  };

  if (!product) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        Loading Product...
      </h2>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <button
        onClick={() =>
          setSelectedProductId(null)
        }
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          backgroundColor:
            "#2563EB",
          color: "white",
          cursor: "pointer",
          marginBottom: "25px",
        }}
      >
        ← Back To Products
      </button>

      <div
        style={{
          display: "flex",
          gap: "40px",

          backgroundColor:
            "#FFFFFF",

          padding: "35px",

          borderRadius: "20px",

          boxShadow:
            "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        {/* Product Image */}

        <div
          style={{
            flex: 1,
          }}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/500x350?text=No+Image";
            }}
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "15px",
            }}
          />
        </div>

        {/* Product Info */}

        <div
          style={{
            flex: 1.2,
          }}
        >
          <h1
            style={{
              color: "#1E3A8A",
              marginBottom: "20px",
            }}
          >
            {product.name}
          </h1>

          <h2
            style={{
              color: "#2563EB",
              marginBottom: "20px",
            }}
          >
            ₹
            {Number(
              product.price
            ).toLocaleString(
              "en-IN"
            )}
          </h2>

          <p>
            <strong>
              Brand:
            </strong>{" "}
            {product.brand}
          </p>

          <p>
            <strong>
              Category:
            </strong>{" "}
            {product.category}
          </p>

          <p>
            <strong>
              Seller:
            </strong>{" "}
            {product.seller}
          </p>

          <p>
            <strong>
              Distributor:
            </strong>{" "}
            {product.distributor}
          </p>

          <p>
            <strong>
              Warranty:
            </strong>{" "}
            {product.warranty}
          </p>

          <p
            style={{
              color:
                product.quantity > 0
                  ? "#16A34A"
                  : "#DC2626",

              fontWeight: "bold",
            }}
          >
            Stock Available:
            {" "}
            {product.quantity}
          </p>

          <hr
            style={{
              margin: "20px 0",
            }}
          />

          <h3>Description</h3>

          <p>
            {product.description}
          </p>

          <h3>
            Specifications
          </h3>

          <p>
            {
              product.specifications
            }
          </p>

          <button
            onClick={addToCart}
            disabled={
              product.quantity === 0
            }
            style={{
              marginTop: "25px",

              padding:
                "14px 30px",

              border: "none",

              borderRadius:
                "10px",

              backgroundColor:
                product.quantity ===
                0
                  ? "#9CA3AF"
                  : "#2563EB",

              color: "white",

              fontWeight: "bold",

              fontSize: "16px",

              cursor:
                product.quantity ===
                0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {product.quantity === 0
              ? "Out Of Stock"
              : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;