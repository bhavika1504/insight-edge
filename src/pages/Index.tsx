import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, Target, TrendingUp, Map, Building2, TreePine, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import heroCity from "@/assets/hero-city.png";

const features = [
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "We parse your resume to understand your unique skills and experience, not to judge.",
  },
  {
    icon: Target,
    title: "Skill Gap Detection",
    description: "Identify exactly what's missing to excel in Smart City roles with precision.",
  },
  {
    icon: TrendingUp,
    title: "Smart City Role Matching",
    description: "Get matched with roles that align with your skills and passion for urban development.",
  },
  {
    icon: Map,
    title: "AI Learning Roadmap",
    description: "A personalized step-by-step plan to build the skills you need for impact.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-32 h-32 rounded-full bg-secondary/50 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-leaf/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-sage/30 blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-8"
            >
              <TreePine className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Smart Cities Career Intelligence</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              Design Your Career for{" "}
              <span className="text-gradient-forest">Smarter Cities</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              AI-powered insights to help you build a career in Smart Cities & Urban Development. 
              Discover your path to shaping the cities of tomorrow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/upload">
                <Button className="btn-forest text-base px-8 py-6 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Upload Resume
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/career-match">
                <Button variant="outline" className="text-base px-8 py-6 rounded-xl border-2 border-primary/20 hover:bg-secondary hover:border-primary/40">
                  <Building2 className="w-5 h-5 mr-2" />
                  Explore Smart City Roles
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative max-w-4xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-card">
              <img 
                src={heroCity} 
                alt="Smart city with nature integration" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 section-sage">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How InsightEdge Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From resume to roadmap, we guide your journey into Smart Cities careers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="card-urban p-10 md:p-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Shape the Future?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of professionals building careers that make cities smarter, greener, and more livable.
              </p>
              <Link to="/upload">
                <Button className="btn-forest text-base px-10 py-6">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
