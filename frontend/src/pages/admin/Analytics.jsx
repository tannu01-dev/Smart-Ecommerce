import { useEffect, useState } from "react";
import "../../styles/dashboard.css";

function Analytics() {

  const [period, setPeriod] = useState("monthly");

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    refundAmount: 0
  });

  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topSellers, setTopSellers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // FETCH ANALYTICS
  const fetchAnalytics = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Admin login required");
        return;
      }

      const response = await fetch(
        `https://smart-ecommerce-site.onrender.com/api/admin/analytics?period=${period}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log("ADMIN ANALYTICS:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load analytics"
        );
      }

      if (data.success) {

        setStats(
          data.stats || {
            totalRevenue: 0,
            totalOrders: 0,
            completedOrders: 0,
            refundAmount: 0
          }
        );

        setSales(data.sales || []);

        setTopProducts(
          data.topProducts || []
        );

        setTopSellers(
          data.topSellers || []
        );

      } else {

        setError(
          data.message ||
          "Failed to load analytics"
        );

      }

    } catch (error) {

      console.error(
        "ANALYTICS ERROR:",
        error
      );

      setError(
        error.message ||
        "Failed to load analytics"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchAnalytics();

  }, [period]);

  if (loading) {

    return (

      <div className="admin-card">

        <h2>
          Loading analytics...
        </h2>

      </div>

    );

  }

  if (error) {

    return (

      <div className="admin-card">

        <h2>
          Failed to load analytics
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={fetchAnalytics}
        >
          Try Again
        </button>

      </div>

    );

  }


  const maxRevenue =
    sales.length > 0
      ? Math.max(
          ...sales.map(
            item =>
              Number(item.revenue) || 0
          )
        )
      : 0;


  return (

    <div>

      <div className="admin-page-title">

        <div>

          <h1>
            Sales Analytics
          </h1>

          <p>
            Monitor platform sales and business performance.
          </p>

        </div>


        <div
          style={{
            display: "flex",
            gap: "10px"
          }}
        >

          <select
            className="analytics-filter"
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value)
            }
          >

            <option value="weekly">
              This Week
            </option>

            <option value="monthly">
              This Month
            </option>

            <option value="yearly">
              This Year
            </option>

          </select>


          <button
            onClick={fetchAnalytics}
          >
            Refresh
          </button>

        </div>

      </div>


      <div className="analytics-stats">


        {/* TOTAL REVENUE */}

        <div className="analytics-card">

          <p>
            Total Revenue
          </p>

          <h2>
            ₹
            {Number(
              stats.totalRevenue || 0
            ).toLocaleString("en-IN")}
          </h2>

          <span>
            Revenue in selected period
          </span>

        </div>


        {/* TOTAL ORDERS */}

        <div className="analytics-card">

          <p>
            Total Orders
          </p>

          <h2>
            {stats.totalOrders || 0}
          </h2>

          <span>
            Orders in selected period
          </span>

        </div>


        {/* COMPLETED ORDERS */}

        <div className="analytics-card">

          <p>
            Completed Orders
          </p>

          <h2>
            {stats.completedOrders || 0}
          </h2>

          <span>
            Delivered orders
          </span>

        </div>


        {/* REFUND */}

        <div className="analytics-card">

          <p>
            Refund Amount
          </p>

          <h2>
            ₹
            {Number(
              stats.refundAmount || 0
            ).toLocaleString("en-IN")}
          </h2>

          <span>
            Refunded orders
          </span>

        </div>


      </div>


      <div className="analytics-box">

        <div className="analytics-box-title">

          <div>

            <h2>
              Revenue Overview
            </h2>

            <span>
              {period === "weekly"
                ? "Daily Revenue"
                : period === "yearly"
                  ? "Monthly Revenue"
                  : "Monthly Revenue"}
            </span>

          </div>

        </div>


        {sales.length === 0 ? (

          <div className="pending-message">

            <h3>
              No sales data
            </h3>

            <p>
              There is no revenue data for this period.
            </p>

          </div>

        ) : (

          <div className="revenue-chart">

            {sales.map((item, index) => {

              const revenue =
                Number(item.revenue) || 0;


              const barHeight =
                maxRevenue > 0
                  ? Math.max(
                      (revenue / maxRevenue) * 250,
                      5
                    )
                  : 5;


              return (

                <div
                  className="chart-column"
                  key={`${item.month}-${index}`}
                >

                  <div
                    className="chart-bar"
                    style={{
                      height: `${barHeight}px`
                    }}
                    title={`₹${revenue.toLocaleString(
                      "en-IN"
                    )}`}
                  />

                  <span>
                    {item.month}
                  </span>

                </div>

              );

            })}

          </div>

        )}

      </div>

      <div className="analytics-grid">


        <div className="analytics-box">

          <div className="analytics-box-title">

            <div>

              <h2>
                Top Products
              </h2>

              <span>
                Best selling products
              </span>

            </div>

          </div>


          {topProducts.length === 0 ? (

            <div className="pending-message">

              <h3>
                No products found
              </h3>

              <p>
                No product sales available.
              </p>

            </div>

          ) : (

            topProducts.map(
              (product, index) => (

                <div
                  className="analytics-list"
                  key={
                    product.productId ||
                    index
                  }
                >

                  {/* RANK */}

                  <div className="rank">

                    #{index + 1}

                  </div>


                  {/* PRODUCT */}

                  <div>

                    <strong>
                      {product.name ||
                        "Unknown Product"}
                    </strong>

                    <small>
                      {product.sales || 0} sales
                    </small>

                  </div>


                  {/* REVENUE */}

                  <strong>

                    ₹
                    {Number(
                      product.revenue || 0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </strong>

                </div>

              )
            )

          )}

        </div>


        <div className="analytics-box">

          <div className="analytics-box-title">

            <div>

              <h2>
                Top Sellers
              </h2>

              <span>
                Best performing sellers
              </span>

            </div>

          </div>


          {topSellers.length === 0 ? (

            <div className="pending-message">

              <h3>
                No sellers found
              </h3>

              <p>
                No seller sales available.
              </p>

            </div>

          ) : (

            topSellers.map(
              (seller, index) => (

                <div
                  className="analytics-list"
                  key={
                    seller.sellerId ||
                    index
                  }
                >

                  {/* RANK */}

                  <div className="rank">

                    #{index + 1}

                  </div>


                  {/* SELLER */}

                  <div>

                    <strong>
                      {seller.name ||
                        "Unknown Seller"}
                    </strong>

                    <small>
                      {seller.orders || 0} orders
                    </small>

                  </div>


                  {/* REVENUE */}

                  <strong>

                    ₹
                    {Number(
                      seller.revenue || 0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </strong>

                </div>

              )
            )

          )}

        </div>


      </div>

      <div className="analytics-box">

        <div className="analytics-box-title">

          <div>

            <h2>
              Performance Summary
            </h2>

            <span>
              Current {period} performance
            </span>

          </div>

        </div>


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px"
          }}
        >


          <div>

            <p>
              Average Order Value
            </p>

            <h3>

              ₹
              {stats.totalOrders > 0
                ? Math.round(
                    stats.totalRevenue /
                      stats.totalOrders
                  ).toLocaleString(
                    "en-IN"
                  )
                : "0"}

            </h3>

          </div>


          <div>

            <p>
              Completion Rate
            </p>

            <h3>

              {stats.totalOrders > 0
                ? (
                    (stats.completedOrders /
                      stats.totalOrders) *
                    100
                  ).toFixed(1)
                : "0"}
              %

            </h3>

          </div>


          <div>

            <p>
              Refund Rate
            </p>

            <h3>

              {stats.totalRevenue > 0
                ? (
                    (stats.refundAmount /
                      stats.totalRevenue) *
                    100
                  ).toFixed(1)
                : "0"}
              %

            </h3>

          </div>


        </div>

      </div>


    </div>

  );
}

export default Analytics;