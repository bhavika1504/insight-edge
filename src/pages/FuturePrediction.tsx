import { useState } from "react";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { TrendingUp, ArrowRight, Brain, Briefcase, Zap, AlertCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Data representing Annual Salary in INR (₹)
const initialSalaryData = [
    { year: "2024", current: 650000, potential: 650000 },
    { year: "2025", current: 750000, potential: 900000 },
    { year: "2026", current: 850000, potential: 1250000 },
    { year: "2027", current: 1000000, potential: 1600000 },
    { year: "2028", current: 1200000, potential: 2200000 },
];

const skillDemandData = [
    { skill: "Data Analysis", demand: 85, growth: "Stable", location: "Pan-India" },
    { skill: "Smart City IoT", demand: 92, growth: "Rapid", location: "Bangalore/Pune" },
    { skill: "Urban Planning", demand: 70, growth: "Moderate", location: "Delhi NCR" },
    { skill: "GIS & Mapping", demand: 80, growth: "High", location: "Hyderabad" },
    { skill: "Public Policy", demand: 65, growth: "Stable", location: "Varanasi/Bhubaneswar" },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumSignificantDigits: 3,
    }).format(value);
};

const FuturePrediction = () => {
    const [isUpskilling, setIsUpskilling] = useState(false);

    return (
        <div className="min-h-screen pt-24 pb-16 bg-background">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
                        <Brain className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">AI Career Forecast (India Edition)</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Your Future Trajectory
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Projecting your career growth in the Indian Smart City sector based on current trends.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Salary Projection Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="col-span-1 lg:col-span-2"
                    >
                        <Card className="p-6 border-2 border-primary/10 shadow-lg">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                        Projected Salary Growth (INR)
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Estimated annual compensation in the Indian market
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setIsUpskilling(!isUpskilling)}
                                    className={`transition-all duration-300 ${isUpskilling ? "bg-green-600 hover:bg-green-700" : "bg-primary"
                                        }`}
                                >
                                    <Zap className="w-4 h-4 mr-2" />
                                    {isUpskilling ? "Upskilling Active" : "Simulate Upskilling"}
                                </Button>
                            </div>

                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={initialSalaryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="year" />
                                        <YAxis
                                            tickFormatter={(value) => `₹${value / 100000}L`}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => [formatCurrency(value), "Annual Salary"]}
                                            contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="current"
                                            name="Current Trajectory"
                                            stroke="#94a3b8"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                        />
                                        {isUpskilling && (
                                            <Line
                                                type="monotone"
                                                dataKey="potential"
                                                name="With Smart City Certification"
                                                stroke="#22c55e"
                                                strokeWidth={3}
                                                animationDuration={1500}
                                            />
                                        )}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Market Demand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex-1"
                    >
                        <Card className="p-6 h-full border-primary/10">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-500" />
                                Regional Skill Demand
                            </h3>
                            <div className="space-y-6">
                                {skillDemandData.map((item, index) => (
                                    <div key={item.skill} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{item.skill}</span>
                                                <div className="flex items-center text-xs text-muted-foreground gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {item.location}
                                                </div>
                                            </div>
                                            <Badge variant={item.growth === "Rapid" ? "default" : "outline"} className={item.growth === "Rapid" ? "bg-green-600" : ""}>
                                                {item.growth} Growth
                                            </Badge>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.demand}%` }}
                                                transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                                className="h-full bg-primary rounded-full relative"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Insights / Recommendations */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex-1"
                    >
                        <Card className="p-6 h-full border-primary/10 bg-secondary/30">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-500" />
                                Indian Market Insights
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-background border border-border">
                                    <h4 className="font-medium text-foreground mb-1">Bangalore & Pune Hubs</h4>
                                    <p className="text-sm text-muted-foreground">
                                        <span className="text-primary font-medium">Smart City IoT</span> roles are seeing a 30% YoY salary hike in these tech hubs.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-background border border-border">
                                    <h4 className="font-medium text-foreground mb-1">Government Initiatives</h4>
                                    <p className="text-sm text-muted-foreground">
                                        The Smart Cities Mission is driving demand for <span className="text-primary font-medium">Urban Analysts</span> in Tier-2 cities like Varanasi and Bhubaneswar, offering competitive packages.
                                    </p>
                                </div>
                                <Button className="w-full mt-2 group" variant="outline">
                                    View Detailed Indian Roadmap
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default FuturePrediction;
