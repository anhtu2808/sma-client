import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowLeft, faRocket } from '@fortawesome/free-solid-svg-icons';
import './styles.css';

const NotFound = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Particle system
        const particles = [];
        const PARTICLE_COUNT = 60;

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = Math.random() > 0.5 ? '#FF6B35' : '#F97316';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += (Math.random() - 0.5) * 0.01;
                this.opacity = Math.max(0.1, Math.min(0.7, this.opacity));

                if (this.x < 0 || this.x > canvas.width ||
                    this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        let animId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connection lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 107, 53, ${0.08 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <div className="notfound-container">
            <canvas ref={canvasRef} className="notfound-canvas" />

            {/* Gradient orbs background */}
            <div className="notfound-orb notfound-orb-1" />
            <div className="notfound-orb notfound-orb-2" />
            <div className="notfound-orb notfound-orb-3" />

            <div className="notfound-content">
                {/* Animated 404 text */}
                <div className="notfound-code-wrapper">
                    <span className="notfound-code-digit notfound-digit-1">4</span>
                    <div className="notfound-planet">
                        <div className="notfound-planet-body">
                            <div className="notfound-planet-ring" />
                        </div>
                    </div>
                    <span className="notfound-code-digit notfound-digit-2">4</span>
                </div>

                {/* Floating astronaut */}
                <div className="notfound-astronaut">
                    <FontAwesomeIcon icon={faRocket} className="notfound-rocket-icon" />
                </div>

                {/* Text content */}
                <h1 className="notfound-title">Oops! Page Not Found</h1>
                <p className="notfound-description">
                    The page you're looking for may have been removed, renamed, or is temporarily unavailable.
                    Head back to the homepage to continue your journey!
                </p>

                {/* Action buttons */}
                <div className="notfound-actions">
                    <button
                        className="notfound-btn notfound-btn-primary"
                        onClick={() => navigate('/')}
                    >
                        <FontAwesomeIcon icon={faHouse} />
                        <span>Go Home</span>
                    </button>
                    <button
                        className="notfound-btn notfound-btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Go Back</span>
                    </button>
                </div>

                {/* Decorative search hint */}
                <div className="notfound-hint">
                    <span className="notfound-hint-code">Error 404</span>
                    <span className="notfound-hint-divider">•</span>
                    <span>Page Not Found</span>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
