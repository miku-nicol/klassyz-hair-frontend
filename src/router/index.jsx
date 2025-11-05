import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Collection from "../pages/Collection";
import CategoryCollection from "../pages/CategoryCollection";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import OrderSuccess from "../pages/OrderSuccess";
import Accessories from "../pages/Accessories";




const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            { path: "/", element: <Home/>},
            { path: "/collection", element: <Collection/>},
            { path: "/collection/:category", element: <CategoryCollection/>},
             { path: "/accessories", element: <Accessories/>},
            { path: "/cart", element: <CartPage/>},
            { path: "/checkout", element: <CheckoutPage/>},
            { path: "/payment-success", element: <PaymentSuccess/>},
            { path: "/order-success/:orderId", element: <OrderSuccess/>},
           
            

       { path: "/login", element: <Login/> },
    
        {path: "/signup", element: <Signup/> },

        ],
    },

    
    
]);


export default router;