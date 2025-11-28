import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Loader2, AlertCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// --- Configuration ---
// Set your API endpoint here
const API_BASE_URL = 'https://geemadhura.braventra.in/api/services';

// --- Interfaces ---

// This interface reflects the data structure returned by your updated backend API endpoint.
// It now includes the ALIASED field: service_description_text
interface ServiceData {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  is_active: 0 | 1;
  created_at: string;
  // This is the ALIASED field from the SQL query: description AS service_description_text
  service_description_text: string | null; // Use string or null/undefined if data might be missing
}

// Frontend Structure for Grid Item
interface GridService {
  id: number;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
}

export const ServicesGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [services, setServices] = useState<GridService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- API Fetch Logic ---
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch only active services
        const response = await fetch(`${API_BASE_URL}?active=true`); 

        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.statusText}`);
        }

        const result = await response.json();
        // TypeScript ensures result.data matches ServiceData[]
        const serviceData: ServiceData[] = result.data || [];
        
        // Console log to verify the field is present now
        console.log("dadtata fetched:", serviceData); 

        // Map backend data to frontend GridService interface
        const mappedServices: GridService[] = serviceData.map(service => {
          return {
            id: service.id,
            title: service.name,
            slug: service.slug,
            icon: 'Zap', 
            // FIXED: Reading from the ALIASED field name
            shortDescription: service.service_description_text || 'No description provided.', 
          };
        });

        setServices(mappedServices);

      } catch (e) {
        console.error('Error fetching services:', e);
        // Cast error to Error to safely access message
        setError(`Could not load services. Details: ${(e as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []); // Run only once on mount

  // Memoize the rendered list for performance
  const servicesList = useMemo(() => {
    return services.map((service, index) => {
      // Safely access Lucide icon component, fall back to Zap
      const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Zap;

      return (
        <motion.div
          key={service.id}
          // Initial staggered animation on load/scroll into view
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
              // Hover animations for the card itself
              whileHover={{
                y: -20,
                rotate: [0, -2, 2, -2, 0],
                scale: 1.05,
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-card border-2 border-border hover:border-primary rounded-2xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden cursor-pointer"
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-yellow/5"
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
                className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 relative z-10"
                whileHover={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.5 }}
              >
                {/* Icon spinning animation */}
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <IconComponent
                    className="text-primary group-hover:text-primary-foreground transition-colors duration-300"
                    size={32}
                  />
                </motion.div>
              </motion.div>

              {/* Title with per-word hover animation */}
              <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors relative z-10">
                {service.title.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-2"
                    whileHover={{
                      y: -5,
                      // Ensure you have an 'accent-yellow' color defined in your Tailwind config
                      color: 'hsl(var(--accent-yellow))', 
                      rotate: [0, -10, 10, 0],
                    }}
                    transition={{ type: 'spring', bounce: 0.7 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h3>

              {/* Dynamic Description */}
              <p className="text-muted-foreground leading-relaxed mb-6 relative z-10">
                {service.shortDescription}
              </p>

              {/* Learn More link with arrow animation */}
              <motion.div
                className="flex items-center text-primary group-hover:text-accent-yellow transition-colors font-semibold relative z-10"
                whileHover={{ x: 10 }}
              >
                <span>Read More</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight className="ml-2" size={20} />
                </motion.div>
              </motion.div>

              {/* Floating corner decoration */}
              <motion.div
                className="absolute -top-10 -right-10 w-32 h-32 bg-accent-yellow/10 rounded-full"
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
  }, [services, isInView]);

  // --- Render Component ---
  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/20 relative overflow-hidden">
      
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}>
          <motion.div
            className="w-full h-full"
            animate={{ backgroundPosition: ['0px 0px', '50px 50px'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Our Services
          </motion.h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive solutions tailored to your business needs
          </p>
        </motion.div>

        {/* --- Dynamic States --- */}
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-10 text-primary">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <span className="text-xl">Loading Services...</span>
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
        {!isLoading && !error && services.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No active services found. Please add services in the admin panel.
          </div>
        )}

        {/* Dynamic Grid */}
        {!isLoading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList}
          </div>
        )}
      </div>
    </section>
  );
};