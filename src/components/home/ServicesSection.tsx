import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SERVICES } from '@/config/constants';

export default function ServicesSection() {
  return (
    <Section background="gradient" padding="xl">
      <Container>
        <div className="text-center">
          <h2 className="section-heading">I Nostri Servizi</h2>
          <p className="section-subtitle">
            Tecniche avanzate e prodotti premium per risultati straordinari
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {SERVICES.map((service) => (
            <Card
              key={service.id}
              title={service.name}
              description={service.shortDescription}
              icon={service.icon}
            >
              <Button href={`/servizi/${service.slug}`} variant="primary" fullWidth>
                Scopri di più
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/servizi" variant="outline" size="lg">
            Vedi Tutti i Servizi
          </Button>
        </div>
      </Container>
    </Section>
  );
}
