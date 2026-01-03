import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, Globe, Building, Compass, 
  CheckCircle, AlertCircle, Loader2, ExternalLink, Navigation
} from 'lucide-react';
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
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service_id: string;
  subject: string;
  message: string;
}

interface Location {
  icon: any;
  title: string;
  address: string;
  pin: string;
  region: string;
  coordinates: string;
  googleMapsUrl: string;
  mapIframeUrl: string;
  isHeadquarters?: boolean;
}

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    value: '9609030792 | 9609030832 | 9609030833',
    link: 'tel:+919609030792',
    color: 'from-blue-500/10 to-blue-600/10',
    iconColor: 'text-blue-600'
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'info@geemadhurainnovations.com',
    link: 'mailto:info@geemadhurainnovations.com',
    color: 'from-red-500/10 to-red-600/10',
    iconColor: 'text-red-600'
  },
  {
    icon: Globe,
    title: 'Online Services',
    value: 'Apply from anywhere in India',
    link: null,
    color: 'from-green-500/10 to-green-600/10',
    iconColor: 'text-green-600'
  },
];

// Google Maps URLs and iframe URLs for each location
const locations: Location[] = [
  {
    icon: Compass,
    title: 'North East Service',
    address: 'Siliguri',
    pin: 'Serving North East region with expert services',
    region: 'North East',
    coordinates: '26.7271° N, 88.3953° E',
    googleMapsUrl: 'https://maps.google.com/?q=Siliguri,West+Bengal',
    mapIframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28566.11106948786!2d88.3953!3d26.7271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e4414e9c0f2c7b%3A0x8c2a2b5d5b5b5b5b!2sSiliguri!5e0!3m2!1sen!2sin!4v1634021234567!5m2!1sen!2sin'
  },
  {
    icon: Building,
    title: 'Headquarters',
    address: 'Jalpaiguri - Raikat Para, Opposite Sports Complex 2nd Gate',
    pin: 'Pin - 735101',
    region: 'West Bengal',
    coordinates: '26.5167° N, 88.7333° E',
    googleMapsUrl: 'https://maps.app.goo.gl/diKY3LyH8Zmi1ua79',
    mapIframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3569.854330628611!2d88.7333!3d26.5167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e4414e9c0f2c7b%3A0x8c2a2b5d5b5b5b!2sJalpaiguri%20-%20Raikat%20Para%2C%20Opposite%20Sports%20Complex%202nd%20Gate!5e0!3m2!1sen!2sin!4v1634021234567!5m2!1sen!2sin',
    isHeadquarters: true
  },
  {
    icon: Compass,
    title: 'Western Bengal Services',
    address: 'Coochbeher',
    pin: 'Serving Western Bengal with expert food safety solutions',
    region: 'West Bengal',
    coordinates: '26.3167° N, 89.4333° E',
    googleMapsUrl: 'https://maps.google.com/?q=Coochbehar,West+Bengal',
    mapIframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28438.85632151554!2d89.4333!3d26.3167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e3d8b9b9b9b9b9%3A0x9b9b9b9b9b9b9b9b!2sCoochbehar!5e0!3m2!1sen!2sin!4v1634021234567!5m2!1sen!2sin'
  }
];

const BASE_URL = 'https://geemadhura.braventra.in';

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service_id: '',
    subject: '',
    message: '',
  });
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapLoaded, setMapLoaded] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  // Fetch active services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true);
        const response = await fetch(`${BASE_URL}/api/services`);
        const data = await response.json();
        
        if (data.status === 200 && Array.isArray(data.data)) {
          const activeServices = data.data
            .filter((service: Service) => service.is_active)
            .sort((a: Service, b: Service) => a.display_order - b.display_order);
          
          setServices(activeServices);
        } else {
          setServices([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
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
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^[0-9+\-\s()]{10,15}$/.test(formData.phone.replace(/\s+/g, ''))) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number (10-15 digits).',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          service_id: formData.service_id ? parseInt(formData.service_id) : null,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === 201) {
        toast({
          title: 'Message Sent Successfully!',
          description: 'Thank you for contacting us. We will get back to you soon.',
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          service_id: '',
          subject: '',
          message: '',
        });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openGoogleMaps = (url: string) => {
    window.open(url, '_blank');
  };

  const handleMapLoad = (index: number) => {
    setMapLoaded(prev => ({ ...prev, [index]: true }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFFF7] to-white">
      {/* Hero Section with Gradient Background */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00283A]/5 via-transparent to-[#F2C445]/5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2C445]/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00283A]/10 rounded-full translate-y-64 -translate-x-64 blur-3xl" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-[#00283A] to-[#F2C445] rounded-full mx-auto" />
              <div className="w-16 h-1 bg-gradient-to-r from-[#F2C445] to-[#00283A] rounded-full mx-auto mt-1" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
              <span style={{ color: '#00283A' }}>GET IN </span>
              <span className="text-[#F2C445]">TOUCH</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#00283A]/70 max-w-2xl mx-auto leading-relaxed">
              Ready to transform your digital journey? Reach out and let's create something amazing together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Contact Info & Headquarters Map */}
            <div className="lg:col-span-1 space-y-8">
              {/* Contact Info Cards */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-3xl border-2 border-[#00283A]/10 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-[#F2C445]/50">
                  <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-[#00283A]/10" style={{ color: '#00283A' }}>
                    Quick Connect
                  </h2>
                  
                  <div className="space-y-4">
                    {contactInfo.map((info, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`p-4 rounded-2xl bg-gradient-to-br ${info.color} border border-white/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300 group`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-white/80 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 ${info.iconColor}`}>
                            <info.icon size={22} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-[#00283A]/60 mb-1">
                              {info.title}
                            </h3>
                            {info.link ? (
                              <a
                                href={info.link}
                                className="text-[#00283A] font-semibold text-base hover:text-[#F2C445] transition-colors duration-300 group-hover:underline"
                              >
                                {info.value}
                              </a>
                            ) : (
                              <p className="text-[#00283A] font-semibold text-base">{info.value}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Headquarters Map Section */}
              {locations.find(loc => loc.isHeadquarters) && (() => {
                const headquarters = locations.find(loc => loc.isHeadquarters)!;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="bg-white rounded-3xl border-2 border-[#00283A]/10 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                    onClick={() => openGoogleMaps(headquarters.googleMapsUrl)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: '#00283A' }}>
                          <Navigation className="text-[#F2C445]" size={20} />
                          Visit Our Headquarters
                        </h3>
                        <ExternalLink className="text-[#00283A]/40 group-hover:text-[#F2C445] transition-colors" size={18} />
                      </div>
                      
                      <div className="relative overflow-hidden rounded-2xl border-2 border-[#00283A]/10 aspect-video">
                        {/* Fallback map image */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-[#00283A]/5 to-[#F2C445]/5 flex items-center justify-center transition-opacity duration-500 ${mapLoaded[1] ? 'opacity-0' : 'opacity-100'}`}>
                          <div className="text-center">
                            <MapPin className="h-12 w-12 text-[#00283A]/30 mx-auto mb-3" />
                            <p className="text-[#00283A]/50 font-medium">Loading map...</p>
                          </div>
                        </div>
                        
                        {/* Interactive Map Frame */}
                        <iframe
                          src={headquarters.mapIframeUrl}
                          className="absolute inset-0 w-full h-full border-0"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          onLoad={() => handleMapLoad(1)}
                          title="Google Maps - Geemadhura Headquarters"
                        />
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <p className="text-[#00283A] font-medium">
                          {headquarters.address}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#00283A]/60">{headquarters.pin}</span>
                          <span className="text-sm font-medium text-[#F2C445] bg-[#00283A]/10 px-3 py-1 rounded-full">
                            Headquarters
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#F2C445]/10 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#00283A]/10 rounded-full blur-xl" />
                
                <div className="bg-gradient-to-br from-white via-white to-[#FFFFF7] rounded-3xl border-2 border-[#00283A]/10 p-8 lg:p-10 shadow-2xl relative overflow-hidden">
                  {/* Pattern Background */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#00283A]/[0.02] to-transparent rounded-full -translate-y-32 translate-x-32" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-[#00283A] to-[#00283A]/80">
                        <Send className="text-white" size={24} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black" style={{ color: '#00283A' }}>
                          Send Your Message
                        </h2>
                        <p className="text-[#00283A]/60">We'll respond within 24 hours</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="block text-sm font-bold uppercase tracking-wider" style={{ color: '#00283A' }}>
                            Your Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className="bg-white/80 border-2 border-[#00283A]/20 focus:border-[#00283A] rounded-xl py-6 px-4 text-base placeholder:text-gray-400 hover:border-[#F2C445]/50 transition-all duration-300"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider" style={{ color: '#00283A' }}>
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            required
                            className="bg-white/80 border-2 border-[#00283A]/20 focus:border-[#00283A] rounded-xl py-6 px-4 text-base placeholder:text-gray-400 hover:border-[#F2C445]/50 transition-all duration-300"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="phone" className="block text-sm font-bold uppercase tracking-wider" style={{ color: '#00283A' }}>
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 00000 00000"
                            className="bg-white/80 border-2 border-[#00283A]/20 focus:border-[#00283A] rounded-xl py-6 px-4 text-base placeholder:text-gray-400 hover:border-[#F2C445]/50 transition-all duration-300"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="service_id" className="block text-sm font-bold uppercase tracking-wider" style={{ color: '#00283A' }}>
                            Service Interested
                          </label>
                          <select
                            id="service_id"
                            name="service_id"
                            value={formData.service_id}
                            onChange={handleChange}
                            className="w-full bg-white/80 border-2 border-[#00283A]/20 focus:border-[#00283A] rounded-xl py-5 px-4 text-base placeholder:text-gray-400 hover:border-[#F2C445]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

                      <div className="space-y-2">
                        <label htmlFor="subject" className="block text-sm font-bold uppercase tracking-wider" style={{ color: '#00283A' }}>
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What's this regarding?"
                          className="bg-white/80 border-2 border-[#00283A]/20 focus:border-[#00283A] rounded-xl py-6 px-4 text-base placeholder:text-gray-400 hover:border-[#F2C445]/50 transition-all duration-300"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="block text-sm font-bold uppercase tracking-wider" style={{ color: '#00283A' }}>
                          Your Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us about your project or inquiry..."
                          rows={6}
                          required
                          className="bg-white/80 border-2 border-[#00283A]/20 focus:border-[#00283A] rounded-xl p-4 text-base placeholder:text-gray-400 hover:border-[#F2C445]/50 transition-all duration-300 resize-none"
                          disabled={isSubmitting}
                        />
                      </div>

                      <motion.div
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        className="pt-4"
                      >
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full text-lg py-7 rounded-xl font-bold hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
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
                              <Loader2 className="animate-spin" />
                              <span className="text-lg font-bold">Sending Your Message...</span>
                            </>
                          ) : (
                            <>
                              <Send style={{color: 'black'}} className="mr-3 h-6 w-6" />
                              <p style={{color: 'black'}} className="text-lg font-bold">Send Message Now</p>
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Full Width Location Cards Section with Maps */}
          <div className="mt-12 md:mt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Section Header */}
              <div className="text-center mb-10">
                <div className="inline-block mb-4">
                  <div className="w-20 h-1 bg-gradient-to-r from-[#00283A] to-[#F2C445] rounded-full mx-auto" />
                  <div className="w-12 h-1 bg-gradient-to-r from-[#F2C445] to-[#00283A] rounded-full mx-auto mt-1" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#00283A' }}>
                  Our <span className="text-[#F2C445]">Service</span> Locations
                </h2>
                <p className="text-[#00283A]/60 mt-3 max-w-2xl mx-auto">
                  Serving across multiple regions with dedicated service centers
                </p>
              </div>

              {/* Full Width Cards Grid with Maps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {locations.map((location, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-[#00283A]/10 overflow-hidden hover:border-[#F2C445]/50 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex flex-col h-full">
                      {/* Map Section */}
                      <div className="relative aspect-video overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00283A]/5 to-[#F2C445]/5 flex items-center justify-center transition-opacity duration-500" />
                        
                        <iframe
                          src={location.mapIframeUrl}
                          className="absolute inset-0 w-full h-full border-0"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`Google Maps - ${location.title}`}
                          style={{ filter: 'grayscale(0.3)' }}
                        />
                        
                        {/* Map Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      </div>

                      {/* Location Info */}
                      <div className="p-5 flex-1">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-[#00283A]/10 to-[#F2C445]/10 group-hover:from-[#00283A]/20 group-hover:to-[#F2C445]/20 transition-all duration-300">
                            <location.icon className="text-[#00283A]" size={22} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-bold text-[#00283A] text-lg">{location.title}</h4>
                              {location.isHeadquarters ? (
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#F2C445] text-[#00283A]">
                                  Headquarters
                                </span>
                              ) : (
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#00283A]/10 text-[#00283A]">
                                  {location.region}
                                </span>
                              )}
                            </div>
                            <p className="text-[#00283A]/70 text-sm font-medium mb-1">{location.address}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-[#00283A]/60 text-xs mb-2">{location.pin}</p>
                          <p className="text-[#00283A]/50 text-xs font-mono">{location.coordinates}</p>
                        </div>
                        
                        <div className="mt-auto pt-3 border-t border-[#00283A]/10">
                          <button
                            onClick={() => openGoogleMaps(location.googleMapsUrl)}
                            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-[#00283A] hover:text-[#F2C445] transition-colors duration-300 group/view-map"
                          >
                            <Navigation size={16} />
                            <span>View on Google Maps</span>
                            <ExternalLink size={14} className="opacity-0 group-hover/view-map:opacity-100 transition-opacity" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map Legend */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-[#00283A]/60">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#F2C445] rounded-full"></div>
                  <span>Headquarters</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#00283A]/20 rounded-full"></div>
                  <span>Service Centers</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00283A] to-[#00283A]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(#F2C445_1px,transparent_1px)] [background-size:20px_20px] opacity-5" />            
            <div className="relative py-12 px-8 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Start Your Project?
              </h3>
              <p className="text-[#F2C445] text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of satisfied clients who have transformed their businesses with our solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-[#00283A] hover:bg-[#F2C445] hover:text-[#00283A] px-8 py-6 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                  onClick={() => openGoogleMaps(locations.find(l => l.isHeadquarters)?.googleMapsUrl || '#')}
                >
                  <Navigation className="mr-2" size={20} />
                  Visit Our Office
                </Button>
                <a href="tel:+919609030792">
                  <Button
                    size="lg"
                    className="bg-[#F2C445] text-[#00283A] hover:bg-white hover:text-[#00283A] px-8 py-6 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 border-2 border-[#F2C445]"
                  >
                    <Phone className="mr-2" size={20} />
                    Call Now: 9609030792
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Contact;