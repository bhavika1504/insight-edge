import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, ExternalLink, ArrowRight } from "lucide-react";
import { NewsArticle } from "@/lib/news-data";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  article: NewsArticle;
  variant?: "default" | "featured";
}

export const NewsCard = ({ article, variant = "default" }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
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

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-urban p-8 border-2 border-primary/20"
      >
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getCategoryColor(article.category)}>
                {article.category}
              </Badge>
              <span className="text-sm text-muted-foreground">Featured Story</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {article.title}
            </h2>
            
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              {article.summary}
            </p>
            
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(article.publishedDate)}
              </div>
              <span>•</span>
              <span>{article.source}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to={`/news/${article.id}`}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center gap-2 text-primary font-medium group"
                >
                  Read Full Story
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  (Original Source)
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card-urban p-6 h-full flex flex-col"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <Badge className={getCategoryColor(article.category)}>
          {article.category}
        </Badge>
        <ExternalLink className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-bold text-foreground mb-2">
        {article.title}
      </h3>
      
      <p className="text-muted-foreground text-sm mb-4 flex-1">
        {article.summary}
      </p>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          {formatDate(article.publishedDate)}
        </div>
        <span>{article.source}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <Link to={`/news/${article.id}`}>
          <motion.div
            whileHover={{ x: 5 }}
            className="inline-flex items-center gap-2 text-primary font-medium text-sm group"
          >
            Read More
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </Link>
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Source
          </a>
        )}
      </div>
    </motion.div>
  );
};
