import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/userOrder.css"

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        return;
      }

      const response = await API.get(
        "/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("MY ORDERS RESPONSE:", response.data);

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setError(
          response.data.message || "Failed to load orders"
        );
      }

    } catch (error) {
      console.log("MY ORDERS ERROR:", error);

      console.log(
        "SERVER ERROR:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        "Failed to load orders"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div>
        <h2>Loading orders...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>My Orders</h2>
        <p>{error}</p>

        <button onClick={fetchOrders}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>

      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div>
          <h2>No Orders Yet</h2>
          <p>Your orders will appear here.</p>
        </div>
      ) : (

        <div>

          {orders.map((order) => (

            <div
              key={order._id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px"
              }}
            >

              <h3>
                Order #{order._id.slice(-8)}
              </h3>

              <p>
                <strong>Status:</strong>{" "}
                {order.orderStatus}
              </p>

              <p>
                <strong>Payment:</strong>{" "}
                {order.paymentMethod}
              </p>

              <p>
                <strong>Payment Status:</strong>{" "}
                {order.paymentStatus}
              </p>

              <p>
                <strong>Total:</strong>{" "}
                ₹{order.totalAmount}
              </p>

              <h4>Products</h4>

              {order.items?.map((item, index) => (

                <div key={index}>

                  <p>
                    <strong>
                      {item.name}
                    </strong>
                  </p>

                  <p>
                    Quantity: {item.quantity}
                  </p>

                  <p>
                    Price: ₹{item.price}
                  </p>

                  <p>
                    Seller:{" "}
                    {item.seller?.name ||
                      "Seller"}
                  </p>

                </div>

              ))}

              <h4>Shipping Address</h4>

              <p>
                {order.shippingAddress?.name}
              </p>

              <p>
                {order.shippingAddress?.phone}
              </p>

              <p>
                {order.shippingAddress?.address},{" "}
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.pincode}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyOrders;