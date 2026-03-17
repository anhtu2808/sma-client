import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-gray-900 dark:bg-black rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                    
                    <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready to elevate your career journey?
                    </h2>
                    <p className="relative z-10 text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                        Join thousands of professionals and top companies who are already using SmartRecruit to connect, grow, and succeed together.
                    </p>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
                        <Button 
                            mode="primary" 
                            size="lg" 
                            onClick={() => navigate('/register')}
                            className="px-12"
                        >
                            Join Now
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
