import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mic, MicOff, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import { sendChatMessage } from "@/services/careerService";

interface Message { role: "user" | "assistant"; content: string; }

const ChatBot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const isTypingRef = useRef(false);
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    // Only update input from voice when actively listening AND user is not typing
    useEffect(() => {
        if (listening && transcript && !isTypingRef.current) {
            setInput(transcript);
        }
    }, [transcript, listening]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setInput(""); resetTranscript(); setIsLoading(true);

        try {
            const data = await sendChatMessage(userMsg);
            setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
        } catch (err: any) {
            let errorMsg = "Sorry, couldn't connect to the server. Make sure the backend is running.";
            if (typeof err === 'string') {
                errorMsg = err;
            } else if (err?.message && typeof err.message === 'string') {
                errorMsg = err.message;
            } else if (err && typeof err === 'object') {
                errorMsg = JSON.stringify(err);
            }
            setMessages(prev => [...prev, { role: "assistant", content: `Error: ${errorMsg}` }]);
        } finally { setIsLoading(false); }
    };

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            isTypingRef.current = false; // Reset typing flag when voice starts
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isTypingRef.current = true; // Mark as typing manually
        setInput(e.target.value);
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-2xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-olive/20 mb-6">
                        <MessageSquare className="w-4 h-4 text-olive" />
                        <span className="text-sm font-medium text-olive">Gemini Powered</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Chat & Voice Bot</h1>
                    <p className="text-muted-foreground">Ask questions using text or voice{browserSupportsSpeechRecognition && " 🎤"}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-urban p-6">
                    <ScrollArea className="h-[400px] mb-4 pr-4">
                        <div className="space-y-3">
                            {messages.length === 0 && <p className="text-center text-muted-foreground text-sm py-12">Start a conversation with the AI assistant</p>}
                            {messages.map((msg, i) => (
                                <div key={i} className={`p-3 rounded-xl max-w-[85%] ${msg.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-secondary"}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            ))}
                            {isLoading && <div className="bg-secondary p-3 rounded-xl max-w-[85%]"><Loader2 className="w-4 h-4 animate-spin" /></div>}
                        </div>
                    </ScrollArea>

                    <div className="flex gap-2">
                        {browserSupportsSpeechRecognition && (
                            <Button variant="outline" size="icon" onClick={toggleListening} className={listening ? "bg-red-500/20 border-red-500" : ""}>
                                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </Button>
                        )}
                        <Input placeholder={listening ? "Listening..." : "Type a message..."} value={input} onChange={handleInputChange} onKeyDown={(e) => e.key === "Enter" && handleSend()} className="flex-1" />
                        <Button onClick={handleSend} disabled={isLoading} className="btn-forest"><Send className="w-4 h-4" /></Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ChatBot;
