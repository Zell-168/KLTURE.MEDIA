
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = "", id }) => {
  return (
    <section id={id} className={`py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in ${className}`}>
      {children}
    </section>
  );
};

export default Section;
