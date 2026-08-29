import { useEffect, useState } from "react";
import "../../styles/dashboard.css";

function Returns() {

    const [returns, setReturns] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedReturn, setSelectedReturn] = useState(null);
    const [modal, setModal] = useState(null);

    const [rejectReason, setRejectReason] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState(false);


    // =====================================
    // FETCH RETURNS
    // =====================================

    const fetchReturns = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Admin login required");
                return;
            }

            const response = await fetch(
                "https://smart-ecommerce-site.onrender.com/api/api/admin/returns",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log("ADMIN RETURNS:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load returns"
                );
            }

            if (data.success) {

                setReturns(data.returns || []);

            } else {

                setError(
                    data.message ||
                    "Failed to load returns"
                );

            }

        } catch (error) {

            console.error(
                "RETURNS ERROR:",
                error
            );

            setError(
                error.message ||
                "Failed to load returns"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // LOAD RETURNS
    // =====================================

    useEffect(() => {

        fetchReturns();

    }, []);


    // =====================================
    // APPROVE RETURN
    // =====================================

    const approveReturn = async () => {

        if (!selectedReturn) {
            return;
        }

        try {

            setActionLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://smart-ecommerce-site.onrender.com/api/api/admin/returns/${selectedReturn._id}/approve`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log(
                "APPROVE RETURN:",
                data
            );

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to approve return"
                );

                return;
            }

            if (data.success) {

                setReturns((prev) =>
                    prev.map((item) =>
                        item._id === selectedReturn._id
                            ? data.returnRequest
                            : item
                    )
                );

                setSelectedReturn(
                    data.returnRequest
                );

                setModal("view");

                alert(
                    "Return approved successfully"
                );

            }

        } catch (error) {

            console.error(
                "APPROVE RETURN ERROR:",
                error
            );

            alert(
                "Failed to approve return"
            );

        } finally {

            setActionLoading(false);

        }
    };


    // =====================================
    // REJECT RETURN
    // =====================================

    const rejectReturn = async () => {

        if (!selectedReturn) {
            return;
        }

        if (!rejectReason.trim()) {

            alert(
                "Please enter rejection reason"
            );

            return;
        }

        try {

            setActionLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://smart-ecommerce-site.onrender.com/api/api/admin/returns/${selectedReturn._id}/reject`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        reason: rejectReason
                    })
                }
            );

            const data = await response.json();

            console.log(
                "REJECT RETURN:",
                data
            );

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to reject return"
                );

                return;
            }

            if (data.success) {

                setReturns((prev) =>
                    prev.map((item) =>
                        item._id === selectedReturn._id
                            ? data.returnRequest
                            : item
                    )
                );

                setSelectedReturn(
                    data.returnRequest
                );

                setRejectReason("");

                setModal("view");

                alert(
                    "Return rejected successfully"
                );

            }

        } catch (error) {

            console.error(
                "REJECT RETURN ERROR:",
                error
            );

            alert(
                "Failed to reject return"
            );

        } finally {

            setActionLoading(false);

        }
    };


    // =====================================
    // COMPLETE REFUND
    // =====================================

    const completeRefund = async () => {

        if (!selectedReturn) {
            return;
        }

        try {

            setActionLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://smart-ecommerce-site.onrender.com/api/api/admin/returns/${selectedReturn._id}/refund`,
                {
                    method: "PUT",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log(
                "COMPLETE REFUND:",
                data
            );

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to complete refund"
                );

                return;
            }

            if (data.success) {

                setReturns((prev) =>
                    prev.map((item) =>
                        item._id === selectedReturn._id
                            ? data.returnRequest
                            : item
                    )
                );

                setSelectedReturn(
                    data.returnRequest
                );

                setModal("view");

                alert(
                    "Refund completed successfully"
                );

            }

        } catch (error) {

            console.error(
                "REFUND ERROR:",
                error
            );

            alert(
                "Failed to complete refund"
            );

        } finally {

            setActionLoading(false);

        }
    };


    // =====================================
    // SEARCH + FILTER
    // =====================================

    const filteredReturns = returns.filter(
        (item) => {

            const customerName =
                item.user?.name || "";

            const customerEmail =
                item.user?.email || "";

            const productName =
                item.product?.name || "";

            const orderId =
                item.order?._id || "";

            const reason =
                item.reason || "";

            const searchText =
                search.toLowerCase();

            const matchesSearch =

                customerName
                    .toLowerCase()
                    .includes(searchText) ||

                customerEmail
                    .toLowerCase()
                    .includes(searchText) ||

                productName
                    .toLowerCase()
                    .includes(searchText) ||

                orderId
                    .toLowerCase()
                    .includes(searchText) ||

                reason
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =
                statusFilter === "all" ||
                item.status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        }
    );


    // =====================================
    // CLOSE MODAL
    // =====================================

    const closeModal = () => {

        setModal(null);
        setSelectedReturn(null);
        setRejectReason("");

    };


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div className="admin-card">

                <h2>
                    Loading returns...
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
                    Failed to load returns
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={fetchReturns}
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

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="admin-page-title">

                <div>

                    <h1>
                        Returns & Refunds
                    </h1>

                    <p>
                        Review customer return and refund requests.
                    </p>

                </div>


                <button
                    onClick={fetchReturns}
                >
                    Refresh
                </button>

            </div>


            {/* ================================= */}
            {/* STATS */}
            {/* ================================= */}

            <div className="admin-stats">

                <div className="admin-stat">

                    <span>
                        Total Returns
                    </span>

                    <h2>
                        {returns.length}
                    </h2>

                    <p>
                        All requests
                    </p>

                </div>


                <div className="admin-stat">

                    <span>
                        Pending
                    </span>

                    <h2>
                        {
                            returns.filter(
                                item =>
                                    item.status === "pending"
                            ).length
                        }
                    </h2>

                    <p>
                        Waiting for review
                    </p>

                </div>


                <div className="admin-stat">

                    <span>
                        Approved
                    </span>

                    <h2>
                        {
                            returns.filter(
                                item =>
                                    item.status === "approved"
                            ).length
                        }
                    </h2>

                    <p>
                        Approved returns
                    </p>

                </div>


                <div className="admin-stat">

                    <span>
                        Refunded
                    </span>

                    <h2>
                        {
                            returns.filter(
                                item =>
                                    item.status === "refunded"
                            ).length
                        }
                    </h2>

                    <p>
                        Completed refunds
                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* TOOLBAR */}
            {/* ================================= */}

            <div className="admin-card">

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
                        placeholder="Search return, order, customer or product..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        style={{
                            padding: "10px 14px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            minWidth: "300px"
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
                            setStatusFilter("refunded")
                        }
                    >
                        Refunded
                    </button>


                    <button
                        onClick={() =>
                            setStatusFilter("rejected")
                        }
                    >
                        Rejected
                    </button>

                </div>


                {/* ================================= */}
                {/* TABLE */}
                {/* ================================= */}

                {filteredReturns.length === 0 ? (

                    <div className="pending-message">

                        <h3>
                            No return requests found
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

                                    <th style={{ padding: "14px", textAlign: "left" }}>
                                        Return ID
                                    </th>

                                    <th style={{ padding: "14px", textAlign: "left" }}>
                                        Customer
                                    </th>

                                    <th style={{ padding: "14px", textAlign: "left" }}>
                                        Product
                                    </th>

                                    <th style={{ padding: "14px", textAlign: "left" }}>
                                        Amount
                                    </th>

                                    <th style={{ padding: "14px", textAlign: "left" }}>
                                        Reason
                                    </th>

                                    <th style={{ padding: "14px", textAlign: "left" }}>
                                        Status
                                    </th>

                                    <th style={{ padding: "14px", textAlign: "left" }}>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredReturns.map(
                                    (item) => {

                                        const status =
                                            item.status ||
                                            "pending";


                                        return (

                                            <tr
                                                key={item._id}
                                            >

                                                {/* RETURN ID */}

                                                <td style={{ padding: "14px" }}>

                                                    <strong>
                                                        #{item._id.slice(-8)}
                                                    </strong>

                                                </td>


                                                {/* CUSTOMER */}

                                                <td style={{ padding: "14px" }}>

                                                    <strong>
                                                        {
                                                            item.user?.name ||
                                                            "Unknown"
                                                        }
                                                    </strong>

                                                    <br />

                                                    <small>
                                                        {
                                                            item.user?.email ||
                                                            ""
                                                        }
                                                    </small>

                                                </td>


                                                {/* PRODUCT */}

                                                <td style={{ padding: "14px" }}>

                                                    {
                                                        item.product?.name ||
                                                        "Product"
                                                    }

                                                </td>


                                                {/* AMOUNT */}

                                                <td style={{ padding: "14px" }}>

                                                    <strong>
                                                        ₹{item.amount}
                                                    </strong>

                                                </td>


                                                {/* REASON */}

                                                <td style={{ padding: "14px" }}>

                                                    {
                                                        item.reason ||
                                                        "No reason"
                                                    }

                                                </td>


                                                {/* STATUS */}

                                                <td style={{ padding: "14px" }}>

                                                    <span
                                                        className={
                                                            `status ${
                                                                status === "approved"
                                                                    ? "approved"
                                                                    : status === "rejected"
                                                                        ? "rejected"
                                                                        : status === "refunded"
                                                                            ? "approved"
                                                                            : "processing"
                                                            }`
                                                        }
                                                    >
                                                        {status}
                                                    </span>

                                                </td>


                                                {/* ACTION */}

                                                <td style={{ padding: "14px" }}>

                                                    <button
                                                        onClick={() => {

                                                            setSelectedReturn(item);
                                                            setModal("view");

                                                        }}
                                                    >
                                                        View
                                                    </button>

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


            {/* ================================= */}
            {/* MODAL */}
            {/* ================================= */}

            {modal && selectedReturn && (

                <div className="modal-overlay">

                    <div className="modal">

                        <button
                            className="modal-close"
                            onClick={closeModal}
                        >
                            ×
                        </button>


                        {/* ========================= */}
                        {/* VIEW */}
                        {/* ========================= */}

                        {modal === "view" && (

                            <>

                                <h2>
                                    Return Request
                                </h2>


                                <div className="return-details">

                                    <div>

                                        <span>
                                            Return ID
                                        </span>

                                        <strong>
                                            #
                                            {selectedReturn._id.slice(-8)}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Customer
                                        </span>

                                        <strong>
                                            {
                                                selectedReturn.user?.name ||
                                                "Unknown"
                                            }
                                        </strong>

                                        <small>
                                            {
                                                selectedReturn.user?.email ||
                                                ""
                                            }
                                        </small>

                                    </div>


                                    <div>

                                        <span>
                                            Order
                                        </span>

                                        <strong>
                                            #
                                            {
                                                selectedReturn.order?._id?.slice(-8) ||
                                                "N/A"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Product
                                        </span>

                                        <strong>
                                            {
                                                selectedReturn.product?.name ||
                                                "Product"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Quantity
                                        </span>

                                        <strong>
                                            {
                                                selectedReturn.quantity ||
                                                1
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Amount
                                        </span>

                                        <strong>
                                            ₹{selectedReturn.amount}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Request Date
                                        </span>

                                        <strong>
                                            {
                                                selectedReturn.createdAt
                                                    ? new Date(
                                                        selectedReturn.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )
                                                    : "N/A"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Status
                                        </span>

                                        <strong>
                                            {
                                                selectedReturn.status
                                            }
                                        </strong>

                                    </div>

                                </div>


                                {/* REASON */}

                                <div className="return-reason-box">

                                    <h3>
                                        Return Reason
                                    </h3>

                                    <p>
                                        {
                                            selectedReturn.reason ||
                                            "No reason provided"
                                        }
                                    </p>

                                </div>


                                {/* REJECTION REASON */}

                                {selectedReturn.rejectionReason && (

                                    <div className="return-reason-box">

                                        <h3>
                                            Rejection Reason
                                        </h3>

                                        <p>
                                            {
                                                selectedReturn.rejectionReason
                                            }
                                        </p>

                                    </div>

                                )}


                                {/* REFUND STATUS */}

                                <div className="return-reason-box">

                                    <h3>
                                        Refund Status
                                    </h3>

                                    <p>
                                        {
                                            selectedReturn.refundStatus ||
                                            "not_started"
                                        }
                                    </p>

                                </div>


                                {/* ACTIONS */}

                                {selectedReturn.status === "pending" && (

                                    <div className="modal-actions">

                                        <button
                                            className="reject-btn"
                                            disabled={actionLoading}
                                            onClick={() =>
                                                setModal("reject")
                                            }
                                        >
                                            ✕ Reject
                                        </button>


                                        <button
                                            className="approve-btn"
                                            disabled={actionLoading}
                                            onClick={() =>
                                                setModal("approve")
                                            }
                                        >
                                            ✓ Approve Return
                                        </button>

                                    </div>

                                )}


                                {/* REFUND BUTTON */}

                                {selectedReturn.status === "approved" && (

                                    <div className="modal-actions">

                                        <button
                                            className="approve-btn"
                                            disabled={actionLoading}
                                            onClick={completeRefund}
                                        >
                                            ✓ Mark Refund Completed
                                        </button>

                                    </div>

                                )}

                            </>

                        )}


                        {/* ========================= */}
                        {/* APPROVE */}
                        {/* ========================= */}

                        {modal === "approve" && (

                            <>

                                <h2>
                                    Approve Return
                                </h2>


                                <p className="modal-message">

                                    Are you sure you want to approve
                                    this return request?

                                </p>


                                <div className="refund-amount">

                                    Return Amount

                                    <strong>
                                        ₹{selectedReturn.amount}
                                    </strong>

                                </div>


                                <div className="modal-actions">

                                    <button
                                        className="cancel-btn"
                                        disabled={actionLoading}
                                        onClick={() =>
                                            setModal("view")
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        className="approve-btn"
                                        disabled={actionLoading}
                                        onClick={approveReturn}
                                    >
                                        {
                                            actionLoading
                                                ? "Processing..."
                                                : "✓ Approve Return"
                                        }
                                    </button>

                                </div>

                            </>

                        )}


                        {/* ========================= */}
                        {/* REJECT */}
                        {/* ========================= */}

                        {modal === "reject" && (

                            <>

                                <h2>
                                    Reject Return
                                </h2>


                                <p className="modal-message">

                                    Enter a reason for rejecting
                                    this return request.

                                </p>


                                <textarea
                                    className="category-textarea"
                                    rows="5"
                                    placeholder="Enter rejection reason..."
                                    value={rejectReason}
                                    onChange={(e) =>
                                        setRejectReason(
                                            e.target.value
                                        )
                                    }
                                />


                                <div className="modal-actions">

                                    <button
                                        className="cancel-btn"
                                        disabled={actionLoading}
                                        onClick={() =>
                                            setModal("view")
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        className="reject-btn"
                                        disabled={actionLoading}
                                        onClick={rejectReturn}
                                    >
                                        {
                                            actionLoading
                                                ? "Processing..."
                                                : "✕ Reject Return"
                                        }
                                    </button>

                                </div>

                            </>

                        )}

                    </div>

                </div>

            )}

        </div>

    );
}

export default Returns;