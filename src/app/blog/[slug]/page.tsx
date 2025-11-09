import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { getPostBySlug, getAllPosts, getLatestPosts } from '@/lib/blog';
import { formatDate } from '@/lib/date-utils';
import { getWhatsAppLink } from '@/lib/whatsapp';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Articolo Non Trovato',
    };
  }

  return {
    title: `${post.title} | Paparazzo Parrucchieri Blog`,
    description: post.excerpt,
    keywords: post.tags,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getLatestPosts(3).filter((p) => p.slug !== post.slug);

  return (
    <>
      {/* Article Header */}
      <Section background="gradient" padding="xl">
        <Container size="md">
          <div className="text-center">
            {/* Category */}
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="mb-4 inline-block rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gold-600"
            >
              {post.category}
            </Link>

            {/* Title */}
            <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                {post.author}
              </div>
              <span>•</span>
              <div className="flex items-center">
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                {formatDate(post.date)}
              </div>
              {post.readTime && (
                <>
                  <span>•</span>
                  <div className="flex items-center">
                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {post.readTime}
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Article Content */}
      <Section background="white" padding="xl">
        <Container size="md">
          {/* Featured Image Placeholder */}
          <div className="mb-12 aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200 shadow-xl">
            <div className="flex h-full items-center justify-center">
              <span className="text-8xl">✨</span>
            </div>
          </div>

          {/* Content */}
          <article
            className="prose prose-lg prose-gray max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-gold-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h3 className="mb-4 font-display text-lg font-bold text-gray-900">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gold-100 hover:text-gold-700"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="mb-4 font-display text-lg font-bold text-gray-900">
              Condividi questo articolo:
            </h3>
            <div className="flex gap-3">
              <Button
                href={getWhatsAppLink(`Leggi questo articolo: ${post.title}`)}
                variant="whatsapp"
                external
              >
                Condividi su WhatsApp
              </Button>
              <Button href="/blog" variant="outline">
                Vedi Altri Articoli
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section background="gray" padding="xl">
          <Container>
            <h2 className="section-heading text-center">Potrebbero Interessarti</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                  <div className="group rounded-2xl bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-gold-100 to-gold-200">
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl">✨</span>
                      </div>
                    </div>
                    <div className="mb-2 text-sm text-gold-600">{relatedPost.category}</div>
                    <h3 className="mb-2 font-display text-lg font-bold text-gray-900 group-hover:text-gold-600">
                      {relatedPost.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-gray-600">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section background="white" padding="xl">
        <Container>
          <div className="rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 p-8 text-center text-white shadow-2xl md:p-12">
            <h2 className="mb-4 font-display text-3xl font-bold">
              Vuoi Risultati Professionali Come Questi?
            </h2>
            <p className="mb-6 text-lg text-gold-50">
              Prenota una consulenza gratuita e scopri come trasformare i tuoi capelli con i nostri
              servizi premium.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                href={getWhatsAppLink('Ciao! Vorrei prenotare una consulenza gratuita')}
                variant="whatsapp"
                size="lg"
                external
              >
                Prenota Consulenza
              </Button>
              <Button href="/servizi" variant="outline" size="lg">
                Scopri i Servizi
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
