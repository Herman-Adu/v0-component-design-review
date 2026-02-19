import { articles } from '../data/content-library/articles'

// Get category for specific article slugs
const slugsToFind = [
  'managing-content-in-strapi',
  'duplicate-providers-architectural-cost',
  'hydration-mismatches-use-client-layouts',
  'server-actions-deep-dive',
  'security-architecture-deep-dive',
  'refactoring-for-maintainability',
]

slugsToFind.forEach(slug => {
  const article = articles.find(a => a.slug === slug)
  if (article) {
    console.log(`${slug} → ${article.category}`)
  } else {
    console.log(`${slug} → NOT FOUND`)
  }
})
