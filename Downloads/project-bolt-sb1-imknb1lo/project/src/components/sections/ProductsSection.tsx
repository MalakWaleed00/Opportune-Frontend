import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { products } from '../../data/productsData';

const ProductsSection: React.FC = () => {
  const featuredProducts = products.filter(product => product.featured);
  
  return (
    <section id="products" className="section bg-white">
      <div className="container-custom">
        <SectionTitle
          title="Featured Products"
          subtitle="Discover our high-quality industrial products designed for reliability and performance."
          centered
        />
        
        {/* Featured Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map(product => (
            <Card key={product.id} className="animate-slide-up">
              <div className="h-60 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="text-sm font-medium text-primary-600 mb-2 block">{product.category}</span>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Product Categories */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8 text-center">Browse by Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {['Power Equipment', 'Safety Equipment', 'Climate Control', 'Tools', 'Environmental', 'Storage'].map(category => (
              <Card key={category} className="bg-gray-50 hover:bg-gray-100 animate-slide-up">
                <div className="p-6 text-center">
                  <h4 className="text-lg font-bold mb-2">{category}</h4>
                  <Button variant="primary" size="sm">
                    Explore
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-16 text-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.location.href = '#catalog'}
          >
            View Full Catalog
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;