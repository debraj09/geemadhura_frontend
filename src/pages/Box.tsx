// Box.tsx

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LuCheck } from 'react-icons/lu';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Image Imports
import Fostac from '@/assets/Fostac.png';
import ISO from '@/assets/ISO.png';
import MITRA from '@/assets/MITRA.png';
import MSME from '@/assets/MSME.png';

const Box: React.FC = () => {
  const leftText1 = "Compliance isn't optional—it's your competitive advantage.";
  const leftText2 = "Geemadhura Innovation handles everything:";

  const compliancePoints = [
    "FSSAI License - Food Safety Certified",
    "Fire Safety NOC - Safety Approved",
    "Factory License - Manufacturing Ready",
    "ISO Certifications - Industry Standard",
    "GST & Business Registration - Tax Compliant",
  ];

  const darkBackground = '#324E5E';
  const lightText = 'white';
  const accentColor = '#F2C445';

  const containerStyle: React.CSSProperties = {
    backgroundColor: darkBackground,
    minHeight: '50vh',
    width: '100%',
    padding: '60px 30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: '8px',
    maxWidth: '1200px',
    width: '100%',
    display: 'flex',
    gap: '50px',
    flexWrap: 'wrap', // Better for mobile responsiveness
  };

  const leftSectionStyle: React.CSSProperties = {
    flex: '1.2',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: lightText,
    textAlign: 'left',
  };

  const rightSectionStyle: React.CSSProperties = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: lightText,
  };

  const leftTitleStyle: React.CSSProperties = {
    fontSize: '2.2rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    lineHeight: '1.2',
  };

  const leftSubtitleStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    fontWeight: '500',
    marginBottom: '25px',
    opacity: 0.9,
  };

  // --- NEW STYLES FOR IMAGES ---
  const imageRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    marginTop: '10px',
    flexWrap: 'wrap',
    borderRadius:'10px'
  };

  const logoStyle: React.CSSProperties = {
    height: '70px', // Adjust height as needed
    width: 'auto',
    objectFit: 'contain',
        borderRadius:'6px'
,
    filter: 'brightness(1.1)', // Optional: makes logos pop against dark bg
  };

  const complianceListStyle: React.CSSProperties = {
    listStyleType: 'none',
    padding: '0',
    marginBottom: '30px',
  };

  const listItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '1.1rem',
    fontWeight: '400',
  };

  const buttonStyle: React.CSSProperties = {
    alignSelf: 'flex-start',
    backgroundColor: accentColor,
    color: '#00283A',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        {/* LEFT SECTION WITH TEXT AND IMAGES */}
        <motion.div
          style={leftSectionStyle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div style={leftTitleStyle}>{leftText1}</div>
          <div style={leftSubtitleStyle}>{leftText2}</div>
          
          {/* ⭐ IMAGES PLACED HERE */}
          <div style={imageRowStyle}>
            <img src={Fostac} alt="Fostac Logo" style={logoStyle} />
            <img src={ISO} alt="ISO Logo" style={logoStyle} />
            <img src={MITRA} alt="MITRA Logo" style={logoStyle} />
            <img src={MSME} alt="MSME Logo" style={logoStyle} />
          </div>
        </motion.div>

        {/* RIGHT SECTION WITH LIST AND BUTTON */}
        <motion.div
          style={rightSectionStyle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <ul style={complianceListStyle}>
            {compliancePoints.map((point, index) => (
              <li key={index} style={listItemStyle}>
                <LuCheck size={24} style={{ marginRight: '15px', color: accentColor }} />
                {point}
              </li>
            ))}
          </ul>
          
          <Link to="/services" style={{ textDecoration: 'none' }}>
            <button
              style={buttonStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#003a52';
                e.currentTarget.style.color = accentColor;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = accentColor;
                e.currentTarget.style.color = '#00283A';
              }}
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

export default Box;