import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  centered = false,
  className = '',
}) => {
  const alignment = centered ? 'text-center mx-auto' : '';
  
  return (
    <div className={`mb-12 ${alignment} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-3xl">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionTitle;