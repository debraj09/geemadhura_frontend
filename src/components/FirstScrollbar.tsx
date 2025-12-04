// FirstScrollbar.jsx

import { motion } from 'framer-motion';
import React from 'react';

// --- Static Content ---
const STATIC_CONTENT = "99% Success Rate | Timely Processing | Transparent Pricing | 24/7 WhatsApp Support";
// Duplicated for a seamless continuous loop
const items = [STATIC_CONTENT, STATIC_CONTENT, STATIC_CONTENT]; 

// --- Configuration ---
const fastDuration = 35; // Duration for the animation loop in seconds (adjust for speed)

export const FirstScrollbar = () => {

  return (
    // Outer container: Set background and dimensions. Assumes 'bg-golden-yellow' is defined in your CSS/Tailwind config.
    <div className="bg-golden-yellow overflow-hidden relative flex items-center h-8 md:h-10 w-full"> 
        
      {/* Marquee Content Bar Wrapper */}
      <div className="relative flex-grow h-full overflow-hidden">
        <div 
        style={{marginTop:20}}
          className="absolute inset-y-0 left-0 flex items-center pr-8"
        >
          {/* Animated Marquee Content */}
          <motion.div
            className="flex" 
            style={{ height: '100%', alignItems: 'center' }} 
            // Animate horizontally from 0% to -33.33% (the length of one repeated block)
            animate={{ x: ['0%', '-33.33%'] }}
            transition={{
              duration: fastDuration, 
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {items.map((text, index) => (
              <div
                key={index}
                className="flex items-center whitespace-nowrap"
                // Ensure there is a gap between the repeated blocks
                style={{ paddingRight: '40px' }} 
              >
                <span className="text-dark-teal font-bold text-xs md:text-sm">
                  {text}
                </span>
                {/* Optional Separator (only for visual clarity between the blocks) */}
                {index < items.length - 1 && (
                    <span className="text-dark-teal/70 text-base font-bold pl-5">|</span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};