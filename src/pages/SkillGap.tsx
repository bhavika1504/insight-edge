import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, CheckCircle2, Target, ArrowRight, Zap, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeSkillsGap, getResumeAnalysis, SkillsGapAnalysis } from "@/services/careerService";
import { toast } from "sonner";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const targetRoles = [
  "Smart City Analyst",
  "Urban Data Scientist",
  "Urban Planner (Tech-enabled)",
  "Smart Infrastructure Engineer",
  "GIS Analyst",
  "Transportation Systems Analyst",
  "Sustainability Analyst",
  "Energy Systems Engineer",
  "IoT Engineer (Smart Cities)",
  "Civic Tech Developer",
  "Urban AI Engineer",
];

const SkillGap = () => {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [targetRole, setTargetRole] = useState("Smart City Analyst");
  const [skillsGap, setSkillsGap] = useState<SkillsGapAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSkillsGap = async (role: string) => {
    try {
      setAnalyzing(true);
      const response = await analyzeSkillsGap(role);
      setSkillsGap(response);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze skills gap";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillsGap(targetRole);
  }, []);

  const handleRoleChange = (role: string) => {
    setTargetRole(role);
    fetchSkillsGap(role);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing your skills...</p>
        </div>
      </div>
    );
  }

  if (error && !skillsGap) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">No Resume Data Found</h2>
          <p className="text-muted-foreground mb-6">Please upload your resume first to analyze skill gaps.</p>
          <Link to="/upload">
            <Button className="btn-forest">Upload Resume</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Build radar chart data
  const radarData = skillsGap?.required_skills.slice(0, 6).map(skill => ({
    skill: skill.length > 12 ? skill.slice(0, 12) + "..." : skill,
    current: skillsGap.matching_skills.includes(skill) ? 80 : 20,
    required: 80,
  })) || [];

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
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Skill Assessment</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Skills Gap Analysis
          </h1>
          <p className="text-muted-foreground mb-6">
            See how your skills match up against your target role
          </p>

          {/* Role Selector */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-muted-foreground">Target Role:</span>
            <Select value={targetRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {targetRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {analyzing && (
          <div className="text-center mb-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          </div>
        )}

        {skillsGap && (
          <>
            {/* Match Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-md mx-auto mb-8"
            >
              <div className={`card-urban p-6 text-center ${skillsGap.readiness === "High" ? "border-2 border-leaf/30" :
                skillsGap.readiness === "Medium" ? "border-2 border-olive/30" : ""
                }`}>
                <div className="text-5xl font-bold text-primary mb-2">
                  {skillsGap.match_percentage}%
                </div>
                <div className="text-lg text-muted-foreground mb-2">Match for {skillsGap.target_role}</div>
                <div className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${skillsGap.readiness === "High" ? "bg-leaf/20 text-leaf" :
                  skillsGap.readiness === "Medium" ? "bg-olive/20 text-olive" :
                    "bg-muted text-muted-foreground"
                  }`}>
                  Readiness: {skillsGap.readiness}
                </div>
              </div>
            </motion.div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card-urban p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Skills Overview
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(90 20% 85%)" />
                      <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: "hsl(150 20% 40%)", fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: "hsl(150 20% 40%)", fontSize: 10 }}
                      />
                      <Radar
                        name="Required"
                        dataKey="required"
                        stroke="hsl(80 25% 45%)"
                        fill="hsl(80 25% 45%)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke="hsl(120 35% 50%)"
                        fill="hsl(120 35% 50%)"
                        fillOpacity={0.4}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-leaf" />
                    <span className="text-sm text-muted-foreground">Your Skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-olive" />
                    <span className="text-sm text-muted-foreground">Required</span>
                  </div>
                </div>
              </motion.div>

              {/* Missing Skills */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card-urban p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Skills to Develop ({skillsGap.missing_skills.length})
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {skillsGap.missing_skills.length > 0 ? (
                    skillsGap.missing_skills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="p-3 rounded-xl bg-secondary flex items-center justify-between"
                      >
                        <span className="font-medium text-foreground">{skill}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive">
                          Missing
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-leaf">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                      <p>You have all the required skills!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Your Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-5xl mx-auto mt-8"
            >
              <div className="card-urban p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-leaf" />
                  Your Matching Skills ({skillsGap.matching_skills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillsGap.matching_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-2 rounded-full text-sm bg-leaf/20 text-leaf font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 inline mr-1" />
                      {skill}
                    </span>
                  ))}
                </div>

                {skillsGap.current_skills.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">All Your Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsGap.current_skills.slice(0, 20).map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full text-sm bg-secondary text-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                      {skillsGap.current_skills.length > 20 && (
                        <span className="px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground">
                          +{skillsGap.current_skills.length - 20} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Learning Recommendations */}
            {skillsGap.recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="max-w-5xl mx-auto mt-8"
              >
                <div className="card-urban p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    🎓 Learning Recommendations (Click to Open)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skillsGap.recommendations.map((rec, index) => (
                      <motion.a
                        key={rec.skill}
                        href={rec.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="block p-4 rounded-xl bg-primary/10 hover:bg-primary/20 border-2 border-primary/30 hover:border-primary transition-all cursor-pointer"
                      >
                        <div className="font-medium text-foreground mb-1">{rec.skill}</div>
                        <div className="text-sm text-primary underline mb-1">{rec.resource} ↗</div>
                        <div className="text-xs text-muted-foreground">Duration: {rec.duration}</div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="max-w-xl mx-auto mt-12 text-center"
            >
              <Link to="/roadmap">
                <Button className="btn-forest text-base px-8 py-6">
                  Get Your Learning Roadmap
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default SkillGap;
