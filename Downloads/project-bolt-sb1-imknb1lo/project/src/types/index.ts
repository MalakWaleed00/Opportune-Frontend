export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  featured?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  testimonial: string;
  image?: string;
  rating: number;
}

export interface NavLink {
  name: string;
  path: string;
  isButton?: boolean;
}