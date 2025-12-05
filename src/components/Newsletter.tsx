import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success!',
      description: 'Thank you for subscribing to our newsletter.',
    });
    setEmail('');
  };

  return (
    <section className="py-16 md:py-24 bg-[#00283A] relative overflow-hidden">
      {/* Subtle animated background element */}
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-[#F2C445]/10 rounded-full blur-3xl"
        animate={{
          scale: [1.5, 1, 1.5],
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, bounce: 0.7 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-[#F2C445]/20 rounded-full mb-6"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Mail className="text-[#F2C445]" size={40} />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
          >
            {['Stay', 'Updated'].map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-3"
                whileHover={{
                  y: -10,
                  color: '#F2C445',
                }}
                transition={{ type: 'spring', bounce: 0.7 }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-white/80 text-lg mb-8"
          >
            Subscribe to our newsletter for the latest updates, insights, and industry news.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring', bounce: 0.4 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative"
          >
            <motion.div
              className="flex-1 relative"
              whileFocus={{ scale: 1.02 }}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-2 border-white/30 focus:border-[#F2C445] h-12 text-base placeholder:text-gray-500"
                required
              />
              <motion.div
                className="absolute inset-0 border-2 border-[#F2C445] rounded-md pointer-events-none"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: 1.05, opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                size="lg"
                className="font-semibold transition-all duration-300 shadow-lg h-12 relative overflow-hidden group"
                style={{
                  backgroundColor: '#F2C445',
                  color: '#00283A',
                  borderColor: '#F2C445'
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: '-100%', skewX: -20 }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Subscribe
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Send size={18} />
                  </motion.div>
                </span>
              </Button>
            </motion.div>
          </motion.form>

          {/* Success indicator particles - YELLOW THEME */}
          <motion.div
            className="flex justify-center gap-2 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#F2C445] rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};