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
    {
      name: 'Pollution Certificate',
      path: '/services/pollution-certificate'
    },
    {
      name: 'Factory License',
      path: '/services/factory-license'
    },
    {
      name: 'Fire Safety NOC',
      path: '/services/fire-safety-noc'
    },
    {
      name: 'Bar License',
      path: '/services/bar-license'
    },
    {
      name: 'FSSAI License',
      path: '/services/fssai-license'
    }
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
    <footer className="bg-brand-black border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={logo} alt="Geeemadhura Innovations" className="h-12 w-auto" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Leading corporate innovation and business solutions provider, transforming businesses through technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-accent-yellow transition-colors text-sm"
                    onClick={() => handleQuickLinkClick(item)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-muted-foreground hover:text-accent-yellow transition-colors text-sm"
                    onClick={handleServiceClick}
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-accent-yellow mt-0.5 flex-shrink-0" />
                <a href="mailto:info@geemadhurainnovations.com
" className="text-muted-foreground hover:text-accent-yellow transition-colors text-sm">
                  info@geemadhurainnovations.com

                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-accent-yellow mt-0.5 flex-shrink-0" />
                <a href="tel:9609030792" className="text-muted-foreground hover:text-accent-yellow transition-colors text-sm">
                  +91 96090 30792 | +91 96090 30832 | +91 96090 30833
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent-yellow mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">\
                  <a href={" https://maps.app.goo.gl/diKY3LyH8Zmi1ua79"} >


                    Jalpaiguri - Raikat Para, Opposite Sports Complex 2nd Gate, Pin - 735101
                  </a>

                </span>
              </li>
              <li className="flex items-start gap-3">
                <Globe size={18} className="text-accent-yellow mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Pan-India Services Available
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Application Management</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Link
                  to={'/verify-certificate'}
                >
                  Application Management
                </Link>
                {/* <a href="/verify-certificate"
                  className="text-muted-foreground hover:text-accent-yellow transition-colors text-sm">
                </a> */}
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
            {[
              { icon: Facebook, href: 'https://www.facebook.com/share/17ywBfsNNb/', label: 'Facebook' },
              { icon: Youtube, href: ' www.youtube.com/@GeemadhuraInnovations', label: 'Youtube' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/gourab-sanyal-6809b0135?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', label: 'LinkedIn' },
              { icon: Instagram, href: ' https://www.instagram.com/geemadhurainnovations?igsh=MWh6d2EyYWgwZWc0ZQ==', label: 'Instagram' },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent-yellow transition-colors"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};