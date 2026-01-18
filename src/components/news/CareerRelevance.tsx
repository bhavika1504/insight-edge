import { motion } from "framer-motion";
import { Target, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsArticle } from "@/lib/news-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CareerRelevanceProps {
  article: NewsArticle;
}

export const CareerRelevance = ({ article }: CareerRelevanceProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-urban p-6 bg-leaf/10 border border-leaf/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-leaf/20 flex items-center justify-center">
          <Target className="w-5 h-5 text-leaf" />
        </div>
        <h3 className="text-lg font-bold text-foreground">
          Why This Matters for Smart City Careers
        </h3>
      </div>
      
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {article.careerRelevance}
      </p>
      
      {article.relatedRoles.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Related Roles
          </h4>
          <div className="flex flex-wrap gap-2">
            {article.relatedRoles.map((role) => (
              <Badge
                key={role}
                className="bg-primary/20 text-primary border-primary/30"
              >
                {role}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {article.skillsMentioned.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Skills Mentioned
          </h4>
          <div className="flex flex-wrap gap-2">
            {article.skillsMentioned.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-xs"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <Link to="/career-match">
        <Button className="btn-forest w-full sm:w-auto">
          Explore Related Roles
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
};
