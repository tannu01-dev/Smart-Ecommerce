import { useEffect, useState } from "react";
import API from "../../services/api";
import ProductCard from "../../components/ProductCard";

function  Home(){
    const [products,setProducts]=useState([])
    const [loading,setloading]=useState(true);

    const fetchProducts=async()=>{
        try{
            const response=await API.get("/user/products");
            setProducts(response.data.products);
        }catch(error){
            console.log(error);
            

        }finally{
            setloading(false)
        }
        
    }

    useEffect(()=>{
        fetchProducts();
    },[])

return (
    <div className="home">

      <section className="hero-section">
        <div>
          <p className="hero-small">
            SMART SHOPPING EXPERIENCE
          </p>

          <h1>
            Shop smarter.
            <br />
            Live better.
          </h1>

          <p>
            Discover products from trusted sellers
            and enjoy a seamless shopping experience.
          </p>

          <button>
            Shop Now
          </button>
        </div>
      </section>


      <section className="products-section">

        <div className="section-header">
          <div>
            <p>DISCOVER</p>
            <h2>Featured Products</h2>
          </div>

          <button>View All</button>
        </div>


        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

      </section>

    </div>
  );
}

export default Home;