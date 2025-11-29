import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

// --- Configuration ---
const API_URL = 'https://geemadhura.braventra.in/api/latestUpdates';

export const Marquee = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Exponential Backoff Configuration (same as your NewUpdates component)
  const maxRetries = 3;
  const initialDelay = 1000;

  // Function to fetch updates with exponential backoff
  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(errorBody.message || `HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setUpdates(result.data);
          setLoading(false);
          return;
        } else {
          throw new Error('Invalid data structure received from API.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        
        if (attempt < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, attempt) + Math.random() * 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error("Failed to fetch updates after all retries:", message);
          setError(`Failed to load updates: ${message}`);
          setLoading(false);
          return;
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  // Create duplicated items for seamless marquee effect
  const items = updates.length > 0 ? [...updates, ...updates, ...updates] : [];
  const fastDuration = 35;

  // Show loading state
  if (loading) {
    return (
      <div className="bg-primary overflow-hidden relative flex items-center h-8 md:h-10">
        <div className="flex-shrink-0 z-30 h-full relative" style={{ marginLeft: '-1rem' }}>
          <div 
            className="bg-dark-teal px-4 md:px-6 h-full flex items-center"
            style={{ borderTopRightRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}
          >
            <h2 className="text-white text-lg md:text-xl font-bold whitespace-nowrap">
              Update
            </h2>
          </div>
        </div>
        <div className="relative flex-grow h-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-golden-yellow shadow-xl flex items-center justify-center pr-8"
            style={{ width: '100%', borderRadius: '9999px', paddingLeft: '2.5rem' }}
          >
            <span className="text-dark-teal text-xs md:text-sm">Loading updates...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-primary overflow-hidden relative flex items-center h-8 md:h-10">
        <div className="flex-shrink-0 z-30 h-full relative" style={{ marginLeft: '-1rem' }}>
          <div 
            className="bg-dark-teal px-4 md:px-6 h-full flex items-center"
            style={{ borderTopRightRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}
          >
            <h2 className="text-white text-lg md:text-xl font-bold whitespace-nowrap">
              Update
            </h2>
          </div>
        </div>
        <div className="relative flex-grow h-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-golden-yellow shadow-xl flex items-center justify-center pr-8"
            style={{ width: '100%', borderRadius: '9999px', paddingLeft: '2.5rem' }}
          >
            <span className="text-dark-teal text-xs md:text-sm">Failed to load updates</span>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (updates.length === 0) {
    return (
      <div className="bg-primary overflow-hidden relative flex items-center h-8 md:h-10">
        <div className="flex-shrink-0 z-30 h-full relative" style={{ marginLeft: '-1rem' }}>
          <div 
            className="bg-dark-teal px-4 md:px-6 h-full flex items-center"
            style={{ borderTopRightRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}
          >
            <h2 className="text-white text-lg md:text-xl font-bold whitespace-nowrap">
              Update
            </h2>
          </div>
        </div>
        <div className="relative flex-grow h-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-golden-yellow shadow-xl flex items-center justify-center pr-8"
            style={{ width: '100%', borderRadius: '9999px', paddingLeft: '2.5rem' }}
          >
            <span className="text-dark-teal text-xs md:text-sm">No updates available</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary overflow-hidden relative flex items-center h-8 md:h-10"> 
      {/* Fixed "Update" Label */}
      <div className="flex-shrink-0 z-30 h-full relative" style={{ marginLeft: '-1rem' }}>
        <div 
          className="bg-dark-teal px-4 md:px-6 h-full flex items-center"
          style={{ borderTopRightRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}
        >
          <h2 className="text-white text-lg md:text-xl font-bold whitespace-nowrap">
            Update
          </h2>
        </div>
      </div>

      {/* Marquee Content Bar */}
      <div className="relative flex-grow h-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-golden-yellow shadow-xl flex items-center pr-8"
          style={{ width: '100%', borderRadius: '9999px', paddingLeft: '2.5rem' }}
        >
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-golden-yellow to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-golden-yellow to-transparent z-10" />

          {/* Animated Marquee Content */}
          <motion.div
            className="flex gap-10"
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
                className="flex items-center gap-2 whitespace-nowrap"
                whileHover={{ scale: 1.05, y: -1 }} 
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {/* Using update_date and title from API response */}
                <span className="text-dark-teal font-bold text-xs md:text-sm">
                  {item.title}
                </span>
                <span className="text-dark-teal/70 text-2xs md:text-xs">
                  • {new Date(item.update_date).toLocaleDateString()}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};