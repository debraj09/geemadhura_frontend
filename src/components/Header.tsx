import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Image as ImageIcon, Video, Send, Phone, Mail, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service_id: string;
  subject: string;
  message: string;
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
  const [isGalleryDropdownOpen, setIsGalleryDropdownOpen] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const location = useLocation();
  const navigate = useNavigate();

  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service_id: '',
    subject: '',
    message: '',
  });

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

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactFormData({ ...contactFormData, [e.target.name]: e.target.value });
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields (Name, Email, Message).',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactFormData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Phone validation (optional but if provided, should be valid)
    if (contactFormData.phone && !/^[0-9+\-\s()]{10,15}$/.test(contactFormData.phone.replace(/\s+/g, ''))) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number (10-15 digits).',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://geemadhura.braventra.in/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contactFormData,
          service_id: contactFormData.service_id ? parseInt(contactFormData.service_id) : null,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === 201) {
        toast({
          title: 'Message Sent Successfully!',
          description: 'Thank you for contacting us. We will get back to you soon.',
        });

        // Reset form
        setContactFormData({
          name: '',
          email: '',
          phone: '',
          service_id: '',
          subject: '',
          message: '',
        });

        // Close popup after successful submission
        setTimeout(() => {
          setShowContactPopup(false);
        }, 1500);
      } else {
        toast({
          title: 'Submission Failed',
          description: result.message || 'Failed to submit form. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Network Error',
        description: 'Failed to connect to server. Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openContactPopup = () => {
    setShowContactPopup(true);
    // Close mobile menu if open
    setIsOpen(false);
  };

  const closeContactPopup = () => {
    setShowContactPopup(false);
    // Reset form when closing
    setContactFormData({
      name: '',
      email: '',
      phone: '',
      service_id: '',
      subject: '',
      message: '',
    });
  };


  const navigateHandler = () => {
    window.location.href = '/tracking-application';
  }
  return (
    <>
      <header
        style={{
          backgroundColor: '#FFFFF7',
          position: 'fixed',
          top: topPosition,
          left: 0,
          right: 0,
          zIndex: 9998,
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
                        className={`flex items-center text-sm lg:text-base font-bold transition-colors hover:text-[#F2C445] group ${location.pathname.startsWith('/services') ? 'text-[#F2C445]' : 'text-[#00283A]'
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
                                      className={`w-full text-left px-5 py-2.5 text-sm transition-all hover:bg-[#00283A]/5 hover:pl-6 ${location.pathname === `/services/${service.id}` ? 'text-[#F2C445] bg-[#00283A]/5' : 'text-[#00283A]'
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

                // --- GALLERY DROPDOWN ---
                if (item.name === 'Gallery') {
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => setIsGalleryDropdownOpen(true)}
                      onMouseLeave={() => setIsGalleryDropdownOpen(false)}
                    >
                      <button
                        className={`flex items-center text-sm lg:text-base font-bold transition-colors hover:text-[#F2C445] group ${location.pathname.startsWith('/gallery') ? 'text-[#F2C445]' : 'text-[#00283A]'
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
                                  className={`flex items-center gap-3 px-5 py-3 text-sm transition-all hover:bg-[#00283A]/5 hover:pl-6 ${location.pathname === sub.href ? 'text-[#F2C445] bg-[#00283A]/5' : 'text-[#00283A]'
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
                    className={`text-sm lg:text-base font-bold transition-colors hover:text-[#F2C445] relative group ${location.pathname === item.href ? 'text-[#F2C445]' : 'text-[#00283A]'
                      }`}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F2C445] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                );
              })}
            </div>

            {/* CTA + Mobile Toggle */}
            {/* Change space-x-4 to space-x-2 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={openContactPopup}
                className="hidden md:block px-6 py-2.5 rounded-full font-bold text-sm bg-[#00283A] text-[#F2C445] hover:scale-105 transition-transform active:scale-95"
              >
                Get Started
              </button>

              {/* I noticed your second button was outside the div in your snippet. 
      Move it inside the div so the space-x property applies to it. */}
              <button
              onClick={navigateHandler}
                className="hidden md:block px-6 py-2.5 rounded-full font-bold text-sm bg-[#00283A] text-[#F2C445] hover:scale-105 transition-transform active:scale-95"
              >
                Tracking Application
              </button>

              {/* Mobile Menu Toggle */}
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
                <button
                  onClick={openContactPopup}
                  className="w-full py-4 rounded-xl font-bold bg-[#00283A] text-[#F2C445] mt-2"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Contact Popup Modal */}
      <AnimatePresence>
        {showContactPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeContactPopup}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999"
            />

            {/* Popup Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-br from-white via-white to-[#FFFFF7] rounded-3xl border-2 border-[#00283A]/10 shadow-2xl relative">
                  {/* Close Button */}
                  <button
                    onClick={closeContactPopup}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#00283A]/10 hover:bg-[#00283A]/5 transition-colors"
                  >
                    <CloseIcon className="h-5 w-5 text-[#00283A]" />
                  </button>

                  {/* Popup Header */}
                  <div className="p-6 md:p-8 border-b border-[#00283A]/10">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-[#00283A] to-[#00283A]/80">
                        <Send className="text-white" size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black" style={{ color: '#00283A' }}>
                          Get Started Today
                        </h2>
                        <p className="text-[#00283A]/60">Fill out the form and we'll get back to you within 24 hours</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <form onSubmit={handleContactFormSubmit} className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="popup-name" className="block text-sm font-bold uppercase tracking-wider" style={{ color: '#00283A' }}>
                          Your Name *
                        </label>
                        <Input
                          id="popup-name"
                          name="name"
                          type="text"
                          value={contactFormData.name}
                          onChange={handleContactFormChange}
                          placeholder="Enter your full name"
                          required
                          className="bg-white/80 border-2 border-[#00283A]/20 focus:border-[#00283A] rounded-xl py-5 px-4 text-base placeholder:text-gray-400 hover:border-[#F2C445]/50 transition-all duration-300"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="popup-email" className="block text-sm font-bold uppercase tracking-wider" style={{ color: '#00283A' }}>
                          Email Address *
                        </label>
                        <Input
                          id="popup-email"
                          name="email"
                          type="email"
                          value={contactFormData.email}
                          onChange={handleContactFormChange}
                          placeholder="your.email@example.com"
                          required
                          className="bg-white/80 border-2 border-[#00283A]/20 focus:border-[#00283A] rounded-xl py-5 px-4 text-base placeholder:text-gray-400 hover:border-[#F2C445]/50 transition-all duration-300"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-2">
                        <label htmlFor="popup-phone" className="block text-sm font-bold uppercase tracking-wider" style={{ color: '#00283A' }}>
                          Phone Number
                        </label>
                        <Input
                          id="popup-phone"
                          name="phone"
                          type="tel"
                          value={contactFormData.phone}
                          onChange={handleContactFormChange}
                          placeholder="+91 00000 00000"
                          className="bg-white/80 border-2 border-[#00283A]/20 focus:border-[#00283A] rounded-xl py-5 px-4 text-base placeholder:text-gray-400 hover:border-[#F2C445]/50 transition-all duration-300"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="popup-service_id" className="block text-sm font-bold uppercase tracking-wider" style={{ color: '#00283A' }}>
                          Service Interested
                        </label>
                        <select
                          id="popup-service_id"
                          name="service_id"
                          value={contactFormData.service_id}
                          onChange={handleContactFormChange}
                          className="w-full bg-white/80 border-2 border-[#00283A]/20 focus:border-[#00283A] rounded-xl py-4 px-4 text-base placeholder:text-gray-400 hover:border-[#F2C445]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isLoadingServices || isSubmitting}
                        >
                          <option value="">Select a service (optional)</option>
                          {isLoadingServices ? (
                            <option value="" disabled>Loading services...</option>
                          ) : services.length > 0 ? (
                            services.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No services available</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 mt-6">
                      <label htmlFor="popup-subject" className="block text-sm font-bold uppercase tracking-wider" style={{ color: '#00283A' }}>
                        Subject
                      </label>
                      <Input
                        id="popup-subject"
                        name="subject"
                        type="text"
                        value={contactFormData.subject}
                        onChange={handleContactFormChange}
                        placeholder="What's this regarding?"
                        className="bg-white/80 border-2 border-[#00283A]/20 focus:border-[#00283A] rounded-xl py-5 px-4 text-base placeholder:text-gray-400 hover:border-[#F2C445]/50 transition-all duration-300"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2 mt-6">
                      <label htmlFor="popup-message" className="block text-sm font-bold uppercase tracking-wider" style={{ color: '#00283A' }}>
                        Your Message *
                      </label>
                      <Textarea
                        id="popup-message"
                        name="message"
                        value={contactFormData.message}
                        onChange={handleContactFormChange}
                        placeholder="Tell us about your project or inquiry..."
                        rows={4}
                        required
                        className="bg-white/80 border-2 border-[#00283A]/20 focus:border-[#00283A] rounded-xl p-4 text-base placeholder:text-gray-400 hover:border-[#F2C445]/50 transition-all duration-300 resize-none"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="mt-8">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full text-lg py-6 rounded-xl font-bold hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #00283A 0%, #00283A 50%, #F2C445 50%, #F2C445 100%)',
                          backgroundSize: '250% 250%',
                          backgroundPosition: '100% 100%',
                          color: '#F2C445',
                          border: 'none'
                        }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            <span className="text-lg font-bold">Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send style={{ color: 'black' }} className="mr-3 h-6 w-6" />
                            <p style={{ color: 'black' }} className="text-lg font-bold">Send Message Now</p>
                          </>
                        )}
                      </Button>
                    </div>


                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add CSS for high z-index */}
      <style>{`
        .z-9998 { z-index: 9998; }
        .z-9999 { z-index: 9999; }
        .z-\[10000\] { z-index: 10000; }
      `}</style>
    </>
  );
};