// Box.tsx

import React from 'react';
// Updated import: Replacing Check with Circle (for a traditional bullet dot)
import { ArrowRight, Circle, Check } from 'lucide-react'; 

// Define the component's structure and styles
const Box: React.FC = () => {
  // --- Text Content Updates ---
  const leftText1 = "Compliance isn't optional—it's your competitive advantage.";
  const leftText2 = "Geemadhura Innovation handles everything:";

  const compliancePoints = [
    "FSSAI License - Food Safety Certified",
    "Fire Safety NOC - Safety Approved",
    "Factory License - Manufacturing Ready",
    "ISO Certifications - Industry Standard",
    "GST & Business Registration - Tax Compliant",
  ];

  // --- Style Definitions ---

  const darkBackground = '#324E5E';
  const lightText = 'white';
  const accentColor = '#00283A'; // Dark blue for button
  const lightAccent = '#003a52'; // Hover color

  const containerStyle: React.CSSProperties = {
    // 1. Full-width background color
    backgroundColor: darkBackground,
    minHeight: '50vh',
    width: '100%',
    padding: '30px', 
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center', 
  };

  const cardStyle: React.CSSProperties = {
    // 2. Card structure (transparent background, inheriting darkBackground)
    borderRadius: '8px',
    maxWidth: '1200px',
    width: '100%',
    padding: '30px', 
    display: 'flex',
    gap: '30px', 
  };

  const leftSectionStyle: React.CSSProperties = {
    // 3. Left 50% section (New Text Content)
    flex: '1',
    minHeight: '300px',
    borderRadius: '4px',
    padding: '30px', 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: lightText, // Text color set to white
    textAlign: 'left',
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
    // 4. Right 50% section (Compliance Points & Button)
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    color: lightText, 
  };

  const complianceListStyle: React.CSSProperties = {
    listStyleType: 'none', // Remove default list markers
    padding: '0',
    marginBottom: '30px',
  };

  const listItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '1.1rem',
    fontWeight: '400',
  };

  const checkIconStyle: React.CSSProperties = {
    // Reduced margin for a smaller bullet dot
    marginRight: '15px', 
    color: lightText, 
  };

  const buttonStyle: React.CSSProperties = {
    // Button
    alignSelf: 'flex-start',
    backgroundColor: '#F2C445',
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
    transition: 'background-color 0.2s',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Left Side: 50% Text Content */}
        <div style={leftSectionStyle}>
          <div style={leftTitleStyle}>
            {leftText1} 
          </div>
          <div style={leftSubtitleStyle}>
            {leftText2}
          </div>
        </div>

        {/* Right Side: 50% Compliance List and Button */}
        <div style={rightSectionStyle}>
          {/* Compliance Points List */}
          <ul style={complianceListStyle}>
            {compliancePoints.map((point, index) => (
              <li key={index} style={listItemStyle}>
                {/* 🌟 REPLACED with Circle for a bullet point effect 🌟 */}
                <Circle size={10} style={checkIconStyle} fill={lightText} />
              ✔ {point}
              </li>
            ))}
          </ul>

          {/* Button with Lucide Icon */}
          <button
            style={buttonStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = lightAccent}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = accentColor}
          >
            Learn More
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Box;