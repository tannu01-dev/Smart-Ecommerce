import { Link, Outlet } from "react-router-dom";
import "../styles/admin.css";
import permissions from "../config/permissions";

function AdminLayout() {
  const role = "Super Admin";
  const allowed = permissions[role];

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-logo">
          SmartCommerce
          <span>ADMIN PANEL</span>
        </div>

        <nav>

          {allowed.includes("dashboard") && (
            <Link to="/admin">📊 Dashboard</Link>
          )}

          {allowed.includes("users") && (
            <Link to="/admin/users">👥 Users</Link>
          )}

          {allowed.includes("products") && (
            <Link to="/admin/products">📦 Products</Link>
          )}

          {allowed.includes("categories") && (
            <Link to="/admin/categories">🏷️ Categories</Link>
          )}

          {allowed.includes("orders") && (
            <Link to="/admin/orders">🛒 Orders</Link>
          )}

          {allowed.includes("returns") && (
            <Link to="/admin/returns">↩️ Returns</Link>
          )}

          {allowed.includes("refunds") && (
            <Link to="/admin/refunds">💰 Refunds</Link>
          )}

          {allowed.includes("coupons") && (
            <Link to="/admin/coupons">🎟️ Coupons</Link>
          )}

          {allowed.includes("analytics") && (
            <Link to="/admin/analytics">📈 Analytics</Link>
          )}

          {allowed.includes("reports") && (
            <Link to="/admin/reports">📋 Reports</Link>
          )}

          {allowed.includes("notifications") && (
            <Link to="/admin/notifications">🔔 Notifications</Link>
          )}

          {allowed.includes("roles") && (
            <Link to="/admin/roles">🛡️ Admin Roles</Link>
          )}

        </nav>

        <button className="admin-logout">
          Logout
        </button>

      </aside>

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <h2>Admin Panel</h2>
            <p>Manage your SmartCommerce platform</p>
          </div>

          <div className="admin-profile">
            🔔
            <span>Administrator</span>
          </div>

        </header>

        <div className="admin-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;