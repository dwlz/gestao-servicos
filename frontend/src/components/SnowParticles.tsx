import { useEffect, useRef } from 'react';

interface Snowflake {
    x: number;
    y: number;
    radius: number;
    speed: number;
    drift: number;
    opacity: number;
    wobble: number;
    wobbleSpeed: number;
}

const SnowParticles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const snowflakesRef = useRef<Snowflake[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Create snowflakes
        const count = 60;
        snowflakesRef.current = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2.5 + 0.8,
            speed: Math.random() * 0.4 + 0.15,
            drift: Math.random() * 0.4 - 0.2,
            opacity: Math.random() * 0.4 + 0.08,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.02 + 0.005,
        }));

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            snowflakesRef.current.forEach((flake) => {
                flake.wobble += flake.wobbleSpeed;
                flake.y += flake.speed;
                flake.x += flake.drift + Math.sin(flake.wobble) * 0.3;

                // Wrap around
                if (flake.y > canvas.height + 5) {
                    flake.y = -5;
                    flake.x = Math.random() * canvas.width;
                }
                if (flake.x > canvas.width + 5) flake.x = -5;
                if (flake.x < -5) flake.x = canvas.width + 5;

                // Draw snowflake with soft glow
                const gradient = ctx.createRadialGradient(
                    flake.x, flake.y, 0,
                    flake.x, flake.y, flake.radius * 2.5
                );
                gradient.addColorStop(0, `rgba(165, 180, 252, ${flake.opacity})`);
                gradient.addColorStop(0.4, `rgba(165, 180, 252, ${flake.opacity * 0.5})`);
                gradient.addColorStop(1, `rgba(165, 180, 252, 0)`);

                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Core bright dot
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(224, 231, 255, ${flake.opacity * 1.5})`;
                ctx.fill();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default SnowParticles;
