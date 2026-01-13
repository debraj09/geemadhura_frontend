// FirstScrollbar.jsx
import { motion } from 'framer-motion';
import React from 'react';

const STATIC_CONTENT = "99% Success Rate | Timely Processing | Transparent Pricing | 24/7 WhatsApp Support";
const items = [STATIC_CONTENT, STATIC_CONTENT, STATIC_CONTENT]; 

const fastDuration = 35;

export const FirstScrollbar = () => {
  return (
    // 1. Added 'flex items-center' to the main container
    <div className="bg-golden-yellow overflow-hidden relative w-full h-8 md:h-10 flex items-center"> 
        
      <div className="relative h-full w-full overflow-hidden flex items-center">
        <motion.div
          className="flex items-center" 
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
              // 2. whitespace-nowrap is key, plus flex items-center
              className="flex items-center whitespace-nowrap"
              style={{ paddingRight: '20px' ,marginTop:10}} 
            >
              <span className="text-dark-teal font-bold text-xs md:text-sm leading-none flex items-center">
                {text}
              </span>
              
              {/* 3. Changed separator logic: using a margin-left instead of a separate span to keep text flow tight */}
              <span className="text-dark-teal/70 text-base font-bold ml-5 flex items-center leading-none">
                |
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};