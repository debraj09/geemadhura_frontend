// components/SecondaryHeader.tsx
import { useState, useEffect } from 'react';
import { Phone, Mail, X, Facebook, Twitter, Linkedin, Instagram, Clock, Globe } from 'lucide-react';

export const SecondaryHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[100] transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ 
        backgroundColor: ' #00283A',
        borderBottom: '1px solid white20',
        height: '40px',
        color:'white'
      }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Left Side - Contact Info */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Phone */}
          <a 
            href="tel:+919609030792"
            className="flex items-center gap-2 text-sm hover:text-[#F2C445] transition-colors"
            style={{ color: 'white' }}
          >
            <Phone size={14} />
            <span className="font-medium">+91 96090 30792 | +91 96090 30832 | +91 96090 30833</span>
          </a>
          
          {/* Separator */}
          <span className="text-[white]/40 hidden md:inline">|</span>
          
          {/* Email */}
          <a 
            href="mailto:info@geeemadhura.com"
            className="hidden md:flex items-center gap-2 text-sm hover:text-[#F2C445] transition-colors"
            style={{ color: 'white' }}
          >
            <Mail size={14} />
            <span className="font-medium">info@geemadhurainnovations.com</span>
          </a>
          
         
        </div>

        {/* Right Side - Social Icons & Close */}
        <div className="flex items-center gap-3">
          {/* Online Services */}
          <div 
            className="hidden md:flex items-center gap-2 text-sm mr-2"
            style={{ color: 'white' }}
          >
            <Globe size={14} />
            <span className="font-medium">🌐 Online Services</span>
          </div>
          
          {/* Separator */}
          <span className="text-[white]/40 hidden md:inline mr-2">|</span>

          {/* Social Icons */}
          <div className="hidden md:flex items-center gap-3 mr-2">
            <a 
              href="#" 
              className="hover:scale-110 transition-transform"
              style={{ color: 'white' }}
            >
              <Facebook size={14} />
            </a>
            <a 
              href="#" 
              className="hover:scale-110 transition-transform"
              style={{ color: 'white' }}
            >
              <Twitter size={14} />
            </a>
            <a 
              href="#" 
              className="hover:scale-110 transition-transform"
              style={{ color: 'white' }}
            >
              <Linkedin size={14} />
            </a>
            <a 
              href="#" 
              className="hover:scale-110 transition-transform"
              style={{ color: 'white' }}
            >
              <Instagram size={14} />
            </a>
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-[white]/10 rounded transition-colors"
            aria-label="Close notification bar"
            style={{ color: 'white' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};