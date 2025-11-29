import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, Loader2, AlertTriangle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// --- Configuration ---
const API_URL = 'https://geemadhura.braventra.in/api/faqs';

export const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Exponential Backoff Configuration
  const maxRetries = 3;
  const initialDelay = 1000;

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

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // Loading State
  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <HelpCircle className="text-accent-yellow mx-auto mb-4" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find answers to common questions about our services
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
            <HelpCircle className="text-accent-yellow mx-auto mb-4" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
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
            <HelpCircle className="text-accent-yellow mx-auto mb-4" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
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
            'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
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
          className="absolute text-primary/10"
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
              <HelpCircle className="text-accent-yellow" size={48} />
            </motion.div>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about our services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
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
                  className="bg-card border-2 border-border rounded-xl px-6 data-[state=open]:border-primary transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Animated background on open */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent-yellow/5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    initial={{ x: '-100%', skewX: -20 }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.8 }}
                  />

                  <AccordionTrigger className="text-left hover:text-primary transition-colors py-5 relative z-10">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="text-primary font-bold text-sm">{index + 1}</span>
                      </motion.div>
                      <span className="font-semibold text-base md:text-lg">
                        {faq.question.split(' ').map((word, i) => (
                          <motion.span
                            key={i}
                            className="inline-block mr-1"
                            whileHover={{
                              y: -3,
                              color: 'hsl(var(--accent-yellow))',
                            }}
                            transition={{ type: 'spring', bounce: 0.6 }}
                          >
                            {word}
                          </motion.span>
                        ))}
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

                  {/* Corner decoration */}
                  <motion.div
                    className="absolute top-0 right-0 w-16 h-16 bg-accent-yellow/5 rounded-bl-full"
                    animate={{ rotate: [0, 90, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Floating help indicator */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, type: 'spring', bounce: 0.6 }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <p className="text-muted-foreground">
              Still have questions?{' '}
              <motion.a
                href="/contact"
                className="text-primary hover:text-accent-yellow font-semibold underline"
                whileHover={{ scale: 1.1 }}
              >
                Contact us
              </motion.a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};