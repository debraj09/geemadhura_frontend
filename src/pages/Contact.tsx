import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Globe, Building, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    value: '9609030792 | 9609030832 | 9609030833',
    link: 'tel:+919609030792',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'info@geemadhurainnovations.com',
    link: 'mailto:info@geemadhurainnovations.com'
  },
  {
    icon: Globe,
    title: 'Online Services',
    value: 'Apply from anywhere in India',
    link: null,
  },
];

const locations = [
  {
    icon: Building,
    title: 'North Bengal Headquarters',
    address: 'Jalpaiguri - Raikat Para, Opposite Sports Complex 2nd Gate',
    pin: 'Pin - 735101',
    region: 'West Bengal'
  },
  {
    icon: Compass,
    title: 'North East Service',
    address: 'Siliguri',
    pin: 'Serving North East region with expert services',
    region: 'North East'
  },
  {
    icon: Building,
    title: 'Eastern India Expansion',
    address: 'Kolkata',
    pin: 'Our newest branch catering to Eastern India region',
    region: 'Eastern India'
  },
  {
    icon: Compass,
    title: 'Western Bengal Services',
    address: 'Coochbeher',
    pin: 'Serving Western Bengal with expert food safety solutions',
    region: 'West Bengal'
  }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Message Sent!',
      description: 'Thank you for contacting us. We will get back to you soon.',
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section - Reduced padding */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 style={{color: '#00283A'}} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Have a question or ready to start your digital transformation journey? We're here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section - Reduced padding */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div>
                <h2 style={{color: '#00283A'}} className="text-2xl md:text-3xl font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Reach out to us through any of the following channels. Our team is ready to assist you.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/95 border-2 border-[#00283A]/20 rounded-xl p-5 hover:border-[#F2C445] transition-all duration-300 group backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-[#00283A]/10 p-3 rounded-lg group-hover:bg-[#00283A] transition-all duration-300">
                        <info.icon className="text-[#00283A] group-hover:text-[#F2C445] transition-all duration-300" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 style={{color: '#00283A'}} className="font-semibold text-lg mb-1 group-hover:text-[#00283A]/90 transition-colors duration-300">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-muted-foreground hover:text-[#F2C445] transition-colors duration-300 text-base"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground text-base">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pan-India Presence Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/95 border-2 border-[#00283A]/20 rounded-2xl p-6 mt-6 backdrop-blur-sm hover:border-[#F2C445] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#00283A]/10 flex items-center justify-center">
                    <MapPin className="text-[#00283A]" size={22} />
                  </div>
                  <div>
                    <h3 style={{color: '#00283A'}} className="text-xl font-bold">Our Pan-India Presence</h3>
                    <p className="text-[#F2C445] text-sm font-medium">Serving All Across India</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {locations.map((location, index) => (
                    <div key={index} className="border-l-4 border-[#F2C445] pl-4 py-1">
                      <h4 style={{color: '#00283A'}} className="font-semibold text-base mb-1">{location.title}:</h4>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">
                          📍 {location.address}
                        </p>
                        <p className="text-muted-foreground text-sm">{location.pin}</p>
                        <span className="inline-block px-2 py-1 text-xs bg-[#00283A]/10 text-[#00283A] rounded">
                          {location.region}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Online Services */}
                  <div className="border-l-4 border-[#00283A] pl-4 py-1 mt-3">
                    <h4 style={{color: '#00283A'}} className="font-semibold text-base mb-1">Online Services:</h4>
                    <p className="text-muted-foreground text-sm">
                      🌐 Nationwide - Apply from anywhere in India
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="bg-white/95 border-2 border-[#00283A]/20 rounded-2xl p-6 md:p-8 shadow-lg hover:border-[#F2C445] transition-all duration-300 backdrop-blur-sm">
                <h3 style={{color: '#00283A'}} className="text-2xl font-bold mb-6">Send us a Message</h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2" style={{color: '#00283A'}}>
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="bg-white border-2 border-[#00283A]/20 focus:border-[#00283A] placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{color: '#00283A'}}>
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="bg-white border-2 border-[#00283A]/20 focus:border-[#00283A] placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{color: '#00283A'}}>
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subject"
                      className="bg-white border-2 border-[#00283A]/20 focus:border-[#00283A] placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2" style={{color: '#00283A'}}>
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message..."
                      rows={5}
                      required
                      className="bg-white border-2 border-[#00283A]/20 focus:border-[#00283A] resize-none placeholder:text-gray-400"
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="pt-2"
                  >
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-lg py-6 border-2 hover:border-[#F2C445] transition-all duration-300"
                      style={{
                        backgroundColor: '#00283A',
                        color: '#F2C445',
                        borderColor: '#00283A'
                      }}
                    >
                      <Send className="mr-2" size={20} />
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              </div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-[#00283A]/5 border-2 border-[#00283A]/10 rounded-xl p-5 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  <span style={{color: '#00283A'}} className="font-semibold">Response Time:</span> We typically respond within 24-48 hours during business days.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map/Additional Info Section */}
      <section className="py-12 md:py-16 bg-muted/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 style={{color: '#00283A'}} className="text-2xl md:text-3xl font-bold mb-4">We're Here to Help</h2>
            <p className="text-muted-foreground text-base mb-6 max-w-2xl mx-auto">
              Whether you're in North Bengal, North East, Eastern India, or anywhere else in the country, 
              our team is ready to assist you with your needs.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {['Jalpaiguri', 'Siliguri', 'Kolkata', 'Coochbeher'].map((city, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/95 border-2 border-[#00283A]/20 rounded-xl p-3 hover:border-[#F2C445] transition-all duration-300"
                >
                  <span style={{color: '#00283A'}} className="font-medium">{city}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Contact;