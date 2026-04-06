import React from 'react';
import HeroSection from './sections/HeroSection';
import FeaturedJobsSection from './sections/FeaturedJobsSection';
import FeaturesSection from './sections/FeaturesSection';
import AIMatchingSection from './sections/AIMatchingSection';
import InteractiveFeaturesSection from './sections/InteractiveFeaturesSection';
import DashboardPreviewSection from './sections/DashboardPreviewSection';
import CTASection from './sections/CTASection';
import Reveal from '@/components/Reveal/Reveal';
import CandidateFAQ from './sections/CandidateFAQ';

const Home = () => {
    return (
        <div className="flex flex-col">
            <HeroSection />

            <Reveal delay={0.2}>
                <InteractiveFeaturesSection />
            </Reveal>

            <Reveal delay={0.2}>
                <AIMatchingSection />
            </Reveal>

            <Reveal delay={0.2}>
                <DashboardPreviewSection />
            </Reveal>

            <Reveal delay={0.2}>
                <FeaturesSection />
            </Reveal>

            <Reveal delay={0.2}>
                <CandidateFAQ />
            </Reveal>

            <Reveal delay={0.2}>
                <CTASection />
            </Reveal>
        </div>
    );
};

export default Home;