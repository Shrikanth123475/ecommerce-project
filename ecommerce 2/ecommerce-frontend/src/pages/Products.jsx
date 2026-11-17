// <<<<< HEAD
//    import { useEffect, useState } from "react";
//    import api from "../services/api";
//    import ProductCard from "../components/ProductCard";
//    import ProductFilters from "../components/ProductFilters";
//
//    function Products({ searchTerm, filter }) {
//      const [products, setProducts] = useState([]);
//
//      const [selectedCategory, setSelectedCategory] =
//        useState("");
//
//      const [selectedBrand, setSelectedBrand] =
//        useState("");
//
//      useEffect(() => {
//        api
//          .get("/products")
//          .then((res) => {
//            setProducts(res.data);
//          })
//          .catch((err) => console.error(err));
//      }, []);
//
//    <<<<<<< HEAD
//      const filteredProducts = products.filter((product) => {
//        const matchesSearch = product.name
//          .toLowerCase()
//          .includes(searchTerm.toLowerCase());
//
//        const matchesFilter =
//          filter === "all"
//            ? true
//            : filter === "available"
//            ? product.quantity > 0
//            : product.quantity === 0;
//
//        return matchesSearch && matchesFilter;
//      });
//    =======
//      const filteredProducts = products.filter(
//        (product) => {
//          const categoryMatch =
//            !selectedCategory ||
//            product.category === selectedCategory;
//
//          const brandMatch =
//            !selectedBrand ||
//            product.brand === selectedBrand;
//
//          return categoryMatch && brandMatch;
//        }
//      );
//    >>>>>>> origin/shrikanth-branch
//
//      return (
//        <div>
//          <h1
//            style={{
//              textAlign: "center",
//              color: "#1E40AF",
//              fontSize: "48px",
//              fontWeight: "bold",
//              marginTop: "30px",
//              marginBottom: "30px",
//              textShadow:
//                "0 2px 6px rgba(0,0,0,0.1)",
//            }}
//          >
//            Products
//          </h1>
//
//          <div
//            style={{
//              display: "flex",
//              gap: "20px",
//              padding: "20px",
//              alignItems: "flex-start",
//            }}
//          >
//    <<     {filteredProducts.length === 0 ? (
//           <h2
//             style={{
//               color: "#64748B",
//               marginTop: "40px",
//             }}
//           >
//             No products found
//           </h2>
//         ) : (
//           filteredProducts.map((product) => (
//             <ProductCard
//               key={product.id}
//               product={product}
//             />
//           ))
//         )}
// =======
//         <ProductFilters
//           selectedCategory={selectedCategory}
//           setSelectedCategory={
//             setSelectedCategory
//           }
//           selectedBrand={selectedBrand}
//           setSelectedBrand={setSelectedBrand}
//         />
//
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             flexWrap: "wrap",
//             justifyContent: "center",
//           }}
//         >
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map(
//               (product, index) => (
//                 <ProductCard
//                   key={index}
//                   product={product}
//                 />
//               )
//             )
//           ) : (
//             <h2
//               style={{
//                 color: "#64748B",
//                 marginTop: "50px",
//               }}
//             >
//               No products found
//             </h2>
//           )}
//         </div>
// >>>>>>> origin/shrikanth-branch
//       </div>
//     </div>
//   );
// }
//
// export default Products;

import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";

function Products({ searchTerm = "", filter = "all" }) {
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

      const matchesSearch = product.name
        .toLowerCase()
        .includes(
          (searchTerm || "").toLowerCase()
        );

      const matchesStock =
        filter === "all"
          ? true
          : filter === "available"
          ? product.quantity > 0
          : product.quantity === 0;

      const categoryMatch =
        !selectedCategory ||
        product.category === selectedCategory;

      const brandMatch =
        !selectedBrand ||
        product.brand === selectedBrand;

      return (
        matchesSearch &&
        matchesStock &&
        categoryMatch &&
        brandMatch
      );
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
    </div>
  );
}

export default Products;