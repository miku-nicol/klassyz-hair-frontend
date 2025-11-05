import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../assets/Logo.png";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { cartCount } = useCart();

  // ✅ Track login state live
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // ✅ Hide navbar on scroll down
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // ✅ Sync login state automatically when token changes
  useEffect(() => {
    const updateAuthStatus = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    // Runs whenever login or logout happens
    window.addEventListener("storage", updateAuthStatus);

    return () => window.removeEventListener("storage", updateAuthStatus);
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken");

    // trigger navbar update immediately
    window.dispatchEvent(new Event("storage"));

    window.location.href = "/";
  };

  return (
    <motion.nav
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: showNavbar ? 0 : -80, opacity: showNavbar ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="bg-[#111] shadow-md py-3 fixed top-0 left-0 w-full z-50 backdrop-blur-md transition-all duration-300"
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="h-14 w-auto" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-white font-medium">
          {[
            { path: "/", label: "Home" },
            { path: "/collection", label: "Collection" },
            { path: "/accessories", label: "Accessories" },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-600 font-semibold border-b-2 border-yellow-600 pb-1"
                  : "hover:text-yellow-600 transition duration-200"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-6">
          
          {/* Cart icon */}
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl text-white hover:text-yellow-600 transition duration-200" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs font-semibold rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ✅ Auth area */}
          <div className="hidden md:flex space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-yellow-600 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className=" text-white px-4  rounded-md hover:text-yellow-700 transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white text-2xl focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg border-t border-gray-200"
          >
            <div className="flex flex-col items-center space-y-4 py-4">
              
              {/* Mobile Links */}
              {[
                { path: "/", label: "Home" },
                { path: "/collection", label: "Collection" },
                { path: "/accessories", label: "Accessories" },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-600 font-semibold"
                      : "text-gray-700 hover:text-yellow-600"
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              {/* ✅ Auth Mobile */}
              <div className="flex flex-col space-y-3 pt-3">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="text-gray-800 hover:text-yellow-600"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
