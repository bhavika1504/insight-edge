import { Link } from "react-router-dom";
import { Leaf, Github, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">InsightEdge</span>
            </div>
            <p className="text-primary-foreground/70 text-sm">
              AI-powered career intelligence for Smart Cities & Urban Development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/upload" className="hover:text-primary-foreground transition-colors">Upload Resume</Link></li>
              <li><Link to="/career-match" className="hover:text-primary-foreground transition-colors">Career Match</Link></li>
              <li><Link to="/roadmap" className="hover:text-primary-foreground transition-colors">Learning Roadmap</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">How It Works</Link></li>
              <li><Link to="/skill-gap" className="hover:text-primary-foreground transition-colors">Skill Assessment</Link></li>
              <li><Link to="/impact" className="hover:text-primary-foreground transition-colors">Urban Impact</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/BhavikaSainani/insightEdge" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center text-sm text-primary-foreground/50">
          <p>InsightEdge. Built with 🌿 for smarter cities.</p>
        </div>
      </div>
    </footer>
  );
};
