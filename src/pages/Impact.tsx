import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Car, Users, Leaf, Wifi, BarChart3, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const impactAreas = [
  {
    icon: Car,
    title: "Urban Mobility",
    description: "Reduce traffic congestion by 25% through smart routing",
    stat: "2M+ commuters",
    color: "leaf",
  },
  {
    icon: Building2,
    title: "City Operations",
    description: "Optimize city services for 15% cost savings",
    stat: "30+ departments",
    color: "olive",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Cut carbon emissions through data-driven decisions",
    stat: "40% reduction",
    color: "primary",
  },
  {
    icon: Users,
    title: "Public Services",
    description: "Improve citizen satisfaction with smart solutions",
    stat: "500K residents",
    color: "leaf",
  },
];

const impactData = [
  { name: "Traffic Flow", impact: 85, fill: "hsl(120 35% 50%)" },
  { name: "Energy Use", impact: 72, fill: "hsl(80 25% 45%)" },
  { name: "Public Transit", impact: 90, fill: "hsl(150 40% 22%)" },
  { name: "Emergency Response", impact: 65, fill: "hsl(120 35% 50%)" },
  { name: "Waste Management", impact: 78, fill: "hsl(80 25% 45%)" },
];

const getColorClasses = (color: string) => {
  switch (color) {
    case "leaf":
      return { bg: "bg-leaf/20", text: "text-leaf" };
    case "olive":
      return { bg: "bg-olive/20", text: "text-olive" };
    default:
      return { bg: "bg-primary/20", text: "text-primary" };
  }
};

const Impact = () => {
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
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Make a Difference</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Smart City Impact
          </h1>
          <p className="text-muted-foreground">
            As an Urban Data Analyst, here's how you'll shape the cities of tomorrow
          </p>
        </motion.div>

        {/* Impact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {impactAreas.map((area, index) => {
              const Icon = area.icon;
              const colors = getColorClasses(area.color);
              
              return (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="card-urban p-6 text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{area.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{area.description}</p>
                  <span className={`text-lg font-bold ${colors.text}`}>{area.stat}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Impact Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="card-urban p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Potential Impact Areas
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(90 20% 85%)" />
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(150 20% 40%)" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120} 
                    stroke="hsl(150 20% 40%)"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(0 0% 100%)",
                      border: "1px solid hsl(90 20% 85%)",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="impact" radius={[0, 8, 8, 0]}>
                    {impactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* City Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="card-urban p-8 text-center">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
              {[Building2, Car, Wifi, Leaf, Users, BarChart3].map((Icon, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="aspect-square rounded-2xl bg-secondary flex items-center justify-center"
                >
                  <Icon className="w-8 h-8 text-primary" />
                </motion.div>
              ))}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Building Connected, Sustainable Cities
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your work will connect mobility, energy, public services, and sustainability 
              to create cities that work better for everyone.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="max-w-xl mx-auto text-center"
        >
          <Link to="/about">
            <Button className="btn-forest text-base px-8 py-6">
              Learn How It Works
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Impact;
