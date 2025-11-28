import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import logo from '@/assets/logo.png';

export const Footer = () => {
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
              {[
                'Digital Transformation',
                'Business Consulting',
                'Technology Solutions',
                'Data Analytics',
                'Cybersecurity',
              ].map((service) => (
                <li key={service}>
                  <span className="text-muted-foreground text-sm">{service}</span>
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
                <a href="mailto:info@geeemadhura.com" className="text-muted-foreground hover:text-accent-yellow transition-colors text-sm">
                  info@geeemadhura.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-accent-yellow mt-0.5 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-muted-foreground hover:text-accent-yellow transition-colors text-sm">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent-yellow mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  123 Innovation Street, Tech City, TC 12345
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
            {[
              { icon: Facebook, href: '#' },
              { icon: Twitter, href: '#' },
              { icon: Linkedin, href: '#' },
              { icon: Instagram, href: '#' },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent-yellow transition-colors"
                aria-label="Social media"
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
