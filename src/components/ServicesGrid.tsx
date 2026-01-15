import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Loader2, AlertCircle, Eye } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = 'https://geemadhura.braventra.in/api/services';
const MAX_INITIAL_SERVICES = 6;

// --- Interfaces ---
interface ServiceData {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  is_active: 0 | 1;
  created_at: string;
  service_description_text: string | null;
}

interface GridService {
  id: number;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
}

// Helper function to strip HTML tags and get plain text
const stripHtmlTags = (html: string | null): string => {
  if (!html) return 'No description provided.';
  
  // Remove HTML tags
  const plainText = html.replace(/<[^>]*>/g, ' ');
  
  // Replace multiple spaces with single space
  const cleanText = plainText.replace(/\s+/g, ' ').trim();
  
  return cleanText;
};

// Helper function to safely truncate text
const truncateToChars = (text: string, maxChars: number): string => {
  if (text.length <= maxChars) {
    return text;
  }
  return text.substring(0, maxChars).trim() + '...';
};

export const ServicesGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const navigate = useNavigate();

  const [allServices, setAllServices] = useState<GridService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const visibleCount = MAX_INITIAL_SERVICES;

  // --- API Fetch Logic ---
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}?active=true`);

        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.statusText}`);
        }

        const result = await response.json();
        const serviceData: ServiceData[] = result.data || [];

        console.log("data fetched:", serviceData);

        const mappedServices: GridService[] = serviceData.map(service => {
          // Convert HTML content to plain text for the short description
          const plainTextDescription = stripHtmlTags(service.service_description_text);
          
          return {
            id: service.id,
            title: service.name,
            slug: service.slug,
            icon: 'Zap', // Default icon, you can map from backend later
            shortDescription: plainTextDescription,
          };
        });

        setAllServices(mappedServices);

      } catch (e) {
        console.error('Error fetching services:', e);
        setError(`Could not load services. Details: ${(e as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Function to handle the "View More" button click
  const handleViewMore = () => {
    navigate('/services');
  };

  // Determine if the View More button should be visible
  const showViewMore = allServices.length > MAX_INITIAL_SERVICES;

  // Slice the services array to display only the initial count
  const servicesToDisplay = allServices.slice(0, visibleCount);

  // Memoize the rendered list for performance
  const servicesList = useMemo(() => {
    return servicesToDisplay.map((service, index) => {
      const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Zap;

      return (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 100, rotate: index % 2 === 0 ? -10 : 10, scale: 0.3 }}
          animate={
            isInView
              ? {
                opacity: 1,
                y: 0,
                rotate: 0,
                scale: 1,
              }
              : {}
          }
          transition={{
            duration: 0.7,
            delay: index * 0.12,
            type: 'spring',
            bounce: 0.6,
          }}
        >
          <Link to={`/services/${service.slug}`}>
            <motion.div
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white/95 dark:bg-gray-900/95 border-2 border-border hover:border-[#00283A] rounded-2xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden cursor-pointer backdrop-blur-sm"
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#00283A]/5 via-transparent to-[#F2C445]/5"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%', skewX: -20 }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.8 }}
              />

              {/* Icon Container with hover animation */}
              <motion.div
                className="bg-[#00283A]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00283A] transition-colors duration-300 relative z-10"
                whileHover={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div className='group-hover:animate-spin-slow'>
                  <IconComponent
                    className="text-[#00283A] group-hover:text-[#F2C445] transition-colors duration-300"
                    size={32}
                  />
                </motion.div>
              </motion.div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-[#00283A] transition-colors relative z-10">
                {service.title.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-2"
                    whileHover={{
                      y: -5,
                      color: '#F2C445',
                    }}
                    transition={{ type: 'spring', bounce: 0.7 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h3>

              {/* Dynamic Description - Now properly cleaned */}
              <p className="text-muted-foreground leading-relaxed mb-6 relative z-10">
                {truncateToChars(service.shortDescription, 100)}
              </p>

              {/* Learn More link with arrow animation */}
              <motion.div
                className="flex items-center text-[#00283A] group-hover:text-[#F2C445] transition-colors font-semibold relative z-10"
                whileHover={{ x: 5 }}
              >
                <span>Read More</span>
                <motion.div
                  className='ml-2'
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </motion.div>

              {/* Floating corner decoration */}
              <motion.div
                className="absolute -top-10 -right-10 w-32 h-32 bg-[#F2C445]/10 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
            </motion.div>
          </Link>
        </motion.div>
      );
    });
  }, [servicesToDisplay, isInView]);

  // --- Render Component ---
  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="text-center mb-12"
        >
          <motion.h2
            style={{ color: '#00283A' }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Our Compliance Services
          </motion.h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive solutions tailored to your business needs
          </p>
        </motion.div>

        {/* --- Dynamic States --- */}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-10 text-primary">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" style={{color: '#00283A'}} />
            <span className="text-xl" style={{color: '#00283A'}}>Loading Services...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg max-w-lg mx-auto">
            <AlertCircle className="mr-3 h-6 w-6 flex-shrink-0" />
            <span className="font-medium">Error: {error}</span>
          </div>
        )}

        {/* No Services State */}
        {!isLoading && !error && allServices.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No active services found. Please add services in the admin panel.
          </div>
        )}

        {/* Dynamic Grid */}
        {!isLoading && !error && allServices.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesList}
            </div>

            {/* View More Button */}
            {showViewMore && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: servicesToDisplay.length * 0.12 + 0.2 }}
                className="text-center mt-12"
              >
                <motion.button
                  onClick={handleViewMore}
                  className="inline-flex items-center justify-center rounded-xl text-lg font-semibold px-8 py-3 shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-2"
                  style={{
                    backgroundColor: '#00283A',
                    color: '#F2C445',
                    borderColor: '#00283A'
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 10px 15px -3px rgba(0, 40, 58, 0.5)',
                    backgroundColor: '#001f2e'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-5 h-5 mr-3" />
                  View All Services ({allServices.length})
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};