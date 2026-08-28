const permissions = {
    super_admin: ["*"],

    product_manager: [
        "products",
        "categories"
    ],

    order_manager: [
        "orders",
        "returns"
    ],

    support: [
        "users",
        "notifications"
    ],

    finance: [
        "refunds",
        "analytics",
        "reports"
    ]
};

module.exports = permissions;