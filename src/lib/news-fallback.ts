/**
 * News Fallback Service
 * 
 * Provides fallback to mock data if real APIs fail
 * or if no API keys are configured
 */

import { NewsArticle } from './news-data';
import { mockNewsArticles } from './news-data';
import { getLatestNews, getPast30DaysNews } from './news-service';

/**
 * Get news with fallback to mock data
 */
export async function getNewsWithFallback(
  dateFilter: 'latest' | 'past30days' = 'latest'
): Promise<NewsArticle[]> {
  try {
    // Try to fetch real news
    const realNews = dateFilter === 'latest'
      ? await getLatestNews()
      : await getPast30DaysNews();

    // If we got real news, return it
    if (realNews && realNews.length > 0) {
      return realNews;
    }

    // Fallback to mock data
    console.warn('No real news available, using mock data');
    return mockNewsArticles;
  } catch (error) {
    console.error('Error fetching news, using fallback:', error);
    // Return mock data as fallback
    return mockNewsArticles;
  }
}

/**
 * Check if real news APIs are configured
 */
export function isRealNewsConfigured(): boolean {
  const newsAPIKey = import.meta.env.VITE_NEWSAPI_KEY;
  // RSS feeds don't need keys, so we always have at least one source
  return true; // RSS is always available
}
