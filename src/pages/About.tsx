import { motion } from 'framer-motion';
import { Award, Users, CheckCircle, Shield, Briefcase, ArrowRight, HeadphonesIcon, BookOpen, TargetIcon, Eye, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Gourab from "@/assets/Gourab.jpeg";
import Mousumi from "@/assets/Mousumi.jpeg";
import Shibani from "@/assets/Shibani.jpeg";
import Ashunta from "@/assets/Ashunta.jpeg";
import office from "@/assets/office.png";
import { useEffect, useState } from 'react';

const stats = [
  { label: 'Years of Excellence', value: '7+' },
  { label: 'Compliance Experts', value: '15+' },
  { label: 'Successful Cases', value: '10000+' },
  { label: 'Happy Clients', value: '10000+' },
];

const directors = [
  {
    name: 'Mr. Gourab Sanyal',
    designation: 'Founder & Director',
    image: Gourab,
    experience: 'Expert knowledge of Indian regulations & compliance',
    speech: 'At Geeemadhura, we believe in simplifying compliance for businesses. Our mission is to bridge the gap between complex regulations and business operations, ensuring seamless compliance and sustainable growth.',
    expertise: 'FSSAI Compliance, Business Licensing, Government Regulations',
    additionalContent: `Director's Desk
Mr. Gourab Sanyal
Founder & Director | Geemadhura Innovation Pvt. Ltd.

Professional Overview
With 11+ years of expertise in Food Safety, Licensing, and Certification, Mr. Gourab Sanyal founded Geemadhura Innovation in 2018 with a vision to make business compliance simple, fast, and affordable for entrepreneurs across India. His deep knowledge of FSS Act, food storage, transportation, and licensing portal management drives the company's mission.

Core Expertise
Food Safety & Compliance
FSS Act and food safety regulations
Food storage and transportation best practices
Quality assurance and standards
Business Licensing & Certification
Licensing portal management
Statutory compliance and approvals
Certification guidance and support
Entrepreneurial Vision
Simplifying compliance for Indian businesses
Building scalable solutions for 15,000+ clients
Staying aligned with industry trends

Professional Strengths
11+ years of industry expertise
Deep regulatory knowledge and practical execution
Visionary leadership and client-focused approach
Proven track record serving 15,000+ satisfied clients

Contact
📞 +91 9434969796 | Geemadhura Innovation Pvt. Ltd.`
  },
  {
    name: 'Mrs. Mousumi Sanyal',
    designation: 'Co-Founder & CMD',
    image: Mousumi,
    experience: 'Strong government relationships & strategic partnerships',
    speech: 'We focus on building strong relationships and creating robust compliance solutions that empower businesses to operate confidently within regulatory frameworks.',
    expertise: 'Government Liaison, Strategic Planning, Corporate Compliance',
    additionalContent: `CMD's Desk
Mrs. Mousumi Sanyal
Co-Founder & CMD | Geemadhura Innovation Pvt. Ltd.

Professional Overview
As Co-Founder and CMD of Geemadhura Innovation, Mrs. Mousumi Sanyal plays a pivotal role in shaping the company's strategic direction and operational excellence. Together with Founder Mr. Gourab Sanyal, she recognized the critical gap in India's business compliance ecosystem and co-founded Geemadhura Innovation in 2018 to make compliance simple, fast, and affordable for entrepreneurs.

Core Expertise
Business Strategy & Operations
Strategic planning and business development
Operational excellence and process management
Client relationship management
Compliance Solutions
Business licensing and regulatory guidance
Statutory compliance support
Certification and approval processes
Entrepreneurial Leadership
Co-founding and scaling Geemadhura Innovation
Building client-centric solutions
Driving growth to 15,000+ satisfied clients

Professional Strengths
Visionary co-founder with strategic business acumen
Client-focused approach to compliance solutions
Strong operational and leadership capabilities
Committed to simplifying business processes for entrepreneurs

Contact
📞 +91 9609030792 | Geemadhura Innovation Pvt. Ltd.`
  }
];

const expertiseDesk = [
  {
    name: 'Ms. Shibani Kundu',
    designation: 'Execution Manager',
    image: Shibani,
    experience: 'Legal & Compliance Expert',
    speech: 'Expertise in end-to-end compliance processes with focus on hospitality, land compliance, and regulatory approvals.',
    expertise: 'Hospitality Compliance, Land & Property, Trade & Establishment',
    detailedContent: `Expertise Desk – Legal & Compliance
Ms. Shibani Kundu
Execution Manager | Geemadhura Innovation Pvt. Ltd.

Professional Overview
4+ years managing end-to-end compliance processes. Expertise in hospitality, land compliance, and regulatory approvals.

Core Expertise
Hospitality Compliance
Fire NOC, Pollution Control License, Factory & Bar Licenses
Hotel, resort, homestay approvals
Land & Property
Statutory compliance and documentation
Land conversion and classification support
Trade & Establishment
SWID License, Sarai Registration, operational licenses
Regulatory Management
Government liaison and approval tracking

Contact
📞 +91 9609030927 | Geemadhura Innovation Pvt. Ltd.`
  },
  {
    name: 'Ms. Ashunta Kujur',
    designation: 'Accountant & Management Executive',
    image: Ashunta,
    experience: 'Accounts, Finance & HR Expert',
    speech: 'Ensuring financial accuracy, statutory compliance, and smooth operations through expert accounting and HR management.',
    expertise: 'Accounting & Finance, Human Resource Management, ISO Services',
    detailedContent: `Expertise Desk – Accounts, Finance & HR
Ms. Ashunta Kujur
Accountant & Management Executive | Geemadhura Innovation Pvt. Ltd.

Professional Overview
With 5+ years of experience, Ms. Ashunta Kujur oversees accounting, finance, and HR functions. Her expertise ensures financial accuracy, statutory compliance, and smooth operations.

Core Expertise
Accounting & Finance
Financial reporting and budgeting
Statutory compliance and tax documentation
Audit coordination
Human Resource Management
Payroll and salary management
HR compliance and employee records
Recruitment support
ISO Services
ISO certification documentation
Internal audit coordination
Process implementation

Contact
📞 +91 7477788991 | Geemadhura Innovation Pvt. Ltd.`
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

  const [selectedExpert, setSelectedExpert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openExpertModal = (expert) => {
    setSelectedExpert(expert);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeExpertModal = () => {
    setIsModalOpen(false);
    setSelectedExpert(null);
    document.body.style.overflow = 'unset';
  };

  const ExpertModal = () => {
    if (!selectedExpert) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden my-auto"
        >
          {/* Close Button - Fixed in top-right corner */}
          <button
            onClick={closeExpertModal}
            className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors duration-200 shadow-lg border border-slate-300"
            style={{ zIndex: 9999 }}
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Image Section */}
            <div className="relative lg:h-full bg-gradient-to-br from-[#00283A]/5 to-[#F2C445]/5">
              <div className="h-64 lg:h-full flex items-center justify-center p-8">
                <img
                  src={selectedExpert.image}
                  alt={selectedExpert.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:bg-none" />
              
              {/* Experience Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-[#F2C445] text-[#00283A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedExpert.experience}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-10 overflow-y-auto max-h-[calc(85vh)]">
              <div className="space-y-6">
                <div>
                  <span className="inline-block px-4 py-2 bg-[#00283A] text-white rounded-lg mb-4 border-2 border-[#00283A]">
                    <span className="font-medium">{selectedExpert.designation}</span>
                  </span>
                  <h3 style={{ color: '#00283A' }} className="text-3xl md:text-4xl font-bold mb-4">
                    {selectedExpert.name}
                  </h3>
                  <p className="text-slate-600 italic text-lg leading-relaxed border-l-4 border-[#F2C445] pl-4 py-2">
                    "{selectedExpert.speech}"
                  </p>
                </div>

                {/* Detailed Content */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="text-slate-700 space-y-6">
                    {selectedExpert.detailedContent.split('\n\n').map((paragraph, idx) => {
                      if (paragraph.includes('Expertise Desk') || paragraph.includes('Professional Overview') || paragraph.includes('Core Expertise') || paragraph.includes('Contact')) {
                        return (
                          <div key={idx} className="space-y-3">
                            <h4 className="text-lg font-bold text-[#00283A] uppercase tracking-wide border-b border-slate-200 pb-2">
                              {paragraph.split('\n')[0]}
                            </h4>
                            {paragraph.split('\n').slice(1).map((line, lineIdx) => (
                              <p key={lineIdx} className="text-slate-600 leading-relaxed pl-4">
                                {line}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return (
                        <p key={idx} className="text-slate-600 leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Specialization Areas */}
                <div className="pt-6 border-t border-slate-200">
                  <h4 className="text-lg font-bold text-[#00283A] uppercase tracking-wide mb-4">
                    Specialization Areas
                  </h4>
                  <p className="text-slate-600 text-base">
                    {selectedExpert.expertise}
                  </p>
                </div>

                {/* Contact Button */}
              
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <main className="min-h-screen">
      {/* Top Banner Image Section */}
      <section className="w-full h-[250px] md:h-[300px] flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#00283A' }}>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F2C445]/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white text-4xl md:text-6xl font-bold tracking-tight"
          >
            About Us
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1.5 bg-[#F2C445] mx-auto mt-4 rounded-full"
          ></motion.div>
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
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#00283A]/20 hover:border-[#F2C445] transition-all duration-300 group">
                <img
                  src={office}
                  alt="Our Story - Geeemadhura Innovations Journey"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00283A]/30 via-transparent to-transparent"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#00283A]/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#F2C445]/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
              </div>

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
                  Over the years, we've grown from a small consultancy to a trusted partner for thousands
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
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="relative group">
                    <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#00283A]/20 group-hover:border-[#F2C445] transition-all duration-300 bg-gradient-to-br from-[#00283A]/5 to-[#F2C445]/5">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={director.image}
                          alt={director.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>

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

                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="relative group">
                    <div className="relative z-10 bg-white/95 backdrop-blur-sm border-2 border-[#00283A]/20 rounded-3xl p-8 shadow-xl group-hover:border-[#F2C445] transition-all duration-300 group-hover:shadow-2xl">
                      <div className="inline-block px-4 py-2 bg-[#00283A] text-white rounded-lg mb-6 border-2 border-[#00283A] group-hover:border-[#F2C445] transition-all duration-300">
                        <span className="font-medium">{director.designation}</span>
                      </div>
                      <h3 style={{ color: '#00283A' }} className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-[#00283A]/90 transition-colors duration-300">{director.name}</h3>
                      
                      <div className="relative mb-6">
                        <p className="text-lg text-muted-foreground leading-relaxed italic pl-6 border-l-4 border-[#F2C445] group-hover:text-[#00283A]/80 transition-colors duration-300">
                          "{director.speech}"
                        </p>
                      </div>
                      
                      {director.additionalContent && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          whileInView={{ opacity: 1, height: 'auto' }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="mt-6 pt-6 border-t border-[#00283A]/10"
                        >
                          <div className="text-muted-foreground text-base leading-relaxed space-y-3">
                            {director.additionalContent.split('\n\n').map((paragraph, idx) => {
                              if (paragraph.includes('Desk') || paragraph.includes('Overview') || paragraph.includes('Expertise') || paragraph.includes('Strengths') || paragraph.includes('Contact')) {
                                return (
                                  <div key={idx} className="mt-4">
                                    <h4 className="text-sm font-semibold text-[#00283A] mb-2 uppercase tracking-wide">
                                      {paragraph.split('\n')[0]}
                                    </h4>
                                    {paragraph.split('\n').slice(1).map((line, lineIdx) => (
                                      <p key={lineIdx} className="text-justify text-sm mt-1">
                                        {line}
                                      </p>
                                    ))}
                                  </div>
                                );
                              }
                              return (
                                <p key={idx} className="text-justify">
                                  {paragraph}
                                </p>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                      
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

      {/* Expertise Desk Section - Side by Side */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            {/* <span className="text-[#F2C445] font-bold uppercase tracking-[0.2em] text-xs mb-4 block">
              Expertise Desk
            </span> */}
            <h2 className="text-[#00283A] text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Expertise Desk
            </h2>
            <div className="w-20 h-1.5 bg-[#F2C445] mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Highly specialized professionals delivering precision-led compliance and domain mastery.
            </p>
          </motion.div>

          {/* Experts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {expertiseDesk.map((expert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 border border-slate-200 group cursor-pointer"
                onClick={() => openExpertModal(expert)}
              >
                {/* Image Column - Fixed Aspect Ratio */}
                <div className="md:w-2/5 relative bg-slate-100 overflow-hidden">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00283A]/60 to-transparent md:bg-none" />
                  <div className="absolute bottom-4 left-4 md:bottom-auto md:top-4">
                    <span className="bg-[#F2C445] text-[#00283A] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {expert.experience}
                    </span>
                  </div>
                </div>

                {/* Content Column - No Scroll, Structured Layout */}
                <div className="md:w-3/5 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-[#00283A] text-2xl font-bold leading-tight">
                          {expert.name}
                        </h3>
                        <p className="text-[#F2C445] font-semibold text-sm uppercase tracking-wide mt-1">
                          {expert.designation}
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-600 italic text-sm mb-6 leading-relaxed relative">
                      <span className="text-3xl text-[#F2C445] absolute -top-4 -left-2 opacity-50 font-serif">"</span>
                      {expert.speech}
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-[#00283A] mt-1 shrink-0" size={18} />
                        <div>
                          <p className="text-[#00283A] font-bold text-xs uppercase mb-1">Core Focus</p>
                          <p className="text-slate-600 text-sm leading-snug">
                            {expert.expertise}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Footer CTA */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[#00283A] font-bold text-xs uppercase">View Full Profile</span>
                    <div className="w-8 h-8 rounded-full bg-[#00283A] text-white flex items-center justify-center group-hover:bg-[#F2C445] group-hover:text-[#00283A] transition-colors duration-300">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Expertise Section */}
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

      {/* Expert Modal */}
      {isModalOpen && <ExpertModal />}
    </main>
  );
};

export default About;