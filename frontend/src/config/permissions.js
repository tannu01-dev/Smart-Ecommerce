const permissions = {
  "Super Admin": [
    "dashboard",
    "products",
    "categories",
    "users",
    "orders",
    "returns",
    "coupons",
    "analytics",
    "reports",
    "notifications",
    "roles"
  ],

  "Product Manager": [
    "dashboard",
    "products",
    "categories"
  ],

  "Order Manager": [
    "dashboard",
    "orders",
    "returns"
  ],

  "Support": [
    "dashboard",
    "users",
    "notifications"
  ],

  "Finance Manager": [
    "dashboard",
    "refunds",
    "analytics",
    "reports"
  ]
};

export default permissions;