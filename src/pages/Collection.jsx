import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosConfig";
import { Link } from "react-router-dom";
import { Loader2, Search, X } from "lucide-react";

// Default category fallback images
const categoryImages = {
  wigs: "/wig.jpg",
  bundles: "/bundles.jpg",
   
};

// Style filter options
const filterOptions = [
  "glueless",
  "yaki-kinky straight",
  "curly",
  "bob",
  "kimk closure",
  "bouncy",
  "frontal",
  "bonestraight",
  "straightwigs",
  "closure fringe",
];

const Collection = () => {
  const [collections, setCollections] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // 🧠 Fetch products from backend
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axiosInstance.get("/product/getAll");
        const products = response.data.data || [];

        // ✅ Group by category
        const grouped = products.reduce((acc, product) => {
          const category = product.category || "others";
          if (!acc[category]) acc[category] = [];
          acc[category].push(product);
          return acc;
        }, {});

        setCollections(grouped);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // 🔍 Filter + search logic
  const getFilteredProducts = () => {
    const allProducts = Object.values(collections).flat();
    return allProducts.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchFilter = selectedFilter
        ? product.texture?.toLowerCase() === selectedFilter.toLowerCase() ||
          product.name.toLowerCase().includes(selectedFilter.toLowerCase())
        : true;

      return matchSearch && matchFilter;
    });
  };

  const filteredProducts = getFilteredProducts();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-[#C5A572]" size={40} />
      </div>
    );
  }

  const categories = Object.keys(collections);
  const mainCategories = ["wigs", "bundles"];

  // 🧹 Clear filter function
  const clearFilter = () => {
    setSelectedFilter("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative h-[22rem] sm:h-[26rem] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/collection.jpg')",
        }}
      >
        <div className="text-center text-white px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-5xl font-bold mb-4"
          >
            Choose Your Style
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-2xl font-light"
          >
            Discover your perfect look from our luxury hair collection
          </motion.p>
        </div>
      </section>

      {/* Search + Filter Section */}
      <section className="py-8 px-4 md:px-12 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Box */}
            <div className="relative w-full md:max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for wigs or styles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A572] focus:border-transparent"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="w-full md:w-64 relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A572] focus:border-transparent bg-white"
              >
                <option value="">All Styles</option>
                {filterOptions.map((option) => (
                  <option key={option} value={option} className="capitalize">
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Indicator */}
          {(searchTerm || selectedFilter) && (
            <div className="flex justify-between items-center mt-6 bg-[#F9F5EF] p-3 rounded-lg border border-[#C5A572]/30">
              <div className="flex items-center gap-2 text-[#C5A572] font-medium">
                <span>Active Filter:</span>
                {searchTerm && (
                  <span className="bg-white border border-[#C5A572]/30 px-3 py-1 rounded-lg text-sm">
                    Search: “{searchTerm}”
                  </span>
                )}
                {selectedFilter && (
                  <span className="bg-white border border-[#C5A572]/30 px-3 py-1 rounded-lg text-sm capitalize">
                    Style: {selectedFilter}
                  </span>
                )}
              </div>

              <button
                onClick={clearFilter}
                className="flex items-center gap-1 text-gray-600 hover:text-red-600 text-sm"
              >
                <X size={16} /> Clear Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Collection Grid */}
      <section className="py-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          {(searchTerm || selectedFilter) ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
                Search Results
              </h2>
              {filteredProducts.length === 0 ? (
                <p className="text-center text-gray-500">No products found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={`${baseURL}${product.image}`}
                        alt={product.name}
                        className="h-64 w-full object-cover"
                      />
                      <div className="p-4 text-center">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">{product.texture}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
                Shop by Category
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {mainCategories.map((cat) => (
                  <motion.div
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-xl transition-all duration-300"
                  >
                    <Link to={`/collection/${cat}`}>
                      <div className="relative">
                        <img
                          src={categoryImages[cat]}
                          alt={cat}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <h3 className="text-white text-2xl font-semibold capitalize">
                            {cat}
                          </h3>
                        </div>
                      </div>
                      <div className="p-6 text-center">
                        <button className="mt-4 px-6 py-2 bg-[#C5A572] text-white rounded-lg hover:bg-[#b8945f] transition-colors duration-300">
                          Shop Now
                        </button>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Collection;
