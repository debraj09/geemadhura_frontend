// components/Header.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Courses', href: '/courses' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // State to track if secondary header is visible
  const [topPosition, setTopPosition] = useState('40px');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      // Adjust top position based on scroll
      // When scrolled down more than 100px, assume secondary header is hidden
      if (currentScrollY > 100) {
        setTopPosition('0px');
      } else {
        setTopPosition('40px');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      style={{
        backgroundColor: '#FFFFF7',
        position: 'fixed',
        top: topPosition,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'top 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease'
      }}
      className={`${scrolled ? 'bg-[#FFFFF7]/95 backdrop-blur-sm shadow-lg' : ''}`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Geeemadhura Innovations" className="h-10 md:h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm lg:text-base font-medium transition-colors hover:text-[#F2C445] relative group ${
                  location.pathname === item.href
                    ? 'text-[#F2C445]'
                    : 'text-[#00283A]'
                }`}
              >
                {item.name}
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: '#F2C445' }}
                ></span>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/contact">
              <button
                className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: '#00283A',
                  color: '#F2C445'
                }}
              >
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md transition-colors"
            style={{ color: '#00283A' }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ 
              backgroundColor: '#FFFFF7',
              borderTop: '1px solid #00283A20'
            }}
            className="md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-2 text-base font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'text-[#F2C445] bg-[#00283A]/10'
                      : 'text-[#00283A] hover:bg-[#00283A]/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#00283A]/20">
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  <button
                    className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-300"
                    style={{
                      backgroundColor: '#00283A',
                      color: '#F2C445'
                    }}
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};