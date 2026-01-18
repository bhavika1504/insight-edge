import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FileText, Brain, Target, TrendingUp, Map, ArrowRight, 
  Leaf, Code, Database, Sparkles, Heart 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const processSteps = [
  { icon: FileText, label: "Resume", description: "Upload your experience" },
  { icon: Brain, label: "Skills", description: "AI extracts your abilities" },
  { icon: Target, label: "Role", description: "Match with Smart City jobs" },
  { icon: TrendingUp, label: "Gap", description: "Identify skill gaps" },
  { icon: Map, label: "Roadmap", description: "Get your learning path" },
];

const techStack = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Framer Motion", category: "Animation" },
  { name: "Recharts", category: "Visualization" },
  { name: "AI/ML", category: "Intelligence" },
];

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">How It Works</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About InsightEdge
          </h1>
          <p className="text-muted-foreground text-lg">
            Career intelligence for the cities of tomorrow
          </p>
        </motion.div>

        {/* Process Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="card-urban p-8">
            <h2 className="text-xl font-bold text-foreground mb-8 text-center">
              Your Journey with InsightEdge
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex flex-col items-center text-center relative"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{step.label}</h3>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                    
                    {index < processSteps.length - 1 && (
                      <ArrowRight className="hidden md:block absolute -right-6 top-6 w-5 h-5 text-muted-foreground" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="card-urban p-8 bg-leaf/10 border border-leaf/20">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-leaf/20 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-7 h-7 text-leaf" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  InsightEdge was born from a simple belief: the future of cities depends on 
                  talented people who understand both technology and urban challenges. We help 
                  bridge that gap by guiding professionals toward meaningful careers in Smart 
                  Cities and Urban Development.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  This isn't a job portal—it's career intelligence. We analyze your unique 
                  skills, identify gaps, and create personalized roadmaps so you can make 
                  real impact in the cities of tomorrow.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="card-urban p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Built With</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="p-4 rounded-xl bg-secondary text-center"
                >
                  <p className="font-medium text-foreground">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.category}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="card-urban p-8 text-center">
            <Heart className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-3">
              Built with Purpose
            </h2>
            <p className="text-muted-foreground mb-6">
              InsightEdge is a hackathon project focused on solving real career challenges 
              in the emerging Smart Cities sector. We believe in transparent, encouraging, 
              and human-centered AI guidance.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground">
                🌿 Sustainability First
              </span>
              <span className="px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground">
                🎯 Career Focused
              </span>
              <span className="px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground">
                🤖 AI-Powered
              </span>
              <span className="px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground">
                💚 Human-Centered
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="max-w-xl mx-auto text-center"
        >
          <Link to="/upload">
            <Button className="btn-forest text-base px-8 py-6">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
