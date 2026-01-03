import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle, Calendar, User } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useState, useEffect } from 'react';

// --- Configuration & Interfaces ---
const API_BASE_URL = 'https://geemadhura.braventra.in/api/services';
const IMAGE_BASE_URL = 'https://geemadhura.braventra.in';

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
  date: string;
}

const Services = () => {
  // --- State Management ---
  const [dynamicServices, setDynamicServices] = useState<DynamicGridService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Format date to "Month Day, Year"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Truncate text to limit words
  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return 'No description available';
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

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
          return {
            id: service.id,
            title: service.name,
            slug: service.slug,
            icon: service.icon_name || 'Zap',
            shortDescription: service.service_description_text || 'No detailed description available.',
            imageUrl: `${IMAGE_BASE_URL}${service.image_url}`,
            date: service.created_at ? formatDate(service.created_at) : 'November 20, 2025' // Fallback date
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

  // --- Conditional Content Rendering ---
  let content;

  if (isLoading) {
    content = (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '40px 0',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3', 
          borderTop: '4px solid #1a73e8', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          marginRight: '10px'
        }}></div>
        <span style={{ fontSize: '1.2em', color: '#1a73e8' }}>Loading Services...</span>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  } else if (error) {
    content = (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          padding: '20px', 
          color: '#d32f2f', 
          backgroundColor: '#ffebee', 
          border: '1px solid #ffcdd2', 
          borderRadius: '8px', 
          maxWidth: '600px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              backgroundColor: '#d32f2f', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold' 
            }}>!</div>
            <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Error</span>
          </div>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  } else if (dynamicServices.length === 0) {
    content = (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 0', 
        color: '#666',
        fontFamily: 'Arial, sans-serif'
      }}>
        No active services found. Please check your data or API connection.
      </div>
    );
  } else {
    // --- Box Card Grid Rendering ---
    content = (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '30px',
        fontFamily: 'Arial, sans-serif'
      }}>
        {dynamicServices.map((service) => {
          const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Zap;

          return (
            <div
              key={service.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(26, 115, 232, 0.15)';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#1a73e8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <Link 
                to={`/services/${service.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Image Section */}
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent style={{ color: '#1a73e8', width: '60px', height: '60px' }} />
                    </div>
                  )}
                  
                  {/* Category/Tag Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    backgroundColor: 'rgba(26, 115, 232, 0.9)',
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '0.8em',
                    fontWeight: 'bold'
                  }}>
                    Service
                  </div>
                </div>

                {/* Content Section */}
                <div style={{ 
                  padding: '25px', 
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Date and Author */}
                  {/* <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '15px',
                    marginBottom: '15px',
                    fontSize: '0.85em',
                    color: '#666'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} />
                      <span>{service.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <User size={14} />
                      <span>Geemadhura Team</span>
                    </div>
                  </div> */}

                  {/* Title */}
                  <h3 style={{ 
                    margin: '0 0 15px 0', 
                    fontSize: '1.4em', 
                    fontWeight: 'bold',
                    color: '#333',
                    lineHeight: '1.4'
                  }}>
                    {service.title}
                  </h3>

                  {/* Description with fixed height */}
                  <div style={{ 
                    flexGrow: 1,
                    marginBottom: '20px',
                    color: '#555',
                    lineHeight: '1.6',
                    fontSize: '0.95em',
                    minHeight: '72px', // Fixed height for 3 lines of text
                    overflow: 'hidden'
                  }}>
                    {truncateText(service.shortDescription, 20)}
                  </div>

                  {/* Learn More Button */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#1a73e8',
                    fontWeight: 'bold',
                    fontSize: '0.95em',
                    paddingTop: '10px',
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <span>Read More</span>
                    <ArrowRight style={{ marginLeft: '8px', transition: 'transform 0.3s ease' }} size={18} />
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }

  // --- Final Render ---
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Hero Section */}
      <div style={{ 
        backgroundColor: '#f8f9fa',
        padding: '60px 0',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '3em', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#333'
          }}>
            Our Services
          </h1>
          <p style={{ 
            fontSize: '1.2em', 
            color: '#666', 
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Comprehensive solutions tailored to transform your business and drive success in the digital age
          </p>
        </div>
      </div>

      {/* Services Grid Section */}
      <div style={{ 
        padding: '60px 0',
        backgroundColor: 'white'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px'
        }}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default Services;