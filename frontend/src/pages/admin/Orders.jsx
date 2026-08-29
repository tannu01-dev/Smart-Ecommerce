import { useEffect, useState } from "react";
import "../../styles/adminOrders.css";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modal, setModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin.");
        return;
      }

      const response = await fetch(
        "https://smart-ecommerce-site.onrender.com/api/admin/orders",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const data = await response.json();

      console.log("ADMIN ORDERS:", data);


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load orders"
        );

      }


      if (data.success) {

        setOrders(
          data.orders || []
        );

      } else {

        setError(
          data.message ||
          "Failed to load orders"
        );

      }


    } catch (error) {

      console.error(
        "ADMIN ORDERS ERROR:",
        error
      );

      setError(
        error.message ||
        "Failed to load orders"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchOrders();

  }, []);

  const filteredOrders = orders.filter(
    (order) => {

      const orderId =
        order._id || "";


      const customerName =
        order.user?.name || "";


      const customerEmail =
        order.user?.email || "";


      // Product name comes from item.product.name
      const productName =
        order.items
          ?.map(
            (item) =>
              item.product?.name || ""
          )
          .join(" ") || "";


      const status =
        order.orderStatus ||
        "pending";


      const searchText =
        search.toLowerCase().trim();


      const matchesSearch =

        orderId
          .toLowerCase()
          .includes(searchText)

        ||

        customerName
          .toLowerCase()
          .includes(searchText)

        ||

        customerEmail
          .toLowerCase()
          .includes(searchText)

        ||

        productName
          .toLowerCase()
          .includes(searchText);


      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;


      return (
        matchesSearch &&
        matchesStatus
      );

    }
  );

  const totalOrders =
    orders.length;


  const pendingOrders =
    orders.filter(
      (order) =>
        order.orderStatus === "pending"
    ).length;


  const processingOrders =
    orders.filter(
      (order) =>
        order.orderStatus === "processing"
    ).length;


  const deliveredOrders =
    orders.filter(
      (order) =>
        order.orderStatus === "delivered"
    ).length;

  if (loading) {

    return (

      <div className="admin-orders-page">

        <div className="admin-card">

          <h2>
            Loading orders...
          </h2>

        </div>

      </div>

    );

  }


  // =====================================
  // ERROR
  // =====================================

  if (error) {

    return (

      <div className="admin-orders-page">

        <div className="admin-card">

          <h2>
            Failed to load orders
          </h2>

          <p>
            {error}
          </p>


          <button
            onClick={fetchOrders}
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  return (

    <div className="admin-orders-page">

      <div className="admin-page-title">

        <div>

          <p>
            ADMIN PANEL
          </p>

          <h1>
            Orders Management
          </h1>

          <span>
            Monitor all platform orders.
          </span>

        </div>


        <button
          onClick={fetchOrders}
        >
          Refresh
        </button>

      </div>

      <div className="admin-stats">


        <div className="admin-stat">

          <span>
            Total Orders
          </span>

          <h2>
            {totalOrders}
          </h2>

          <p>
            All platform orders
          </p>

        </div>


        <div className="admin-stat">

          <span>
            Pending
          </span>

          <h2>
            {pendingOrders}
          </h2>

          <p>
            Waiting for processing
          </p>

        </div>


        <div className="admin-stat">

          <span>
            Processing
          </span>

          <h2>
            {processingOrders}
          </h2>

          <p>
            Currently processing
          </p>

        </div>


        <div className="admin-stat">

          <span>
            Delivered
          </span>

          <h2>
            {deliveredOrders}
          </h2>

          <p>
            Successfully delivered
          </p>

        </div>


      </div>

      <div className="orders-toolbar">


        <input
          type="text"
          placeholder="🔍 Search order, customer or product..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >

          <option value="all">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="processing">
            Processing
          </option>

          <option value="shipped">
            Shipped
          </option>

          <option value="out_for_delivery">
            Out For Delivery
          </option>

          <option value="delivered">
            Delivered
          </option>

          <option value="cancelled">
            Cancelled
          </option>

          <option value="returned">
            Returned
          </option>

        </select>


      </div>

      <div className="orders-table">


        <div className="orders-table-header">

          <span>
            Order ID
          </span>

          <span>
            Customer
          </span>

          <span>
            Products
          </span>

          <span>
            Amount
          </span>

          <span>
            Payment
          </span>

          <span>
            Status
          </span>

          <span>
            Action
          </span>

        </div>


        {filteredOrders.map(
          (order) => {

            const status =
              order.orderStatus ||
              "pending";


            return (

              <div
                className="orders-table-row"
                key={order._id}
              >


                {/* ORDER ID */}

                <strong>

                  #
                  {order._id
                    ?.slice(-8)
                    .toUpperCase()}

                </strong>


                {/* CUSTOMER */}

                <div>

                  <strong>

                    {order.user?.name ||
                      "Unknown"}

                  </strong>


                  <small>

                    {order.user?.email ||
                      ""}

                  </small>

                </div>


                {/* PRODUCTS */}

                <div className="admin-order-products">

                  {order.items?.map(
                    (item, index) => (

                      <div
                        key={index}
                      >

                        <strong>

                          {item.product?.name ||
                            item.name ||
                            "Product"}

                        </strong>


                        <small>

                          Qty:
                          {" "}
                          {item.quantity}

                        </small>

                      </div>

                    )
                  )}

                </div>


                {/* AMOUNT */}

                <strong>

                  ₹
                  {order.totalAmount ||
                    0}

                </strong>


                {/* PAYMENT */}

                <span>

                  {order.paymentMethod ||
                    "N/A"}

                  {order.paymentStatus && (

                    <small
                      style={{
                        display: "block",
                        marginTop: "4px"
                      }}
                    >
                      {order.paymentStatus}
                    </small>

                  )}

                </span>


                {/* STATUS */}

                <span
                  className={`order-status ${status}`}
                >

                  {status.replaceAll(
                    "_",
                    " "
                  )}

                </span>


                {/* VIEW */}

                <button
                  className="view-btn"
                  onClick={() => {

                    setSelectedOrder(order);
                    setModal(true);

                  }}
                >
                  View
                </button>


              </div>

            );

          }
        )}


        {filteredOrders.length === 0 && (

          <div className="no-orders">

            No orders found.

          </div>

        )}


      </div>

      {modal &&
        selectedOrder && (

          <div className="modal-overlay">

            <div className="modal order-modal">


              {/* CLOSE */}

              <button
                className="modal-close"
                onClick={() => {

                  setModal(false);
                  setSelectedOrder(null);

                }}
              >
                ×
              </button>


              <h2>

                Order #

                {selectedOrder._id
                  ?.slice(-8)
                  .toUpperCase()}

              </h2>

              <div className="order-section">

                <h3>
                  Customer
                </h3>


                <p>

                  <strong>
                    {selectedOrder.user?.name ||
                      "Unknown"}
                  </strong>

                </p>


                <p>

                  {selectedOrder.user?.email ||
                    "No email"}

                </p>

              </div>

              <div className="order-section">

                <h3>
                  Products
                </h3>


                {selectedOrder.items?.map(
                  (item, index) => (

                    <div
                      className="order-product"
                      key={index}
                    >


                      <div className="order-product-icon">

                        🛍️

                      </div>


                      <div>

                        <strong>

                          {item.product?.name ||
                            item.name ||
                            "Product"}

                        </strong>


                        <p>

                          Quantity:
                          {" "}
                          {item.quantity}

                        </p>


                        {item.seller && (

                          <small>

                            Seller:
                            {" "}
                            {item.seller?.name ||
                              "Seller"}

                          </small>

                        )}

                      </div>


                      <strong>

                        ₹
                        {(item.price || 0) *
                          (item.quantity || 0)}

                      </strong>


                    </div>

                  )
                )}

              </div>

              <div className="order-section">

                <h3>
                  Seller
                </h3>


                {selectedOrder.items?.map(
                  (item, index) => (

                    <p key={index}>

                      {item.seller?.name ||
                        "Seller"}

                      {item.seller?.email && (

                        <>
                          {" - "}
                          {item.seller.email}
                        </>

                      )}

                    </p>

                  )
                )}

              </div>

              <div className="order-section">

                <h3>
                  Payment
                </h3>


                <p>

                  Method:
                  {" "}
                  <strong>
                    {selectedOrder.paymentMethod ||
                      "N/A"}
                  </strong>

                </p>


                <p>

                  Status:
                  {" "}
                  <strong>
                    {selectedOrder.paymentStatus ||
                      "N/A"}
                  </strong>

                </p>

              </div>

              <div className="order-section">

                <h3>
                  Shipping Address
                </h3>


                {selectedOrder.shippingAddress ? (

                  <p>

                    {selectedOrder.shippingAddress.name}

                    <br />

                    {selectedOrder.shippingAddress.phone}

                    <br />

                    {selectedOrder.shippingAddress.address}

                    <br />

                    {selectedOrder.shippingAddress.city}

                    {" "}

                    {selectedOrder.shippingAddress.state}

                    {" - "}

                    {selectedOrder.shippingAddress.pincode}

                  </p>

                ) : (

                  <p>
                    No shipping address available.
                  </p>

                )}

              </div>

              <div className="order-section">

                <h3>
                  Total Amount
                </h3>


                <h2>

                  ₹
                  {selectedOrder.totalAmount ||
                    0}

                </h2>

              </div>

              <div className="order-section">

                <h3>
                  Order Status
                </h3>


                <span
                  className={`order-status ${
                    selectedOrder.orderStatus ||
                    "pending"
                  }`}
                >

                  {(
                    selectedOrder.orderStatus ||
                    "pending"
                  ).replaceAll(
                    "_",
                    " "
                  )}

                </span>

              </div>


              {/* CLOSE BUTTON */}

              <div className="modal-actions">

                <button
                  className="cancel-btn"
                  onClick={() => {

                    setModal(false);
                    setSelectedOrder(null);

                  }}
                >
                  Close
                </button>

              </div>


            </div>

          </div>

        )}


    </div>

  );

}


export default Orders;