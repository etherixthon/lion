import React, { useEffect, useRef } from 'react';
import './BlockchainBackground.css';

const BlockchainBackground = ({ children }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let connections = [];

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = 1.5;
                this.color = '#8B5CF6'; // Purple color
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            }
        }

        // Create particles
        const createParticles = () => {
            const particleCount = Math.min(40, Math.floor(window.innerWidth / 40));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        // Update connections
        const updateConnections = () => {
            connections = [];
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        connections.push({
                            start: particles[i],
                            end: particles[j],
                            opacity: (1 - (distance / 120)) * 0.5
                        });
                    }
                }
            }
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Update and draw connections
            updateConnections();
            connections.forEach(connection => {
                ctx.beginPath();
                ctx.moveTo(connection.start.x, connection.start.y);
                ctx.lineTo(connection.end.x, connection.end.y);
                ctx.strokeStyle = `rgba(139, 92, 246, ${connection.opacity * 0.5})`; // Purple with opacity
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.closePath();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        // Initialize
        createParticles();
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="blockchain-background">
            <canvas ref={canvasRef} className="blockchain-canvas" />
            <div className="blockchain-content">
                {children}
            </div>
        </div>
    );
};

export default BlockchainBackground;
