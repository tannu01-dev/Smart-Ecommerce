import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";

function Products() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================
  // FETCH SELLER PRODUCTS
  // =====================================

  const fetchProducts = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }


      const response = await API.get(
        "/seller/products",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (response.data.success) {

        setProducts(
          response.data.products || []
        );

      }

    } catch (error) {

      console.log(
        "SELLER PRODUCTS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load products"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchProducts();

  }, []);


  // =====================================
  // DELETE PRODUCT
  // =====================================

  const deleteProduct = async (productId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }


    try {

      const token = localStorage.getItem("token");


      const response = await API.delete(
        `/seller/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (response.data.success) {

        alert("Product deleted successfully");

        setProducts((prevProducts) =>
          prevProducts.filter(
            (product) =>
              product._id !== productId
          )
        );

      }

    } catch (error) {

      console.log(
        "DELETE PRODUCT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete product"
      );

    }

  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div>
        <h2>Loading products...</h2>
      </div>
    );

  }


  // =====================================
  // ERROR
  // =====================================

  if (error) {

    return (
      <div>

        <h2>{error}</h2>

        <button onClick={fetchProducts}>
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


      {/* HEADER */}

      <div className="page-title">

        <div>

          <h1>
            My Products
          </h1>

          <p>
            Manage all your products.
          </p>

        </div>


        <button
          className="add-product-btn"
          onClick={() =>
            navigate("/seller/add-product")
          }
        >
          + Add Product
        </button>

      </div>



      {/* EMPTY */}

      {products.length === 0 ? (

        <div className="product-table">

          <div
            style={{
              padding: "40px",
              textAlign: "center"
            }}
          >

            <h2>
              No Products Yet
            </h2>

            <p>
              Add your first product to start selling.
            </p>

            <button
              className="add-product-btn"
              onClick={() =>
                navigate("/seller/add-product")
              }
            >
              + Add Product
            </button>

          </div>

        </div>

      ) : (


        /* PRODUCT TABLE */

        <div className="product-table">


          {/* TABLE HEADER */}

          <div className="table-header">

            <span>
              Product
            </span>

            <span>
              Price
            </span>

            <span>
              Stock
            </span>

            <span>
              Status
            </span>

            <span>
              Action
            </span>

          </div>



          {/* PRODUCTS */}

          {products.map((product) => {

            const status =
              product.status || "pending";


            return (

              <div
                className="table-row"
                key={product._id}
              >


                {/* PRODUCT */}

                <strong>
                  {product.name}
                </strong>


                {/* PRICE */}

                <span>
                  ₹{product.price}
                </span>


                {/* STOCK */}

                <span>
                  {product.stock}
                </span>


                {/* STATUS */}

                <span
                  className={`status ${status}`}
                >
                  {status}
                </span>


                {/* ACTIONS */}

                <div className="actions">


                  {/* VIEW */}

                  <button
                    onClick={() =>
                      alert(
                        `Product: ${product.name}\nPrice: ₹${product.price}\nStock: ${product.stock}\nStatus: ${product.status}`
                      )
                    }
                  >
                    View
                  </button>


                  {/* EDIT */}

                  <button
                    onClick={() =>
                      navigate(
                        `/seller/edit-product/${product._id}`
                      )
                    }
                  >
                    Edit
                  </button>


                  {/* DELETE */}

                  <button
                    onClick={() =>
                      deleteProduct(product._id)
                    }
                  >
                    Delete
                  </button>


                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>

  );

}

export default Products;