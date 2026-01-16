import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Configuration ---
const API_BASE_URL = 'https://geemadhura.braventra.in/api/banners';
const IMAGE_BASE_URL = 'https://geemadhura.braventra.in'; 
const SLIDE_DURATION = 5000; 

interface Slide {
  heading: string;
  subheading: string;
  cta: string; 
  ctaLink: string; 
  image: string; 
}

export const HeroSlider = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_BASE_URL);
        const result = await response.json();
        const mappedSlides: Slide[] = (result.data || []).map((banner: any) => ({
          heading: banner.title,
          subheading: banner.short_description || 'Leading innovation through technology',
          cta: 'Explore Services',
          ctaLink: '/services',
          image: `${IMAGE_BASE_URL}${banner.image_url.replace('/public', '')}`, 
        }));
        setSlides(mappedSlides);
      } catch (e) {
        setError('Could not load banners.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length > 0) setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!isPaused && slides.length > 1) {
      const interval = setInterval(nextSlide, SLIDE_DURATION);
      return () => clearInterval(interval);
    }
  }, [isPaused, nextSlide, slides.length]);

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center bg-gray-100 text-gray-500 font-medium">Loading...</div>;
  if (error || slides.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:h-[85vh]"
        >
          {/* Background Image - Overlay (bg-black/20) removed below */}
          <div
            className="absolute inset-0 bg-no-repeat bg-center transition-transform duration-1000"
            style={{ 
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundSize: '100% 100%', 
            }}
          />

          {/* Text Content Container (Removed bg-black/20) */}
          <div className="absolute inset-0"> 
            <div className="h-full container mx-auto px-4 flex items-center">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl text-white"
              >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                  {slides[currentSlide].heading}
                </h1>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              i === currentSlide ? 'w-10 bg-white' : 'w-3 bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};