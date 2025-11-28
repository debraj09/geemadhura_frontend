import { motion } from 'framer-motion';

export const FloatingElements = () => {
  const circles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className="absolute rounded-full"
          style={{
            width: circle.size,
            height: circle.size,
            left: `${circle.x}%`,
            top: `${circle.y}%`,
            background: `radial-gradient(circle, rgba(219, 29, 48, 0.1), rgba(255, 210, 0, 0.05))`,
            filter: 'blur(40px)',
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: circle.duration,
            repeat: Infinity,
            delay: circle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
