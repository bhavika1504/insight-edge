import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe,
    TrendingUp,
    DollarSign,
    MapPin,
    Plane,
    Laptop,
    Briefcase,
    Info,
    ArrowRight,
    ShieldCheck,
    Zap,
    Loader2,
    AlertCircle,
    ArrowLeftRight,
    ChevronRight,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getSkillArbitrage, ArbitrageOpportunity, SkillArbitrageResponse } from "@/services/careerService";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GlobalOpportunities = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<SkillArbitrageResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (usdAmount: number, targetIsLocal: boolean = false) => {
        const inrRate = 83.5;
        const inrAmount = usdAmount * inrRate;

        const inrFormatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        });

        const usdFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });

        if (targetIsLocal) {
            return inrFormatter.format(inrAmount);
        }

        return {
            usd: usdFormatter.format(usdAmount),
            inr: inrFormatter.format(inrAmount)
        };
    };

    useEffect(() => {
        const fetchArbitrage = async () => {
            try {
                setLoading(true);
                const result = await getSkillArbitrage();
                setData(result);
                setError(null);
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Failed to load global data. Please upload a resume first.";
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchArbitrage();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground animate-pulse">Scanning global markets for your skills...</p>
                </div>
            </div>
        );
    }

    if (error || !data || data.opportunities.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container mx-auto px-4 text-center max-w-md"
                >
                    <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                        <Globe className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Discover Your Global Value</h2>
                    <p className="text-muted-foreground mb-8">
                        Upload your resume to see where in the world your specific skills are worth the most.
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

    const bestFit = data.opportunities[0];
    const local = data.local_market;
    const arbitrageDelta = local ? ((bestFit.value_index / local.value_index) - 1) * 100 : 0;

    return (
        <div className="min-h-screen pt-24 pb-16 bg-background">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6 border border-primary/20">
                        <Globe className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary uppercase tracking-wider">Skill Arbitrage Intelligence</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Where Your Skills are <span className="text-gradient-forest">Worth Most</span>
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Compare your current local market benchmarks against global arbitrage opportunities.
                        Find where your time yields the highest return on investment.
                    </p>
                </motion.div>

                <Tabs defaultValue="global" className="w-full">
                    <div className="flex justify-center mb-12">
                        <TabsList className="bg-secondary/50 p-1 rounded-2xl border border-border">
                            <TabsTrigger value="global" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-sm font-semibold">
                                Global Marketplace
                            </TabsTrigger>
                            <TabsTrigger value="compare" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-sm font-semibold gap-2">
                                <ArrowLeftRight className="w-4 h-4" /> Market Comparison
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="global" className="mt-0">
                        {/* Featured Best Fit */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-5xl mx-auto mb-16"
                        >
                            <div className="relative group overflow-hidden rounded-3xl bg-secondary/30 border-2 border-primary/20 p-8 md:p-12 hover:border-primary/40 transition-all duration-500">
                                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Globe className="w-32 h-32 text-primary" />
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                    <div className="flex-1">
                                        <Badge className="bg-primary text-primary-foreground mb-6 px-4 py-1.5 rounded-full">
                                            TOP GLOBAL ARBITRAGE
                                        </Badge>
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-6xl md:text-7xl">{bestFit.flag}</span>
                                            <div>
                                                <h2 className="text-3xl md:text-4xl font-bold text-foreground">{bestFit.country}</h2>
                                                <p className="text-primary font-medium">{bestFit.city}, {bestFit.region}</p>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-lg mb-8 max-w-xl">
                                            {bestFit.description}
                                        </p>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                            <div className="card-urban p-4 bg-background/50 border border-border/40">
                                                <p className="text-xs text-muted-foreground uppercase mb-1">Market Focus</p>
                                                <p className="text-xl font-bold text-foreground truncate">{bestFit.dominant_sector}</p>
                                            </div>
                                            <div className="card-urban p-4 bg-background/50 border border-border/40">
                                                <p className="text-xs text-muted-foreground uppercase mb-1">Demand</p>
                                                <p className="text-xl font-bold text-primary">{bestFit.demand}</p>
                                            </div>
                                            <div className="card-urban p-4 bg-background/50 border border-border/40">
                                                <p className="text-xs text-muted-foreground uppercase mb-1">Salary (USD/INR)</p>
                                                <div className="flex flex-col">
                                                    <p className="text-xl font-bold text-foreground">
                                                        {(formatCurrency(bestFit.salary_usd) as any).usd}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground font-medium">
                                                        ≈ {(formatCurrency(bestFit.salary_usd) as any).inr}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="card-urban p-4 bg-background/50 border border-border/40">
                                                <p className="text-xs text-muted-foreground uppercase mb-1">Visa Ease</p>
                                                <p className="text-xl font-bold text-leaf">{bestFit.visa_ease}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-64 flex flex-col items-center justify-center p-8 bg-primary rounded-3xl text-primary-foreground text-center shadow-2xl shadow-primary/20">
                                        <TrendingUp className="w-12 h-12 mb-4" />
                                        <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-2">Value Index</p>
                                        <h3 className="text-6xl font-black mb-4">{bestFit.value_multiplier}</h3>
                                        <p className="text-xs opacity-70">Personalized to your skill vector</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.opportunities.slice(1).map((opportunity, index) => (
                                <motion.div
                                    key={opportunity.country}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="card-urban p-6 group hover:translate-y-[-4px] transition-all duration-300 bg-secondary/10 border border-border/50"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{opportunity.flag}</span>
                                            <div>
                                                <h3 className="font-bold text-foreground">{opportunity.country}</h3>
                                                <p className="text-xs text-muted-foreground">{opportunity.city}, {opportunity.region}</p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-secondary text-primary text-sm font-bold">
                                            {opportunity.value_multiplier}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-muted-foreground">Focus: {opportunity.dominant_sector}</span>
                                                <span className="font-medium text-foreground">{opportunity.demand}</span>
                                            </div>
                                            <Progress value={opportunity.demand === "High" ? 85 : 60} className="h-1.5" />
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-y border-border/30">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <DollarSign className="w-4 h-4" />
                                                <span>Avg. Salary</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-foreground">{(formatCurrency(opportunity.salary_usd) as any).usd}</span>
                                                <p className="text-[10px] text-muted-foreground font-medium">≈ {(formatCurrency(opportunity.salary_usd) as any).inr}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="text-[10px] items-center gap-1 py-0 border-border/60">
                                                <MapPin className="w-3 h-3" /> Visa: {opportunity.visa_ease}
                                            </Badge>
                                            {opportunity.remote_friendly && (
                                                <Badge variant="outline" className="text-[10px] items-center gap-1 py-0 text-leaf border-leaf/30 bg-leaf/5">
                                                    <Laptop className="w-3 h-3" /> Remote
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-muted-foreground/80 uppercase mb-2 flex items-center gap-1">
                                            <Zap className="w-3 h-3 text-primary" /> Matching Skills
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {opportunity.top_matching_skills.slice(0, 3).map(skill => (
                                                <span key={skill} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/30">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Button variant="ghost" className="w-full text-xs gap-2 group/btn hover:bg-primary/5 hover:text-primary transition-colors">
                                        View Deep Insight
                                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="compare" className="mt-0">
                        <div className="max-w-5xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12">
                                {/* Local Market Card */}
                                {local && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-8 rounded-3xl border border-border bg-secondary/5 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <MapPin className="w-32 h-32" />
                                        </div>
                                        <Badge variant="outline" className="mb-6 uppercase tracking-wider font-bold">Currently Analyzed Local Market</Badge>
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-6xl">{local.flag}</span>
                                            <div>
                                                <h2 className="text-3xl font-bold">{local.country}</h2>
                                                <p className="text-muted-foreground">{local.city}, {local.region}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center py-4 border-b border-border/50">
                                                <span className="text-muted-foreground">Market Demand</span>
                                                <Badge className="bg-primary/20 text-primary border-primary/30">{local.demand}</Badge>
                                            </div>
                                            <div className="flex justify-between items-center py-4 border-b border-border/50">
                                                <span className="text-muted-foreground">Avg. Salary</span>
                                                <span className="text-xl font-bold">{(formatCurrency(local.salary_usd, true) as string)}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-4 border-b border-border/50">
                                                <span className="text-muted-foreground">Relative Cost of Living</span>
                                                <span className="font-semibold">{local.col_index}/100</span>
                                            </div>
                                            <div className="flex justify-between items-center py-4">
                                                <span className="text-muted-foreground">Skill Value Index</span>
                                                <span className="text-2xl font-black text-primary">{local.value_multiplier}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex items-center justify-center -my-4 lg:my-0 lg:-mx-4 z-10">
                                    <div className="bg-primary p-4 rounded-full shadow-xl shadow-primary/40 border-4 border-background">
                                        <ArrowLeftRight className="w-8 h-8 text-primary-foreground" />
                                    </div>
                                </div>

                                {/* Best Fit Global Market Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-8 rounded-3xl border-2 border-primary/30 bg-primary/5 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <TrendingUp className="w-32 h-32 text-primary" />
                                    </div>
                                    <Badge className="mb-6 gap-2 bg-primary text-primary-foreground uppercase tracking-wider font-bold">
                                        Top Arbitrage Opportunity
                                    </Badge>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-6xl">{bestFit.flag}</span>
                                        <div>
                                            <h2 className="text-3xl font-bold text-foreground">{bestFit.country}</h2>
                                            <p className="text-primary font-bold">{bestFit.city}, {bestFit.region}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center py-4 border-b border-border/50">
                                            <span className="text-muted-foreground">Market Demand</span>
                                            <Badge className="bg-primary text-primary-foreground border-none">Personalized: {bestFit.demand}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center py-4 border-b border-border/50">
                                            <span className="text-muted-foreground">Avg. Salary</span>
                                            <div className="text-right">
                                                <span className="text-xl font-black text-primary">{(formatCurrency(bestFit.salary_usd) as any).usd}</span>
                                                <p className="text-[10px] text-muted-foreground font-medium">≈ {(formatCurrency(bestFit.salary_usd) as any).inr}</p>
                                                {local && <p className="text-[10px] text-leaf font-bold">+{(((bestFit.salary_usd / local.salary_usd) - 1) * 100).toFixed(0)}% Increase</p>}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center py-4 border-b border-border/50">
                                            <span className="text-muted-foreground">Relative Cost of Living</span>
                                            <span className="font-semibold text-foreground">{bestFit.col_index}/100</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4">
                                            <span className="text-muted-foreground font-bold text-foreground">Personalized Value Score</span>
                                            <div className="text-right">
                                                <span className="text-3xl font-black text-primary">{bestFit.value_multiplier}</span>
                                                {local && <p className="text-[10px] text-primary font-bold">ROI Factor: {(bestFit.value_index / local.value_index).toFixed(1)}x</p>}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Comparison Insights */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-10 rounded-[2.5rem] bg-foreground text-background shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/4 -translate-y-1/4">
                                    <Zap className="w-64 h-64 text-background" />
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                                    <div className="text-center md:text-left flex-1">
                                        <h3 className="text-3xl font-bold mb-4">Strategic Insights</h3>
                                        <p className="text-background/70 text-lg mb-8 leading-relaxed">
                                            Your skills in <span className="text-primary font-bold">{bestFit.dominant_sector}</span> are currently experiencing extreme demand in <span className="text-primary font-bold">{bestFit.country}</span>.
                                            By relocating or securing a remote position in this market, you effectively increase your purchasing power by
                                            <span className="text-4xl font-black block mt-2 text-primary">{arbitrageDelta.toFixed(0)}%</span>
                                        </p>
                                        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/20 rounded-lg">
                                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="font-semibold">Visa: {bestFit.visa_ease}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/20 rounded-lg">
                                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="font-semibold">{bestFit.remote_friendly ? "Remote Ready" : "On-Site Only"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto">
                                        <Button className="w-full md:w-auto px-10 py-8 text-xl rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 group">
                                            Explore Moving Guide
                                            <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </TabsContent>
                </Tabs>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-24 max-w-5xl mx-auto p-12 rounded-[3rem] bg-secondary/10 border border-primary/20 backdrop-blur-xl"
                >
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                    <Info className="w-8 h-8 text-primary" />
                                </div>
                                <h4 className="text-3xl font-black text-foreground tracking-tight">The Scoring Methodology</h4>
                            </div>

                            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                                Our suggestions are not static. The **Value Multiplier** is calculated through a dynamic engine that weighs three core pillars of your professional profile against global market data:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Zap className="w-5 h-5 font-bold" />
                                        <span className="font-extrabold uppercase tracking-widest text-xs">Pillar 01 (60%)</span>
                                    </div>
                                    <h5 className="text-lg font-bold">Skill-Sector Synergy</h5>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        We use **Fuzzy Keyword Matching** to map your resume to high-growth sectors. If a city has a high "Tightness Score" (High Demand + Low Supply) for your specific sector, your multiplier skyrockets.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary">
                                        <ArrowLeftRight className="w-5 h-5" />
                                        <span className="font-extrabold uppercase tracking-widest text-xs">Pillar 02 (30%)</span>
                                    </div>
                                    <h5 className="text-lg font-bold">Economic Arbitrage</h5>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        We normalize local salaries against the **Purchasing Power Parity (PPP)**. The score reflects how much "leftover" value you have after local expenses, compared to your current local baseline.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary">
                                        <ShieldCheck className="w-5 h-5" />
                                        <span className="font-extrabold uppercase tracking-widest text-xs">Pillar 03 (10%)</span>
                                    </div>
                                    <h5 className="text-lg font-bold">Operational Ease</h5>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Visa complexity, remote work availability, and regional stability are factored in to ensure the recommendation is not just profitable, but actually achievable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GlobalOpportunities;
