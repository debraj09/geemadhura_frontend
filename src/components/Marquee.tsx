import { motion } from 'framer-motion';
import updates from '@/data/updates.json';

export const Marquee = () => {
  const items = [...updates, ...updates, ...updates]; 
  // Note: I'm using the provided duration of 35, but this is quite slow. 
  // If you want it faster, you should decrease this value (e.g., to 15).
  const fastDuration = 35; 

  return (
    // 1. REDUCED HEIGHT: h-12 (on small screens) and md:h-14 (on medium/large screens)
    <div className="bg-primary overflow-hidden relative flex items-center h-8 md:h-10"> 
      
      {/* 1. Fixed "Update" Label - Dark Teal/Blue Background */}
      <div 
        className="flex-shrink-0 z-30 h-full relative"
        style={{ marginLeft: '-1rem' }} 
      >
        <div 
          className="bg-dark-teal px-4 md:px-6 h-full flex items-center" // Reduced horizontal padding slightly
          style={{ borderTopRightRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}
        >
            {/* 2. REDUCED FONT SIZE */}
            <h2 className="text-white text-lg md:text-xl font-bold whitespace-nowrap">
                Update
            </h2>
        </div>
      </div>

      {/* 2. Marquee Content Bar - Yellow/Orange Rounded Pill Shape */}
      <div className="relative flex-grow h-full overflow-hidden">
        <div 
            className="absolute inset-y-0 left-0 bg-golden-yellow shadow-xl flex items-center pr-8"
            style={{ width: '100%', borderRadius: '9999px', paddingLeft: '2.5rem' }} // Reduced paddingLeft
        >
            
            {/* Gradient masks */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-golden-yellow to-transparent z-10" />

            {/* Animated Marquee Content */}
            <motion.div
                className="flex gap-10" // Reduced gap slightly
                style={{ height: '100%', alignItems: 'center' }} 
                animate={{ x: ['0%', '-33.33%'] }}
                transition={{
                    duration: fastDuration, 
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                {items.map((item, index) => (
                    <motion.div
                        key={`${item.id}-${index}`}
                        className="flex items-center gap-2 whitespace-nowrap" // Reduced gap slightly
                        whileHover={{ scale: 1.05, y: -1 }} 
                        transition={{ type: 'spring', stiffness: 400 }}
                    >
                        {/* 3. REDUCED FONT SIZE */}
                        <span className="text-dark-teal font-bold text-xs md:text-sm">
                            {item.title}
                        </span>
                        {/* 3. REDUCED FONT SIZE */}
                        <span className="text-dark-teal/70 text-2xs md:text-xs">
                            • {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </div>
    </div>
  );
};