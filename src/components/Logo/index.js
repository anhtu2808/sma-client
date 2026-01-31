import React from 'react';
import { Link } from 'react-router-dom';
import smaLogo from '@/assets/svg/sma-logo.svg';

const Logo = ({ className = '' }) => {
    return (
        <Link to="/" className={`flex items-center gap-2 group ${className}`}>
            <img src={smaLogo} alt="SmartRecruit" className="w-8 h-8" />
            <span className="self-center text-xl font-bold whitespace-nowrap dark:text-white tracking-tight">SmartRecruit</span>
        </Link>
    );
};

export default Logo;