import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Target, TrendingUp, CheckCircle2, AlertCircle, ArrowRight, Briefcase, Code, Database, Cloud, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCareerPaths, getResumeAnalysis, CareerPath, ResumeAnalysis } from "@/services/careerService";
import { toast } from "sonner";

const iconMap: Record<string, any> = {
  "Data Scientist": Database,
  "Software Engineer": Code,
  "Frontend Developer": Code,
  "Backend Developer": Code,
  "Data Analyst": Database,
  "DevOps Engineer": Cloud,
  "ML Engineer": Database,
  "IT Professional": Briefcase,
};

const getConfidenceColor = (match: string) => {
  switch (match) {
    case "High":
      return "text-leaf";
    case "Medium":
      return "text-olive";
    default:
      return "text-muted-foreground";
  }
};

const getConfidenceBg = (match: string) => {
  switch (match) {
    case "High":
      return "bg-leaf/20";
    case "Medium":
      return "bg-olive/20";
    default:
      return "bg-muted";
  }
};

const CareerMatch = () => {
  const [loading, setLoading] = useState(true);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch career paths and resume analysis
        const [pathsResponse, analysisResponse] = await Promise.all([
          getCareerPaths(),
          getResumeAnalysis()
        ]);

        setCareerPaths(pathsResponse.career_paths);
        setSkills(pathsResponse.skills_detected);
        setResumeAnalysis(analysisResponse);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load career data. Please upload a resume first.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing your career matches...</p>
        </div>
      </div>
    );
  }

  if (error || careerPaths.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 text-center max-w-md"
        >
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to find your match?</h2>
          <p className="text-muted-foreground mb-8">
            Upload your resume or link your LinkedIn profile to see personalized career matches in the Smart City ecosystem.
          </p>
          <Link to="/upload">
            <Button className="btn-forest px-8 py-6 text-lg rounded-2xl group">
              Start Analysis
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const topRole = careerPaths[0];
  const topRolePercentage = topRole.match_score;
  const TopIcon = iconMap[topRole.title] || Briefcase;

  const analysisSource = resumeAnalysis?.metadata?.source || "Uploaded Data";
  const sourceDetail = resumeAnalysis?.metadata?.filename || resumeAnalysis?.contact?.linkedin || "";

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
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf/20">
              <Target className="w-4 h-4 text-leaf" />
              <span className="text-sm font-medium text-leaf">Analysis Complete</span>
            </div>

            {resumeAnalysis && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground">
                <span className="font-semibold">{analysisSource}:</span>
                <span className="truncate max-w-[200px]">{sourceDetail}</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Career Matches
          </h1>
          <p className="text-muted-foreground">
            Based on your {skills.length} skills, here are the roles that best fit your profile
          </p>
        </motion.div>

        {/* Top Match */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="card-urban p-8 border-2 border-leaf/30">
            <div className="flex items-center gap-2 text-sm font-medium text-leaf mb-4">
              <CheckCircle2 className="w-4 h-4" />
              Top Recommendation
            </div>

            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-leaf/20 flex items-center justify-center flex-shrink-0">
                <TopIcon className="w-10 h-10 text-leaf" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {topRole.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {topRole.description}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div className={`px-4 py-2 rounded-xl ${getConfidenceBg(topRole.match)}`}>
                    <span className={`font-semibold ${getConfidenceColor(topRole.match)}`}>
                      {topRolePercentage}% Match
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Confidence: {topRole.match}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-leaf/10">
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-leaf" />
                      Your Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 6).map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full text-sm bg-leaf/20 text-leaf"
                        >
                          {skill}
                        </span>
                      ))}
                      {skills.length > 6 && (
                        <span className="px-3 py-1 rounded-full text-sm bg-secondary text-muted-foreground">
                          +{skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary">
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-olive" />
                      Next Steps
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {topRole.next_steps.slice(0, 3).map((step, i) => (
                        <li key={i}>• {step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link to="/skill-gap" className="flex-1">
                <Button className="w-full btn-forest">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Skill Gap Analysis
                </Button>
              </Link>
              <Link to="/roadmap" className="flex-1">
                <Button variant="outline" className="w-full rounded-xl border-2 hover:bg-secondary">
                  See Learning Roadmap
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Other Matches */}
        {careerPaths.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Other Potential Matches
            </h3>

            <div className="space-y-4">
              {careerPaths.slice(1).map((role, index) => {
                const Icon = iconMap[role.title] || Briefcase;
                const percentage = role.match_score;
                return (
                  <motion.div
                    key={role.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="card-urban p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getConfidenceBg(role.match)}`}>
                        <Icon className={`w-7 h-7 ${getConfidenceColor(role.match)}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground">{role.title}</h4>
                          <span className={`text-sm font-medium ${getConfidenceColor(role.match)}`}>
                            {percentage}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Resume Summary */}
        {resumeAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-3xl mx-auto mt-8"
          >
            <div className="card-urban p-6 bg-secondary/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Resume Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{resumeAnalysis.skills.length}</div>
                  <div className="text-sm text-muted-foreground">Skills</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{resumeAnalysis.projects.length}</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{resumeAnalysis.education.length}</div>
                  <div className="text-sm text-muted-foreground">Education</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{resumeAnalysis.quality_analysis.completeness_score}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CareerMatch;
