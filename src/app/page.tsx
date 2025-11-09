import Hero from '@/components/home/Hero';
import PhilosophySection from '@/components/home/PhilosophySection';
import ServicesSection from '@/components/home/ServicesSection';
import GallerySection from '@/components/home/GallerySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FeedbackForm from '@/components/home/FeedbackForm';
import BlogSection from '@/components/home/BlogSection';
import LocationSection from '@/components/home/LocationSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PhilosophySection />
      <GallerySection />
      <ServicesSection />
      <TestimonialsSection />
      <FeedbackForm />
      <BlogSection />
      <LocationSection />
      <CTASection />
    </>
  );
}
