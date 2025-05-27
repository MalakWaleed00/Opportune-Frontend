import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { NavLink } from '../../types';

const navigation: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '#services' },
  { name: 'Products', path: '#products' },
  { name: 'About', path: '#about' },
  { name: 'Contact', path: '#contact' },
  { name: 'Get Quote', path: '#quote', isButton: true },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary-700">ProSupply</span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => 
            item.isButton ? (
              <Button 
                key={item.name} 
                variant="primary"
                size="sm"
                onClick={() => window.location.href = item.path}
              >
                {item.name}
              </Button>
            ) : (
              <a
                key={item.name}
                href={item.path}
                className={`text-base font-medium hover:text-primary-600 transition-colors ${
                  isScrolled ? 'text-gray-800' : 'text-gray-900'
                }`}
              >
                {item.name}
              </a>
            )
          )}
        </nav>
        
        {/* Mobile Navigation Button */}
        <button
          type="button"
          className="md:hidden text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 animate-fade-in">
          <div className="container-custom space-y-4">
            {navigation.map((item) => 
              item.isButton ? (
                <Button 
                  key={item.name} 
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    window.location.href = item.path;
                    setIsOpen(false);
                  }}
                >
                  {item.name}
                </Button>
              ) : (
                <a
                  key={item.name}
                  href={item.path}
                  className="block py-2 text-base font-medium text-gray-800 hover:text-primary-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;