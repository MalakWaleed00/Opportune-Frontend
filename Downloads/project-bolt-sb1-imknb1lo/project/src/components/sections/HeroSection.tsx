import React from 'react';
import Button from '../ui/Button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-24 pb-32 md:pt-32 md:pb-48 bg-gradient-to-br from-primary-900 to-primary-700 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-10 -top-40 w-80 h-80 rounded-full bg-accent-500"></div>
        <div className="absolute -left-20 top-40 w-60 h-60 rounded-full bg-secondary-500"></div>
        <div className="absolute right-40 bottom-0 w-40 h-40 rounded-full bg-accent-300"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Professional Supply & Services Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl">
              Streamlining your operations with quality equipment, expert services, and reliable logistics.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="accent" 
                size="lg"
                onClick={() => window.location.href = '#services'}
              >
                Explore Services
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.location.href = '#contact'}
              >
                Contact Us
              </Button>
            </div>
          </div>
          
          {/* Image or Video */}
          <div className="hidden lg:block relative animate-fade-in">
            <img
              src="https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Industrial Supplies and Services"
              className="rounded-xl shadow-2xl object-cover h-[500px] w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-white text-gray-800 p-6 rounded-lg shadow-xl max-w-xs">
              <p className="font-bold text-lg mb-2">Trusted by 500+ Companies</p>
              <p className="text-gray-600">From small businesses to Fortune 500 companies, we deliver excellence.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;