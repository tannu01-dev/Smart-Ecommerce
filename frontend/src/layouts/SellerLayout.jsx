import { Link, Outlet } from "react-router-dom";
import "../styles/seller.css";

function SellerLayout() {
  return (
    <div className="seller-layout">

      <aside className="seller-sidebar">

        <div className="seller-logo">
          SmartCommerce
          <span>Seller</span>
        </div>

        <nav>

          <Link to="/seller">
            📊 Dashboard
          </Link>

          <Link to="/seller/products">
            📦 My Products
          </Link>

          <Link to="/seller/add-product">
            ➕ Add Product
          </Link>

          <Link to="/seller/inventory">
            🏷️ Inventory
          </Link>

          <Link to="/seller/orders">
            🛒 Orders
          </Link>

          <Link to="/seller/earnings">
            💰 Earnings
          </Link>

          <Link to="/seller/reviews">
            ⭐ Reviews
          </Link>

          <Link to="/seller/notifications">
            🔔 Notifications
          </Link>

          <Link to="/seller/profile">
            👤 Profile
          </Link>

        </nav>

        <button className="seller-logout">
          Logout
        </button>

      </aside>


      <main className="seller-main">

        <header className="seller-header">

          <div>
            <h2>Seller Panel</h2>
            <p>Manage your store</p>
          </div>

          <div className="seller-user">
            🔔
            <span>Seller</span>
          </div>

        </header>

        <div className="seller-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default SellerLayout;