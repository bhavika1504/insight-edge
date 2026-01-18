/**
 * News Sources Configuration
 * 
 * This file defines the news sources and their configurations
 * for fetching real-time Smart Cities news
 */

export interface NewsSource {
  id: string;
  name: string;
  type: 'rss' | 'api' | 'scraper';
  url?: string;
  apiKey?: string;
  enabled: boolean;
  categories: string[];
}

export const newsSources: NewsSource[] = [
  {
    id: 'timesofindia',
    name: 'Times of India',
    type: 'rss',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128833038.cms', // Cities RSS
    enabled: true,
    categories: ['Smart Cities', 'Urban Mobility', 'Infrastructure'],
  },
  {
    id: 'timesofindia-tech',
    name: 'Times of India - Technology',
    type: 'rss',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/5880659.cms',
    enabled: true,
    categories: ['Technology in Cities'],
  },
  {
    id: 'newsapi',
    name: 'NewsAPI',
    type: 'api',
    url: 'https://newsapi.org/v2/everything',
    apiKey: import.meta.env.VITE_NEWSAPI_KEY || '',
    enabled: true,
    categories: ['Smart Cities', 'Urban Mobility', 'Infrastructure', 'Sustainability'],
  },
  {
    id: 'datagov',
    name: 'Data.gov.in',
    type: 'api',
    url: 'https://api.data.gov.in/resource',
    apiKey: import.meta.env.VITE_DATAGOV_KEY || '',
    enabled: true,
    categories: ['Governance & Policy'],
  },
];

// Smart Cities related keywords for filtering
export const smartCityKeywords = [
  'smart city',
  'urban development',
  'urban planning',
  'smart mobility',
  'public transit',
  'traffic management',
  'city infrastructure',
  'sustainable city',
  'urban technology',
  'IoT city',
  'digital city',
  'city data',
  'urban analytics',
  'municipal',
  'civic tech',
  'urban innovation',
];
