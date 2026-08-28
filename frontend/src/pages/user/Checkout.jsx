
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Product nahi mila
  if (!product) {
    return (
      <div className="empty">
        Product not found.
      </div>
    );
  }

  const totalAmount = product.price * quantity;


  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const token = localStorage.getItem("token");

      // Token check
      if (!token) {
        setError("Please login before placing an order.");
        setLoading(false);
        return;
      }


      // =========================
      // ORDER DATA
      // =========================

      const orderData = {
        items: [
          {
            product: product._id,
            seller: product.seller?._id,
            name: product.name,
            price: product.price,
            quantity: quantity
          }
        ],

        totalAmount: totalAmount,

        shippingAddress: form,

        paymentMethod: paymentMethod
      };


      // =================================================
      // COD
      // =================================================

      if (paymentMethod === "COD") {

        const response = await API.post(
          "/orders",
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {

          alert("Order placed successfully!");

          navigate("/products");
        }

        return;
      }


      // =================================================
      // ONLINE PAYMENT
      // =================================================

      // Step 1:
      // Create order in our database

      

      // Step 2:
      // Create Razorpay order

      const razorpayResponse = await API.post(
        "/payment/create-order",
        {
          amount: totalAmount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (!razorpayResponse.data.success) {
        throw new Error(
          "Unable to create Razorpay order"
        );
      }


      const razorpayOrder =
        razorpayResponse.data.order;


      // Step 3:
      // Razorpay checkout options

      const options = {

        key:
          import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount:
          razorpayOrder.amount,

        currency: "INR",

        name: "SmartCommerce",

        description:
          product.name,

        order_id:
          razorpayOrder.id,


        // =========================
        // PAYMENT SUCCESS
        // =========================

        handler: async function (response) {

          try {

            const verifyResponse =
              await API.post(
                "/payment/verify",
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,

                  items: orderData.items,

        totalAmount: totalAmount,

        shippingAddress: form

                },
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`
                  }
                }
              );


            if (
              verifyResponse.data.success
            ) {

              alert(
                "Payment successful! Order confirmed."
              );

              navigate("/products");

            } else {

              setError(
                "Payment verification failed"
              );

            }

          } catch (error) {

            console.log(
              "Payment verification error:",
              error
            );

            setError(
              error.response?.data?.message ||
              "Payment verification failed"
            );
          }
        },


        // =========================
        // PREFILL USER DETAILS
        // =========================

        prefill: {

          name: form.name,

          contact: form.phone
        },


        // =========================
        // THEME
        // =========================

        theme: {

          color: "#111827"
        }
      };


      // Step 4:
      // Open Razorpay

      if (!window.Razorpay) {

        setError(
          "Razorpay failed to load. Please refresh the page."
        );

        return;
      }


      const razorpay =
        new window.Razorpay(options);


      // Payment failed
      razorpay.on(
        "payment.failed",
        function (response) {

          console.log(
            "Payment failed:",
            response
          );

          setError(
            response.error?.description ||
            "Payment failed"
          );
        }
      );


      razorpay.open();

    } catch (error) {

      console.log(
        "ORDER/PAYMENT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to place order"
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================
  // UI
  // =========================

  return (
    <div className="checkout-page">

      {/* HEADER */}

      <div className="checkout-header">

        <p>CHECKOUT</p>

        <h1>
          Complete Your Order
        </h1>

      </div>


      {/* ERROR */}

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}


      <div className="checkout-container">


        {/* =================================
            PRODUCT SUMMARY
        ================================= */}

        <div className="checkout-product">

          <h2>
            Order Summary
          </h2>


          <div className="checkout-product-card">


            <div className="checkout-image">

              {product.images?.length > 0 ? (

                <img
                  src={product.images[0]}
                  alt={product.name}
                />

              ) : (

                <span>
                  No Image
                </span>

              )}

            </div>


            <div>

              <h3>
                {product.name}
              </h3>


              <p>
                Seller:{" "}
                {product.seller?.name ||
                  "Seller"}
              </p>


              <strong>
                ₹{product.price}
              </strong>

            </div>

          </div>


          {/* QUANTITY */}

          <div className="quantity-box">

            <label>
              Quantity
            </label>


            <button
              type="button"
              onClick={() =>
                setQuantity(
                  Math.max(
                    1,
                    quantity - 1
                  )
                )
              }
            >
              −
            </button>


            <span>
              {quantity}
            </span>


            <button
              type="button"
              onClick={() =>
                setQuantity(
                  quantity + 1
                )
              }
            >
              +
            </button>

          </div>


          {/* TOTAL */}

          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              ₹{totalAmount}
            </strong>

          </div>

        </div>


        {/* =================================
            SHIPPING FORM
        ================================= */}

        <form
          className="checkout-form"
          onSubmit={handlePlaceOrder}
        >

          <h2>
            Shipping Address
          </h2>


          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />


          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />


          <textarea
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            required
          />


          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />


          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            required
          />


          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            required
          />


          {/* PAYMENT */}

          <h2>
            Payment Method
          </h2>


          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
          >

            <option value="COD">
              Cash on Delivery
            </option>

            <option value="ONLINE">
              Online Payment
            </option>

          </select>


          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="place-order-btn"
          >

            {loading
              ? "Processing..."
              : paymentMethod === "ONLINE"
                ? `Pay Now • ₹${totalAmount}`
                : `Place Order • ₹${totalAmount}`}

          </button>

        </form>

      </div>

    </div>
  );
}

export default Checkout;

