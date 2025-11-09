import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/date-utils';
import { getAllPosts } from '@/lib/blog';

export default async function BlogSection() {
  // Fetch real blog posts
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 3);

  // Don't render the section if there are no posts
  if (latestPosts.length === 0) {
    return null;
  }

  return (
    <Section background="white" padding="xl">
      <Container>
        <div className="text-center">
          <h2 className="section-heading">Dal Nostro Blog</h2>
          <p className="section-subtitle">
            Consigli, guide e novità dal mondo dell'hair styling
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="h-full rounded-2xl bg-gray-50 p-6 shadow-md transition-all hover:-translate-y-2 hover:shadow-xl">
                <div className="mb-3 flex items-center gap-3 text-sm">
                  <span className="rounded-full bg-gold-100 px-3 py-1 font-medium text-gold-700">
                    {post.category}
                  </span>
                  <span className="text-gray-500">{formatDate(post.date, 'dd MMM yyyy')}</span>
                </div>

                <h3 className="mb-3 font-display text-xl font-bold text-gray-900 group-hover:text-gold-600">
                  {post.title}
                </h3>

                <p className="mb-4 leading-relaxed text-gray-600">{post.excerpt}</p>

                <div className="flex items-center font-medium text-gold-600 group-hover:text-gold-700">
                  Leggi di più
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/blog" variant="outline" size="lg">
            Vedi Tutti gli Articoli
          </Button>
        </div>
      </Container>
    </Section>
  );
}
