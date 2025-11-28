import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';
import updates from '@/data/updates.json';

export const NewUpdates = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-background relative overflow-hidden">
      <motion.div
        className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-accent-yellow/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.6 }}
            className="inline-block mb-4"
          >
            <Sparkles className="text-accent-yellow animate-pulse-glow" size={48} />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Updates</h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Stay informed with our latest news and announcements
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {updates.map((update, index) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 100, rotate: -10, scale: 0.5 }}
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
                duration: 0.6,
                delay: index * 0.15,
                type: 'spring',
                bounce: 0.5,
              }}
              whileHover={{
                y: -15,
                rotate: [0, -2, 2, 0],
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              className="perspective-card bg-card border-2 border-border rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-primary transition-all duration-300 cursor-pointer relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-yellow/10 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6 }}
              />

              <motion.div
                className="flex items-center gap-2 text-accent-yellow text-sm mb-3"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Clock size={16} className="animate-pulse-glow" />
                <span>{new Date(update.timestamp).toLocaleDateString()}</span>
              </motion.div>

              <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                {update.title.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-1"
                    whileHover={{ y: -5, color: 'hsl(var(--accent-yellow))' }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed">{update.text}</p>

              <motion.div
                className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"
                animate={{ rotate: [0, 90, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
