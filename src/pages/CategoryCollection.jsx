import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { Loader2, ArrowLeft, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import AddToCartButton from "../components/AddToCart";

const CategoryCollection = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axiosInstance.get("/product/getAll");
        const allProducts = response.data.data || [];
        const filtered = allProducts.filter(
          (product) => product.category === category
        );
        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching category products:", error);
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [category]);


  
 

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100   ">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#C5A572] mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-medium">
            Loading {category} collection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-16 relative ">
      {/* Back Button (fixed but small) */}
      <div className="fixed top-15 left-6 z-40 bg-white/70 backdrop-blur-md p-2 rounded-full shadow-md  ">
        <Link
          to="/collection"
          className="flex items-center gap-2 text-gray-700 hover:text-[#C5A572] transition-colors duration-300 font-medium"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500 mb-6">
                Sorry, there are no products available in the {category} category at the moment.
              </p>
              <Link
                to="/collection"
                className="inline-flex items-center gap-2 bg-[#C5A572] hover:bg-[#b8945f] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                <ArrowLeft size={18} />
                Back to Collection
              </Link>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4"
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="overflow-hidden transition-all duration-500 ease-in-out group hover:bg-white hover:rounded-3xl hover:shadow-2xl hover:border hover:border-gray-200"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={
                      product.image
                        ? `${baseURL}${product.image}`
                        : "/placeholder.jpg"
                    }
                    alt={product.name}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#C5A572] text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-5">
                  <h3 className="ffont-semibold text-gray-800 text-base sm:text-lg lg:text-xl mb-2 line-clamp-2 sm:line-clamp-3 leading-tight sm:leading-snug">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    {product.length && (
                      <span className=" bg-gray-100 px-2 py-1 rounded ">
                       <span className="hidden sm:inline-flex">Length:</span> "{product.length}"
                      </span>
                    )}
                    {product.color && (
                      <span className="bg-gray-100 px-2 py-1 rounded capitalize">
                        {product.color}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-lg font-bold text-[#C5A572] sm:text-xl md:text-xl">
                        ₦{product.price.toLocaleString()}
                      </p>
                    </div>
                    <button className="p-1 sm:p-2 lg:p-1.5"> 
                      <AddToCartButton product={product}/>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryCollection;
