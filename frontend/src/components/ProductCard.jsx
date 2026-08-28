
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const addToCart = () => {
    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingProduct = cart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      existingProduct.cartQuantity += 1;
    } else {
      cart.push({
        ...product,
        cartQuantity: 1
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        product
      }
    });
  };

  return (
    <div className="product-card">

      <div className="product-image">
        {product.images?.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
          />
        ) : (
          <span>No Image</span>
        )}
      </div>

      <div className="product-info">

        <p className="product-seller">
          {product.seller?.name || "Seller"}
        </p>

        <h3>{product.name}</h3>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-bottom">

          <strong>₹{product.price}</strong>

          <div className="product-actions">

            <button
              className="cart-btn"
              onClick={addToCart}
            >
              Add to Cart
            </button>

            <button
              className="buy-btn"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;

