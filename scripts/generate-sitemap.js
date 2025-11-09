/**
 * Generate sitemap.xml for SEO
 * Run: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://paparazzoparrucchieri.it';

// Static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/servizi', priority: '0.9', changefreq: 'weekly' },
  { url: '/servizi/nanoplastia', priority: '0.9', changefreq: 'monthly' },
  { url: '/servizi/hair-extensions', priority: '0.9', changefreq: 'monthly' },
  { url: '/servizi/color-correction', priority: '0.9', changefreq: 'monthly' },
  { url: '/blog', priority: '0.8', changefreq: 'daily' },
  { url: '/corsi', priority: '0.8', changefreq: 'monthly' },
  { url: '/contatti', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/cookie', priority: '0.3', changefreq: 'yearly' },
];

/**
 * Get all blog posts
 */
function getBlogPosts() {
  const blogDir = path.join(__dirname, '..', 'content', 'blog');

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);
  const posts = [];

  files.forEach((file) => {
    if (file.endsWith('.md')) {
      const slug = file.replace('.md', '');
      const filePath = path.join(blogDir, file);
      const stats = fs.statSync(filePath);

      posts.push({
        url: `/blog/${slug}`,
        lastmod: stats.mtime.toISOString().split('T')[0],
        priority: '0.7',
        changefreq: 'monthly',
      });
    }
  });

  return posts;
}

/**
 * Generate sitemap XML
 */
function generateSitemap() {
  console.log('🗺️  Generating sitemap.xml...');

  const blogPosts = getBlogPosts();
  const allPages = [...staticPages, ...blogPosts];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allPages.forEach((page) => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${page.url}</loc>\n`;
    if (page.lastmod) {
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    } else {
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    }
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');

  console.log(`✅ Sitemap generated with ${allPages.length} URLs`);
  console.log(`📄 File: ${sitemapPath}`);

  return sitemapPath;
}

/**
 * Generate robots.txt
 */
function generateRobots() {
  console.log('🤖 Generating robots.txt...');

  const robotsTxt = `# Robots.txt for ${SITE_URL}

User-agent: *
Allow: /

Disallow: /api/
Disallow: /_next/
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`;

  const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt, 'utf8');

  console.log(`✅ Robots.txt generated`);
  console.log(`📄 File: ${robotsPath}`);

  return robotsPath;
}

// Run if executed directly
if (require.main === module) {
  try {
    generateSitemap();
    generateRobots();
    console.log('\n🎉 SEO files generation complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { generateSitemap, generateRobots };
