import React from 'react';
import HeroSection from './sections/HeroSection';
import TrustedBySection from './sections/TrustedBySection';
import FeaturesSection from './sections/FeaturesSection';
import AboutSection from './sections/AboutSection';
import CategoriesSection from './sections/CategoriesSection';
import CTASection from './sections/CTASection';

const Home = () => {
    return (
        <>
            <HeroSection />
            <TrustedBySection />
            <FeaturesSection />
            <AboutSection />
            <CategoriesSection />
            <CTASection />
        </>
    );
};

export default Home;