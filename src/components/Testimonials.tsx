import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import testimonials from '@/data/testimonials.json';

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

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
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = testimonials.length - 1;
      if (newIndex >= testimonials.length) newIndex = 0;
      return newIndex;
    });
  };

  const testimonialsToShow = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <section
      className="py-16 md:py-24 bg-background relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundImage: [
            'radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, hsl(var(--accent-yellow)) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, hsl(var(--primary)) 0%, transparent 50%)',
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
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Quote className="text-accent-yellow" size={48} />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
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
                className="bg-card border-2 border-border hover:border-primary rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent-yellow/5"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />

                {/* Floating quote icon */}
                <motion.div
                  className="absolute -top-4 -right-4 text-accent-yellow/20"
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
                      <Star className="fill-accent-yellow text-accent-yellow" size={20} />
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
                  <motion.div
                    className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    {testimonial.name.charAt(0)}
                  </motion.div>
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
                  className="bg-card border-2 border-primary rounded-2xl p-8 shadow-2xl max-w-lg mx-auto relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent-yellow/10"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  />

                  <motion.div
                    className="absolute top-4 right-4 text-accent-yellow/30"
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
                        <Star className="fill-accent-yellow text-accent-yellow" size={20} />
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed italic relative z-10">
                    "{testimonials[currentIndex].message}"
                  </p>

                  <div className="flex items-center gap-4 relative z-10">
                    <motion.div
                      className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      {testimonials[currentIndex].name.charAt(0)}
                    </motion.div>
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
              className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground p-3 rounded-full transition-all duration-300 shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              onClick={() => paginate(1)}
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground p-3 rounded-full transition-all duration-300 shadow-lg"
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
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-accent-yellow' : 'w-2 bg-muted-foreground/30'
                }`}
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
