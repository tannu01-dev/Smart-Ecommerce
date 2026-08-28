import { useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "New Order",
      message: "Tannu placed a new order #ORD-1021",
      time: "5 min ago",
      read: false
    },
    {
      id: 2,
      type: "product",
      title: "Product Submitted",
      message: 'Tech World submitted "Smart Watch" for approval.',
      time: "20 min ago",
      read: false
    },
    {
      id: 3,
      type: "return",
      title: "Return Request",
      message: "Rahul requested a return for Order #ORD-1015.",
      time: "1 hour ago",
      read: true
    },
    {
      id: 4,
      type: "report",
      title: "Product Report",
      message: "A customer reported a product.",
      time: "2 hours ago",
      read: true
    }
  ]);

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, read: true }
          : item
      )
    );
  };

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <div>
      <div className="admin-page-title">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with platform activity.</p>
        </div>

        {unreadCount > 0 && (
          <button
            className="secondary-btn"
            onClick={markAllRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="notification-summary">
        <strong>{unreadCount}</strong>
        <span>Unread Notifications</span>
      </div>

      <div className="notification-list">
        {notifications.map((item) => (
          <div
            className={`notification-item ${
              !item.read ? "unread" : ""
            }`}
            key={item.id}
          >
            <div className={`notification-icon ${item.type}`}>
              {item.type === "order" && "🛒"}
              {item.type === "product" && "📦"}
              {item.type === "return" && "↩️"}
              {item.type === "report" && "⚠️"}
            </div>

            <div className="notification-content">
              <strong>{item.title}</strong>
              <p>{item.message}</p>
              <small>{item.time}</small>
            </div>

            <div className="notification-actions">
              {!item.read && (
                <button
                  className="view-btn"
                  onClick={() => markRead(item.id)}
                >
                  Mark Read
                </button>
              )}

              <button
                className="delete-btn"
                onClick={() =>
                  deleteNotification(item.id)
                }
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="no-notifications">
            No notifications
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;