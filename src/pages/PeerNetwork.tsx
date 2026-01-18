import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Users,
    ArrowRight,
    Sparkles,
    BookOpen,
    GraduationCap,
    Loader2,
    FileText,
    CheckCircle2,
    ExternalLink,
    Globe,
    Linkedin,
    Mail,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPeerMatches, connectWithPeer, PeerMatch, PeerConnectionResponse } from "@/services/careerService";
import { toast } from "sonner";

const PeerNetwork = () => {
    const [loading, setLoading] = useState(true);
    const [peers, setPeers] = useState<PeerMatch[]>([]);
    const [userSkills, setUserSkills] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [connectedPeers, setConnectedPeers] = useState<Record<string, PeerConnectionResponse["peer"]>>({});
    const [connectingId, setConnectingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchPeers = async () => {
            try {
                setLoading(true);
                const response = await getPeerMatches();
                setPeers(response.peers);
                setUserSkills(response.user_skills);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to load peer matches.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchPeers();
    }, []);

    const handleConnect = async (peerId: string) => {
        try {
            setConnectingId(peerId);
            const response = await connectWithPeer(peerId);
            setConnectedPeers(prev => ({ ...prev, [peerId]: response.peer }));
            toast.success(response.message);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to connect.";
            toast.error(errorMessage);
        } finally {
            setConnectingId(null);
        }
    };

    const getMatchColor = (score: number) => {
        if (score >= 60) return "text-leaf";
        if (score >= 45) return "text-olive";
        return "text-muted-foreground";
    };

    const getMatchBg = (score: number) => {
        if (score >= 60) return "bg-leaf/20";
        if (score >= 45) return "bg-olive/20";
        return "bg-muted";
    };

    const isNoResume = !!error && (error.toLowerCase().includes("upload") || error.toLowerCase().includes("resume"));
    const isServerOutdated = !!error && error.includes("404");
    const isServerDown = !!error && (error.toLowerCase().includes("failed to fetch") || error.toLowerCase().includes("networkerror") || error.toLowerCase().includes("no connection"));

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Finding your learning peers...</p>
                </div>
            </div>
        );
    }

    if (isServerDown) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container mx-auto px-4 text-center max-w-md"
                >
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Globe className="w-10 h-10 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">No Connection</h2>
                    <p className="text-muted-foreground mb-8">
                        The Peer Network cannot reach the backend server. Please make sure `python main.py` is running in your terminal.
                    </p>
                    <Button onClick={() => window.location.reload()} className="btn-forest px-8 py-4 rounded-xl group">
                        Reconnect
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </motion.div>
            </div>
        );
    }

    if (isServerOutdated) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container mx-auto px-4 text-center max-w-md"
                >
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Loader2 className="w-10 h-10 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Server Outdated</h2>
                    <p className="text-muted-foreground mb-8">
                        The Peer Network feature requires a backend update. Please restart your Python server (`python main.py`) to activate the new matching engine.
                    </p>
                    <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl border-2">
                        Refresh Connection
                    </Button>
                </motion.div>
            </div>
        );
    }

    if (isNoResume) {
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
                    <h2 className="text-2xl font-bold text-foreground mb-4">Connect with Peers</h2>
                    <p className="text-muted-foreground mb-8">
                        Upload your resume first to find peers with complementary skills who can help accelerate your learning.
                    </p>
                    <Link to="/upload">
                        <Button className="btn-forest px-8 py-6 text-lg rounded-2xl group">
                            Upload Resume
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <X className="w-8 h-8 text-destructive" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Connection Error</h3>
                    <p className="text-sm text-muted-foreground mb-6">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Skill Swap Network</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Find Your Learning Partners
                    </h1>
                    <p className="text-muted-foreground">
                        Connect with peers who have skills you're learning — and can learn from skills you already have.
                    </p>
                </motion.div>

                {/* Your Skills Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="max-w-3xl mx-auto mb-8"
                >
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                            <Sparkles className="w-4 h-4" />
                            Your Skills
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {userSkills.length > 0 ? (
                                userSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground italic">
                                    General profile extracted from resume
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Peer Cards */}
                <div className="max-w-3xl mx-auto space-y-6">
                    {peers.length > 0 ? (
                        peers.map((peer, index) => {
                            const isConnected = !!connectedPeers[peer.peer_id];
                            const connection = connectedPeers[peer.peer_id];

                            return (
                                <motion.div
                                    key={peer.peer_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                    className="card-urban p-6 border-2 border-border hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                                        {/* Avatar & Info */}
                                        <div className="flex items-center gap-4 md:flex-col md:items-center md:w-32">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getMatchBg(peer.match_score)}`}>
                                                <Users className={`w-8 h-8 ${getMatchColor(peer.match_score)}`} />
                                            </div>
                                            <div className="md:text-center">
                                                <h3 className="font-bold text-foreground">{peer.pseudonym}</h3>
                                                <p className="text-xs text-muted-foreground">{peer.target_role}</p>
                                            </div>
                                        </div>

                                        {/* Skill Exchange */}
                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* They Can Teach */}
                                                <div className="p-4 rounded-xl bg-leaf/10">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-leaf mb-2">
                                                        <GraduationCap className="w-4 h-4" />
                                                        They Can Teach You
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {peer.they_can_teach.length > 0 ? (
                                                            peer.they_can_teach.map((skill) => (
                                                                <span
                                                                    key={skill}
                                                                    className="px-2 py-1 rounded-full text-xs bg-leaf/20 text-leaf"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">Learning similar skills</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* You Can Teach */}
                                                <div className="p-4 rounded-xl bg-primary/10">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                                                        <BookOpen className="w-4 h-4" />
                                                        You Can Teach Them
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {peer.you_can_teach.length > 0 ? (
                                                            peer.you_can_teach.map((skill) => (
                                                                <span
                                                                    key={skill}
                                                                    className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">Similar skill level</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Match Score & Action */}
                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`px-3 py-1 rounded-lg ${getMatchBg(peer.match_score)}`}>
                                                        <span className={`text-sm font-semibold ${getMatchColor(peer.match_score)}`}>
                                                            {peer.match_score}% Match
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        via {peer.contact_preference}
                                                    </span>
                                                </div>

                                                <AnimatePresence mode="wait">
                                                    {isConnected && connection ? (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5 text-leaf" />
                                                            <div className="text-sm">
                                                                {connection.contact_preference === "LinkedIn" ? (
                                                                    <a
                                                                        href={`https://${connection.contact_value}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-1 text-[#0077b5] hover:underline"
                                                                    >
                                                                        <Linkedin className="w-4 h-4" />
                                                                        Connect
                                                                        <ExternalLink className="w-3 h-3" />
                                                                    </a>
                                                                ) : (
                                                                    <a
                                                                        href={`mailto:${connection.contact_value}`}
                                                                        className="flex items-center gap-1 text-primary hover:underline"
                                                                    >
                                                                        <Mail className="w-4 h-4" />
                                                                        {connection.contact_value}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ) : (
                                                        <Button
                                                            onClick={() => handleConnect(peer.peer_id)}
                                                            disabled={connectingId === peer.peer_id}
                                                            className="btn-forest"
                                                        >
                                                            {connectingId === peer.peer_id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                            ) : null}
                                                            Connect
                                                        </Button>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 px-6 rounded-[2.5rem] bg-secondary/20 border-2 border-dashed border-border/50"
                        >
                            <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Users className="w-8 h-8 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Resume Processed</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto mb-6">
                                We've analyzed your skills, but haven't found a direct skill-swap match in the network just yet.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-xs font-medium text-primary/60 animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Scanning for new partners...
                            </div>
                        </motion.div>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="max-w-3xl mx-auto mt-12 text-center"
                >
                    <p className="text-muted-foreground text-sm mb-4">
                        Matches not what you expected? You can always refine your profile by uploading an updated resume.
                    </p>
                    <Link to="/upload">
                        <Button variant="outline" className="rounded-xl border-2">
                            Update Resume
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default PeerNetwork;
