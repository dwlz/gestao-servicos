import { useEffect, useRef } from 'react';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Stagger animate child cards/sections
        const animatables = el.querySelectorAll('[data-animate]');
        animatables.forEach((child, i) => {
            const htmlChild = child as HTMLElement;
            htmlChild.style.opacity = '0';
            htmlChild.style.transform = 'translateY(16px)';
            htmlChild.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    htmlChild.style.opacity = '1';
                    htmlChild.style.transform = 'translateY(0)';
                });
            });
        });
    }, []);

    return (
        <div ref={ref} className={`animate-page-enter ${className}`}>
            {children}
        </div>
    );
};

export default PageTransition;
