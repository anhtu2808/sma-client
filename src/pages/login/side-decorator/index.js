import Logo from "@/components/Logo";
import { Link } from "react-router-dom";

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
                    <span className="material-icons-round text-9xl absolute -top-10 -left-10 transform rotate-12">code</span>
                    <span className="material-icons-round text-8xl absolute top-1/4 right-10 transform -rotate-12">memory</span>
                    <span className="material-icons-round text-9xl absolute bottom-1/3 left-20 transform rotate-45">hub</span>
                    <span className="material-icons-round text-9xl absolute -bottom-10 right-20 transform -rotate-6">cloud_upload</span>
                    <span className="material-icons-round text-6xl absolute top-1/2 left-1/2 transform translate-x-10 translate-y-20 rotate-12">security</span>
                </div>

                <Logo className="relative z-10" iconColor="white" />

                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                        Your next tech breakthrough starts here.
                    </h1>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Join the community where top-tier developers and innovative 
                        companies build the future together.
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