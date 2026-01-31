import Logo from '@/components/Logo';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className='mb-3'>
                            <Logo />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            Transforming the chaotic world of tech recruitment into an elegant, intuitive experience.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/" className="text-gray-400 hover:text-primary transition">
                                <span className="material-icons-round">facebook</span>
                            </Link>
                            <Link to="/" className="text-gray-400 hover:text-primary transition">
                                <span className="material-icons-round">flutter_dash</span>
                            </Link>
                            <Link to="/" className="text-gray-400 hover:text-primary transition">
                                <span className="material-icons-round">photo_camera</span>
                            </Link>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Product</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link to="#" className="hover:text-primary transition">Features</Link></li>
                            <li><Link to="#" className="hover:text-primary transition">Solutions</Link></li>
                            <li><Link to="#" className="hover:text-primary transition">Pricing</Link></li>
                            <li><Link to="#" className="hover:text-primary transition">Mobile Apps</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link to="#" className="hover:text-primary transition">Help Center</Link></li>
                            <li><Link to="#" className="hover:text-primary transition">Video Tutorials</Link></li>
                            <li><Link to="#" className="hover:text-primary transition">Community</Link></li>
                            <li><Link to="#" className="hover:text-primary transition">Templates</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link to="#" className="hover:text-primary transition">About Us</Link></li>
                            <li><Link to="#" className="hover:text-primary transition">Careers</Link></li>
                            <li><Link to="#" className="hover:text-primary transition">Blog</Link></li>
                            <li><Link to="#" className="hover:text-primary transition">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 SmartRecruit Inc. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <Link to="#" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link>
                        <Link to="#" className="hover:text-gray-900 dark:hover:text-white">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
