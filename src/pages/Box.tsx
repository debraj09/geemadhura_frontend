// Box.tsx

import React from 'react';
import { ArrowRight, Circle, CheckSquare } from 'lucide-react';
import { LuCheck } from 'react-icons/lu';
import { hover, motion } from 'framer-motion';   // ⭐ ADDED motion here

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
  const lightAccent = '#003a52';

  const containerStyle: React.CSSProperties = {
    backgroundColor: darkBackground,
    minHeight: '50vh',
    width: '100%',
    padding: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: '8px',
    maxWidth: '1200px',
    width: '100%',
    padding: '30px',
    display: 'flex',
    gap: '30px',
  };

  const leftSectionStyle: React.CSSProperties = {
    flex: '1',
    minHeight: '300px',
    borderRadius: '4px',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: lightText,
    textAlign: 'left',
    marginTop: '-30px'
  };

  const leftTitleStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const leftSubtitleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  const rightSectionStyle: React.CSSProperties = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    color: lightText,
  };

  const complianceListStyle: React.CSSProperties = {
    listStyleType: 'none',
    padding: '0',
    marginTop: '30px',
    marginBottom: '30px'
  };

  const listItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '1.1rem',
    fontWeight: '400',
  };

  const checkIconStyle: React.CSSProperties = {
    marginRight: '15px',
    color: lightText,
  };

  const buttonStyle: React.CSSProperties = {
    alignSelf: 'flex-start',
    backgroundColor: '#F2C445',
    color: '#00283A',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s, color 0.2s',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>

        {/* ⭐ FADE-UP ANIMATED TEXT SECTION */}
        <motion.div
          style={leftSectionStyle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div style={leftTitleStyle}>{leftText1}</div>
          <div style={leftSubtitleStyle}>{leftText2}</div>
        </motion.div>




        {/* Right Section */}
        <motion.div
          style={leftSectionStyle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
        <div style={rightSectionStyle}>
          <ul style={complianceListStyle}>
            {compliancePoints.map((point, index) => (
              <li key={index} style={listItemStyle}>
                <LuCheck size={24} className="text-white-700" />
                &nbsp; &nbsp;{point}
              </li>
            ))}
          </ul>

          <button
            style={buttonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#003a52';
              e.currentTarget.style.color = '#F2C445';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#F2C445';
              e.currentTarget.style.color = 'white';
            }}
          >
            Learn More
            <ArrowRight size={20} />
          </button>

        </div>
        </motion.div>




      </div>
    </div>
  );
};

export default Box;
