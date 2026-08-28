import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageError, setImageError] = useState(false);

  // =====================================
  // FETCH CATEGORIES
  // =====================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Login required. Please login again.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("CATEGORIES:", response.data);

        if (response.data.success) {
          setCategories(response.data.categories || []);
        } else {
          setError(
            response.data.message ||
              "Failed to load categories"
          );
        }
      } catch (err) {
        console.error(
          "FETCH CATEGORIES ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load categories"
        );
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "image") {
      setImageError(false);
    }
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.category ||
      formData.stock === ""
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Login required. Please login again."
        );
        return;
      }

      const productData = {
        name: formData.name.trim(),

        description:
          formData.description.trim(),

        price: Number(formData.price),

        // IMPORTANT:
        // category yahan MongoDB ObjectId hai
        category: formData.category,

        stock: Number(formData.stock),

        // IMPORTANT:
        // Product model me images array hai
        images: formData.image.trim()
          ? [formData.image.trim()]
          : [],
      };

      console.log(
        "SENDING PRODUCT:",
        productData
      );

      const response = await axios.post(
        "http://localhost:5000/api/seller/products",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "PRODUCT ADDED:",
        response.data
      );

      if (response.data.success) {
        setSuccess(
          response.data.message ||
            "Product added successfully!"
        );

        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          image: "",
        });

        setImageError(false);

        setTimeout(() => {
          navigate("/seller/products");
        }, 1500);
      } else {
        setError(
          response.data.message ||
            "Failed to add product"
        );
      }
    } catch (err) {
      console.error(
        "ADD PRODUCT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="add-product-page">

      <div className="page-title">
        <div>
          <h1>Add Product</h1>

          <p>
            Add a new product to your store.
          </p>
        </div>
      </div>


      <div className="add-product-card">

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          {/* PRODUCT NAME */}

          <div className="form-group">

            <label>
              Product Name *
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description *
            </label>

            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />

          </div>


          {/* PRICE + STOCK */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Price *
              </label>

              <input
                type="number"
                name="price"
                placeholder="Enter price"
                min="0"
                value={formData.price}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                placeholder="Enter stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* CATEGORY */}

          <div className="form-group">

            <label>
              Category *
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={categoryLoading}
            >

              <option value="">
                {categoryLoading
                  ? "Loading categories..."
                  : "Select Category"}
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}

            </select>

          </div>


          {/* IMAGE URL */}

          <div className="form-group">

            <label>
              Product Image URL
            </label>

            <input
              type="url"
              name="image"
              placeholder="https://example.com/product.jpg"
              value={formData.image}
              onChange={handleChange}
            />

            <small>
              Paste a direct image URL.
            </small>

          </div>


          {/* IMAGE PREVIEW */}

          {formData.image.trim() &&
            !imageError && (

              <div
                className="image-preview"
                style={{
                  marginTop: "15px",
                  marginBottom: "20px",
                }}
              >

                <p
                  style={{
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Image Preview
                </p>


                <img
                  src={formData.image.trim()}
                  alt={
                    formData.name ||
                    "Product Preview"
                  }
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "8px",
                    background: "#fff",
                  }}
                  onLoad={() =>
                    setImageError(false)
                  }
                  onError={() =>
                    setImageError(true)
                  }
                />

              </div>
            )}


          {/* IMAGE ERROR */}

          {formData.image.trim() &&
            imageError && (

              <div
                style={{
                  marginTop: "10px",
                  marginBottom: "20px",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#fff1f1",
                  color: "#d00",
                }}
              >
                Image URL is invalid or the
                image cannot be loaded.
              </div>

            )}


          {/* BUTTONS */}

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/seller/products")
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="submit-btn"
              disabled={
                loading ||
                categoryLoading
              }
            >
              {loading
                ? "Adding Product..."
                : "Add Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddProduct;

