import React, { useEffect, useRef, useState } from 'react';

/**
 * Reveal component that animates its children when they enter the viewport.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contents to animate
 * @param {number} [props.delay=0] - Animation delay in seconds
 * @param {number} [props.threshold=0.1] - Intersection observer threshold
 * @param {string} [props.className=""] - Optional extra classes
 */
const Reveal = ({ children, delay = 0, threshold = 0.2, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold });

        const currentTarget = domRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [threshold]);

    return (
        <div
            ref={domRef}
            className={`reveal-wrapper ${className} ${isVisible ? 'reveal-active' : ''}`}
            style={{
                transitionDelay: `${delay}s`,
                width: '100%'
            }}
        >
            {children}
        </div>
    );
};

export default Reveal;
