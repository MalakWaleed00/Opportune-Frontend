import React from 'react';
import Layout from './components/layout/Layout';
import HeroSection from './components/sections/HeroSection';
import ServicesSection from './components/sections/ServicesSection';
import ProductsSection from './components/sections/ProductsSection';
import AboutSection from './components/sections/AboutSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import ContactSection from './components/sections/ContactSection';
import QuoteSection from './components/sections/QuoteSection';
import NewsletterSection from './components/sections/NewsletterSection';

function App() {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <ProductsSection />
      <AboutSection />
      <TestimonialsSection />
      <QuoteSection />
      <ContactSection />
      <NewsletterSection />
    </Layout>
  );
}

export default App;