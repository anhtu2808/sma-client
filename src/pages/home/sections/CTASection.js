import Button from '@/components/Button';

const CTASection = () => {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-gray-900 dark:bg-black rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                    
                    <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready to scale your tech team?
                    </h2>
                    <p className="relative z-10 text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                        Join 2,500+ highly productive teams who use SmartRecruit to find, hire, and manage their dream candidates.
                    </p>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
                        <Button 
                            mode="primary" 
                            size="lg" 
                            className=""
                        >
                            Start Hiring Now
                        </Button>
                        <Button 
                            mode="secondary" 
                            size="lg" 
                            className="bg-white"
                        >
                            Book a Demo
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
