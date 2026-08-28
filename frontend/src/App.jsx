// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import "./index.css";

// import Products from "./pages/user/Products";
// import SellerLayout from "./layouts/SellerLayout";
// import SellerDashboard from "./pages/seller/Dashboard";
// import SellerProducts from "./pages/seller/Products";
// import AddProduct from "./pages/seller/AddProduct";
// import AdminLayout from "./layouts/AdminLayout";
// import AdminDashboard from "./pages/admin/Dashboard";
// import AdminProducts from "./pages/admin/Products";
// import AdminUsers from "./pages/admin/Users";
// import AdminCategories from "./pages/admin/Categories";
// import AdminReturns from "./pages/admin/Returns";
// import AdminCoupons from "./pages/admin/Coupons";
// import AdminOrders from "./pages/admin/Orders";
// import AdminAnalytics from "./pages/admin/Analytics";
// import AdminReports from "./pages/admin/Reports";
// import AdminNotifications from "./pages/admin/Notifications";
// import AdminRoles from "./pages/admin/AdminRoles";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminLogin from "./pages/admin/Login";
// import Checkout from "./pages/user/Checkout";

// import Register from "./pages/auth/Register";
// import Orders from "./pages/user/Orders";
// import SellerOrders from "./pages/seller/Orders";
// import EditProduct from "./pages/seller/EditProduct";



// function Home() {
//   return (
//     <main className="hero">

//       <div className="hero-content">

//         <p className="tagline">
//           SMART SHOPPING EXPERIENCE
//         </p>

//         <h1>
//           Everything you need,
//           <br />
//           in one place.
//         </h1>

//         <p className="description">
//           Discover products from trusted sellers
//           with a smarter and simpler shopping
//           experience.
//         </p>

//         <div className="hero-buttons">

//           <Link to="/products">
//             <button className="primary-btn">
//               Explore Products
//             </button>
//           </Link>

//           <button className="secondary-btn">
//             Become a Seller
//           </button>

//         </div>

//       </div>

//     </main>
//   );
// }


// function App() {
//   return (
//     <BrowserRouter>

//       <div className="app">

//         <nav className="navbar">

//           <Link to="/" className="logo">
//             SmartCommerce
//           </Link>

//           <div className="nav-links">

//             <Link to="/">
//               Home
//             </Link>

//             <Link to="/products">
//               Products
//             </Link>

//             <span>
//               Wishlist
//             </span>

//             <span>
//               Cart
//             </span>
//             <Link to="/orders">
//   My Orders
// </Link>

//             <Link to="/admin/login" className="login-btn">
//   Login
// </Link>

//           </div>

//         </nav>


//         <Routes>

//           <Route
//             path="/"
//             element={<Home />}
//           />

//           <Route
//             path="/products"
//             element={<Products />}
//           />
//           <Route
//   path="/orders"
//   element={<Orders />}
// />
//           <Route
//     path="/checkout"
//     element={<Checkout />}
//   />
//   <Route
//   path="/login"
//   element={<AdminLogin />}
// />

// <Route
//   path="/register"
//   element={<Register />}
// />

//           <Route path="/seller" element={<SellerLayout />}>

//   <Route index element={<SellerDashboard />} />

//   <Route
//     path="products"
//     element={<SellerProducts />}
//   />
//   <Route
//   path="orders"
//   element={<SellerOrders />}
// />
// <Route
//   path="/seller/edit-product/:id"
//   element={<EditProduct />}
// />

//   <Route
//     path="add-product"
//     element={<AddProduct />}
//   />
  

// </Route>
// <Route path="/admin" element={<AdminLayout />}>

//   <Route
//     index
//     element={<AdminDashboard />}
//   />

//   <Route
//     path="products"
//     element={<AdminProducts />}
//   />

//   <Route
//     path="users"
//     element={<AdminUsers />}
//   />
  

//   <Route
//     path="categories"
//     element={<AdminCategories />}
//   />

//   <Route
//     path="returns"
//     element={<AdminReturns />}
//   />
  
//   <Route
//   path="orders"
//   element={<AdminOrders />}
// />
// </Route>

//   <Route
//     path="returns"
//     element={<AdminReturns />}
//   />
  

//   <Route
//     path="coupons"
//     element={<AdminCoupons />}
//   />
//   <Route element={<ProtectedRoute permission="analytics" />}>
//   <Route
//     path="analytics"
//     element={<AdminAnalytics />}
//   />
// </Route>
//   <Route element={<ProtectedRoute permission="reports" />}>
//   <Route
//     path="reports"
//     element={<AdminReports />}
//   />
// </Route>
//   <Route
//   path="notifications"
//   element={<AdminNotifications />}
//   />
//   <Route
//   path="roles"
//   element={<AdminRoles />}
//   />
//   <Route path="/admin/login" element={<AdminLogin />} />
  


//         </Routes>
        

//       </div>

//     </BrowserRouter>
//   );
// }

// export default App;



import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";

import Products from "./pages/user/Products";
import SellerLayout from "./layouts/SellerLayout";
import SellerDashboard from "./pages/seller/Dashboard";
import SellerProducts from "./pages/seller/Products";
import AddProduct from "./pages/seller/AddProduct";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminUsers from "./pages/admin/Users";
import AdminCategories from "./pages/admin/Categories";
import AdminReturns from "./pages/admin/Returns";
import AdminCoupons from "./pages/admin/Coupons";
import AdminOrders from "./pages/admin/Orders";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminReports from "./pages/admin/Reports";
import AdminNotifications from "./pages/admin/Notifications";
import AdminRoles from "./pages/admin/AdminRoles";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/Login";
import Checkout from "./pages/user/Checkout";

import Register from "./pages/auth/Register";
import Orders from "./pages/user/Orders";
import SellerOrders from "./pages/seller/Orders";
import EditProduct from "./pages/seller/EditProduct";


// =====================================
// HOME
// =====================================

function Home() {
  return (
    <main className="hero">

      <div className="hero-content">

        <p className="tagline">
          SMART SHOPPING EXPERIENCE
        </p>

        <h1>
          Everything you need,
          <br />
          in one place.
        </h1>

        <p className="description">
          Discover products from trusted sellers
          with a smarter and simpler shopping
          experience.
        </p>

        <div className="hero-buttons">

          <Link to="/products">
            <button className="primary-btn">
              Explore Products
            </button>
          </Link>

          <button className="secondary-btn">
            Become a Seller
          </button>

        </div>

      </div>

    </main>
  );
}


// =====================================
// APP
// =====================================

function App() {

  return (
    <BrowserRouter>

      <div className="app">

        {/* ================================= */}
        {/* NAVBAR */}
        {/* ================================= */}

        <nav className="navbar">

          <Link
            to="/"
            className="logo"
          >
            SmartCommerce
          </Link>

          <div className="nav-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/products">
              Products
            </Link>

            <span>
              Wishlist
            </span>

            <span>
              Cart
            </span>

            <Link to="/orders">
              My Orders
            </Link>

            <Link
              to="/admin/login"
              className="login-btn"
            >
              Login
            </Link>

          </div>

        </nav>


        {/* ================================= */}
        {/* ROUTES */}
        {/* ================================= */}

        <Routes>

          {/* ================================= */}
          {/* HOME */}
          {/* ================================= */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* ================================= */}
          {/* USER PRODUCTS */}
          {/* ================================= */}

          <Route
            path="/products"
            element={<Products />}
          />


          {/* ================================= */}
          {/* USER ORDERS */}
          {/* ================================= */}

          <Route
            path="/orders"
            element={<Orders />}
          />


          {/* ================================= */}
          {/* CHECKOUT */}
          {/* ================================= */}

          <Route
            path="/checkout"
            element={<Checkout />}
          />


          {/* ================================= */}
          {/* LOGIN */}
          {/* ================================= */}

          <Route
            path="/login"
            element={<AdminLogin />}
          />


          {/* ================================= */}
          {/* REGISTER */}
          {/* ================================= */}

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ================================= */}
          {/* SELLER */}
          {/* ================================= */}

          <Route
            path="/seller"
            element={<SellerLayout />}
          >

            {/* Seller Dashboard */}

            <Route
              index
              element={<SellerDashboard />}
            />


            {/* Seller Products */}

            <Route
              path="products"
              element={<SellerProducts />}
            />


            {/* Seller Orders */}

            <Route
              path="orders"
              element={<SellerOrders />}
            />


            {/* Seller Add Product */}

            <Route
              path="add-product"
              element={<AddProduct />}
            />


            {/* Seller Edit Product */}

            <Route
              path="edit-product/:id"
              element={<EditProduct />}
            />

          </Route>


          {/* ================================= */}
          {/* ADMIN */}
          {/* ================================= */}

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            {/* Admin Dashboard */}

            <Route
              index
              element={<AdminDashboard />}
            />


            {/* Admin Products */}

            <Route
              path="products"
              element={<AdminProducts />}
            />


            {/* Admin Users */}

            <Route
              path="users"
              element={<AdminUsers />}
            />


            {/* Admin Categories */}

            <Route
              path="categories"
              element={<AdminCategories />}
            />


            {/* Admin Returns */}

            <Route
              path="returns"
              element={<AdminReturns />}
            />


            {/* Admin Orders */}

            <Route
              path="orders"
              element={<AdminOrders />}
            />


            {/* Admin Coupons */}

            <Route
              path="coupons"
              element={<AdminCoupons />}
            />


            {/* Admin Analytics */}

            <Route
              path="analytics"
              element={
                <ProtectedRoute permission="analytics">
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />


            {/* Admin Reports */}

            <Route
              path="reports"
              element={
                <ProtectedRoute permission="reports">
                  <AdminReports />
                </ProtectedRoute>
              }
            />


            {/* Admin Notifications */}

            <Route
              path="notifications"
              element={<AdminNotifications />}
            />


            {/* Admin Roles */}

            <Route
              path="roles"
              element={<AdminRoles />}
            />

          </Route>


          {/* ================================= */}
          {/* ADMIN LOGIN */}
          {/* ================================= */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />


        </Routes>

      </div>

    </BrowserRouter>
  );
}


export default App;

