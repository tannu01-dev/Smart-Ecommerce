
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(savedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, cartQuantity: item.cartQuantity + 1 }
        : item
    );

    updateCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item._id === id
          ? { ...item, cartQuantity: item.cartQuantity - 1 }
          : item
      )
      .filter((item) => item.cartQuantity > 0);

    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item._id !== id
    );

    updateCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.cartQuantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h1>Your Cart is Empty</h1>
        <p>Add some products to your cart.</p>

        <button onClick={() => navigate("/products")}>
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-header">
        <p>YOUR CART</p>
        <h1>Shopping Cart</h1>
      </div>

      <div className="cart-container">

        <div className="cart-items">

          {cart.map((item) => (

            <div
              className="cart-item"
              key={item._id}
            >

              <div className="cart-image">

                {item.images?.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                  />
                ) : (
                  <span>No Image</span>
                )}

              </div>

              <div className="cart-info">

                <h3>{item.name}</h3>

                <p>
                  {item.seller?.name || "Seller"}
                </p>

                <strong>
                  ₹{item.price}
                </strong>

                <div className="cart-quantity">

                  <button
                    onClick={() =>
                      decreaseQuantity(item._id)
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.cartQuantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(item._id)
                    }
                  >
                    +
                  </button>

                </div>

                <button
                  className="remove-cart"
                  onClick={() =>
                    removeItem(item._id)
                  }
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div>
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="cart-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <button
            className="checkout-btn"
            onClick={() =>
              navigate("/checkout", {
                state: {
                  cart
                }
              })
            }
          >
            Proceed to Checkout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Cart;
