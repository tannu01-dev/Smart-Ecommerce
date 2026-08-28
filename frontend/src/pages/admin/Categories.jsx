import React, { useEffect, useState } from "react";
import axios from "axios";

function Categories() {

  const [categories, setCategories] = useState([]);

  const [modal, setModal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("CATEGORIES:", response.data);

      if (response.data.success) {

        setCategories(
          response.data.categories || []
        );

      } else {

        setError(
          response.data.message ||
          "Failed to load categories"
        );

      }

    } catch (error) {

      console.error(
        "GET CATEGORIES ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load categories"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchCategories();

  }, []);

  const openAddModal = () => {

    setName("");
    setDescription("");

    setSelectedCategory(null);

    setModal("add");

  };


  const openEditModal = (category) => {

    setSelectedCategory(category);

    setName(category.name || "");
    setDescription(category.description || "");

    setModal("edit");

  };

  const addCategory = async () => {

    if (!name.trim()) {

      alert("Please enter category name");

      return;
    }

    try {

      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/admin/categories",
        {
          name: name.trim(),
          description: description.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "CREATE CATEGORY:",
        response.data
      );

      if (response.data.success) {

        alert("Category created successfully");

        setCategories((prev) => [
          response.data.category,
          ...prev
        ]);

        setModal(null);

        setName("");
        setDescription("");

      } else {

        alert(
          response.data.message ||
          "Failed to create category"
        );

      }

    } catch (error) {

      console.error(
        "CREATE CATEGORY ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to create category"
      );

    } finally {

      setSaving(false);

    }
  };

  const updateCategory = async () => {

    if (!name.trim()) {

      alert("Please enter category name");

      return;
    }

    if (!selectedCategory) {
      return;
    }

    try {

      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/admin/categories/${selectedCategory._id}`,
        {
          name: name.trim(),
          description: description.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "UPDATE CATEGORY:",
        response.data
      );

      if (response.data.success) {

        alert("Category updated successfully");

        setCategories((prev) =>
          prev.map((category) =>
            category._id === selectedCategory._id
              ? response.data.category
              : category
          )
        );

        setModal(null);

        setSelectedCategory(null);

        setName("");
        setDescription("");

      } else {

        alert(
          response.data.message ||
          "Failed to update category"
        );

      }

    } catch (error) {

      console.error(
        "UPDATE CATEGORY ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update category"
      );

    } finally {

      setSaving(false);

    }
  };


  const deleteCategory = async () => {

    if (!selectedCategory) {
      return;
    }

    try {

      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/admin/categories/${selectedCategory._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "DELETE CATEGORY:",
        response.data
      );

      if (response.data.success) {

        alert("Category deleted successfully");

        setCategories((prev) =>
          prev.filter(
            (category) =>
              category._id !== selectedCategory._id
          )
        );

        setModal(null);

        setSelectedCategory(null);

      } else {

        alert(
          response.data.message ||
          "Failed to delete category"
        );

      }

    } catch (error) {

      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete category"
      );

    } finally {

      setSaving(false);

    }
  };

  const closeModal = () => {

    if (saving) {
      return;
    }

    setModal(null);

    setSelectedCategory(null);

    setName("");
    setDescription("");

  };


  if (loading) {

    return (

      <div className="admin-card">

        <h2>
          Loading categories...
        </h2>

      </div>

    );

  }

  if (error) {

    return (

      <div className="admin-card">

        <h2>
          Failed to load categories
        </h2>

        <p>
          {error}
        </p>

        <button onClick={fetchCategories}>
          Try Again
        </button>

      </div>

    );

  }


  // =====================================
  // UI
  // =====================================

  return (

    <div>

      <div className="admin-page-title">

        <div>

          <h1>
            Categories
          </h1>

          <p>
            Create and manage product categories.
          </p>

        </div>


        <button
          className="add-category-btn"
          onClick={openAddModal}
        >
          + Add Category
        </button>

      </div>


      <div className="categories-table">

        <div className="categories-table-header">

          <span>
            Category
          </span>

          <span>
            Description
          </span>

          <span>
            Created
          </span>

          <span>
            Status
          </span>

          <span>
            Action
          </span>

        </div>


        {categories.length === 0 ? (

          <div className="pending-message">

            <h3>
              No Categories Found
            </h3>

            <p>
              Create your first product category.
            </p>

          </div>

        ) : (

          categories.map((category) => (

            <div
              className="categories-table-row"
              key={category._id}
            >

              {/* CATEGORY */}

              <strong>
                {category.name}
              </strong>


              {/* DESCRIPTION */}

              <span className="category-description">

                {category.description ||
                  "No description"}

              </span>


              {/* CREATED */}

              <span>

                {category.createdAt
                  ? new Date(
                      category.createdAt
                    ).toLocaleDateString("en-IN")
                  : "N/A"}

              </span>


              {/* STATUS */}

              <span
                className={
                  category.isActive
                    ? "category-status"
                    : "category-status inactive"
                }
              >

                {category.isActive
                  ? "Active"
                  : "Inactive"}

              </span>


              {/* ACTIONS */}

              <div className="category-actions">

                <button
                  className="edit-btn"
                  onClick={() =>
                    openEditModal(category)
                  }
                >
                  Edit
                </button>


                <button
                  className="delete-btn"
                  onClick={() => {

                    setSelectedCategory(category);

                    setModal("delete");

                  }}
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>

      {modal && (

        <div className="modal-overlay">

          <div className="modal">

            {/* CLOSE */}

            <button
              className="modal-close"
              onClick={closeModal}
              disabled={saving}
            >
              ×
            </button>

            {modal === "add" && (

              <>

                <h2>
                  Add New Category
                </h2>


                <label>
                  Category Name
                </label>

                <input
                  className="category-input"
                  type="text"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  disabled={saving}
                />


                <label>
                  Description
                </label>

                <textarea
                  className="category-textarea"
                  placeholder="Enter category description"
                  rows="4"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  disabled={saving}
                />


                <div className="modal-actions">

                  <button
                    className="cancel-btn"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>


                  <button
                    className="approve-btn"
                    onClick={addCategory}
                    disabled={saving}
                  >
                    {saving
                      ? "Adding..."
                      : "+ Add Category"}
                  </button>

                </div>

              </>

            )}

            {modal === "edit" && (

              <>

                <h2>
                  Edit Category
                </h2>


                <label>
                  Category Name
                </label>

                <input
                  className="category-input"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  disabled={saving}
                />


                <label>
                  Description
                </label>

                <textarea
                  className="category-textarea"
                  rows="4"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  disabled={saving}
                />


                <div className="modal-actions">

                  <button
                    className="cancel-btn"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>


                  <button
                    className="approve-btn"
                    onClick={updateCategory}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              </>

            )}


            {modal === "delete" && (

              <>

                <h2>
                  Delete Category
                </h2>


                <p className="modal-message">

                  Are you sure you want to delete

                  <strong>
                    {" "}
                    {selectedCategory?.name}
                  </strong>
                  ?

                </p>


                <p className="warning-text">

                  Products using this category may
                  need to be reassigned.

                </p>


                <div className="modal-actions">

                  <button
                    className="cancel-btn"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>


                  <button
                    className="delete-confirm-btn"
                    onClick={deleteCategory}
                    disabled={saving}
                  >
                    {saving
                      ? "Deleting..."
                      : "Delete Category"}
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

export default Categories;