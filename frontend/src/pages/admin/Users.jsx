import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/dashboard.css";

function Users() {

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);


  // =====================================
  // FETCH USERS
  // =====================================

  const fetchUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin.");
        return;
      }


      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      console.log(
        "ADMIN USERS:",
        response.data
      );


      if (response.data.success) {

        setUsers(
          response.data.users || []
        );

      } else {

        setError(
          response.data.message ||
          "Failed to load users"
        );

      }

    } catch (error) {

      console.error(
        "USERS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load users"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchUsers();

  }, []);


  // =====================================
  // BLOCK / UNBLOCK
  // =====================================

  const toggleBlock = async (user) => {

    try {

      setActionId(user._id);

      const token = localStorage.getItem("token");


      const url = user.isBlocked
        ? `http://localhost:5000/api/admin/users/${user._id}/unblock`
        : `http://localhost:5000/api/admin/users/${user._id}/block`;


      const response = await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (response.data.success) {

        setUsers((prev) =>
          prev.map((item) =>
            item._id === user._id
              ? {
                  ...item,
                  isBlocked:
                    response.data.user.isBlocked
                }
              : item
          )
        );

      }

    } catch (error) {

      console.error(
        "BLOCK/UNBLOCK ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Action failed"
      );

    } finally {

      setActionId(null);

    }
  };


  // =====================================
  // DELETE USER
  // =====================================

  const deleteUser = async (user) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );


    if (!confirmDelete) {
      return;
    }


    try {

      setActionId(user._id);

      const token = localStorage.getItem("token");


      const response = await axios.delete(
        `http://localhost:5000/api/admin/users/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (response.data.success) {

        setUsers((prev) =>
          prev.filter(
            (item) =>
              item._id !== user._id
          )
        );

      }

    } catch (error) {

      console.error(
        "DELETE USER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete user"
      );

    } finally {

      setActionId(null);

    }
  };

  const filteredUsers = users.filter(
    (user) => {

      const matchesFilter =
        filter === "all" ||
        user.role === filter;


      const searchText =
        search.toLowerCase();


      const matchesSearch =
        user.name
          ?.toLowerCase()
          .includes(searchText) ||

        user.email
          ?.toLowerCase()
          .includes(searchText);


      return (
        matchesFilter &&
        matchesSearch
      );

    }
  );

  const totalUsers = users.filter(
    (user) =>
      user.role === "user"
  ).length;


  const totalSellers = users.filter(
    (user) =>
      user.role === "seller"
  ).length;


  const blockedUsers = users.filter(
    (user) =>
      user.isBlocked === true
  ).length;

  if (loading) {

    return (
      <div className="admin-card">

        <h2>
          Loading users...
        </h2>

      </div>
    );

  }

  if (error) {

    return (
      <div className="admin-card">

        <h2>
          Failed to load users
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={fetchUsers}
        >
          Try Again
        </button>

      </div>
    );

  }

  return (

    <div>

      <div className="admin-page-title">

        <div>

          <h1>
            Users
          </h1>

          <p>
            Manage users and sellers on your platform.
          </p>

        </div>


        <button
          onClick={fetchUsers}
        >
          Refresh
        </button>

      </div>


      <div className="admin-stats">


        <div className="admin-stat">

          <span>
            Total Users
          </span>

          <h2>
            {totalUsers}
          </h2>

          <p>
            Customers
          </p>

        </div>


        <div className="admin-stat">

          <span>
            Total Sellers
          </span>

          <h2>
            {totalSellers}
          </h2>

          <p>
            Store owners
          </p>

        </div>


        <div className="admin-stat">

          <span>
            Total Accounts
          </span>

          <h2>
            {users.length}
          </h2>

          <p>
            Users + Sellers
          </p>

        </div>


        <div className="admin-stat">

          <span>
            Blocked
          </span>

          <h2>
            {blockedUsers}
          </h2>

          <p>
            Blocked accounts
          </p>

        </div>

      </div>

      <div className="admin-card">


        {/* HEADER */}

        <div className="admin-card-header">

          <div>

            <h3>
              User Management
            </h3>

            <p>
              View and manage all registered accounts.
            </p>

          </div>

        </div>

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
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              padding: "10px 14px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              minWidth: "250px"
            }}
          />


          <button
            onClick={() =>
              setFilter("all")
            }
          >
            All
          </button>


          <button
            onClick={() =>
              setFilter("user")
            }
          >
            Users
          </button>


          <button
            onClick={() =>
              setFilter("seller")
            }
          >
            Sellers
          </button>

        </div>

        {filteredUsers.length === 0 ? (

          <div className="pending-message">

            <h3>
              No users found
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
                    User
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "14px"
                    }}
                  >
                    Email
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "14px"
                    }}
                  >
                    Role
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
                    Joined
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "14px"
                    }}
                  >
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredUsers.map(
                  (user) => (

                    <tr
                      key={user._id}
                    >

                      {/* USER */}

                      <td
                        style={{
                          padding: "14px"
                        }}
                      >

                        <strong>
                          {user.name}
                        </strong>

                      </td>


                      {/* EMAIL */}

                      <td
                        style={{
                          padding: "14px"
                        }}
                      >

                        {user.email}

                      </td>


                      {/* ROLE */}

                      <td
                        style={{
                          padding: "14px"
                        }}
                      >

                        <span
                          className={
                            user.role === "seller"
                              ? "status approved"
                              : "status processing"
                          }
                        >

                          {user.role}

                        </span>

                      </td>


                      {/* STATUS */}

                      <td
                        style={{
                          padding: "14px"
                        }}
                      >

                        {user.isBlocked ? (

                          <span className="status rejected">
                            Blocked
                          </span>

                        ) : (

                          <span className="status approved">
                            Active
                          </span>

                        )}

                      </td>


                      {/* DATE */}

                      <td
                        style={{
                          padding: "14px"
                        }}
                      >

                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}

                      </td>


                      {/* ACTIONS */}

                      <td
                        style={{
                          padding: "14px"
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap"
                          }}
                        >

                          <button
                            disabled={
                              actionId ===
                              user._id
                            }
                            onClick={() =>
                              toggleBlock(user)
                            }
                          >

                            {actionId ===
                            user._id
                              ? "..."
                              : user.isBlocked
                                ? "Unblock"
                                : "Block"}

                          </button>


                          <button
                            disabled={
                              actionId ===
                              user._id
                            }
                            onClick={() =>
                              deleteUser(user)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Users;