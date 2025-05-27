import React, { useState, useEffect } from 'react';
import SectionTitle from '../ui/SectionTitle';
import { testimonials } from '../../data/testimonialsData';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  return (
    <section id="testimonials" className="section bg-primary-900 text-white">
      <div className="container-custom">
        <SectionTitle
          title="What Our Clients Say"
          subtitle="Read testimonials from businesses that have partnered with us."
          centered
          className="text-white"
        />
        
        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Slider */}
          <div className="overflow-hidden">
            <div 
              className="transition-all duration-500 ease-in-out flex"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-primary-800/50 p-8 rounded-xl shadow-lg">
                    <div className="flex items-center mb-6">
                      {testimonial.image && (
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                      )}
                      <div>
                        <h4 className="text-xl font-bold">{testimonial.name}</h4>
                        <p className="text-primary-300">{testimonial.company}</p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16}
                              className={i < testimonial.rating ? 'text-accent-400 fill-accent-400' : 'text-gray-400'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-lg italic text-gray-200 mb-4">
                      "{testimonial.testimonial}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button 
            className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-8 bg-white text-primary-900 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            onClick={goToPrevious}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-8 bg-white text-primary-900 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            onClick={goToNext}
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;