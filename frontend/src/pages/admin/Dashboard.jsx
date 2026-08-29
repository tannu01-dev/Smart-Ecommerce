import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/dashboard.css";

function Dashboard() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    pendingProducts: 0,
    approvedProducts: 0,
    rejectedProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: []
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================
  // FETCH ADMIN DASHBOARD
  // =====================================

  const fetchDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin.");
        return;
      }


      const response = await axios.get(
        "https://smart-ecommerce-site.onrender.com/api/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      console.log(
        "ADMIN DASHBOARD:",
        response.data
      );


      if (response.data.success) {

        setStats(
          response.data.stats || {}
        );

        setRecentOrders(
          response.data.recentOrders || []
        );

        setRecentProducts(
          response.data.recentProducts || []
        );

      } else {

        setError(
          response.data.message ||
          "Failed to load dashboard"
        );

      }

    } catch (error) {

      console.error(
        "ADMIN DASHBOARD ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load dashboard"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================
  // LOAD DASHBOARD
  // =====================================

  useEffect(() => {

    fetchDashboard();

  }, []);


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="admin-page">

        <div className="admin-card">

          <h2>
            Loading dashboard...
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
      <div className="admin-page">

        <div className="admin-card">

          <h2>
            Failed to load dashboard
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={fetchDashboard}
          >
            Try Again
          </button>

        </div>

      </div>
    );

  }


  // =====================================
  // DASHBOARD
  // =====================================

  return (

    <div>

      {/* =================================
          HEADER
      ================================= */}

      <div className="admin-page-title">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Here's what's happening on your platform.
          </p>

        </div>

        <button
          onClick={fetchDashboard}
        >
          Refresh
        </button>

      </div>


      {/* =================================
          STATS
      ================================= */}

      <div className="admin-stats">


        {/* USERS */}

        <div className="admin-stat">

          <span>
            Total Users
          </span>

          <h2>
            {stats.totalUsers}
          </h2>

          <p>
            Registered users
          </p>

        </div>


        {/* SELLERS */}

        <div className="admin-stat">

          <span>
            Total Sellers
          </span>

          <h2>
            {stats.totalSellers}
          </h2>

          <p>
            Registered sellers
          </p>

        </div>


        {/* PRODUCTS */}

        <div className="admin-stat">

          <span>
            Total Products
          </span>

          <h2>
            {stats.totalProducts}
          </h2>

          <p>
            {stats.pendingProducts} pending approval
          </p>

        </div>


        {/* REVENUE */}

        <div className="admin-stat">

          <span>
            Total Revenue
          </span>

          <h2>
            ₹{Number(stats.totalRevenue || 0).toLocaleString("en-IN")}
          </h2>

          <p>
            Paid orders revenue
          </p>

        </div>

      </div>


      {/* =================================
          SECOND STATS
      ================================= */}

      <div className="admin-stats">


        <div className="admin-stat">

          <span>
            Total Orders
          </span>

          <h2>
            {stats.totalOrders}
          </h2>

          <p>
            All orders
          </p>

        </div>


        <div className="admin-stat">

          <span>
            Pending Orders
          </span>

          <h2>
            {stats.pendingOrders}
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
            {stats.processingOrders}
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
            {stats.deliveredOrders}
          </h2>

          <p>
            Successfully delivered
          </p>

        </div>

      </div>


      {/* =================================
          DASHBOARD GRID
      ================================= */}

      <div className="admin-dashboard-grid">


        {/* =================================
            PRODUCT APPROVAL
        ================================= */}

        <div className="admin-card">

          <div className="admin-card-header">

            <h3>
              Product Overview
            </h3>

          </div>


          <div className="action-item">

            <div>

              <strong>
                {stats.pendingProducts}
              </strong>

              <span>
                Pending Products
              </span>

            </div>

          </div>


          <div className="action-item">

            <div>

              <strong>
                {stats.approvedProducts}
              </strong>

              <span>
                Approved Products
              </span>

            </div>

          </div>


          <div className="action-item">

            <div>

              <strong>
                {stats.rejectedProducts}
              </strong>

              <span>
                Rejected Products
              </span>

            </div>

          </div>

        </div>


        {/* =================================
            ORDER OVERVIEW
        ================================= */}

        <div className="admin-card">

          <div className="admin-card-header">

            <h3>
              Order Overview
            </h3>

          </div>


          <div className="action-item">

            <div>

              <strong>
                {stats.confirmedOrders}
              </strong>

              <span>
                Confirmed
              </span>

            </div>

          </div>


          <div className="action-item">

            <div>

              <strong>
                {stats.shippedOrders}
              </strong>

              <span>
                Shipped
              </span>

            </div>

          </div>


          <div className="action-item">

            <div>

              <strong>
                {stats.cancelledOrders}
              </strong>

              <span>
                Cancelled
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =================================
          RECENT ORDERS
      ================================= */}

      <div className="admin-card">

        <div className="admin-card-header">

          <h3>
            Recent Orders
          </h3>

        </div>


        {recentOrders.length === 0 ? (

          <div className="pending-message">

            <p>
              No orders yet.
            </p>

          </div>

        ) : (

          <div className="pending-products-list">

            {recentOrders.map((order) => (

              <div
                className="pending-product"
                key={order._id}
              >

                <div className="pending-product-details">

                  <h3>
                    Order #{order._id.slice(-8)}
                  </h3>

                  <p>
                    Customer:{" "}
                    {order.user?.name ||
                      "Unknown"}
                  </p>

                  <p>
                    Email:{" "}
                    {order.user?.email ||
                      "N/A"}
                  </p>

                  <div className="product-info-row">

                    <span>

                      <strong>
                        Total:
                      </strong>{" "}

                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}

                    </span>


                    <span>

                      <strong>
                        Payment:
                      </strong>{" "}

                      {order.paymentMethod}

                    </span>


                    <span>

                      <strong>
                        Payment Status:
                      </strong>{" "}

                      {order.paymentStatus}

                    </span>


                    <span>

                      <strong>
                        Order Status:
                      </strong>{" "}

                      {order.orderStatus
                        ?.replaceAll("_", " ")}

                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* =================================
          RECENT PRODUCTS
      ================================= */}

      <div className="admin-card">

        <div className="admin-card-header">

          <h3>
            Recent Products
          </h3>

        </div>


        {recentProducts.length === 0 ? (

          <div className="pending-message">

            <p>
              No products yet.
            </p>

          </div>

        ) : (

          <div className="pending-products-list">

            {recentProducts.map((product) => (

              <div
                className="pending-product"
                key={product._id}
              >

                <div className="pending-product-details">

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.description}
                  </p>

                  <div className="product-info-row">

                    <span>

                      <strong>
                        Price:
                      </strong>{" "}

                      ₹{product.price}

                    </span>


                    <span>

                      <strong>
                        Stock:
                      </strong>{" "}

                      {product.stock}

                    </span>


                    <span>

                      <strong>
                        Category:
                      </strong>{" "}

                      {product.category}

                    </span>


                    <span>

                      <strong>
                        Status:
                      </strong>{" "}

                      {product.status}

                    </span>

                  </div>


                  <div className="product-seller">

                    <strong>
                      Seller:
                    </strong>

                    <span>
                      {product.seller?.name ||
                        "Unknown"}
                    </span>

                    <span>
                      {product.seller?.email ||
                        ""}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;