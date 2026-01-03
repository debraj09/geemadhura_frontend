// OurStory.tsx

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Circle } from 'lucide-react';
import lightbg from "../assets/lightbg.jpeg";
import ourstory from "../assets/ourstory.jpeg";
import { hover, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const OurStory: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const compliancePoints = [
        "In 2018, Geemadhura Innovations was founded with a simple but powerful vision:Make business compliance simple, fast, and affordable for every entrepreneur in India",
        "Our founder, Mr. Gourab Sanyal, and co-founder, Mrs. Mousumi Sanyal, recognized a critical problem in the Indian business ecosystem. Thousands of talented entrepreneurs had  amazing ideas, amazing products, and amazing businesses—but they were held back by one thing: complicated, time-consuming, expensive compliance processes."
    ];
useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    const darkBackground = '#FFFFFF';
    const lightText = 'black';
    const accentColor = '#00283A';
    const lightAccent = '#003a52';

    // Animation container style
    const containerStyle: React.CSSProperties = {
        backgroundImage: `url(${lightbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(255, 255, 255, 0.63)',
        backgroundBlendMode: 'overlay',
        minHeight: '50vh',
        width: '100%',
        padding: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '70px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
    };

    const cardStyle: React.CSSProperties = {
        borderRadius: '8px',
        maxWidth: '1200px',
        width: '100%',
        padding: '30px',
        display: 'flex',
        gap: '30px',
        alignItems: 'center',
    };

    // Left section style for image
    const leftSectionStyle: React.CSSProperties = {
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
        transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s',
    };

    // Image container style
    const imageContainerStyle: React.CSSProperties = {
        width: '100%',
        height: '400px',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.25), -5px -5px 15px rgba(0, 0, 0, 0.33)',
        position: 'relative',
    };

    const imageStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease',
    };

    const rightSectionStyle: React.CSSProperties = {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: lightText,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
        transition: 'opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s',
        marginLeft: '40px'
    };

    // Title style
    const titleStyle: React.CSSProperties = {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '25px',
        color: accentColor,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s',
        position: 'relative',
        display: 'inline-block',
    };

    // Optional: Add underline effect for the title
    const titleUnderlineStyle: React.CSSProperties = {
        content: '""',
        position: 'absolute',
        bottom: '-8px',
        left: '0',
        width: '80px',
        height: '4px',
        backgroundColor: accentColor,
        borderRadius: '2px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.8s ease-out 0.6s, opacity 0.8s ease-out 0.6s',
    };

    const complianceListStyle: React.CSSProperties = {
        listStyleType: 'none',
        padding: '0',
        marginBottom: '30px',
        marginTop: '10px',
        textAlign: 'justify'
    };

    const listItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        fontSize: '1.1rem',
        fontWeight: '400',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease-out ${0.6 + 0.1 * 0}s, transform 0.6s ease-out ${0.6 + 0.1 * 0}s`,
    };

    // Staggered animation for list items
    const getListItemStyle = (index: number): React.CSSProperties => ({
        ...listItemStyle,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease-out ${0.7 + 0.1 * index}s, transform 0.6s ease-out ${0.7 + 0.1 * index}s`,
    });

    const checkIconStyle: React.CSSProperties = {
        marginRight: '15px',
        color: lightText,
    };

    const buttonStyle: React.CSSProperties = {
        alignSelf: 'flex-start',
        backgroundColor: accentColor,
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background-color 0.2s, opacity 0.8s ease-out, transform 0.8s ease-out',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: '1.2s',
    };

    // Image hover effect
    const handleImageHover = (e: React.MouseEvent<HTMLImageElement>) => {
        e.currentTarget.style.transform = 'scale(1.05)';
    };

    const handleImageLeave = (e: React.MouseEvent<HTMLImageElement>) => {
        e.currentTarget.style.transform = 'scale(1)';
    };

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div ref={containerRef} style={containerStyle}>
            <div style={cardStyle}>
                {/* Left Side: 50% Image */}
                <div style={leftSectionStyle}>
                    <div style={imageContainerStyle}>
                        <img
                            src={ourstory}
                            alt="Our Story"
                            style={imageStyle}
                            onMouseEnter={handleImageHover}
                            onMouseLeave={handleImageLeave}
                        />
                    </div>
                </div>

                {/* Right Side: 50% Title, Compliance List and Button */}

                <motion.div
                    style={leftSectionStyle}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    <div style={rightSectionStyle}>
                        {/* "Our Story" Title */}
                        <div style={{ position: 'relative', marginBottom: '10px' }}>
                            <h2 style={titleStyle}>
                                Our Journey: From Vision to 15,000+ Happy Clients                                {/* Optional underline */}
                                <span style={titleUnderlineStyle}></span>
                            </h2>
                        </div>

                        {/* Compliance Points List with staggered animations */}
                        <ul style={complianceListStyle}>
                            {compliancePoints.map((point, index) => (
                                <li key={index} style={getListItemStyle(index)}>
                                    {point}
                                </li>
                            ))}
                        </ul>

                        {/* Button with animation */}
                        <Link
                        to ="/about"
                        >
                            <button

                                style={buttonStyle}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = lightAccent}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = accentColor}
                            >
                                Learn More
                                <ArrowRight size={20} />
                            </button>
                            </Link>
                    </div>

                </motion.div>


            </div>

        </div>

    );
};

export default OurStory;