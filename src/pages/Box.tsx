// Box.tsx

import React from 'react';
import { ArrowRight } from 'lucide-react'; // Importing a Lucide icon

// Define the component's structure and styles
const Box: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    // 1. Full-width background color
    backgroundColor: '#324E5E',
    minHeight: '50vh',
    width: '100%',
    padding: '30px', // 30px padding from the entire section (top/bottom/sides)
    display: 'flex',
    justifyContent: 'center', // Center the card horizontally
    alignItems: 'center', // Center the card vertically (if content is short)
  };

  const cardStyle: React.CSSProperties = {
    // 2. Card background and padding
    backgroundColor: 'white',
    borderRadius: '8px', // Optional: for a nicer look
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '1200px', // Set a max width for better appearance on large screens
    width: '100%', // Take full width within the container's padding
    padding: '30px', // 30px padding inside the card (as requested)
    display: 'flex',
    gap: '30px', // Space between the two 50% sections
  };

  const leftSectionStyle: React.CSSProperties = {
    // 3. Left 50% section (Image/Dummy)
    flex: '1', // Equivalent to 50% when paired with the right section's flex: 1
    backgroundColor: '#e0e0e0', // Dummy image background
    minHeight: '300px', // Ensure it has some height
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5rem',
    color: '#666',
  };

  const rightSectionStyle: React.CSSProperties = {
    // 4. Right 50% section (Content)
    flex: '1', // Equivalent to 50%
    display: 'flex',
    flexDirection: 'column', // Stack the rows
    justifyContent: 'space-between', // Optional: Space out the rows vertically
  };

  const titleStyle: React.CSSProperties = {
    // First Row: Title
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  };

  const descriptionStyle: React.CSSProperties = {
    // Second Row: Description
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#555',
    marginBottom: '20px',
  };

  const buttonStyle: React.CSSProperties = {
    // Third Row: Button
    alignSelf: 'flex-start', // Align button to the start of the right section
    backgroundColor: '#00283A',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
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
        {/* Left Side: 50% Dummy Image */}
        <div style={leftSectionStyle}>
          **[Image Placeholder]**
        </div>

        {/* Right Side: 50% Content - Three Rows */}
        <div style={rightSectionStyle}>
          {/* Row 1: Title */}
          <div style={titleStyle}>
            Dummy Title for the Card
          </div>

          {/* Row 2: Description */}
          <div style={descriptionStyle}>
            This is a dummy description section. It takes up the middle space of the right 50% column. The layout is structured with two equal parts: an image placeholder on the left and content on the right.
          </div>

          {/* Row 3: Button with Lucide Icon */}
          <button style={buttonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#003a52'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00283A'}>
            Learn More
            <ArrowRight size={20} /> {/* Lucide Icon Usage */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Box;