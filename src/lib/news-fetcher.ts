/**
 * News Fetcher Service
 * 
 * Fetches real news from multiple sources (RSS, APIs)
 * Handles parsing, filtering, and date-based queries
 */

import { NewsArticle, NewsCategory, SmartCityRole } from './news-data';
import { newsSources, smartCityKeywords } from './news-sources';

export interface FetchedNewsItem {
  title: string;
  description: string;
  url: string;
  publishedDate: string;
  source: string;
  category?: NewsCategory;
  imageUrl?: string;
}

/**
 * Fetch news from RSS feeds
 */
async function fetchRSSFeed(url: string, sourceName: string): Promise<FetchedNewsItem[]> {
  try {
    // Use CORS proxy for RSS feeds (in production, use backend)
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
      return [];
    }

    return data.items
      .filter((item: any) => {
        // Filter for Smart Cities related content
        const text = `${item.title} ${item.description || ''}`.toLowerCase();
        return smartCityKeywords.some(keyword => text.includes(keyword));
      })
      .map((item: any) => ({
        title: item.title || 'Untitled',
        description: item.description || item.content || '',
        url: item.link || '',
        publishedDate: item.pubDate || new Date().toISOString(),
        source: sourceName,
        imageUrl: item.enclosure?.link || item.thumbnail || undefined,
      }));
  } catch (error) {
    console.error(`Error fetching RSS from ${sourceName}:`, error);
    return [];
  }
}

/**
 * Fetch news from NewsAPI
 */
async function fetchNewsAPI(apiKey: string): Promise<FetchedNewsItem[]> {
  if (!apiKey) {
    console.warn('NewsAPI key not configured');
    return [];
  }

  try {
    // Search for Smart Cities related news
    const query = smartCityKeywords.slice(0, 3).join(' OR ');
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 401) {
        console.warn('NewsAPI: Invalid API key');
        return [];
      }
      throw new Error(`NewsAPI error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'ok' || !data.articles) {
      return [];
    }

    return data.articles
      .filter((article: any) => article.title && article.url)
      .map((article: any) => ({
        title: article.title,
        description: article.description || '',
        url: article.url,
        publishedDate: article.publishedAt || new Date().toISOString(),
        source: article.source?.name || 'NewsAPI',
        imageUrl: article.urlToImage || undefined,
      }));
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
}

/**
 * Categorize article based on content
 */
function categorizeArticle(item: FetchedNewsItem): NewsCategory {
  const text = `${item.title} ${item.description}`.toLowerCase();

  if (text.includes('mobility') || text.includes('transport') || text.includes('traffic')) {
    return 'Urban Mobility';
  }
  if (text.includes('infrastructure') || text.includes('disaster') || text.includes('resilience')) {
    return 'Infrastructure';
  }
  if (text.includes('sustainability') || text.includes('carbon') || text.includes('energy') || text.includes('green')) {
    return 'Sustainability';
  }
  if (text.includes('governance') || text.includes('policy') || text.includes('government') || text.includes('data.gov')) {
    return 'Governance & Policy';
  }
  if (text.includes('technology') || text.includes('digital') || text.includes('IoT') || text.includes('AI')) {
    return 'Technology in Cities';
  }

  return 'Smart Cities';
}

/**
 * Extract related roles from article content
 */
function extractRelatedRoles(item: FetchedNewsItem): SmartCityRole[] {
  const text = `${item.title} ${item.description}`.toLowerCase();
  const roles: SmartCityRole[] = [];

  if (text.includes('data') || text.includes('analytics') || text.includes('analysis')) {
    roles.push('Urban Data Analyst');
  }
  if (text.includes('mobility') || text.includes('transport') || text.includes('traffic')) {
    roles.push('Smart Mobility Analyst');
  }
  if (text.includes('operations') || text.includes('management') || text.includes('infrastructure')) {
    roles.push('City Operations Analyst');
  }

  // Default to at least one role
  if (roles.length === 0) {
    roles.push('Urban Data Analyst');
  }

  return roles;
}

/**
 * Extract skills mentioned in article
 */
function extractSkills(item: FetchedNewsItem): string[] {
  const text = `${item.title} ${item.description}`.toLowerCase();
  const skills: string[] = [];

  const skillKeywords: Record<string, string> = {
    'data analysis': 'Data Analysis',
    'python': 'Python',
    'sql': 'SQL',
    'gis': 'GIS Mapping',
    'iot': 'IoT Systems',
    'machine learning': 'Machine Learning',
    'ai': 'AI & Machine Learning',
    'visualization': 'Data Visualization',
    'urban planning': 'Urban Planning',
    'transportation': 'Transportation Systems',
    'project management': 'Project Management',
  };

  Object.entries(skillKeywords).forEach(([keyword, skill]) => {
    if (text.includes(keyword) && !skills.includes(skill)) {
      skills.push(skill);
    }
  });

  return skills.slice(0, 5); // Limit to 5 skills
}

/**
 * Generate career relevance explanation
 */
function generateCareerRelevance(item: FetchedNewsItem, category: NewsCategory): string {
  const roleText = extractRelatedRoles(item).join(' or ');

  return `This article highlights developments in ${category.toLowerCase()} that directly impact Smart City professionals. As a ${roleText}, understanding these trends helps you stay current with industry developments and identify emerging opportunities in urban technology and planning.`;
}

/**
 * Convert fetched news item to NewsArticle format
 */
function convertToNewsArticle(item: FetchedNewsItem, index: number): NewsArticle {
  const category = categorizeArticle(item);
  const relatedRoles = extractRelatedRoles(item);
  const skills = extractSkills(item);
  const careerRelevance = generateCareerRelevance(item, category);

  // Create summary from description (first 2-3 sentences)
  const summary = item.description
    .split(/[.!?]+/)
    .slice(0, 2)
    .join('. ')
    .trim() || item.title;

  return {
    id: `real-${item.source.toLowerCase().replace(/\s+/g, '-')}-${index}-${Date.now()}`,
    title: item.title,
    summary: summary.length > 200 ? summary.substring(0, 200) + '...' : summary,
    content: item.description || item.title,
    category,
    source: item.source,
    publishedDate: item.publishedDate.split('T')[0], // Extract date only
    imageUrl: item.imageUrl,
    url: item.url, // Link to original article
    relatedRoles,
    skillsMentioned: skills,
    careerRelevance,
  };
}

/**
 * Fetch all news from enabled sources
 */
export async function fetchAllNews(
  dateFilter?: 'latest' | 'past30days'
): Promise<NewsArticle[]> {
  const allItems: FetchedNewsItem[] = [];

  // Fetch from RSS sources
  for (const source of newsSources.filter(s => s.enabled && s.type === 'rss')) {
    if (source.url) {
      const items = await fetchRSSFeed(source.url, source.name);
      allItems.push(...items);
    }
  }

  // Fetch from NewsAPI
  const newsAPISource = newsSources.find(s => s.id === 'newsapi' && s.enabled);
  if (newsAPISource && newsAPISource.apiKey) {
    const items = await fetchNewsAPI(newsAPISource.apiKey);
    allItems.push(...items);
  }

  // Apply date filter
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const filteredItems = allItems.filter(item => {
    const itemDate = new Date(item.publishedDate);

    if (dateFilter === 'past30days') {
      return itemDate >= thirtyDaysAgo && itemDate <= now;
    } else {
      // Latest: last 7 days
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return itemDate >= sevenDaysAgo;
    }
  });

  // Remove duplicates based on URL
  const uniqueItems = Array.from(
    new Map(filteredItems.map(item => [item.url, item])).values()
  );

  // Sort by date (newest first)
  uniqueItems.sort((a, b) =>
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  // Convert to NewsArticle format
  return uniqueItems.map((item, index) => convertToNewsArticle(item, index));
}

/**
 * Fetch news by category
 */
export async function fetchNewsByCategory(
  category: NewsCategory | 'All',
  dateFilter?: 'latest' | 'past30days'
): Promise<NewsArticle[]> {
  const allNews = await fetchAllNews(dateFilter);

  if (category === 'All') {
    return allNews;
  }

  return allNews.filter(article => article.category === category);
}
