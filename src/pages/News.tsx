import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper, Sparkles, TrendingUp, RefreshCw, AlertCircle, Calendar } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import { CategoryFilter } from "@/components/news/CategoryFilter";
import { Button } from "@/components/ui/button";
import {
  newsCategories,
  type NewsCategory,
} from "@/lib/news-data";
import {
  getLatestNews,
  getPast30DaysNews,
  getFeaturedArticle,
  clearNewsCache,
} from "@/lib/news-service";
import { getNewsWithFallback } from "@/lib/news-fallback";
import { NewsArticle } from "@/lib/news-data";

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | "All">("All");
  const [dateFilter, setDateFilter] = useState<"latest" | "past30days">("latest");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
        clearNewsCache();
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Fetch news based on date filter (with fallback)
      let allNews: NewsArticle[];
      try {
        if (dateFilter === "latest") {
          allNews = await getLatestNews(forceRefresh);
        } else {
          allNews = await getPast30DaysNews(forceRefresh);
        }
        
        // If no real news, use fallback
        if (!allNews || allNews.length === 0) {
          allNews = await getNewsWithFallback(dateFilter);
        }
      } catch (error) {
        // Use fallback on error
        allNews = await getNewsWithFallback(dateFilter);
      }

      // Filter by category
      const filteredNews = selectedCategory === "All"
        ? allNews
        : allNews.filter(article => article.category === selectedCategory);

      setArticles(filteredNews);

      // Get featured article
      const featured = await getFeaturedArticle(dateFilter);
      setFeaturedArticle(featured);

      // Exclude featured from main list
      if (featured) {
        setArticles(prev => prev.filter(a => a.id !== featured.id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news");
      console.error("Error loading news:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [selectedCategory, dateFilter]);

  const handleRefresh = () => {
    loadNews(true);
  };

  // Get trending topics from current articles
  const getTrendingTopics = (): NewsCategory[] => {
    const categoryCounts = newsCategories.map(category => ({
      category,
      count: articles.filter(a => a.category === category).length,
    }));
    
    return categoryCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
      .map(item => item.category);
  };

  const trendingTopics = getTrendingTopics();
  const latestArticles = articles.filter(
    (article) => featuredArticle && article.id !== featuredArticle.id
  );

  if (isLoading && articles.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading latest Smart Cities news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-6">
            <Newspaper className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">News & Insights</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Smart Cities News Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Curated urban intelligence, not breaking news chaos
          </p>
        </motion.div>

        {/* Date Filter Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl mx-auto mb-6"
        >
          <div className="card-urban p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Time Range:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={dateFilter === "latest" ? "default" : "outline"}
                onClick={() => setDateFilter("latest")}
                className="rounded-xl"
                disabled={isRefreshing}
              >
                Latest News
              </Button>
              <Button
                variant={dateFilter === "past30days" ? "default" : "outline"}
                onClick={() => setDateFilter("past30days")}
                className="rounded-xl"
                disabled={isRefreshing}
              >
                Past 30 Days
              </Button>
              <Button
                variant="ghost"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto mb-6"
          >
            <div className="card-urban p-4 bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Error loading news</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Trending Topics */}
        {trendingTopics.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-5xl mx-auto mb-8"
          >
            <div className="card-urban p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Trending Topics</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <motion.button
                    key={topic}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(topic)}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-leaf/20 text-leaf border border-leaf/30 hover:bg-leaf/30 transition-colors"
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto mb-8"
        >
          <CategoryFilter
            categories={newsCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>

        {/* Featured Story */}
        {featuredArticle && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-5xl mx-auto mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Featured Story</h2>
            </div>
            <NewsCard article={featuredArticle} variant="featured" />
          </motion.div>
        )}

        {/* Latest News Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-6">
            <Newspaper className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              {selectedCategory === "All" 
                ? dateFilter === "latest" 
                  ? "Latest News" 
                  : "Past 30 Days News"
                : `${selectedCategory} News`}
            </h2>
            <span className="text-sm text-muted-foreground">
              ({latestArticles.length} {latestArticles.length === 1 ? "article" : "articles"})
            </span>
          </div>

          {isRefreshing && (
            <div className="text-center py-8">
              <RefreshCw className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Refreshing news...</p>
            </div>
          )}

          {!isRefreshing && latestArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <NewsCard article={article} />
                </motion.div>
              ))}
            </div>
          ) : !isRefreshing ? (
            <div className="card-urban p-12 text-center">
              <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                No articles found in this category.
              </p>
              <p className="text-sm text-muted-foreground">
                Try selecting a different category or time range.
              </p>
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
};

export default News;
