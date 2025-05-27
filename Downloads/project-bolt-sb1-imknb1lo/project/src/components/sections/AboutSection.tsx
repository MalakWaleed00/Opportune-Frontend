import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import { teamMembers } from '../../data/teamData';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="section bg-gray-50">
      <div className="container-custom">
        <SectionTitle
          title="About ProSupply"
          subtitle="Learn about our mission, values, and the team behind our success."
          centered
        />
        
        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1 animate-slide-up">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Story</h3>
            <p className="text-gray-600 mb-4">
              Founded in 2005, ProSupply began with a simple mission: to provide businesses with high-quality industrial supplies and exceptional service. What started as a small operation has grown into a comprehensive supply and services company serving clients across multiple industries.
            </p>
            <p className="text-gray-600 mb-4">
              Our commitment to quality, reliability, and customer satisfaction has remained unwavering throughout our journey. We've built our reputation on understanding our clients' unique needs and delivering solutions that help them succeed.
            </p>
            <p className="text-gray-600">
              Today, ProSupply is a trusted partner to businesses of all sizes, from local operations to multinational corporations. Our extensive product range and diverse service offerings make us a one-stop solution for all industrial supply needs.
            </p>
          </div>
          <div className="order-1 lg:order-2 animate-fade-in">
            <img 
              src="https://images.pexels.com/photos/3862377/pexels-photo-3862377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Company History" 
              className="rounded-xl shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </div>
        
        {/* Core Values */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-8 text-center text-gray-900">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Quality',
                description: 'We provide only the highest quality products and services that meet or exceed industry standards.'
              },
              {
                title: 'Reliability',
                description: 'Our clients can count on us to deliver on our promises, consistently and on time.'
              },
              {
                title: 'Innovation',
                description: 'We continuously seek new and better ways to serve our clients and improve our offerings.'
              },
              {
                title: 'Integrity',
                description: 'We conduct our business with honesty, transparency, and the highest ethical standards.'
              }
            ].map((value, index) => (
              <Card key={index} className="animate-slide-up">
                <div className="p-6 text-center">
                  <h4 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h4>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Team Section */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-center text-gray-900">Meet Our Leadership Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map(member => (
              <Card key={member.id} className="animate-slide-up">
                <div className="h-60 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl font-bold mb-1 text-gray-900">{member.name}</h4>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;