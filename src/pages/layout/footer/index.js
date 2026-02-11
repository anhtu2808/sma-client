import Logo from '@/components/Logo';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#101827] border-t border-gray-800 pt-16 pb-8 font-poppins text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className='mb-6'>
                            <Logo variant="white" />
                        </div>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-sm">
                            The world's first fully autonomous AI recruitment platform. We help you build the team of your dreams.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: "fa-twitter", link: "#" },
                                { icon: "fa-facebook", link: "#" },
                                { icon: "fa-linkedin", link: "#" }
                            ].map((social, index) => (
                                <Link
                                    key={index}
                                    to={social.link}
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                    <i className={`fa-brands ${social.icon} text-lg`}></i>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="#" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">AI Engine</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Case Studies</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="#" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Press</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="#" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">API Documentation</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Status</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">© 2024 SmartRecruit Inc. All rights reserved.</p>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
