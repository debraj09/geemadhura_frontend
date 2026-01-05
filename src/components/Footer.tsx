import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Globe, Youtube } from 'lucide-react';
import logo from '@/assets/logo.png';

export const Footer = () => {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const services = [
    {
      name: 'Homestay Registration',
      path: '/services/homestay-registration'
    },
    {
      name: 'Trade Licence',
      path: '/services/trade-licence'
    },
    {
      name: 'FoSTaC Trainings and Certification',
      path: '/services/fostac-trainings-and-certification'
    },
    {
      name: 'GST & Business Registration',
      path: '/services/gst-business-registration'
    },
    {
      name: 'ISO Certifications',
      path: '/services/iso-certifications'
    },

  ];

  // Handler for Quick Links
  const handleQuickLinkClick = (item: string) => {
    scrollToTop();
  };

  // Handler for Service Links
  const handleServiceClick = () => {
    scrollToTop();
  };

  return (
    <footer className="bg-brand-black border-t border-border" style={{ backgroundColor: '#00283A', color: 'white' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={logo} alt="Geeemadhura Innovations" className="h-12 w-auto" />
            <p style={{ color: 'white' }} className="text-muted-foreground text-sm leading-relaxed">
              Leading corporate innovation and business solutions provider, transforming businesses through technology.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ color: 'white' }}>
            <h3 style={{ color: 'white' }} className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {['About', 'Blog', 'FAQ', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-accent-yellow transition-colors text-sm"
                    onClick={() => handleQuickLinkClick(item)}
                    style={{ color: 'white' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 style={{ color: 'white' }} className="text-lg font-semibold mb-4 text-foreground">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-muted-foreground hover:text-accent-yellow transition-colors text-sm"
                    onClick={handleServiceClick}
                    style={{ color: 'white' }}
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ color: 'white' }} className="text-lg font-semibold mb-4 text-foreground">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-accent-yellow mt-0.5 flex-shrink-0" />
                <a href="mailto:info@geemadhurainnovations.com
" className="text-muted-foreground hover:text-accent-yellow transition-colors text-sm" style={{ color: 'white' }}>
                  info@geemadhurainnovations.com

                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-accent-yellow mt-0.5 flex-shrink-0" />
                <a href="tel:9609030792" style={{ color: 'white' }} className="text-muted-foreground hover:text-accent-yellow transition-colors text-sm">
                  +91 96090 30792 | +91 96090 30832 | +91 96090 30833
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent-yellow mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  <a style={{ color: 'white' }} href={" https://maps.app.goo.gl/diKY3LyH8Zmi1ua79"} >


                    Jalpaiguri - Raikat Para, Opposite Sports Complex 2nd Gate, Pin - 735101
                  </a>

                </span>
              </li>
              <li className="flex items-start gap-3">
                <Globe size={18} className="text-accent-yellow mt-0.5 flex-shrink-0" />
                <span style={{ color: 'white' }} className="text-muted-foreground text-sm">
                  Pan-India Services Available
                </span>
              </li>
            </ul>
          </div>






        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Geeemadhura Innovations. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Developed by <span style={{ color: 'white' ,fontSize:12}}><a href="https://btrcommunication.com/" target="_blank" rel="noopener noreferrer">BTR Communication</a></span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};