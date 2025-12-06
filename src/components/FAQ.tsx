import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, Loader2, AlertTriangle, MessageCircle, Phone, Copy } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';

// --- Configuration ---
const API_URL = 'https://geemadhura.braventra.in/api/faqs';

export const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState('');

  // Exponential Backoff Configuration
  const maxRetries = 3;
  const initialDelay = 1000;

  // Show only first 10 FAQs initially
  const displayedFaqs = faqs.slice(0, 10);
  
  // Phone numbers
  const phoneNumbers = [
    '+91 96090 30792',
    '+91 96090 30832',
    '+91 96090 30833'
  ];

  // WhatsApp configuration
  const whatsappNumber = '+919609030792';
  const whatsappMessage = encodeURIComponent('Hello! I have a question about your services.');

  // Function to fetch FAQs with exponential backoff
  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(errorBody.message || `HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 200 && Array.isArray(result.data)) {
          // Map API response to match your component's expected structure
          const mappedFaqs = result.data.map((item) => ({
            id: item.id,
            question: item.qus,
            answer: item.answers,
          }));
          
          setFaqs(mappedFaqs);
          setLoading(false);
          return;
        } else {
          throw new Error('Invalid data structure received from API.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        
        if (attempt < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, attempt) + Math.random() * 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error("Failed to fetch FAQs after all retries:", message);
          setError(`Failed to load FAQs: ${message}`);
          setLoading(false);
          return;
        }
      }
    }
  }, []);

  // Copy phone number to clipboard
  const copyToClipboard = (number: string) => {
    navigator.clipboard.writeText(number.replace(/\s/g, ''));
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(''), 2000);
  };

  // Make phone call
  const makePhoneCall = (number: string) => {
    window.location.href = `tel:${number.replace(/\s/g, '')}`;
  };

  // Open WhatsApp chat
  const openWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
  };

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // Loading State
  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <HelpCircle className="text-[#F2C445] mx-auto mb-4" size={48} />
            <h2 style={{color: '#00283A'}} className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find answers to common questions about our services
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" style={{color: '#00283A'}} />
            <p className="ml-3 text-lg text-muted-foreground">Loading FAQs...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <HelpCircle className="text-[#F2C445] mx-auto mb-4" size={48} />
            <h2 style={{color: '#00283A'}} className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="p-6 bg-red-100 border border-red-400 rounded-xl text-red-700 max-w-xl mx-auto flex items-center space-x-3">
            <AlertTriangle size={24} />
            <div>
              <h3 className="font-semibold text-lg">Error Loading FAQs</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (faqs.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <HelpCircle className="text-[#F2C445] mx-auto mb-4" size={48} />
            <h2 style={{color: '#00283A'}} className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find answers to common questions about our services
            </p>
          </div>
          <div className="p-6 bg-yellow-100 border border-yellow-400 rounded-xl text-yellow-800 max-w-xl mx-auto text-center">
            <p className="font-medium">No FAQs available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Animated background grid */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle, #00283A 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '30px 30px'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating question marks */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-[#00283A]/10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 40 + 20}px`,
          }}
          animate={{
            y: [0, -50, 0],
            rotate: [0, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: i * 0.5,
            repeat: Infinity,
          }}
        >
          ?
        </motion.div>
      ))}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, bounce: 0.7 }}
            className="inline-block mb-4"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <HelpCircle className="text-[#F2C445]" size={48} />
            </motion.div>
          </motion.div>

          <h2 style={{color: '#00283A'}} className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about our services
          </p>
        </motion.div>

        {/* Two column layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left column - 40% width for custom content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-2/5"
          >
            <div className="sticky top-8 space-y-6">
              {/* Contact Support Card */}
              <div className="bg-white/95 border-2 border-[#00283A]/20 rounded-xl p-6 md:p-8 backdrop-blur-sm">
                <div className="text-center">
                  <motion.div
                    className="w-20 h-20 bg-[#00283A]/10 rounded-full flex items-center justify-center mb-6 mx-auto"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  >
                    <HelpCircle className="text-[#00283A]" size={40} />
                  </motion.div>
                  
                  <h3 style={{color: '#00283A'}} className="text-xl md:text-2xl font-bold mb-4">
                    Need More Help?
                  </h3>
                  
                  {/* Contact Support Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mb-6"
                  >
                    <button 
                      onClick={() => setShowContactInfo(!showContactInfo)}
                      className="px-6 py-3 rounded-lg font-medium transition-colors w-full"
                      style={{
                        backgroundColor: '#00283A',
                        color: '#F2C445'
                      }}
                    >
                      {showContactInfo ? 'Hide Contact Info' : 'Contact Support'}
                    </button>
                  </motion.div>

                  {/* Contact Information - Conditionally shown */}
                  {showContactInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#F2C445]/10 border border-[#F2C445]/20 rounded-lg p-4 mb-6"
                    >
                      <h4 className="font-semibold text-[#00283A] mb-3 text-lg">Contact Numbers</h4>
                      <div className="space-y-3">
                        {phoneNumbers.map((number, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white/50 rounded">
                            <div className="flex items-center gap-3">
                              <Phone size={16} className="text-[#00283A]" />
                              <span className="font-medium text-[#00283A]">{number}</span>
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => makePhoneCall(number)}
                                className="p-2 bg-[#00283A] text-white rounded hover:bg-[#00283A]/90 transition-colors"
                                title="Call"
                              >
                                <Phone size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => copyToClipboard(number)}
                                className="p-2 bg-[#F2C445] text-[#00283A] rounded hover:bg-[#F2C445]/90 transition-colors"
                                title="Copy"
                              >
                                {copiedNumber === number ? (
                                  <span className="text-xs font-medium">Copied!</span>
                                ) : (
                                  <Copy size={16} />
                                )}
                              </motion.button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 text-center">
                        Click the phone icon to call or copy icon to copy number
                      </p>
                    </motion.div>
                  )}

                  {/* WhatsApp Chat Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mb-6"
                  >
                    <button 
                      onClick={openWhatsApp}
                      className="px-6 py-3 rounded-lg font-medium transition-colors w-full flex items-center justify-center gap-3"
                      style={{
                        backgroundColor: '#25D366',
                        color: 'white'
                      }}
                    >
                      <MessageCircle size={20} />
                      Chat with us on WhatsApp
                    </button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Click to start a WhatsApp chat with our team
                    </p>
                  </motion.div>
                </div>
              </div>

            
            </div>
          </motion.div>

          {/* Right column - 60% width for FAQs */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-3/5"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {displayedFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, x: -50, rotate: -5 }}
                    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      type: 'spring',
                      bounce: 0.4,
                    }}
                    whileHover={{
                      x: 10,
                      scale: 1.02,
                    }}
                  >
                    <AccordionItem
                      value={`item-${faq.id}`}
                      className="bg-white/95 border-2 border-[#00283A]/20 rounded-xl px-6 data-[state=open]:border-[#00283A] transition-all duration-300 relative overflow-hidden group backdrop-blur-sm"
                    >
                      <AccordionTrigger className="text-left hover:text-[#00283A] transition-colors py-5 relative z-10">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-8 h-8 rounded-full bg-[#00283A]/10 flex items-center justify-center flex-shrink-0"
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.5 }}
                          >
                            <span className="text-[#00283A] font-bold text-sm">{index + 1}</span>
                          </motion.div>
                          <span className="font-semibold text-base md:text-lg">
                            {faq.question}
                          </span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="text-muted-foreground leading-relaxed pb-5 relative z-10">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {faq.answer}
                        </motion.div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>

              {/* Show All FAQs Button (only if there are more than 10) */}
              {faqs.length > 10 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-8 text-center"
                >
                  <Link
                    to="/faq"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:gap-3 hover:shadow-lg"
                    style={{
                      backgroundColor: '#00283A',
                      color: '#F2C445'
                    }}
                  >
                    
                    View All FAQs ({faqs.length})
                    <ChevronDown size={20} />
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2">
                    Showing 10 of {faqs.length} FAQs
                  </p>
                </motion.div>
              )}

              {/* Floating help indicator */}
              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: 'spring', bounce: 0.6 }}
              >
                <p className="text-muted-foreground">
                  Can't find your answer?{' '}
                  <button
                    onClick={() => setShowContactInfo(true)}
                    className="font-semibold underline hover:text-[#F2C445] transition-colors"
                    style={{color: '#00283A'}}
                  >
                    Contact our support team
                  </button>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};