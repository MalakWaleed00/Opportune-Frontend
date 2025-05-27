import React, { useState } from 'react';
import Button from '../ui/Button';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for subscribing to our newsletter!');
      setEmail('');
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    }, 1000);
  };
  
  return (
    <section className="py-16 bg-gray-100">
      <div className="container-custom">
        <div className="bg-primary-800 rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-16 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated with Industry News</h2>
              <p className="text-lg text-gray-200 mb-8">
                Subscribe to our newsletter for the latest product updates, industry trends, and exclusive offers.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitMessage && (
                  <div className="bg-green-500/20 border border-green-500/30 text-green-100 px-4 py-3 rounded-lg">
                    {submitMessage}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-grow p-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-accent-400"
                    required
                  />
                  <Button
                    type="submit"
                    variant="accent"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </div>
                
                <p className="text-sm text-gray-300">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
            
            <div className="hidden lg:block relative">
              <img
                src="https://images.pexels.com/photos/4439901/pexels-photo-4439901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Industrial machinery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary-800/80"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;