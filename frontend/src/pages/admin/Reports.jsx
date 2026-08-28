import { useEffect, useState } from "react";

function Reports() {

    const [type, setType] = useState("Sales");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // =====================================
    // FETCH REPORT
    // =====================================

    const fetchReport = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {

                setError("Admin login required");

                return;
            }


            let url =
                `http://localhost:5000/api/admin/reports?type=${type}`;


            if (from) {
                url += `&from=${from}`;
            }


            if (to) {
                url += `&to=${to}`;
            }


            const response =
                await fetch(url, {

                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }

                });


            const data =
                await response.json();


            console.log(
                "ADMIN REPORT:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load report"
                );

            }


            if (data.success) {

                setReport(data.report);

            } else {

                throw new Error(
                    data.message ||
                    "Failed to load report"
                );

            }


        } catch (error) {

            console.error(
                "REPORT ERROR:",
                error
            );

            setError(
                error.message ||
                "Failed to load report"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================
    // DEFAULT REPORT
    // =====================================

    useEffect(() => {

        fetchReport();

    }, [type]);


    // =====================================
    // GENERATE
    // =====================================

    const generateReport = () => {

        fetchReport();

    };


    // =====================================
    // MONEY FORMAT
    // =====================================

    const formatMoney = (value) => {

        return `₹${Number(value || 0).toLocaleString("en-IN")}`;

    };


    // =====================================
    // REPORT CARDS
    // =====================================

    const getReportCards = () => {

        if (!report) {
            return [];
        }


        // SALES

        if (type === "Sales") {

            return [

                [
                    "Total Sales",
                    formatMoney(report.totalSales)
                ],

                [
                    "Orders",
                    report.totalOrders
                ],

                [
                    "Products Sold",
                    report.productsSold
                ],

                [
                    "Refunds",
                    "₹0"
                ]

            ];

        }


        // ORDERS

        if (type === "Orders") {

            return [

                [
                    "Total Orders",
                    report.totalOrders
                ],

                [
                    "Completed",
                    report.completed
                ],

                [
                    "Cancelled",
                    report.cancelled
                ],

                [
                    "Pending",
                    report.pending
                ]

            ];

        }


        // PRODUCTS

        if (type === "Products") {

            return [

                [
                    "Total Products",
                    report.totalProducts
                ],

                [
                    "Approved",
                    report.approved
                ],

                [
                    "Pending",
                    report.pending
                ],

                [
                    "Rejected",
                    report.rejected
                ]

            ];

        }


        // SELLERS

        if (type === "Sellers") {

            return [

                [
                    "Total Sellers",
                    report.totalSellers
                ],

                [
                    "Active Sellers",
                    report.activeSellers
                ],

                [
                    "Top Seller",
                    report.topSeller
                ],

                [
                    "Seller Revenue",
                    formatMoney(
                        report.sellerRevenue
                    )
                ]

            ];

        }


        return [];

    };


    // =====================================
    // ERROR
    // =====================================

    if (error) {

        return (

            <div>

                <div className="admin-page-title">

                    <div>

                        <h1>
                            Reports
                        </h1>

                        <p>
                            Generate and review
                            business reports.
                        </p>

                    </div>

                </div>


                <div className="report-box">

                    <h2>
                        Failed to load report
                    </h2>

                    <p>
                        {error}
                    </p>


                    <button
                        className="approve-btn"
                        onClick={fetchReport}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    // =====================================
    // PAGE
    // =====================================

    return (

        <div>

            {/* HEADER */}

            <div className="admin-page-title">

                <div>

                    <h1>
                        Reports
                    </h1>

                    <p>
                        Generate and review
                        business reports.
                    </p>

                </div>

            </div>


            {/* FILTER */}

            <div className="report-filter">

                <input
                    type="date"
                    value={from}
                    onChange={(e) =>
                        setFrom(e.target.value)
                    }
                />


                <input
                    type="date"
                    value={to}
                    onChange={(e) =>
                        setTo(e.target.value)
                    }
                />


                <select
                    value={type}
                    onChange={(e) =>
                        setType(e.target.value)
                    }
                >

                    <option value="Sales">
                        Sales
                    </option>

                    <option value="Orders">
                        Orders
                    </option>

                    <option value="Products">
                        Products
                    </option>

                    <option value="Sellers">
                        Sellers
                    </option>

                </select>


                <button
                    className="approve-btn"
                    onClick={generateReport}
                    disabled={loading}
                >

                    {loading
                        ? "Generating..."
                        : "Generate"}

                </button>

            </div>


            {/* REPORT BOX */}

            <div className="report-box">

                <div className="report-heading">

                    <div>

                        <h2>
                            {type} Report
                        </h2>

                        <p>
                            {from || "Start"}
                            {" → "}
                            {to || "Today"}
                        </p>

                    </div>


                    <button
                        className="secondary-btn"
                        onClick={() =>
                            alert(
                                "CSV export will be connected later"
                            )
                        }
                    >
                        Export CSV
                    </button>

                </div>


                {/* LOADING */}

                {loading ? (

                    <div className="pending-message">

                        <h3>
                            Generating report...
                        </h3>

                    </div>

                ) : (

                    <div className="report-grid">

                        {getReportCards().map(
                            ([label, value]) => (

                                <div
                                    className="report-card"
                                    key={label}
                                >

                                    <span>
                                        {label}
                                    </span>

                                    <strong>
                                        {value}
                                    </strong>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}

export default Reports;