import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink, Building2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CareerRelevance } from "@/components/news/CareerRelevance";
import { getArticleById } from "@/lib/news-data";
import { getLatestNews, getPast30DaysNews } from "@/lib/news-service";
import { Badge } from "@/components/ui/badge";
import { NewsArticle } from "@/lib/news-data";

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      // First try mock data
      let foundArticle = getArticleById(id);
      
      // If not found in mock data, search in real news
      if (!foundArticle) {
        try {
          const latestNews = await getLatestNews();
          const past30News = await getPast30DaysNews();
          const allNews = [...latestNews, ...past30News];
          foundArticle = allNews.find(a => a.id === id);
        } catch (error) {
          console.error("Error loading article:", error);
        }
      }
      
      setArticle(foundArticle);
      setIsLoading(false);
    };
    
    loadArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or may have been removed.
          </p>
          <Link to="/news">
            <Button className="btn-forest">Back to News</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Smart Cities": "bg-leaf/20 text-leaf",
      "Urban Mobility": "bg-primary/20 text-primary",
      "Infrastructure": "bg-olive/20 text-olive",
      "Sustainability": "bg-leaf/20 text-leaf",
      "Governance & Policy": "bg-primary/20 text-primary",
      "Technology in Cities": "bg-olive/20 text-olive",
    };
    return colors[category] || "bg-secondary text-muted-foreground";
  };

  // Split content into paragraphs
  const paragraphs = article.content.split("\n\n").filter((p) => p.trim());

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-4xl mx-auto mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Button>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Badge className={getCategoryColor(article.category)}>
              {article.category}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishedDate)}
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              {article.source}
            </div>
            {article.url && (
              <>
                <span>•</span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read on {article.source}
                </a>
              </>
            )}
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="card-urban p-8 md:p-12 mb-8">
            {paragraphs.length > 0 ? (
              <div className="prose prose-lg max-w-none">
                {paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="text-muted-foreground leading-relaxed mb-6 text-base md:text-lg"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-6">
                  {article.summary}
                </p>
                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 btn-forest"
                  >
                    Read Full Article on {article.source}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Career Relevance Section */}
          <CareerRelevance article={article} />
        </motion.div>

        {/* Related Articles Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="card-urban p-6 bg-secondary/50">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Explore More Smart City News
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Stay updated with the latest developments in urban technology and Smart City initiatives.
            </p>
            <Link to="/news">
              <Button variant="outline" className="rounded-xl">
                Browse All News
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Article;
