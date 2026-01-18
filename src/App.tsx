import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import CareerMatch from "./pages/CareerMatch";
import SkillGap from "./pages/SkillGap";
import Roadmap from "./pages/Roadmap";
import Impact from "./pages/Impact";
import News from "./pages/News";
import Article from "./pages/Article";
import About from "./pages/About";
import ChatBot from "./pages/ChatBot";
import PeerNetwork from "./pages/PeerNetwork";
import GlobalOpportunities from "./pages/GlobalOpportunities";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/career-match" element={<CareerMatch />} />
                <Route path="/skill-gap" element={<SkillGap />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<Article />} />
                <Route path="/about" element={<About />} />
                <Route path="/chatbot" element={<ChatBot />} />
                <Route path="/peer-network" element={<PeerNetwork />} />
                <Route path="/global-opportunities" element={<GlobalOpportunities />} />
              </Route>
            </Route>


            {/* Unknown Routes */}
            < Route path="*" element={< NotFound />} />
          </Routes >
        </BrowserRouter >
      </TooltipProvider >
    </AuthProvider >
  </QueryClientProvider >
);

export default App;
