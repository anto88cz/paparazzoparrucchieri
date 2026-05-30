import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { getAllPosts, getAllCategories } from '@/lib/blog';
import { formatDate } from '@/lib/date-utils';

export const metadata: Metadata = {
  title: 'Blog Parrucchiere Catanzaro | Consigli Capelli e Tendenze Hair Style',
  alternates: { canonical: '/blog' },
  description:
    'Blog Paparazzo Parrucchieri Catanzaro: consigli professionali su cura capelli, colorazioni, trattamenti. Guide e tendenze hair style aggiornate. Leggi gli articoli!',
  keywords: [
    'blog parrucchiere catanzaro',
    'consigli capelli catanzaro',
    'tendenze capelli 2025',
    'consigli hair stylist catanzaro',
    'cura capelli catanzaro',
    'tutorial capelli',
    'come curare i capelli',
  ],
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();

  return (
    <>
      {/* Hero */}
      <Section background="gradient" padding="xl">
        <Container>
          <div className="text-center">
            <h1 className="mb-6 font-display text-4xl font-bold text-gray-900 md:text-5xl">
              Blog & <span className="text-gold-600">Ispirazioni</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Guide professionali, tendenze hair styling e consigli per la cura dei capelli.
              Aggiornato 3 volte a settimana con contenuti esclusivi.
            </p>
          </div>
        </Container>
      </Section>

      {/* Categories */}
      {categories.length > 0 && (
        <Section background="white" padding="md">
          <Container>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/blog"
                className="rounded-full bg-gold-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gold-600"
              >
                Tutti gli Articoli ({allPosts.length})
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/blog?category=${encodeURIComponent(category.name)}`}
                  className="rounded-full bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  {category.name} ({category.count})
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Posts Grid */}
      <Section background="gray" padding="xl">
        <Container>
          {allPosts.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
              <div className="mb-4 text-6xl">📝</div>
              <h2 className="mb-4 font-display text-2xl font-bold text-gray-900">
                Nessun Articolo Ancora
              </h2>
              <p className="mb-6 text-gray-600">
                Stiamo lavorando ai primi contenuti del blog. Torna presto per scoprire guide,
                tutorial e tendenze dal mondo hair styling!
              </p>
              <Button href="/" variant="primary">
                Torna alla Home
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {allPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}>
                    <div className="h-full rounded-2xl bg-white p-6 shadow-lg transition-transform hover:scale-105">
                      {/* Image placeholder */}
                      <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-gold-100 to-gold-200">
                        <div className="flex h-full items-center justify-center">
                          <span className="text-5xl">✨</span>
                        </div>
                      </div>

                      {/* Category & Date */}
                      <div className="mb-3 flex items-center justify-between text-sm">
                        <span className="rounded-full bg-gold-100 px-3 py-1 font-medium text-gold-700">
                          {post.category}
                        </span>
                        <span className="text-gray-500">{formatDate(post.date)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-2 font-display text-xl font-bold text-gray-900 transition-colors group-hover:text-gold-600">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="mb-4 line-clamp-3 text-gray-600">{post.excerpt}</p>

                      {/* Meta */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
                        <span>By {post.author}</span>
                        {post.readTime && <span>{post.readTime}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination placeholder - implement when needed */}
              {allPosts.length > 9 && (
                <div className="mt-12 flex justify-center gap-2">
                  <Button variant="outline">← Precedente</Button>
                  <Button variant="primary">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Successivo →</Button>
                </div>
              )}
            </>
          )}
        </Container>
      </Section>

      {/* CTA */}
      <Section background="white" padding="xl">
        <Container>
          <div className="rounded-2xl bg-gradient-to-r from-gold-50 to-gold-100 p-8 text-center md:p-12">
            <h2 className="mb-4 font-display text-3xl font-bold text-gray-900">
              Vuoi Risultati Professionali?
            </h2>
            <p className="mb-6 text-lg text-gray-700">
              Prenota una consulenza gratuita e scopri i nostri servizi premium per capelli
              perfetti.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/servizi" variant="primary" size="lg">
                Scopri i Servizi
              </Button>
              <Button href="/contatti" variant="outline" size="lg">
                Contattaci
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
