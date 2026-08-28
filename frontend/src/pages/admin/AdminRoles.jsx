import { useState } from "react";

function AdminRoles() {
  const [admins, setAdmins] = useState([
    { id: 1, name: "Tannu", email: "admin@gmail.com", role: "Super Admin" },
    { id: 2, name: "Rahul", email: "rahul@gmail.com", role: "Product Manager" },
    { id: 3, name: "Priya", email: "priya@gmail.com", role: "Support" }
  ]);

  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Super Admin");

  const addAdmin = () => {
    if (!name || !email) {
      alert("Please fill all fields");
      return;
    }

    setAdmins([
      ...admins,
      {
        id: Date.now(),
        name,
        email,
        role
      }
    ]);

    setName("");
    setEmail("");
    setRole("Super Admin");
    setModal(false);
  };

  const deleteAdmin = (id) => {
    setAdmins(
      admins.filter((admin) => admin.id !== id)
    );
  };

  return (
    <div>

      <div className="admin-page-title">
        <div>
          <h1>Admin Roles</h1>
          <p>Manage admin accounts and permissions.</p>
        </div>

        <button
          className="add-category-btn"
          onClick={() => setModal(true)}
        >
          + Add Admin
        </button>
      </div>

      <div className="admin-roles-table">

        <div className="admin-roles-header">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Action</span>
        </div>

        {admins.map((admin) => (
          <div
            className="admin-roles-row"
            key={admin.id}
          >

            <strong>{admin.name}</strong>

            <span>{admin.email}</span>

            <span className="admin-role-badge">
              {admin.role}
            </span>

            <button
              className="delete-btn"
              onClick={() =>
                deleteAdmin(admin.id)
              }
            >
              Delete
            </button>

          </div>
        ))}

      </div>


      {modal && (

        <div className="modal-overlay">

          <div className="modal">

            <button
              className="modal-close"
              onClick={() => setModal(false)}
            >
              ×
            </button>

            <h2>Add Admin</h2>

            <label>Name</label>

            <input
              className="category-input"
              placeholder="Admin name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <label>Email</label>

            <input
              className="category-input"
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <label>Role</label>

            <select
              className="category-input"
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            >
              <option>Super Admin</option>
              <option>Product Manager</option>
              <option>Order Manager</option>
              <option>Support</option>
              <option>Finance Manager</option>
            </select>

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>

              <button
                className="approve-btn"
                onClick={addAdmin}
              >
                Create Admin
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminRoles;