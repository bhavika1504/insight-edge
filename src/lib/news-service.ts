/**
 * News Service
 * 
 * Main service layer for news operations
 * Handles caching, real-time fetching, and data management
 */

import { NewsArticle, NewsCategory } from './news-data';
import { fetchAllNews, fetchNewsByCategory } from './news-fetcher';

// In-memory cache (in production, use Redis or database)
const newsCache: {
  latest: NewsArticle[];
  past30days: NewsArticle[];
  lastFetch: {
    latest: number;
    past30days: number;
  };
} = {
  latest: [],
  past30days: [],
  lastFetch: {
    latest: 0,
    past30days: 0,
  },
};

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Get latest news (refreshes on each call if cache expired)
 */
export async function getLatestNews(
  forceRefresh = false
): Promise<NewsArticle[]> {
  const now = Date.now();
  const cacheExpired = now - newsCache.lastFetch.latest > CACHE_DURATION;

  if (forceRefresh || cacheExpired || newsCache.latest.length === 0) {
    try {
      const news = await fetchAllNews('latest');
      newsCache.latest = news;
      newsCache.lastFetch.latest = now;
      return news;
    } catch (error) {
      console.error('Error fetching latest news:', error);
      // Return cached data if available
      return newsCache.latest;
    }
  }

  return newsCache.latest;
}

/**
 * Get past 30 days news
 */
export async function getPast30DaysNews(
  forceRefresh = false
): Promise<NewsArticle[]> {
  const now = Date.now();
  const cacheExpired = now - newsCache.lastFetch.past30days > CACHE_DURATION;

  if (forceRefresh || cacheExpired || newsCache.past30days.length === 0) {
    try {
      const news = await fetchAllNews('past30days');
      newsCache.past30days = news;
      newsCache.lastFetch.past30days = now;
      return news;
    } catch (error) {
      console.error('Error fetching past 30 days news:', error);
      // Return cached data if available
      return newsCache.past30days;
    }
  }

  return newsCache.past30days;
}

/**
 * Get news by category
 */
export async function getNewsByCategory(
  category: NewsCategory | 'All',
  dateFilter: 'latest' | 'past30days' = 'latest',
  forceRefresh = false
): Promise<NewsArticle[]> {
  if (dateFilter === 'latest') {
    const allNews = await getLatestNews(forceRefresh);
    if (category === 'All') return allNews;
    return allNews.filter(article => article.category === category);
  } else {
    const allNews = await getPast30DaysNews(forceRefresh);
    if (category === 'All') return allNews;
    return allNews.filter(article => article.category === category);
  }
}

/**
 * Get featured article (most recent)
 */
export async function getFeaturedArticle(
  dateFilter: 'latest' | 'past30days' = 'latest'
): Promise<NewsArticle | null> {
  const news = dateFilter === 'latest'
    ? await getLatestNews()
    : await getPast30DaysNews();

  return news.length > 0 ? news[0] : null;
}

/**
 * Clear cache (useful for testing or manual refresh)
 */
export function clearNewsCache(): void {
  newsCache.latest = [];
  newsCache.past30days = [];
  newsCache.lastFetch.latest = 0;
  newsCache.lastFetch.past30days = 0;
}
