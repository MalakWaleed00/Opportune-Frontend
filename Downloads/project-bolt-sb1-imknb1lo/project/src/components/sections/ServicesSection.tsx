import React, { useState } from 'react';
import { Package, Wrench, Truck, Shield, LightbulbIcon, Building2, Clock, GraduationCap } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import { services } from '../../data/servicesData';
import Button from '../ui/Button';

const ServicesSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const iconMap: Record<string, React.ReactNode> = {
    Package: <Package size={40} className="text-primary-600" />,
    Wrench: <Wrench size={40} className="text-primary-600" />,
    Truck: <Truck size={40} className="text-primary-600" />,
    Shield: <Shield size={40} className="text-primary-600" />,
    LightbulbIcon: <LightbulbIcon size={40} className="text-primary-600" />,
    Building2: <Building2 size={40} className="text-primary-600" />,
    Clock: <Clock size={40} className="text-primary-600" />,
    GraduationCap: <GraduationCap size={40} className="text-primary-600" />,
  };
  
  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(service => service.category === activeFilter);

  return (
    <section id="services" className="section bg-gray-50">
      <div className="container-custom">
        <SectionTitle
          title="Our Services"
          subtitle="We provide comprehensive industrial supply and service solutions to meet your business needs."
          centered
        />
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            variant={activeFilter === 'all' ? 'primary' : 'outline'}
            onClick={() => setActiveFilter('all')}
          >
            All Services
          </Button>
          <Button
            variant={activeFilter === 'supply' ? 'primary' : 'outline'}
            onClick={() => setActiveFilter('supply')}
          >
            Supply
          </Button>
          <Button
            variant={activeFilter === 'service' ? 'primary' : 'outline'}
            onClick={() => setActiveFilter('service')}
          >
            Services
          </Button>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredServices.map(service => (
            <Card key={service.id} className="animate-slide-up">
              <div className="p-6">
                <div className="mb-4">
                  {iconMap[service.icon]}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </Card>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.href = '#quote'}
          >
            Request a Custom Quote
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;