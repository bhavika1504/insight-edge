import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Map, BookOpen, Code, Briefcase, CheckCircle2, Clock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const roadmapSteps = [
  {
    phase: "Learn",
    icon: BookOpen,
    color: "leaf",
    description: "Build your foundational knowledge",
    steps: [
      {
        skill: "GIS Fundamentals",
        why: "Essential for analyzing spatial urban data and creating city maps",
        effort: "4-6 weeks",
        resources: ["ESRI Training", "QGIS Tutorials"],
      },
      {
        skill: "Urban Planning Basics",
        why: "Understand how cities are designed and managed",
        effort: "3-4 weeks",
        resources: ["MIT OpenCourseWare", "Smart Cities MOOC"],
      },
    ],
  },
  {
    phase: "Practice",
    icon: Code,
    color: "olive",
    description: "Apply your skills with hands-on projects",
    steps: [
      {
        skill: "City Data Analysis Project",
        why: "Build a portfolio piece using real urban datasets",
        effort: "2-3 weeks",
        resources: ["NYC Open Data", "London Datastore"],
      },
      {
        skill: "Transportation Flow Visualization",
        why: "Demonstrate your ability to visualize complex mobility patterns",
        effort: "2 weeks",
        resources: ["D3.js", "Kepler.gl"],
      },
    ],
  },
  {
    phase: "Apply",
    icon: Briefcase,
    color: "primary",
    description: "Launch your Smart Cities career",
    steps: [
      {
        skill: "Build Your Portfolio",
        why: "Showcase 3-5 urban data projects to potential employers",
        effort: "Ongoing",
        resources: ["GitHub", "Personal Website"],
      },
      {
        skill: "Network & Apply",
        why: "Connect with Smart City professionals and apply to roles",
        effort: "Ongoing",
        resources: ["LinkedIn", "Smart City Events"],
      },
    ],
  },
];

const getColorClasses = (color: string) => {
  switch (color) {
    case "leaf":
      return { bg: "bg-leaf/20", text: "text-leaf", border: "border-leaf/30" };
    case "olive":
      return { bg: "bg-olive/20", text: "text-olive", border: "border-olive/30" };
    default:
      return { bg: "bg-primary/20", text: "text-primary", border: "border-primary/30" };
  }
};

const Roadmap = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Generated</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Learning Roadmap
          </h1>
          <p className="text-muted-foreground">
            A personalized step-by-step plan to build your Smart City career
          </p>
        </motion.div>

        {/* AI Mentor Note */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="card-urban p-6 bg-leaf/10 border border-leaf/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-leaf/20 flex items-center justify-center flex-shrink-0">
                <Map className="w-6 h-6 text-leaf" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Hey there, future city-shaper! 🌿
                </h3>
                <p className="text-muted-foreground text-sm">
                  I've analyzed your skills and created this roadmap just for you. 
                  The key is consistency—even 30 minutes a day adds up. 
                  Remember, every expert was once a beginner. You've got this!
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Roadmap Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            {roadmapSteps.map((phase, phaseIndex) => {
              const Icon = phase.icon;
              const colors = getColorClasses(phase.color);
              
              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + phaseIndex * 0.2 }}
                  className="relative mb-12 last:mb-0"
                >
                  {/* Phase Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center relative z-10`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${colors.text}`}>
                        Phase {phaseIndex + 1}: {phase.phase}
                      </h2>
                      <p className="text-muted-foreground">{phase.description}</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="md:ml-20 space-y-4">
                    {phase.steps.map((step, stepIndex) => (
                      <motion.div
                        key={step.skill}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + phaseIndex * 0.2 + stepIndex * 0.1 }}
                        className={`card-urban p-6 border-l-4 ${colors.border}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {step.skill}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3">
                              <span className="font-medium text-foreground">Why it matters:</span>{" "}
                              {step.why}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {step.resources.map((resource) => (
                                <span
                                  key={resource}
                                  className="px-3 py-1 rounded-full text-xs bg-secondary text-muted-foreground"
                                >
                                  {resource}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${colors.bg}`}>
                            <Clock className={`w-4 h-4 ${colors.text}`} />
                            <span className={`text-sm font-medium ${colors.text}`}>
                              {step.effort}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="max-w-xl mx-auto mt-16 text-center"
        >
          <div className="card-urban p-8">
            <CheckCircle2 className="w-12 h-12 text-leaf mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Ready to Start Your Journey?
            </h3>
            <p className="text-muted-foreground mb-6">
              Explore how your career can impact cities around the world
            </p>
            <Link to="/impact">
              <Button className="btn-forest">
                See Your Urban Impact
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Roadmap;
