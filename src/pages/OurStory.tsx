// OurStory.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import lightbg from "../assets/lightbg.jpeg";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import aboutus from '@/assets/page.png';

const OurStory: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const containerRef = useRef<HTMLDivElement>(null);

    // Track window size for responsive styles
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const compliancePoints = [
        "In 2018, Geemadhura Innovations was founded with a simple but powerful vision: Make business compliance simple, fast, and affordable for every entrepreneur in India",
        "Our founder, Mr. Gourab Sanyal, and co-founder, Mrs. Mousumi Sanyal, recognized a critical problem in the Indian business ecosystem. Thousands of talented entrepreneurs had amazing ideas, amazing products, and amazing businesses—but they were held back by one thing: complicated, time-consuming, expensive compliance processes."
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const accentColor = '#00283A';
    const lightAccent = '#003a52';

    // --- RESPONSIVE STYLES ---
    const containerStyle: React.CSSProperties = {
        backgroundImage: `url(${lightbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.63)',
        backgroundBlendMode: 'overlay',
        minHeight: '50vh',
        width: '100%',
        padding: isMobile ? '40px 20px' : '60px 30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        overflow: 'hidden'
    };

    const cardStyle: React.CSSProperties = {
        maxWidth: '1200px',
        width: '100%',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '40px' : '30px',
        alignItems: 'center',
    };

    const leftSectionStyle: React.CSSProperties = {
        flex: '1',
        width: '100%',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : (isMobile ? 'translateY(-20px)' : 'translateX(-30px)'),
        transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s',
    };

    const imageContainerStyle: React.CSSProperties = {
        width: '100%',
        height: isMobile ? '250px' : '330px',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.15)',
    };

    const rightSectionStyle: React.CSSProperties = {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        textAlign: isMobile ? 'center' : 'left',
        color: 'black',
        marginLeft: isMobile ? '0' : '40px'
    };

    const titleStyle: React.CSSProperties = {
        fontSize: isMobile ? '1.5rem' : '2rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: accentColor,
        lineHeight: '1.2'
    };

    const titleUnderlineStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: '-8px',
        left: isMobile ? '50%' : '0',
        transform: isMobile ? 'translateX(-50%)' : 'none',
        width: '60px',
        height: '4px',
        backgroundColor: accentColor,
        borderRadius: '2px',
    };

    const getListItemStyle = (index: number): React.CSSProperties => ({
        marginBottom: '15px',
        fontSize: isMobile ? '0.95rem' : '1.1rem',
        lineHeight: '1.6',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease-out ${0.7 + 0.1 * index}s, transform 0.6s ease-out ${0.7 + 0.1 * index}s`,
        textAlign: isMobile ? 'center' : 'justify'
    });

    const buttonStyle: React.CSSProperties = {
        alignSelf: isMobile ? 'center' : 'flex-start',
        backgroundColor: accentColor,
        color: 'white',
        border: 'none',
        padding: '12px 28px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '10px'
    };

    // Intersection Observer logic
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} style={containerStyle}>
            <div style={cardStyle}>
                {/* Image Section */}
                <div style={leftSectionStyle}>
                    <div style={imageContainerStyle}>
                        <img
                            src={aboutus}
                            alt="Our Story"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>

                {/* Content Section */}
                <motion.div
                    style={rightSectionStyle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                        <h2 style={titleStyle}>
                            Our Journey: From Vision to 15,000+ Happy Clients
                            <span style={titleUnderlineStyle}></span>
                        </h2>
                    </div>

                    <div style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
                        {compliancePoints.map((point, index) => (
                            <p key={index} style={getListItemStyle(index)}>
                                {point}
                            </p>
                        ))}
                    </div>

                    <Link to="/about" style={{ textDecoration: 'none' }}>
                        <button
                            style={buttonStyle}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = lightAccent}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = accentColor}
                        >
                            Learn More
                            <ArrowRight size={20} />
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default OurStory;