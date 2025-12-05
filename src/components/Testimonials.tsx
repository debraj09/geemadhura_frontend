import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Loader2, AlertTriangle } from 'lucide-react';
import lightbg from "../assets/lightbg.jpeg";

// --- Configuration ---
const API_URL = 'https://geemadhura.braventra.in/api/testimonials';
const BASE_URL = 'https://geemadhura.braventra.in';
export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Exponential Backoff Configuration
  const maxRetries = 3;
  const initialDelay = 1000;

  // Function to fetch testimonials with exponential backoff
  const fetchTestimonials = useCallback(async () => {
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
        
        if (result.status === 200 && Array.isArray(result.data)) {
          // Map API response to match your component's expected structure
          const mappedTestimonials = result.data.map((item, index) => ({
            id: index, // Use index as ID since API doesn't provide ID
            name: item.client_name,
            role: item.client_position || item.client_company || 'Client',
            message: item.comment,
            rating: item.review_stars || 5,
            imageUrl: item.image_url ? `${BASE_URL}${item.image_url}` : null,
            // Add timestamp for consistency
            timestamp: new Date().toISOString()
          }));
          
          setTestimonials(mappedTestimonials);
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
          console.error("Failed to fetch testimonials after all retries:", message);
          setError(`Failed to load testimonials: ${message}`);
          setLoading(false);
          return;
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      paginate(1);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, testimonials.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.5,
      z: -1000,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      z: 0,
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
      scale: 0.5,
      z: -1000,
    }),
  };

  const paginate = (newDirection: number) => {
    if (testimonials.length === 0) return;
    
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = testimonials.length - 1;
      if (newIndex >= testimonials.length) newIndex = 0;
      return newIndex;
    });
  };

  // Get testimonials to show (for desktop view)
  const testimonialsToShow = testimonials.length > 0 ? [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ] : [];

  // Loading State
  if (loading) {
    return (
      <section 
        className="py-16 md:py-24 bg-background relative overflow-hidden"
        style={{
          backgroundImage: `url(${lightbg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/90 dark:bg-black/80" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 style={{color:'#00283A'}} className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear what our clients say about our services
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" style={{color: '#00283A'}} />
            <p className="ml-3 text-lg text-muted-foreground">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section 
        className="py-16 md:py-24 bg-background relative overflow-hidden"
        style={{
          backgroundImage: `url(${lightbg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/90 dark:bg-black/80" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 style={{color:'#00283A'}} className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
          </div>
          <div className="p-6 bg-red-100 border border-red-400 rounded-xl text-red-700 max-w-xl mx-auto flex items-center space-x-3">
            <AlertTriangle size={24} />
            <div>
              <h3 className="font-semibold text-lg">Error Loading Testimonials</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (testimonials.length === 0) {
    return (
      <section 
        className="py-16 md:py-24 bg-background relative overflow-hidden"
        style={{
          backgroundImage: `url(${lightbg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/90 dark:bg-black/80" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 style={{color:'#00283A'}} className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear what our clients say about our services
            </p>
          </div>
          <div className="p-6 bg-yellow-100 border border-yellow-400 rounded-xl text-yellow-800 max-w-xl mx-auto text-center">
            <p className="font-medium">No testimonials available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 md:py-24 bg-background relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      style={{
        backgroundImage: `url(${lightbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Semi-transparent overlay for better readability */}
      <div className="absolute inset-0 bg-white/80 dark:bg-black/70" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundImage: [
            'radial-gradient(circle at 20% 50%, #00283A 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, #F2C445 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, #00283A 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="text-center mb-12"
        >
          <h2 style={{color:'#00283A'}} className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hear what our clients say about our services
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto" style={{ perspective: '2000px' }}>
          {/* Desktop: Show 3 cards with stagger */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {testimonialsToShow.map((testimonial, idx) => (
              <motion.div
                key={`${currentIndex}-${idx}`}
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.15,
                  type: 'spring',
                  bounce: 0.5,
                }}
                whileHover={{
                  y: -15,
                  rotateY: 5,
                  scale: 1.05,
                }}
                className="bg-white/95 dark:bg-gray-900/95 border-2 border-border hover:border-[#00283A] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group backdrop-blur-sm"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#00283A]/5 to-[#F2C445]/5"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />

                {/* Floating quote icon */}
                <motion.div
                  className="absolute -top-4 -right-4 text-[#F2C445]/20"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <Quote size={80} />
                </motion.div>

                <motion.div
                  className="flex gap-1 mb-4 relative z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.15, type: 'spring', bounce: 0.6 }}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    >
                      <Star className="fill-[#F2C445] text-[#F2C445]" size={20} />
                    </motion.div>
                  ))}
                </motion.div>

                <p className="text-muted-foreground mb-6 leading-relaxed italic relative z-10">
                  "{testimonial.message}"
                </p>

                <motion.div
                  className="flex items-center gap-4 relative z-10"
                  whileHover={{ x: 10 }}
                >
                  {testimonial.imageUrl ? (
                    <motion.img
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <motion.div
                      className="w-12 h-12 bg-[#00283A]/20 rounded-full flex items-center justify-center text-[#00283A] font-bold"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      {testimonial.name.charAt(0)}
                    </motion.div>
                  )}
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Mobile & Tablet: Auto-rotating 3D flip animation */}
          <div className="lg:hidden relative overflow-visible h-[450px]" style={{ perspective: '1500px' }}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  rotateY: { type: 'spring', stiffness: 100, damping: 20 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.4 },
                }}
                className="absolute w-full"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div
                  className="bg-white/95 dark:bg-gray-900/95 border-2 border-[#00283A] rounded-2xl p-8 shadow-2xl max-w-lg mx-auto relative overflow-hidden backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#00283A]/10 to-[#F2C445]/10"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  />

                  <motion.div
                    className="absolute top-4 right-4 text-[#F2C445]/30"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity }}
                  >
                    <Quote size={60} />
                  </motion.div>

                  <div className="flex gap-1 mb-4 relative z-10">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.3, 1],
                        }}
                        transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Star className="fill-[#F2C445] text-[#F2C445]" size={20} />
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed italic relative z-10">
                    "{testimonials[currentIndex].message}"
                  </p>

                  <div className="flex items-center gap-4 relative z-10">
                    {testimonials[currentIndex].imageUrl ? (
                      <motion.img
                        src={testimonials[currentIndex].imageUrl}
                        alt={testimonials[currentIndex].name}
                        className="w-12 h-12 rounded-full object-cover"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : (
                      <motion.div
                        className="w-12 h-12 bg-[#00283A]/20 rounded-full flex items-center justify-center text-[#00283A] font-bold"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      >
                        {testimonials[currentIndex].name.charAt(0)}
                      </motion.div>
                    )}
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonials[currentIndex].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              onClick={() => paginate(-1)}
              whileHover={{ scale: 1.2, rotate: -90 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm"
              style={{
                backgroundColor: '#00283A',
                color: '#F2C445'
              }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              onClick={() => paginate(1)}
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm"
              style={{
                backgroundColor: '#00283A',
                color: '#F2C445'
              }}
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all backdrop-blur-sm ${
                  index === currentIndex ? 'w-8' : 'w-2 bg-muted-foreground/30'
                }`}
                style={{
                  backgroundColor: index === currentIndex ? '#F2C445' : ''
                }}
                animate={index === currentIndex ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                whileHover={{ scale: 1.3 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};