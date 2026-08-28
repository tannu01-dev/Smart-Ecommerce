import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../../services/api";
import "../../styles/Edit.css"


function EditProduct() {

  const { id } = useParams();

  const navigate = useNavigate();


  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: []
  });


  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");


  // =====================================
  // GET PRODUCT
  // =====================================

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const token =
          localStorage.getItem("token");


        const response = await API.get(
          "/seller/products",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


        const product =
          response.data.products.find(
            (item) =>
              item._id === id
          );


        if (!product) {

          setError(
            "Product not found"
          );

          return;

        }


        setForm({

          name: product.name || "",

          description:
            product.description || "",

          price:
            product.price || "",

          category:
            product.category || "",

          stock:
            product.stock || 0,

          images:
            product.images || []

        });


      } catch (error) {

        console.log(
          "GET PRODUCT ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load product"
        );

      } finally {

        setLoading(false);

      }

    };


    fetchProduct();

  }, [id]);


  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  };


  // =====================================
  // UPDATE PRODUCT
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSaving(true);

    setError("");


    try {

      const token =
        localStorage.getItem("token");


      const response =
        await API.put(

          `/seller/products/${id}`,

          {

            name: form.name,

            description:
              form.description,

            price:
              Number(form.price),

            category:
              form.category,

            stock:
              Number(form.stock),

            images:
              form.images

          },

          {
            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );


      if (response.data.success) {

        alert(
          "Product updated successfully. It has been sent for admin approval."
        );


        navigate(
          "/seller/products"
        );

      }

    } catch (error) {

      console.log(
        "UPDATE PRODUCT ERROR:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Failed to update product"
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div>

        <h2>
          Loading product...
        </h2>

      </div>

    );

  }


  // =====================================
  // ERROR
  // =====================================

  if (error && !form.name) {

    return (

      <div>

        <h2>
          {error}
        </h2>

        <button
          onClick={() =>
            navigate(
              "/seller/products"
            )
          }
        >
          Back to Products
        </button>

      </div>

    );

  }


  // =====================================
  // FORM
  // =====================================

  return (

    <div>

      <div className="page-title">

        <div>

          <h1>
            Edit Product
          </h1>

          <p>
            Update your product details.
          </p>

        </div>

      </div>


      {error && (

        <div className="login-error">

          {error}

        </div>

      )}


      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "700px"
        }}
      >


        {/* NAME */}

        <div>

          <label>
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

        </div>



        {/* DESCRIPTION */}

        <div>

          <label>
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            required
          />

        </div>



        {/* PRICE */}

        <div>

          <label>
            Price
          </label>

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min="0"
            required
          />

        </div>



        {/* CATEGORY */}

        <div>

          <label>
            Category
          </label>

          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />

        </div>



        {/* STOCK */}

        <div>

          <label>
            Stock
          </label>

          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            min="0"
            required
          />

        </div>



        {/* BUTTONS */}

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px"
          }}
        >

          <button
            type="button"
            onClick={() =>
              navigate(
                "/seller/products"
              )
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            disabled={saving}
          >

            {saving
              ? "Updating..."
              : "Update Product"}

          </button>

        </div>


      </form>

    </div>

  );

}

export default EditProduct;