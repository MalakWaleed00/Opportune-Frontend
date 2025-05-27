import React, { useState } from 'react';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';

interface QuoteFormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  serviceType: string;
  projectDetails: string;
  budget: string;
  timeframe: string;
}

const QuoteSection: React.FC = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    serviceType: '',
    projectDetails: '',
    budget: '',
    timeframe: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your quote request. Our team will review your requirements and get back to you within 24 hours.');
      setFormData({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phone: '',
        serviceType: '',
        projectDetails: '',
        budget: '',
        timeframe: '',
      });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubmitMessage('');
      }, 8000);
    }, 1500);
  };
  
  return (
    <section id="quote" className="section bg-gradient-to-br from-primary-800 to-primary-900 text-white">
      <div className="container-custom">
        <SectionTitle
          title="Request a Quote"
          subtitle="Tell us about your project or requirements, and we'll provide a tailored quote."
          centered
          className="text-white"
        />
        
        <div className="max-w-3xl mx-auto bg-white text-gray-800 rounded-xl shadow-xl p-8 animate-fade-in">
          {submitMessage && (
            <div className="bg-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6">
              {submitMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="company" className="block text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="serviceType" className="block text-gray-700 mb-1">Service Type</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                  required
                >
                  <option value="">Select a service</option>
                  <option value="Equipment Supply">Equipment Supply</option>
                  <option value="Industrial Maintenance">Industrial Maintenance</option>
                  <option value="Logistics Solutions">Logistics Solutions</option>
                  <option value="Safety Equipment">Safety Equipment</option>
                  <option value="Technical Consulting">Technical Consulting</option>
                  <option value="Construction Materials">Construction Materials</option>
                  <option value="Equipment Rental">Equipment Rental</option>
                  <option value="Training Programs">Training Programs</option>
                  <option value="Other">Other (Please specify in details)</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="projectDetails" className="block text-gray-700 mb-1">Project Details</label>
              <textarea
                id="projectDetails"
                name="projectDetails"
                value={formData.projectDetails}
                onChange={handleChange}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                placeholder="Please describe your project or requirements in detail..."
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="budget" className="block text-gray-700 mb-1">Estimated Budget</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                  required
                >
                  <option value="">Select budget range</option>
                  <option value="Under $5,000">Under $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                  <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                  <option value="Over $100,000">Over $100,000</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeframe" className="block text-gray-700 mb-1">Timeframe</label>
                <select
                  id="timeframe"
                  name="timeframe"
                  value={formData.timeframe}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                  required
                >
                  <option value="">Select timeframe</option>
                  <option value="Immediately">Immediately</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6+ months">6+ months</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </div>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Quote Request'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;