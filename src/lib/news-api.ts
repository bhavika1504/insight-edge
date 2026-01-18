import {
  NewsArticle,
  NewsCategory,
  getFeaturedArticle,
  getArticlesByCategory,
  getArticleById,
  getTrendingTopics,
} from './news-data';

/**
 * News API Service
 * 
 * This service provides a clean interface for fetching news data.
 * Currently uses mock data, but structured to easily integrate with:
 * - Public news APIs (NewsAPI, Guardian API)
 * - RSS feeds
 * - Government portals
 * - Custom CMS
 */

export interface NewsApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface NewsQueryParams {
  category?: NewsCategory | 'All';
  limit?: number;
  offset?: number;
  sortBy?: 'latest' | 'relevance';
}

/**
 * Get all news articles with optional filtering
 */
export const fetchNews = async (
  params: NewsQueryParams = {}
): Promise<NewsApiResponse<NewsArticle[]>> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let articles = getArticlesByCategory(params.category || 'All');

    // Sort by latest (most recent first)
    if (params.sortBy === 'latest' || !params.sortBy) {
      articles = articles.sort((a, b) =>
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      );
    }

    // Apply pagination
    const offset = params.offset || 0;
    const limit = params.limit;

    if (limit) {
      articles = articles.slice(offset, offset + limit);
    }

    return {
      data: articles,
      success: true,
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch news',
    };
  }
};

/**
 * Get a single article by ID
 */
export const fetchArticle = async (
  id: string
): Promise<NewsApiResponse<NewsArticle | null>> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const article = getArticleById(id);

    if (!article) {
      return {
        data: null,
        success: false,
        message: 'Article not found',
      };
    }

    return {
      data: article,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch article',
    };
  }
};

/**
 * Get featured article
 */
export const fetchFeaturedArticle = async (): Promise<NewsApiResponse<NewsArticle>> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const article = getFeaturedArticle();

    return {
      data: article,
      success: true,
    };
  } catch (error) {
    return {
      data: getFeaturedArticle(), // Fallback
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch featured article',
    };
  }
};

/**
 * Get trending topics
 */
export const fetchTrendingTopics = async (): Promise<NewsApiResponse<NewsCategory[]>> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const topics = getTrendingTopics();

    return {
      data: topics,
      success: true,
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch trending topics',
    };
  }
};

/**
 * Search articles by keyword
 * (Future enhancement - currently searches in title and summary)
 */
export const searchNews = async (
  query: string,
  params: NewsQueryParams = {}
): Promise<NewsApiResponse<NewsArticle[]>> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let articles = getArticlesByCategory(params.category || 'All');

    // Simple search in title and summary
    const searchLower = query.toLowerCase();
    articles = articles.filter(
      article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.summary.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower)
    );

    // Sort by relevance (simple: title matches first)
    articles = articles.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchLower);
      const bTitleMatch = b.title.toLowerCase().includes(searchLower);
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });

    return {
      data: articles,
      success: true,
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      message: error instanceof Error ? error.message : 'Failed to search news',
    };
  }
};
