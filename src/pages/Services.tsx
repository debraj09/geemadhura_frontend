import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Loader2, AlertCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useState, useEffect } from 'react';

// --- Configuration & Interfaces ---
const API_BASE_URL = 'https://geemadhura.braventra.in/api/services';
// --- ADDED BASE DOMAIN FOR IMAGE PREFIXING ---
const IMAGE_BASE_URL = 'https://geemadhura.braventra.in';
// ---------------------------------------------

// Interface for the data coming directly from the backend API
interface BackendServiceData {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  is_active: 0 | 1;
  created_at: string;
  service_description_text: string | null;
  icon_name?: string;
}

// Interface for the data used in the component's state
interface DynamicGridService {
  id: number;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  imageUrl: string;
}

const Services = () => {
  // --- State Management ---
  const [dynamicServices, setDynamicServices] = useState<DynamicGridService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const serviceData: BackendServiceData[] = result.data || [];

        // Map backend data to frontend structure
        const mappedServices: DynamicGridService[] = serviceData.map(service => {
          // --- IMAGE URL PREFIXING LOGIC APPLIED HERE ---
          // const fullImageUrl = service.image_url ? `${IMAGE_BASE_URL}${service.image_url}` : '';

          return {
            id: service.id,
            title: service.name,
            slug: service.slug,
            icon: service.icon_name || 'Zap',
            shortDescription: service.service_description_text || 'No detailed description available.',
            imageUrl: `${IMAGE_BASE_URL}${service.image_url}`,
          };
        });

        setDynamicServices(mappedServices);

      } catch (e) {
        console.error('Error fetching services:', e);
        setError(`Could not load services. Details: ${(e as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // --- Conditional Content Rendering (Unchanged) ---
  let content;

  if (isLoading) {
    content = (
      <div className="flex justify-center items-center py-10 text-primary">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span className="text-xl">Loading Services...</span>
      </div>
    );
  } else if (error) {
    content = (
      <div className="flex justify-center items-center p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg max-w-lg mx-auto">
        <AlertCircle className="mr-3 h-6 w-6 flex-shrink-0" />
        <span className="font-medium">Error: {error}</span>
      </div>
    );
  } else if (dynamicServices.length === 0) {
    content = (
      <div className="text-center py-10 text-muted-foreground">
        No active services found. Please check your data or API connection.
      </div>
    );
  } else {
    // --- Dynamic Grid Rendering (Unchanged structure) ---
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dynamicServices.map((service, index) => {
          const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Zap;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/services/${service.slug}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-card border-2 border-border hover:border-primary rounded-2xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 group"
                >

                  {/* --- IMAGE DISPLAY --- */}
                  {service.imageUrl ? (
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
                      <img
                        src={service.imageUrl}
                        alt={`${service.title} icon`}
                        className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    // Fallback to icon if imageUrl is missing
                    <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                      <IconComponent className="text-primary group-hover:text-primary-foreground transition-colors duration-300" size={32} />
                    </div>
                  )}
                  {/* ------------------------------- */}

                  <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>

                  <div className="flex items-center text-primary group-hover:text-accent-yellow transition-colors font-semibold">
                    <span>Learn More</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={20} />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // --- Final Render (Unchanged) ---
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Comprehensive solutions tailored to transform your business and drive success in the
              digital age
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid (Dynamic Content Area) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {content}
        </div>
      </section>
    </main>
  );
};

export default Services;