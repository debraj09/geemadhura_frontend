import { motion } from 'framer-motion';
import { Target, Users, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Years of Excellence', value: '15+' },
  { label: 'Successful Projects', value: '500+' },
  { label: 'Global Clients', value: '200+' },
  { label: 'Team Members', value: '150+' },
];

const values = [
  {
    icon: Target,
    title: 'Innovation First',
    description: 'We push boundaries and embrace cutting-edge solutions to drive transformation.',
  },
  {
    icon: Users,
    title: 'Client-Centric',
    description: 'Your success is our mission. We build lasting partnerships based on trust.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in everything we do, delivering quality results.',
  },
  {
    icon: TrendingUp,
    title: 'Growth Focus',
    description: 'We help businesses scale and thrive in an ever-changing digital landscape.',
  },
];

const About = () => {
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About Geeemadhura Innovations
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We are a leading corporate innovation and business solutions provider, empowering
              organizations to thrive in the digital age through strategic transformation and
              cutting-edge technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-primary-foreground/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded with a vision to transform businesses through innovation, Geeemadhura
                  Innovations has grown into a trusted partner for organizations worldwide. Our
                  journey began with a simple belief: technology should empower, not complicate.
                </p>
                <p>
                  Over the years, we've helped hundreds of businesses navigate digital
                  transformation, optimize operations, and achieve sustainable growth. Our team of
                  experts combines deep technical knowledge with strategic business insight to
                  deliver solutions that make a real difference.
                </p>
                <p>
                  Today, we continue to push boundaries, embrace emerging technologies, and
                  maintain our commitment to excellence in everything we do.
                </p>
              </div>
              <Button
                size="lg"
                className="mt-8 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Learn About Our Services
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide our work and relationships
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-card border border-border rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <value.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
