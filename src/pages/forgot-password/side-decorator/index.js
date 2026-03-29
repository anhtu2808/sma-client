import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faCode, faDiagramProject, faMicrochip, faShieldHalved } from '../../../utils/icons';

const SideDecorator = () => {
    return (
        <div
            className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12 text-white"
            style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <FontAwesomeIcon icon={faCode} className="text-9xl absolute -top-10 -left-10 transform rotate-12" />
                <FontAwesomeIcon icon={faMicrochip} className="text-8xl absolute top-1/4 right-10 transform -rotate-12" />
                <FontAwesomeIcon icon={faDiagramProject} className="text-9xl absolute bottom-1/3 left-20 transform rotate-45" />
                <FontAwesomeIcon icon={faCloudArrowUp} className="text-9xl absolute -bottom-10 right-20 transform -rotate-6" />
                <FontAwesomeIcon icon={faShieldHalved} className="text-6xl absolute top-1/2 left-1/2 transform translate-x-10 translate-y-20 rotate-12" />
            </div>
            <Logo className="relative z-10" iconColor="white" />

            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
                <div className="w-40 h-40 bg-white/20 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-lg backdrop-blur-sm border border-white/20">
                    <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                        <rect x="9" y="11" width="6" height="6" rx="1" fill="white" stroke="white" />
                        <path d="M10 11V9a2 2 0 1 1 4 0v2" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-[2.5rem] font-bold mb-4 tracking-tight leading-tight">
                    Securing your journey.
                </h1>
                <p className="text-white/90 text-[1.1rem] leading-relaxed font-medium px-4 max-w-md">
                    We'll help you get back into your account in just a few simple steps.
                </p>
            </div>

            <div className="relative z-10 flex items-center gap-4 text-sm text-white/70">
                <span>© 2026 SmartRecruit</span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
        </div>
    );
};

export default SideDecorator;