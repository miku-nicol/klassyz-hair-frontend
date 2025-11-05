import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import AddToCartButton from "../components/AddToCart";

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await axiosInstance.get("/product/getAll?category=accessories");
        const products = response.data.data || [];

        const accessoriesOnly = products.filter(
          (item) => item.category?.toLowerCase() === "accessories"
        );

        setAccessories(accessoriesOnly);
      } catch (error) {
        console.error("Error fetching accessories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccessories();
  }, []);

  // ------------------ Loading Skeleton --------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-52 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-80 mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="h-72 bg-gray-200 rounded-2xl"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ------------------ MAIN UI --------------------

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* ================= HERO SECTION ================= */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-center text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium Hair Accessories
          </h1>
          <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto">
            Explore elegant hair accessories crafted to elevate your everyday look 
            and enhance your natural beauty.
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* -------- Filter Buttons -------- */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {["all", "clips", "headbands", "scrunchies", "pins", "other"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium capitalize transition-all duration-300 
                ${
                  selectedCategory === category
                    ? "bg-[#C5A572] text-white shadow-md scale-105"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-[#C5A572] hover:text-[#C5A572]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* --------- No Items --------- */}
        {accessories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-300 text-7xl mb-6">✨</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Accessories Available
            </h3>
            <p className="text-gray-600">
              New items will be added soon. Check back later 💖
            </p>
          </div>
        ) : (
          
          /* ---------- PRODUCT GRID ---------- */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 ">
            {accessories.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative bg-gray-100 overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`}
                    alt={item.name}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {item.name}
                  </h3>

                  {/* ✅ DESCRIPTION SHOWN */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>

                  <p className="text-2xl font-bold text-[#C5A572] mb-5">
                    ₦{item.price.toLocaleString()}
                  </p>

                  {/* Add to Cart */}
                  <button>
                     <AddToCartButton product={item} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accessories;
