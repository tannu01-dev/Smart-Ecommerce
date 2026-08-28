
import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/orders1.css";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get(
        "/orders/seller-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }

    } catch (error) {
      console.log("SELLER ORDERS ERROR:", error);

      if (error.response) {
        console.log("SERVER ERROR:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      const token = localStorage.getItem("token");

      const response = await API.put(
        `/orders/seller-orders/${orderId}`,
        {
          status: status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {

        // Update UI immediately
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  orderStatus: status
                }
              : order
          )
        );

        alert("Order status updated successfully");
      }

    } catch (error) {
      console.log("STATUS UPDATE ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Failed to update order"
      );

    } finally {
      setUpdatingId(null);
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="seller-orders-page">
        <h2>Loading orders...</h2>
      </div>
    );
  }


  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="seller-orders-page">

      {/* HEADER */}

      <div className="seller-orders-header">

        <p>SELLER PANEL</p>

        <h1>Orders</h1>

        <span>
          Manage customer orders and update delivery status.
        </span>

      </div>


      {/* NO ORDERS */}

      {orders.length === 0 ? (

        <div className="seller-no-orders">

          <h2>No Orders Yet</h2>

          <p>
            Orders from customers will appear here.
          </p>

        </div>

      ) : (

        <div className="seller-orders-list">

          {orders.map((order) => {

            const status =
              order.orderStatus || "pending";

            const isUpdating =
              updatingId === order._id;


            return (

              <div
                className="seller-order-card"
                key={order._id}
              >

                {/* ==================================
                    ORDER HEADER
                ================================== */}

                <div className="seller-order-top">

                  <div>

                    <span>ORDER ID</span>

                    <strong>
                      #{order._id.slice(-8)}
                    </strong>

                  </div>


                  <div>

                    <span>STATUS</span>

                    <strong
                      className={`seller-order-status ${status}`}
                    >
                      {status.replaceAll("_", " ")}
                    </strong>

                  </div>

                </div>


                {/* ==================================
                    CUSTOMER
                ================================== */}

                <div className="customer-info">

                  <h3>Customer</h3>

                  <p>
                    <strong>
                      {order.user?.name || "Unknown Customer"}
                    </strong>
                  </p>

                  <p>
                    {order.user?.email || ""}
                  </p>

                </div>


                {/* ==================================
                    ITEMS
                ================================== */}

                <div className="seller-order-items">

                  <h3>Products</h3>

                  {order.items?.map((item, index) => (

                    <div
                      className="seller-order-item"
                      key={index}
                    >

                      <div>

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          Quantity: {item.quantity}
                        </p>

                        <p>
                          Price: ₹{item.price}
                        </p>

                      </div>

                      <strong>
                        ₹{item.price * item.quantity}
                      </strong>

                    </div>

                  ))}

                </div>


                {/* ==================================
                    SHIPPING ADDRESS
                ================================== */}

                <div className="shipping-info">

                  <h3>
                    Shipping Address
                  </h3>

                  <p>
                    <strong>
                      {order.shippingAddress?.name}
                    </strong>
                  </p>

                  <p>
                    {order.shippingAddress?.phone}
                  </p>

                  <p>
                    {order.shippingAddress?.address}
                    {", "}
                    {order.shippingAddress?.city}
                    {", "}
                    {order.shippingAddress?.state}
                    {" - "}
                    {order.shippingAddress?.pincode}
                  </p>

                </div>


                {/* ==================================
                    PAYMENT + TOTAL
                ================================== */}

                <div className="seller-order-bottom">

                  <div>

                    <span>PAYMENT</span>

                    <strong>
                      {order.paymentMethod || "COD"}
                    </strong>

                    <small>
                      Status:{" "}
                      {order.paymentStatus || "pending"}
                    </small>

                  </div>


                  <div>

                    <span>TOTAL</span>

                    <strong>
                      ₹{order.totalAmount}
                    </strong>

                  </div>

                </div>


                {/* ==================================
                    ACTIONS
                ================================== */}

                <div className="order-actions">

                  {/* PENDING */}

                  {status === "pending" && (

                    <>
                      <button
                        className="accept-btn"
                        disabled={isUpdating}
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "confirmed"
                          )
                        }
                      >
                        {isUpdating
                          ? "Updating..."
                          : "Accept Order"}
                      </button>


                      <button
                        className="reject-btn"
                        disabled={isUpdating}
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "cancelled"
                          )
                        }
                      >
                        Cancel Order
                      </button>
                    </>

                  )}


                  {/* CONFIRMED */}

                  {status === "confirmed" && (

                    <button
                      className="status-btn"
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus(
                          order._id,
                          "processing"
                        )
                      }
                    >
                      {isUpdating
                        ? "Updating..."
                        : "Start Processing"}
                    </button>

                  )}


                  {/* PROCESSING */}

                  {status === "processing" && (

                    <button
                      className="status-btn"
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus(
                          order._id,
                          "shipped"
                        )
                      }
                    >
                      {isUpdating
                        ? "Updating..."
                        : "Mark as Shipped"}
                    </button>

                  )}


                  {/* SHIPPED */}

                  {status === "shipped" && (

                    <button
                      className="status-btn"
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus(
                          order._id,
                          "out_for_delivery"
                        )
                      }
                    >
                      {isUpdating
                        ? "Updating..."
                        : "Out for Delivery"}
                    </button>

                  )}


                  {/* OUT FOR DELIVERY */}

                  {status === "out_for_delivery" && (

                    <button
                      className="status-btn"
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus(
                          order._id,
                          "delivered"
                        )
                      }
                    >
                      {isUpdating
                        ? "Updating..."
                        : "Mark as Delivered"}
                    </button>

                  )}


                  {/* DELIVERED */}

                  {status === "delivered" && (

                    <span className="order-completed">
                      ✓ Order Delivered
                    </span>

                  )}


                  {/* CANCELLED */}

                  {status === "cancelled" && (

                    <span className="order-cancelled">
                      ✕ Order Cancelled
                    </span>

                  )}


                  {/* RETURNED */}

                  {status === "returned" && (

                    <span className="order-returned">
                      ↩ Order Returned
                    </span>

                  )}

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
}

export default SellerOrders;

