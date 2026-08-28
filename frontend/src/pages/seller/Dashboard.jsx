import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import API from "../../services/api";

function Dashboard() {

  const navigate = useNavigate();

  // =====================================
  // STATE
  // =====================================

  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingProducts: 0,
    approvedProducts: 0,

    totalOrders: 0,

    pendingOrders: 0,
    confirmedOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    outForDeliveryOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,

    totalEarnings: 0,

    monthlySales: []
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================
  // FETCH SELLER DASHBOARD
  // =====================================

  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {

        setError("Please login first");

        setLoading(false);

        return;
      }


      const response = await API.get(
        "/seller/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (response.data.success) {

        setStats(
          response.data.stats || {}
        );

        setRecentOrders(
          response.data.recentOrders || []
        );

      }

    } catch (error) {

      console.log(
        "SELLER DASHBOARD ERROR:",
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
  // MONTH NAMES
  // =====================================

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];


  // =====================================
  // SALES CHART DATA
  // =====================================

  const salesData =
    (stats.monthlySales || []).map(
      (sale, index) => ({

        month: monthNames[index],

        sales: sale

      })
    );


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div>

        <h2>
          Loading dashboard...
        </h2>

      </div>

    );

  }


  // =====================================
  // ERROR
  // =====================================

  if (error) {

    return (

      <div>

        <h2>
          {error}
        </h2>

        <button
          onClick={fetchDashboard}
        >
          Try Again
        </button>

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

      <div className="page-title">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Welcome back! Here's what's happening with your store.
          </p>

        </div>


        <button
          className="add-product-btn"
          onClick={() =>
            navigate("/seller/add-product")
          }
        >
          + Add Product
        </button>

      </div>



      {/* =================================
          STATS
      ================================= */}

      <div className="stats-grid">


        {/* TOTAL PRODUCTS */}

        <div className="stat-card">

          <span>
            Total Products
          </span>

          <h2>
            {stats.totalProducts}
          </h2>

          <p>
            Products in your store
          </p>

        </div>



        {/* PENDING PRODUCTS */}

        <div className="stat-card">

          <span>
            Pending Products
          </span>

          <h2>
            {stats.pendingProducts}
          </h2>

          <p>
            Waiting for approval
          </p>

        </div>



        {/* TOTAL ORDERS */}

        <div className="stat-card">

          <span>
            Total Orders
          </span>

          <h2>
            {stats.totalOrders}
          </h2>

          <p>
            Customer orders
          </p>

        </div>



        {/* TOTAL EARNINGS */}

        <div className="stat-card">

          <span>
            Total Earnings
          </span>

          <h2>
            ₹{stats.totalEarnings}
          </h2>

          <p>
            From your orders
          </p>

        </div>

      </div>



      {/* =================================
          RECENT ORDERS + APPROVAL
      ================================= */}

      <div className="dashboard-grid">


        {/* =================================
            RECENT ORDERS
        ================================= */}

        <div className="dashboard-card">

          <div className="card-header">

            <h3>
              Recent Orders
            </h3>

            <span
              onClick={() =>
                navigate("/seller/orders")
              }
              style={{
                cursor: "pointer"
              }}
            >
              View All
            </span>

          </div>


          {recentOrders.length === 0 ? (

            <p>
              No orders yet.
            </p>

          ) : (

            recentOrders.map((order) => {

              // Seller ke products ka total
              const sellerTotal =
                order.items?.reduce(
                  (total, item) => {

                    return (
                      total +
                      (
                        item.price *
                        item.quantity
                      )
                    );

                  },
                  0
                ) || 0;


              return (

                <div
                  className="order-row"
                  key={order._id}
                >


                  <div>

                    <strong>
                      #{order._id.slice(-8)}
                    </strong>

                    <p>

                      {order.items?.[0]?.name ||
                        "Product"}

                    </p>

                  </div>


                  <span
                    className={`status ${
                      order.orderStatus ||
                      "pending"
                    }`}
                  >

                    {(
                      order.orderStatus ||
                      "pending"
                    ).replaceAll(
                      "_",
                      " "
                    )}

                  </span>


                  <strong>
                    ₹{sellerTotal}
                  </strong>


                </div>

              );

            })

          )}

        </div>



        {/* =================================
            PRODUCT APPROVAL
        ================================= */}

        <div className="dashboard-card">


          <div className="card-header">

            <h3>
              Product Approval
            </h3>

          </div>


          <div className="approval-box">


            <span className="approval-number">

              {stats.pendingProducts}

            </span>


            <div>

              <strong>
                Products Pending
              </strong>

              <p>
                Your products are waiting
                for admin approval.
              </p>

            </div>

          </div>


          <button
            className="view-products-btn"
            onClick={() =>
              navigate("/seller/products")
            }
          >
            View Products
          </button>


        </div>


      </div>



      {/* =================================
          ORDER STATUS SUMMARY
      ================================= */}

      <div
        className="dashboard-card"
        style={{
          marginTop: "20px"
        }}
      >


        <div className="card-header">

          <h3>
            Order Status
          </h3>

        </div>


        <div className="stats-grid">


          {/* PENDING */}

          <div className="stat-card">

            <span>
              Pending
            </span>

            <h2>
              {stats.pendingOrders}
            </h2>

            <p>
              New orders
            </p>

          </div>



          {/* CONFIRMED */}

          <div className="stat-card">

            <span>
              Confirmed
            </span>

            <h2>
              {stats.confirmedOrders}
            </h2>

            <p>
              Accepted orders
            </p>

          </div>



          {/* PROCESSING */}

          <div className="stat-card">

            <span>
              Processing
            </span>

            <h2>
              {stats.processingOrders}
            </h2>

            <p>
              Being prepared
            </p>

          </div>



          {/* SHIPPED */}

          <div className="stat-card">

            <span>
              Shipped
            </span>

            <h2>
              {stats.shippedOrders}
            </h2>

            <p>
              On the way
            </p>

          </div>



          {/* OUT FOR DELIVERY */}

          <div className="stat-card">

            <span>
              Out for Delivery
            </span>

            <h2>
              {stats.outForDeliveryOrders}
            </h2>

            <p>
              Delivery in progress
            </p>

          </div>



          {/* DELIVERED */}

          <div className="stat-card">

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



          {/* CANCELLED */}

          <div className="stat-card">

            <span>
              Cancelled
            </span>

            <h2>
              {stats.cancelledOrders}
            </h2>

            <p>
              Cancelled orders
            </p>

          </div>


        </div>

      </div>



      {/* =================================
          SALES OVERVIEW
      ================================= */}

      <div
        className="dashboard-card"
        style={{
          marginTop: "20px",
          width: "100%"
        }}
      >


        <div className="card-header">

          <h3>
            Sales Overview
          </h3>

          <span>
            Monthly Sales
          </span>

        </div>


        <div
          style={{
            width: "100%",
            height: "320px"
          }}
        >


          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={salesData}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10
              }}
            >


              <CartesianGrid
                strokeDasharray="3 3"
              />


              <XAxis
                dataKey="month"
              />


              <YAxis />


              <Tooltip
                formatter={(value) => [
                  `₹${value}`,
                  "Sales"
                ]}
              />


              <Line
                type="monotone"
                dataKey="sales"
                strokeWidth={3}
              />


            </LineChart>

          </ResponsiveContainer>


        </div>

      </div>



      {/* =================================
          QUICK ACTIONS
      ================================= */}

      <div
        className="dashboard-card"
        style={{
          marginTop: "20px"
        }}
      >


        <div className="card-header">

          <h3>
            Quick Actions
          </h3>

        </div>


        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >


          <button
            className="view-products-btn"
            onClick={() =>
              navigate("/seller/products")
            }
          >
            Manage Products
          </button>


          <button
            className="view-products-btn"
            onClick={() =>
              navigate("/seller/orders")
            }
          >
            Manage Orders
          </button>


          <button
            className="view-products-btn"
            onClick={() =>
              navigate("/seller/add-product")
            }
          >
            Add New Product
          </button>


        </div>

      </div>


    </div>

  );

}

export default Dashboard;