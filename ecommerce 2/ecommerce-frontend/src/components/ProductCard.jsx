import api from "../services/api";

function ProductCard({
  product,
  setSelectedProductId,
}) {
  const addToCart = async (e) => {
    e.stopPropagation();

    try {
      const payload = {
        productId: product.id,
        quantity: 1,
      };

      await api.post(
        "/cart/add",
        payload
      );

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

  return (
    <div
      onClick={() =>
        setSelectedProductId(
          product.id
        )
      }
      style={{
        backgroundColor: "white",
        borderRadius: "16px",

        padding: "20px",

        width: "255px",

        cursor: "pointer",

        border:
          "1px solid #BFDBFE",

        boxShadow:
          "0 4px 20px rgba(59,130,246,0.15)",

        textAlign: "center",

        transition:
          "all 0.3s ease",
      }}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/300x180?text=No+Image";
        }}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "10px",
          marginBottom: "15px",
        }}
      />

      <h2
        style={{
          color: "#1E40AF",
          marginBottom: "10px",
          fontSize: "28px",
        }}
      >
        {product.name}
      </h2>

      <p
        style={{
          color: "#64748B",
          minHeight: "45px",
        }}
      >
        {product.description}
      </p>

      <p
        style={{
          color: "#2563EB",
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        ₹{" "}
        {Number(
          product.price
        ).toLocaleString("en-IN")}
      </p>

      <p
        style={{
          color:
            product.quantity > 0
              ? "#16A34A"
              : "#DC2626",

          fontWeight: "600",

          marginBottom: "12px",
        }}
      >
        {product.quantity > 0
          ? `${product.quantity} in stock`
          : "Out of Stock"}
      </p>

      <div
            onClick={() =>
              setSelectedProductId(
                product.id
              )
            }
        style={{
          color: "#64748B",
          fontSize: "14px",
          marginBottom: "15px",
        }}
      >
        Click card to view details
      </div>

      <button
        onClick={addToCart}
        disabled={
          product.quantity === 0
        }
        style={{
          backgroundColor:
            product.quantity === 0
              ? "#9CA3AF"
              : "#3B82F6",

          color: "white",

          border: "none",

          padding: "10px 20px",

          borderRadius: "8px",

          cursor:
            product.quantity === 0
              ? "not-allowed"
              : "pointer",

          fontWeight: "bold",

          width: "100%",
        }}
      >
        {product.quantity === 0
          ? "Out Of Stock"
          : "Add To Cart"}
      </button>
    </div>
  );
}

export default ProductCard;