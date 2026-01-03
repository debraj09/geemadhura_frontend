import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Image as ImageIcon, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

interface Service {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  // New Gallery Dropdown structure
  { 
    name: 'Gallery', 
    href: '#', 
    isDropdown: true,
    subItems: [
      { name: 'Images', href: '/gallery/images', icon: <ImageIcon size={16} /> },
      { name: 'Videos', href: '/gallery/videos', icon: <Video size={16} /> }
    ] 
  },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [topPosition, setTopPosition] = useState('40px');
  const [services, setServices] = useState<Service[]>([]);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isGalleryDropdownOpen, setIsGalleryDropdownOpen] = useState(false); // New State
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true);
        const response = await fetch('https://geemadhura.braventra.in/api/services');
        const data = await response.json();
        
        if (data.status === 200 && data.data) {
          const activeServices = data.data
            .filter((service: Service) => service.is_active)
            .sort((a: Service, b: Service) => a.display_order - b.display_order);
          
          setServices(activeServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      setTopPosition(currentScrollY > 100 ? '0px' : '40px');
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleServiceClick = (service: Service) => {
    navigate(`/services/${service.id}`);
    setIsServicesDropdownOpen(false);
  };

  return (
    <header
      style={{
        backgroundColor: '#FFFFF7',
        position: 'fixed',
        top: topPosition,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'top 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease'
      }}
      className={`${scrolled ? 'bg-[#FFFFF7]/95 backdrop-blur-sm shadow-lg' : ''}`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Logo" className="h-10 md:h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              // --- SERVICES DROPDOWN ---
              if (item.name === 'Services') {
                return (
                  <div 
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setIsServicesDropdownOpen(true)}
                    onMouseLeave={() => setIsServicesDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center text-sm lg:text-base font-bold transition-colors hover:text-[#F2C445] group ${
                        location.pathname.startsWith('/services') ? 'text-[#F2C445]' : 'text-[#00283A]'
                      }`}
                    >
                      {item.name}
                      <ChevronDown 
                        size={16} 
                        className={`ml-1 transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isServicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 mt-2 w-64 rounded-xl shadow-2xl overflow-hidden border border-[#00283A]/10"
                          style={{ backgroundColor: '#FFFFF7' }}
                        >
                          <div className="py-1">
                            {isLoadingServices ? (
                              <div className="p-4 text-center"><div className="animate-spin h-4 w-4 border-2 border-[#00283A] border-t-transparent rounded-full inline-block" /></div>
                            ) : services.length > 0 ? (
                              <>
                                {services.slice(0, 5).map((service) => (
                                  <button
                                    key={service.id}
                                    onClick={() => handleServiceClick(service)}
                                    className={`w-full text-left px-5 py-2.5 text-sm transition-all hover:bg-[#00283A]/5 hover:pl-6 ${
                                      location.pathname === `/services/${service.id}` ? 'text-[#F2C445] bg-[#00283A]/5' : 'text-[#00283A]'
                                    }`}
                                  >
                                    {service.name}
                                  </button>
                                ))}
                                <Link
                                  to="/services"
                                  className="block px-5 py-3 text-sm font-bold border-t border-[#00283A]/10 bg-[#00283A]/5 text-[#00283A] hover:text-[#F2C445] transition-colors"
                                  onClick={() => setIsServicesDropdownOpen(false)}
                                >
                                  View All Services
                                </Link>
                              </>
                            ) : (
                              <div className="px-5 py-3 text-sm text-gray-500">No services found</div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // --- GALLERY DROPDOWN (Added) ---
              if (item.name === 'Gallery') {
                return (
                  <div 
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setIsGalleryDropdownOpen(true)}
                    onMouseLeave={() => setIsGalleryDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center text-sm lg:text-base font-bold transition-colors hover:text-[#F2C445] group ${
                        location.pathname.startsWith('/gallery') ? 'text-[#F2C445]' : 'text-[#00283A]'
                      }`}
                    >
                      {item.name}
                      <ChevronDown 
                        size={16} 
                        className={`ml-1 transition-transform duration-300 ${isGalleryDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isGalleryDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 mt-2 w-48 rounded-xl shadow-2xl overflow-hidden border border-[#00283A]/10"
                          style={{ backgroundColor: '#FFFFF7' }}
                        >
                          <div className="py-1">
                            {item.subItems?.map((sub) => (
                              <Link
                                key={sub.name}
                                to={sub.href}
                                onClick={() => setIsGalleryDropdownOpen(false)}
                                className={`flex items-center gap-3 px-5 py-3 text-sm transition-all hover:bg-[#00283A]/5 hover:pl-6 ${
                                  location.pathname === sub.href ? 'text-[#F2C445] bg-[#00283A]/5' : 'text-[#00283A]'
                                }`}
                              >
                                {sub.icon}
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm lg:text-base font-bold transition-colors hover:text-[#F2C445] relative group ${
                    location.pathname === item.href ? 'text-[#F2C445]' : 'text-[#00283A]'
                  }`}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F2C445] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              );
            })}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <Link to="/contact" className="hidden md:block">
              <button className="px-6 py-2.5 rounded-full font-bold text-sm bg-[#00283A] text-[#F2C445] hover:scale-105 transition-transform active:scale-95">
                Get Started
              </button>
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-[#00283A]">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#FFFFF7] border-t border-[#00283A]/10 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.isDropdown ? (
                    <>
                      <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">{item.name}</div>
                      {item.subItems?.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 font-bold text-[#00283A] hover:bg-[#00283A]/5 rounded-lg text-sm"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 font-bold text-[#00283A] hover:bg-[#00283A]/5 rounded-lg"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <Link to="/contact" className="block pt-2" onClick={() => setIsOpen(false)}>
                <button className="w-full py-4 rounded-xl font-bold bg-[#00283A] text-[#F2C445]">Get Started</button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};