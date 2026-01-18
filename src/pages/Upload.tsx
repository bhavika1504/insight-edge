import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileText, CheckCircle2, Loader2, Sparkles, Brain, Target, AlertCircle, Linkedin, Link as LinkIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadResume, extractLinkedIn } from "@/services/careerService";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const steps = [
  { icon: FileText, label: "Parsing Resume", description: "Reading your experience" },
  { icon: Brain, label: "Understanding Skills", description: "Extracting core competencies" },
  { icon: Target, label: "Matching Roles", description: "Ranking best career choices" },
];

const linkedinSteps = [
  { icon: Linkedin, label: "Connecting Profile", description: "Linking to your LinkedIn" },
  { icon: Brain, label: "Analyzing Profile", description: "Extracting skills and history" },
  { icon: Target, label: "Matching Roles", description: "Finding your smart city path" },
];

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    setError(null);
    setCurrentStep(0);

    try {
      // Step 1: Parsing Resume
      const response = await uploadResume(uploadedFile);
      setCurrentStep(1);

      // Step 2: Understanding Skills (brief delay for UX)
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCurrentStep(2);

      // Step 3: Matching Roles
      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsComplete(true);
      toast.success(`Found ${response.skills_found} skills and ${response.projects_found} projects!`);

      // Navigate to career match page
      setTimeout(() => navigate("/career-match"), 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process resume. Make sure the Career API is running.";
      setError(errorMessage);
      setCurrentStep(-1);
      setFile(null);
      setIsProcessing(false);
      toast.error(errorMessage);
    }
  };

  const processLinkedIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl.includes("linkedin.com/in/")) {
      toast.error("Please enter a valid LinkedIn profile URL");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(0);

    try {
      // Step 1: Connecting
      const response = await extractLinkedIn(linkedinUrl);
      setCurrentStep(1);

      // Step 2: Analyzing
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setCurrentStep(2);

      // Step 3: Matching Roles
      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsComplete(true);
      toast.success(`Success! Linked profile. Found ${response.skills_found} skills.`);

      // Navigate to career match page
      setTimeout(() => navigate("/career-match"), 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to link LinkedIn. Make sure the Career API is running.";
      setError(errorMessage);
      setCurrentStep(-1);
      setIsProcessing(false);
      toast.error(errorMessage);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf"))) {
      processFile(droppedFile);
    } else {
      toast.error("Please upload a PDF file");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
    e.target.value = '';
  };


  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get Analyzed
          </h1>
          <p className="text-muted-foreground">
            Choose either your resume or your LinkedIn profile for analysis 🌱
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          {!isProcessing ? (
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-secondary rounded-xl">
                <TabsTrigger value="upload" className="rounded-lg py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Upload Resume
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="rounded-lg py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  LinkedIn Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`card-urban p-12 text-center border-2 border-dashed transition-all duration-300 ${isDragging
                    ? "border-primary bg-secondary/50 scale-[1.02]"
                    : "border-border hover:border-primary/50"
                    }`}
                >
                  <motion.div
                    animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center"
                  >
                    <UploadIcon className="w-10 h-10 text-primary" />
                  </motion.div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Drag & drop your resume here
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    or click to browse files
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <Button
                    type="button"
                    className="btn-forest"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>

                  <p className="text-xs text-muted-foreground mt-4">
                    Supports PDF (Max 5MB)
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="linkedin">
                <div className="card-urban p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#0077b5]/10 flex items-center justify-center">
                    <Linkedin className="w-10 h-10 text-[#0077b5]" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Connect LinkedIn Profile
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Enter your profile URL to extract skills directly
                  </p>

                  <form onSubmit={processLinkedIn} className="space-y-4">
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="linkedin.com/in/username"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="pl-10 h-12 rounded-xl"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-[#0077b5] hover:bg-[#0077b5]/90 text-white font-semibold transition-all"
                    >
                      Connect Profile
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="card-urban p-8">
              {file && (
                <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-secondary">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground truncate">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{(file.size / 1024).toPrecision(3)} KB</div>
                  </div>
                  {isComplete && <CheckCircle2 className="w-6 h-6 text-primary" />}
                </div>
              )}

              {linkedinUrl && !file && (
                <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-secondary">
                  <div className="w-12 h-12 rounded-xl bg-[#0077b5]/10 flex items-center justify-center">
                    <Linkedin className="w-6 h-6 text-[#0077b5]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground truncate text-sm">{linkedinUrl}</div>
                    <div className="text-xs text-muted-foreground">Linked Profile</div>
                  </div>
                  {isComplete && <CheckCircle2 className="w-6 h-6 text-primary" />}
                </div>
              )}

              <div className="space-y-6">
                {(linkedinUrl && !file ? linkedinSteps : steps).map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === index;
                  const isPast = currentStep > index;

                  return (
                    <div
                      key={step.label}
                      className={`flex items-start gap-4 transition-all duration-500 ${isActive ? "opacity-100 translate-x-1" :
                        isPast ? "opacity-60" : "opacity-40"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" :
                        isPast ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                        }`}>
                        {isActive ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isPast ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className={`font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                          {step.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="mt-8 p-4 rounded-xl bg-destructive/10 text-destructive flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <AnimatePresence>
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center"
                  >
                    <p className="text-lg font-medium text-primary mb-2">
                      Analysis Complete! ✨
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Redirecting to your career matches...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
