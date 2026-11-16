import api from "../services/api";

function ProductCard({ product }) {

  const addToCart = async () => {
    try {
      console.log(product);

      const payload = {
        productId: product.id,
        quantity: 1,
      };

      console.log("Payload:", payload);

      await api.post("/cart/add", payload);

      alert("Product added to cart");
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "20px",
        margin: "15px",
        width: "280px",
        boxShadow: "0 4px 20px rgba(59,130,246,0.15)",
        border: "1px solid #BFDBFE",
        textAlign: "center",
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
        }}
      >
        {product.name}
      </h2>

      <p>{product.description}</p>

      <p
        style={{
          color: "#2563EB",
          fontWeight: "bold",
          fontSize: "22px",
        }}
      >
        ₹ {product.price}
      </p>

      <p>
        Quantity: {product.quantity ?? 0}
      </p>

      <button
        onClick={addToCart}
        style={{
          backgroundColor: "#3B82F6",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "10px",
          fontWeight: "bold",
        }}
      >
        Add To Cart
      </button>
    </div>
  );
}

export default ProductCard;