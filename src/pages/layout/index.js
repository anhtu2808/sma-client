import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';

const Layout = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans antialiased selection:bg-primary selection:text-white transition-colors duration-300 min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            
            <Link 
                to="/ui-kit" 
                className="fixed bottom-2 right-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full opacity-20 hover:opacity-100 transition-opacity z-[100]"
                title="UI Kit"
            >
                <span className="material-icons-round text-xs">palette</span>
            </Link>
        </div>
    );
};

export default Layout;
