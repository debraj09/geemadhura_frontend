import { motion } from 'framer-motion';
import { Award, Users, CheckCircle, Shield, Briefcase, HeadphonesIcon, BookOpen, TargetIcon, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Gourab from "@/assets/Gourab.jpeg";
import Mousumi from "@/assets/Mousumi.jpeg";
import ourstory from "../assets/ourstory.jpeg";
import { useEffect } from 'react';
const stats = [
  { label: 'Years of Excellence', value: '7+' },
  { label: 'Compliance Experts', value: '15+' },
  { label: 'Successful Cases', value: '1000+' },
  { label: 'Happy Clients', value: '500+' },
];

const directors = [
  {
    name: 'Mr. Gourab Sanyal',
    designation: 'Founder & CEO',
    image: Gourab,
    experience: 'Expert knowledge of Indian regulations & compliance',
    speech: 'At Geeemadhura, we believe in simplifying compliance for businesses. Our mission is to bridge the gap between complex regulations and business operations, ensuring seamless compliance and sustainable growth.',
    expertise: 'FSSAI Compliance, Business Licensing, Government Regulations'
  },
  {
    name: 'Mrs. Mousumi Sanyal',
    designation: 'Co-Founder & CMD',
    image: Mousumi,
    experience: 'Strong government relationships & strategic partnerships',
    speech: 'We focus on building strong relationships and creating robust compliance solutions that empower businesses to operate confidently within regulatory frameworks.',
    expertise: 'Government Liaison, Strategic Planning, Corporate Compliance'
  }
];

const teamExpertise = [
  {
    icon: CheckCircle,
    title: 'Certified Compliance Consultants',
    description: 'Professionally certified experts ensuring accurate compliance'
  },
  {
    icon: Shield,
    title: 'FSSAI Training Partners',
    description: 'Authorized training partners for food safety certification'
  },
  {
    icon: BookOpen,
    title: 'Legal Advisors',
    description: 'Expert legal guidance for regulatory compliance'
  },
  {
    icon: Users,
    title: 'Government Relations Specialists',
    description: 'Strong connections with regulatory authorities'
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Customer Support Team',
    description: 'Round-the-clock assistance for all your queries'
  },
  {
    icon: Briefcase,
    title: 'Compliance Process Experts',
    description: 'Streamlined processes for efficient compliance management'
  }
];



const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 style={{ color: '#00283A' }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About Geeemadhura Innovations
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Your trusted partner for comprehensive compliance solutions and regulatory expertise across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16" style={{ backgroundColor: '#00283A' }}>
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
                <div style={{ color: '#F2C445' }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-base md:text-lg text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-24">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Image Container - Replaced the gradient with actual image */}
        <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#00283A]/20 hover:border-[#F2C445] transition-all duration-300 group">
          {/* Actual Image */}
          <img 
            src={ourstory}  
            alt="Our Story - Geeemadhura Innovations Journey"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#00283A]/30 via-transparent to-transparent"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#00283A]/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#F2C445]/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        {/* Floating badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="absolute -bottom-6 -right-6 bg-[#F2C445] text-[#00283A] px-8 py-4 rounded-2xl shadow-xl border-2 border-[#F2C445] hover:border-[#00283A] transition-all duration-300 z-10"
        >
          <span className="font-bold text-lg">Since 2016</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 style={{ color: '#00283A' }} className="text-3xl md:text-4xl font-bold mb-8">Our Journey</h2>
        <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
          <p>
            Founded in 2016, Geeemadhura Innovations began with a simple vision: to simplify compliance
            for Indian businesses. We recognized the challenges companies face in navigating complex
            regulatory frameworks and committed ourselves to making this process seamless.
          </p>
          <p>
            Over the years, we've grown from a small consultancy to a trusted partner for hundreds
            of businesses across India. Our team of experts combines deep regulatory knowledge with
            practical business insight to deliver solutions that ensure compliance while driving growth.
          </p>
          <p>
            Today, we continue to expand our services, enhance our expertise, and strengthen our
            government relationships to better serve our clients across all major cities in India.
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 inline-block"
        >
          <a href="/services">
          <Button
            size="lg"
            className="px-10 py-6 text-lg border-2 hover:border-[#F2C445] transition-all duration-300"
            style={{
              backgroundColor: '#00283A',
              color: '#F2C445',
              borderColor: '#00283A'
            }}
          >
            Explore Our Services
          </Button>
          </a>
        </motion.div>
      </motion.div>
    </div>
  </div>
</section>

      {/* Leadership Team Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-muted/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#F2C445]"></div>
              <span className="text-[#00283A] font-semibold uppercase tracking-wider text-sm">Our Leadership</span>
              <div className="w-12 h-1 bg-[#F2C445]"></div>
            </div>
            <h2 style={{ color: '#00283A' }} className="text-4xl md:text-5xl font-bold mb-4">Meet Our Founders</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              7+ years of combined compliance experience with expert knowledge of Indian regulations
            </p>
          </motion.div>

          <div className="space-y-20">
            {directors.map((director, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.3 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
              >
                {/* Image Side */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
  <div className="relative group">
    {/* Main image container */}
    <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#00283A]/20 group-hover:border-[#F2C445] transition-all duration-300 bg-gradient-to-br from-[#00283A]/5 to-[#F2C445]/5">
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src={director.image} 
          alt={director.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
    </div>
    
    {/* Expertise badge */}
    <div className="absolute -bottom-6 left-8 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl border-2 border-[#00283A]/10 hover:border-[#F2C445] transition-all duration-300 group-hover:shadow-2xl">
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-full bg-[#00283A]/10 flex items-center justify-center group-hover:bg-[#00283A] transition-all duration-300"
        >
          <Award className="text-[#00283A] group-hover:text-[#F2C445] transition-all duration-300" size={20} />
        </motion.div>
        <div>
          <p className="text-sm text-muted-foreground">Expertise</p>
          <p className="font-semibold text-[#00283A]">{director.experience}</p>
        </div>
      </div>
    </div>
  </div>
</div>
                </div>

                {/* Content Side */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="relative group">
                    <div className="relative z-10 bg-white/95 backdrop-blur-sm border-2 border-[#00283A]/20 rounded-3xl p-8 shadow-xl group-hover:border-[#F2C445] transition-all duration-300 group-hover:shadow-2xl">
                      {/* Designation */}
                      <div className="inline-block px-4 py-2 bg-[#00283A] text-white rounded-lg mb-6 border-2 border-[#00283A] group-hover:border-[#F2C445] transition-all duration-300">
                        <span className="font-medium">{director.designation}</span>
                      </div>

                      {/* Name */}
                      <h3 style={{ color: '#00283A' }} className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-[#00283A]/90 transition-colors duration-300">{director.name}</h3>

                      {/* Message */}
                      <div className="relative mb-8">
                        <p className="text-lg text-muted-foreground leading-relaxed italic pl-6 border-l-4 border-[#F2C445] group-hover:text-[#00283A]/80 transition-colors duration-300">
                          "{director.speech}"
                        </p>
                      </div>

                      {/* Expertise areas */}
                      <div className="mt-6 pt-6 border-t border-[#00283A]/10">
                        <h4 className="text-sm font-semibold text-[#00283A] mb-3 uppercase tracking-wide">Specialization Areas:</h4>
                        <p className="text-muted-foreground text-base">
                          {director.expertise}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Expertise Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#F2C445]"></div>
              <span className="text-[#00283A] font-semibold uppercase tracking-wider text-sm">Our Team Expertise</span>
              <div className="w-12 h-1 bg-[#F2C445]"></div>
            </div>
            <h2 style={{ color: '#00283A' }} className="text-4xl md:text-5xl font-bold mb-4">Our Team Includes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A dedicated team of professionals ensuring your compliance needs are met with expertise and precision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamExpertise.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/95 border-2 border-[#00283A]/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:border-[#F2C445] backdrop-blur-sm"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 rounded-full bg-[#00283A]/10 flex items-center justify-center mb-6 border-2 border-transparent group-hover:border-[#F2C445] group-hover:bg-[#00283A] transition-all duration-300"
                  >
                    <item.icon className="text-[#00283A] group-hover:text-[#F2C445] transition-all duration-300" size={36} />
                  </motion.div>
                  <h3 style={{ color: '#00283A' }} className="text-xl font-bold mb-4 group-hover:text-[#00283A]/90 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed group-hover:text-[#00283A]/80 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Expertise Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 bg-gradient-to-r from-[#00283A]/5 to-[#F2C445]/5 border-2 border-[#00283A]/20 rounded-3xl p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#00283A]/10 flex items-center justify-center mx-auto mb-4">
                  <span style={{ color: '#00283A' }} className="text-2xl font-bold">7+</span>
                </div>
                <h4 className="font-bold text-[#00283A] mb-2">Years Combined Experience</h4>
                <p className="text-sm text-muted-foreground">Deep expertise in Indian compliance</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#00283A]/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-[#00283A]" size={32} />
                </div>
                <h4 className="font-bold text-[#00283A] mb-2">Strong Government Relationships</h4>
                <p className="text-sm text-muted-foreground">Direct connections with regulatory bodies</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#00283A]/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="text-[#00283A]" size={32} />
                </div>
                <h4 className="font-bold text-[#00283A] mb-2">Dedicated Support Team</h4>
                <p className="text-sm text-muted-foreground">24/7 assistance for all compliance needs</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#00283A' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#F2C445]"></div>
              <span className="text-white font-semibold uppercase tracking-wider text-sm">Our Foundation</span>
              <div className="w-12 h-1 bg-[#F2C445]"></div>
            </div>
            <h2 style={{ color: '#F2C445' }} className="text-4xl md:text-5xl font-bold mb-4">Our Guiding Principles</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              The foundation of our success and commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/95 border-2 border-[#00283A]/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm group hover:border-[#F2C445]"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 rounded-full bg-[#00283A]/10 flex items-center justify-center mb-6 border-2 border-transparent group-hover:border-[#F2C445] transition-all duration-300 group-hover:bg-[#00283A]"
                >
                  <Eye className="text-[#00283A] group-hover:text-[#F2C445] transition-all duration-300" size={36} />
                </motion.div>
                <h3 style={{ color: '#00283A' }} className="text-2xl font-bold mb-4 group-hover:text-[#00283A]/90 transition-colors duration-300">Our Vision</h3>
                <p className="text-muted-foreground text-base leading-relaxed group-hover:text-[#00283A]/80 transition-colors duration-300">
                  To be India's most trusted compliance partner, simplifying regulatory processes and empowering businesses to operate confidently and grow sustainably.
                </p>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/95 border-2 border-[#00283A]/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm group hover:border-[#F2C445]"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 rounded-full bg-[#00283A]/10 flex items-center justify-center mb-6 border-2 border-transparent group-hover:border-[#F2C445] transition-all duration-300 group-hover:bg-[#00283A]"
                >
                  <TargetIcon className="text-[#00283A] group-hover:text-[#F2C445] transition-all duration-300" size={36} />
                </motion.div>
                <h3 style={{ color: '#00283A' }} className="text-2xl font-bold mb-4 group-hover:text-[#00283A]/90 transition-colors duration-300">Our Mission</h3>
                <p className="text-muted-foreground text-base leading-relaxed group-hover:text-[#00283A]/80 transition-colors duration-300">
                  To provide comprehensive, accurate, and timely compliance solutions through expert guidance, strong government relationships, and dedicated support, ensuring our clients' business success.
                </p>
              </div>
            </motion.div>

            {/* Values Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/95 border-2 border-[#00283A]/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm group hover:border-[#F2C445]"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 rounded-full bg-[#00283A]/10 flex items-center justify-center mb-6 border-2 border-transparent group-hover:border-[#F2C445] transition-all duration-300 group-hover:bg-[#00283A]"
                >
                  <Heart className="text-[#00283A] group-hover:text-[#F2C445] transition-all duration-300" size={36} />
                </motion.div>
                <h3 style={{ color: '#00283A' }} className="text-2xl font-bold mb-4 group-hover:text-[#00283A]/90 transition-colors duration-300">Our Values</h3>
                <div className="space-y-4 w-full">
                  {['Integrity & Transparency', 'Client Success Focus', 'Expert Excellence', 'Dedicated Support'].map((value, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i, duration: 0.3 }}
                      className="flex items-start gap-3 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#00283A]/10 flex items-center justify-center mt-1 border border-transparent group-hover:border-[#F2C445] group-hover:bg-[#00283A] transition-all duration-300">
                        <div className="w-2 h-2 rounded-full bg-[#F2C445]"></div>
                      </div>
                      <p className="text-muted-foreground text-sm flex-1 group-hover:text-[#00283A]/80 transition-colors duration-300">
                        {value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;