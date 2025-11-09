import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

export default function PhilosophySection() {
  return (
    <Section background="white" padding="xl">
      <Container>
        <div className="text-center">
          <h2 className="section-heading">La Nostra Filosofia</h2>
          <p className="section-subtitle">
            Avanguardia, tecnica e arte per un'esperienza di bellezza su misura
          </p>
        </div>
      </Container>
    </Section>
  );
}
