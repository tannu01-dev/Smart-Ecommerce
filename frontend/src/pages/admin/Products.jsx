
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/dashboard.css";

function AdminProducts() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // =====================================
    // FETCH ALL PRODUCTS
    // =====================================

    const fetchProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Admin login required.");
                return;
            }

            const response = await axios.get(
                "https://smart-ecommerce-site.onrender.com/api/admin/products",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "ADMIN PRODUCTS:",
                response.data
            );

            if (response.data.success) {

                setProducts(
                    response.data.products || []
                );

            } else {

                setError(
                    response.data.message ||
                    "Failed to load products"
                );

            }

        } catch (error) {

            console.error(
                "ADMIN PRODUCTS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load products"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchProducts();

    }, []);


    // =====================================
    // APPROVE PRODUCT
    // =====================================

    const approveProduct = async (productId) => {

        const confirmApprove = window.confirm(
            "Are you sure you want to approve this product?"
        );

        if (!confirmApprove) {
            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.put(

                `https://smart-ecommerce-site.onrender.com/api/admin/products/${productId}/approve`,

                {},

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            console.log(
                "APPROVE RESPONSE:",
                response.data
            );


            if (response.data.success) {

                alert(
                    "Product approved successfully!"
                );

                // Refresh products
                fetchProducts();

            } else {

                alert(
                    response.data.message ||
                    "Failed to approve product"
                );

            }

        } catch (error) {

            console.error(
                "APPROVE PRODUCT ERROR:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Failed to approve product"
            );

        }

    };


    // =====================================
    // REJECT PRODUCT
    // =====================================

    const rejectProduct = async (productId) => {

        const reason =
            window.prompt(
                "Enter rejection reason:"
            );


        if (reason === null) {
            return;
        }


        try {

            const token =
                localStorage.getItem("token");


            const response = await axios.put(

                `https://smart-ecommerce-site.onrender.com/api/admin/products/${productId}/reject`,

                {
                    rejectionReason:
                        reason.trim()
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            console.log(
                "REJECT RESPONSE:",
                response.data
            );


            if (response.data.success) {

                alert(
                    "Product rejected successfully!"
                );

                fetchProducts();

            } else {

                alert(
                    response.data.message ||
                    "Failed to reject product"
                );

            }

        } catch (error) {

            console.error(
                "REJECT PRODUCT ERROR:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Failed to reject product"
            );

        }

    };


    // =====================================
    // FILTER PRODUCTS
    // =====================================

    const filteredProducts =
        products.filter((product) => {

            const searchText =
                search.toLowerCase().trim();


            const categoryName =
                typeof product.category === "object"
                    ? product.category?.name || ""
                    : product.category || "";


            const sellerName =
                product.seller?.name || "";


            const matchesSearch =

                product.name
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                categoryName
                    .toLowerCase()
                    .includes(searchText)

                ||

                sellerName
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =

                statusFilter === "all"

                ||

                product.status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    // =====================================
    // COUNTS
    // =====================================

    const totalProducts =
        products.length;


    const pendingProducts =
        products.filter(
            product =>
                product.status === "pending"
        ).length;


    const approvedProducts =
        products.filter(
            product =>
                product.status === "approved"
        ).length;


    const rejectedProducts =
        products.filter(
            product =>
                product.status === "rejected"
        ).length;


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div className="admin-card">

                <h2>
                    Loading products...
                </h2>

            </div>

        );

    }


    // =====================================
    // ERROR
    // =====================================

    if (error) {

        return (

            <div className="admin-card">

                <h2>
                    Failed to load products
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={fetchProducts}
                >
                    Try Again
                </button>

            </div>

        );

    }


    // =====================================
    // PAGE
    // =====================================

    return (

        <div>

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="admin-page-title">

                <div>

                    <h1>
                        Products
                    </h1>

                    <p>
                        Manage all products on your platform.
                    </p>

                </div>


                <button
                    onClick={fetchProducts}
                >
                    Refresh
                </button>

            </div>


            {/* =====================================
                STATS
            ===================================== */}

            <div className="admin-stats">


                <div className="admin-stat">

                    <span>
                        Total Products
                    </span>

                    <h2>
                        {totalProducts}
                    </h2>

                    <p>
                        All products
                    </p>

                </div>


                <div className="admin-stat">

                    <span>
                        Pending
                    </span>

                    <h2>
                        {pendingProducts}
                    </h2>

                    <p>
                        Waiting for approval
                    </p>

                </div>


                <div className="admin-stat">

                    <span>
                        Approved
                    </span>

                    <h2>
                        {approvedProducts}
                    </h2>

                    <p>
                        Live products
                    </p>

                </div>


                <div className="admin-stat">

                    <span>
                        Rejected
                    </span>

                    <h2>
                        {rejectedProducts}
                    </h2>

                    <p>
                        Rejected products
                    </p>

                </div>


            </div>


            {/* =====================================
                PRODUCT CARD
            ===================================== */}

            <div className="admin-card">


                <div className="admin-card-header">

                    <div>

                        <h3>
                            Product Management
                        </h3>

                        <p>
                            Review seller products and approve or reject them.
                        </p>

                    </div>

                </div>


                {/* =====================================
                    SEARCH + FILTER
                ===================================== */}

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: "20px",
                        flexWrap: "wrap"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Search product, category or seller..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        style={{
                            padding: "10px 14px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            minWidth: "280px"
                        }}
                    />


                    <button
                        onClick={() =>
                            setStatusFilter("all")
                        }
                    >
                        All
                    </button>


                    <button
                        onClick={() =>
                            setStatusFilter("pending")
                        }
                    >
                        Pending
                    </button>


                    <button
                        onClick={() =>
                            setStatusFilter("approved")
                        }
                    >
                        Approved
                    </button>


                    <button
                        onClick={() =>
                            setStatusFilter("rejected")
                        }
                    >
                        Rejected
                    </button>

                </div>


                {/* =====================================
                    NO PRODUCTS
                ===================================== */}

                {filteredProducts.length === 0 ? (

                    <div className="pending-message">

                        <h3>
                            No Products Found
                        </h3>

                        <p>
                            Try changing your search or filter.
                        </p>

                    </div>

                ) : (

                    <div
                        style={{
                            overflowX: "auto"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse"
                            }}
                        >

                            <thead>

                                <tr>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "14px"
                                        }}
                                    >
                                        Product
                                    </th>


                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "14px"
                                        }}
                                    >
                                        Seller
                                    </th>


                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "14px"
                                        }}
                                    >
                                        Category
                                    </th>


                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "14px"
                                        }}
                                    >
                                        Price
                                    </th>


                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "14px"
                                        }}
                                    >
                                        Stock
                                    </th>


                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "14px"
                                        }}
                                    >
                                        Status
                                    </th>


                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "14px"
                                        }}
                                    >
                                        Date
                                    </th>


                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "14px"
                                        }}
                                    >
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredProducts.map(
                                    (product) => {

                                        const categoryName =
                                            typeof product.category === "object"
                                                ? product.category?.name || "Unknown"
                                                : product.category || "Unknown";


                                        return (

                                            <tr
                                                key={product._id}
                                            >

                                                {/* PRODUCT */}

                                                <td
                                                    style={{
                                                        padding: "14px"
                                                    }}
                                                >

                                                    <div>

                                                        <strong>
                                                            {product.name}
                                                        </strong>

                                                        {product.images?.[0] && (

                                                            <div
                                                                style={{
                                                                    marginTop: "8px"
                                                                }}
                                                            >

                                                                <img
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    style={{
                                                                        width: "60px",
                                                                        height: "60px",
                                                                        objectFit: "cover",
                                                                        borderRadius: "8px",
                                                                        border: "1px solid #ddd"
                                                                    }}
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display =
                                                                            "none";
                                                                    }}
                                                                />

                                                            </div>

                                                        )}

                                                    </div>

                                                </td>


                                                {/* SELLER */}

                                                <td
                                                    style={{
                                                        padding: "14px"
                                                    }}
                                                >

                                                    {product.seller?.name ||
                                                        "Unknown"}

                                                    <br />

                                                    <small>
                                                        {product.seller?.email ||
                                                            ""}
                                                    </small>

                                                </td>


                                                {/* CATEGORY */}

                                                <td
                                                    style={{
                                                        padding: "14px"
                                                    }}
                                                >

                                                    {categoryName}

                                                </td>


                                                {/* PRICE */}

                                                <td
                                                    style={{
                                                        padding: "14px"
                                                    }}
                                                >

                                                    ₹{product.price}

                                                </td>


                                                {/* STOCK */}

                                                <td
                                                    style={{
                                                        padding: "14px"
                                                    }}
                                                >

                                                    {product.stock}

                                                </td>


                                                {/* STATUS */}

                                                <td
                                                    style={{
                                                        padding: "14px"
                                                    }}
                                                >

                                                    <span
                                                        className={
                                                            `status ${
                                                                product.status ===
                                                                "approved"

                                                                    ? "approved"

                                                                    : product.status ===
                                                                      "rejected"

                                                                        ? "rejected"

                                                                        : "processing"
                                                            }`
                                                        }
                                                    >

                                                        {product.status}

                                                    </span>

                                                </td>


                                                {/* DATE */}

                                                <td
                                                    style={{
                                                        padding: "14px"
                                                    }}
                                                >

                                                    {product.createdAt

                                                        ? new Date(
                                                            product.createdAt
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )

                                                        : "N/A"}

                                                </td>


                                                {/* ACTION */}

                                                <td
                                                    style={{
                                                        padding: "14px"
                                                    }}
                                                >

                                                    {product.status === "pending" ? (

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                gap: "8px",
                                                                flexWrap: "wrap"
                                                            }}
                                                        >

                                                            <button
                                                                onClick={() =>
                                                                    approveProduct(
                                                                        product._id
                                                                    )
                                                                }
                                                                style={{
                                                                    padding: "8px 12px",
                                                                    border: "none",
                                                                    borderRadius: "6px",
                                                                    cursor: "pointer"
                                                                }}
                                                            >
                                                                Approve
                                                            </button>


                                                            <button
                                                                onClick={() =>
                                                                    rejectProduct(
                                                                        product._id
                                                                    )
                                                                }
                                                                style={{
                                                                    padding: "8px 12px",
                                                                    border: "none",
                                                                    borderRadius: "6px",
                                                                    cursor: "pointer"
                                                                }}
                                                            >
                                                                Reject
                                                            </button>

                                                        </div>

                                                    ) : (

                                                        <span>
                                                            No Action
                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}

export default AdminProducts;
