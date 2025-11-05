import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newletter from '../components/Newletter';


function MainLayout() {
  return (
    <div>
        <Navbar/>

        <main>
            <Outlet/>
        </main>
        
        <Footer/>
        <Newletter/>

    </div>
  );
};

export default MainLayout; 