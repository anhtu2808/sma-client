import React from 'react';
import { Link } from 'react-router-dom';
import smaLogo from '@/assets/svg/sma-logo.svg';
import smaLogoWhite from '@/assets/svg/sma-logo-white.svg';

const Logo = ({ className = '', iconColor = '' }) => {
    return (
        <Link to="/" className={`flex items-center gap-2 group ${className}`}>
            <img src={iconColor === 'white' ? smaLogoWhite : smaLogo} alt="SmartRecruit" className="w-8 h-8" />
            <span className={`self-center text-xl font-bold whitespace-nowrap ${iconColor === 'white' ? 'text-white' : 'dark:text-white'} tracking-tight`}>SmartRecruit</span>
        </Link>
    );
};

export default Logo;