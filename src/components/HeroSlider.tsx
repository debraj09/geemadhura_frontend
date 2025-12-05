import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Removed Sparkles, Zap, TrendingUp
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
// Removed import for FloatingElements

// --- Configuration ---
const API_BASE_URL = 'https://geemadhura.braventra.in/api/banners';
const IMAGE_BASE_URL = 'https://geemadhura.braventra.in'; // Base URL to construct the full image path
const SLIDE_DURATION = 5000; // 5 seconds per slide

// --- Interfaces ---
interface BannerData {
  id: number;
  title: string;
  image_url: string;
  // Assuming shortDescription is the new field for the subheading
  short_description?: string; 
  is_mobile_enabled: boolean;
}

interface Slide {
  heading: string;
  subheading: string;
  cta: string; // Hardcoded as requested
  ctaLink: string; // Hardcoded as requested
  image: string; // Full image URL
}

// Removed floatingIcons array

export const HeroSlider = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- API Fetch Logic ---
  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
          throw new Error(`Failed to fetch banners: ${response.statusText}`);
        }

        const result = await response.json();
        const bannerData: BannerData[] = result.data || [];

        // Map backend data to frontend Slide interface
        const mappedSlides: Slide[] = bannerData.map(banner => ({
          heading: banner.title,
          // Using a placeholder/default if short_description is not available
          subheading: banner.short_description || 'Leading innovation through cutting-edge technology solutions',
          cta: 'Explore Services', // Hardcoded CTA text
          ctaLink: '/services', // Hardcoded CTA link
          // Construct the full, public image URL
          image: `${IMAGE_BASE_URL}${banner.image_url.replace('/public', '')}`, 
        }));

        if (mappedSlides.length > 0) {
            setSlides(mappedSlides);
        } else {
            // Optional: Fallback to your original hardcoded slides if API returns empty
            // setSlides(initialHardcodedSlides); 
            console.warn("API returned no banners. Using an empty slider.");
        }

      } catch (e) {
        console.error('Error fetching banners:', e);
        setError('Could not load banners. Check API endpoint and network.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []); // Empty dependency array means this runs only once on mount

  // --- Slider Logic ---
  const nextSlide = useCallback(() => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [slides.length]);

  // Auto-play interval
  useEffect(() => {
    if (!isPaused && slides.length > 1) {
      const interval = setInterval(nextSlide, SLIDE_DURATION);
      return () => clearInterval(interval);
    }
  }, [isPaused, nextSlide, slides.length]);

  // GSAP animation trigger on slide change
  useEffect(() => {
    if (slides.length > 0) {
      const tl = gsap.timeline();
      tl.fromTo(
        '.hero-bg',
        { scale: 1.2, rotation: 0.01 },
        { scale: 1, rotation: 0, duration: 2, ease: 'power3.out' }
      );
    }
  }, [currentSlide, slides.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  }, [prevSlide, nextSlide]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  // --- Loading and Error States ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center hero-height bg-primary text-white">
        Loading Banners...
      </div>
    );
  }

  if (error || slides.length === 0) {
    return (
      <div className="flex items-center justify-center hero-height  ">
        Error: {error || "No banners available to display."}
      </div>
    );
  }

  // --- Render Dynamic Slider ---
  return (
    <div
      className="relative w-full hero-height overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="hero-bg absolute inset-0 bg-cover bg-center"
            // Dynamic image URL
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />

          {/* Removed: Animated Overlay/Shadow */}
          {/* Removed: FloatingElements */}
          {/* Removed: Floating Icons */}
          
          {/* Content */}
          <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, type: 'spring', bounce: 0.4 }}
              className="max-w-3xl"
            >
              {/* Heading with character animation - Dynamic (Uncommented for visibility) */}
              {/* <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                {slides[currentSlide].heading.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: 0.5 + i * 0.03,
                      duration: 0.5,
                      type: 'spring',
                      bounce: 0.5,
                    }}
                    className="inline-block"
                    style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </h1> */}

              {/* Subheading with shimmer effect - Dynamic (Uncommented for visibility) */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="relative overflow-hidden mb-8"
              >
                {/* <p className="text-lg md:text-xl text-gray-200 relative z-10">
                  {slides[currentSlide].subheading}
                </p> */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-yellow/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, delay: 1.5, ease: 'easeInOut' }}
                />
              </motion.div>

              {/* CTA Button with bounce - Hardcoded as requested (Uncommented for visibility) */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 1.6,
                  duration: 0.8,
                  type: 'spring',
                  bounce: 0.6,
                }}
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.95 }}
              >
                {/* <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-semibold text-base md:text-lg px-8 py-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-accent-yellow/50"
                >
                  <a href={slides[currentSlide].ctaLink}>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {slides[currentSlide].cta}
                    </motion.span>
                  </a>
                </Button> */}
              </motion.div>
            </motion.div>
          </div>

          {/* Removed: Animated particles */}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows (Uncommented for visibility) */}
      {/* {slides.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.2, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-primary text-white p-3 rounded-full transition-all duration-300 z-10 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-primary text-white p-3 rounded-full transition-all duration-300 z-10 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </motion.button>
        </>
      )} */}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-accent-yellow w-8' : 'bg-white/50 hover:bg-white/75 w-3'
              }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              animate={index === currentSlide ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: index === currentSlide ? Infinity : 0 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};