import { useEffect, useState } from "react";
import API from "../../services/api";
import ProductCard from "../../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/user/products");
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="products-page">

      <div className="products-header">
        <p>DISCOVER</p>

        <h1>Explore Products</h1>

        <span>
          Discover products from our trusted sellers.
        </span>
      </div>

      {loading ? (
        <div className="loading">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="empty">
          No products available.
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Products;