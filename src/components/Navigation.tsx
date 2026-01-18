import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import {
  Menu, X, Leaf, FileText, Target, TrendingUp, Map, Info,
  Newspaper, MessageSquare, LogOut, Users, Globe, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navGroups = [
  {
    name: "Career Tools",
    items: [
      { name: "Upload Resume", path: "/upload", icon: FileText, description: "Get started with your profile" },
      { name: "Career Match", path: "/career-match", icon: Target, description: "Find roles that fit you" },
      { name: "Skill Gap", path: "/skill-gap", icon: TrendingUp, description: "Bridge your knowledge gaps" },
      { name: "Roadmap", path: "/roadmap", icon: Map, description: "Your path to success" },
    ]
  },
  {
    name: "Network",
    items: [
      { name: "Peer Network", path: "/peer-network", icon: Users, description: "Connect with others" },
      { name: "Global Marketplace", path: "/global-opportunities", icon: Globe, description: "Explore opportunities" },
    ]
  },
  {
    name: "Insights",
    items: [
      { name: "News & Insights", path: "/news", icon: Newspaper, description: "Stay informed with trends" },
      { name: "Market Trends", path: "/impact", icon: TrendingUp, description: "Analyze market impact" },
    ]
  },
  {
    name: "Assistant",
    items: [
      { name: "ChatBot", path: "/chatbot", icon: MessageSquare, description: "Instant AI assistance" },
    ]
  }
];

const NavDropdown = ({ group, isActive }: { group: any, isActive: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:text-primary hover:bg-secondary/40"
          }`}
      >
        {group.name}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl"
          >
            <div className="grid gap-1">
              {group.items.map((item: any) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{item.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#1B4332] flex items-center justify-center overflow-hidden shadow-xl shadow-primary/20 border-2 border-white/20">
              <img
                src="/logo.jpg"
                alt="InsightEdge Logo"
                className="w-14 h-14 object-contain"
              />
            </div>
            <span className="text-2xl font-black text-gradient-forest tracking-tighter">InsightEdge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${location.pathname === "/" ? "bg-secondary text-primary" : "text-muted-foreground hover:text-primary hover:bg-secondary/40"
                }`}
            >
              Home
            </Link>

            {navGroups.map((group) => (
              <NavDropdown
                key={group.name}
                group={group}
                isActive={group.items.some(item => location.pathname === item.path)}
              />
            ))}

            <Link
              to="/about"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${location.pathname === "/about" ? "bg-secondary text-primary" : "text-muted-foreground hover:text-primary hover:bg-secondary/40"
                }`}
            >
              About
            </Link>
          </div>

          {/* CTA / Logout */}
          <div className="hidden md:block">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="h-10 px-5 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-4 py-6 space-y-6">
              {navGroups.map((group) => (
                <div key={group.name} className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4">
                    {group.name}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {group.items.map((item: any) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? "bg-secondary text-primary" : "text-muted-foreground"
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-bold">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-border/50 space-y-2">
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground"
                >
                  <Info className="w-5 h-5" />
                  <span className="font-bold">About InsightEdge</span>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full h-12 rounded-xl font-bold gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
