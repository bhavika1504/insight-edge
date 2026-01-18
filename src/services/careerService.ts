/**
 * Career API Service
 * Communicates with the FastAPI Career Advisor backend
 */

const CAREER_API_URL = '/api';
const API_URL = import.meta.env.VITE_API_URL;
export interface ResumeUploadResponse {
    success: boolean;
    message: string;
    filename: string;
    characters_extracted: number;
    skills_found: number;
    projects_found: number;
    quality: ResumeQuality;
}

export interface ResumeQuality {
    completeness_score: number;
    missing_sections: string[];
    recommendations: string[];
    strengths: string[];
}

export interface ResumeAnalysis {
    contact: {
        email?: string;
        phone?: string;
        linkedin?: string;
        github?: string;
    };
    education: string[];
    experience: string[];
    projects: string[];
    skills: string[];
    certifications: string[];
    achievements: string[];
    quality_analysis: ResumeQuality;
    metadata: {
        total_characters?: number;
        total_lines?: number;
        sections_found: string[];
        contact_info_found: boolean;
        source?: string;
        filename?: string;
    };
}

export interface SkillsGapAnalysis {
    target_role: string;
    current_skills: string[];
    required_skills: string[];
    matching_skills: string[];
    missing_skills: string[];
    match_percentage: number;
    recommendations: SkillRecommendation[];
    readiness: 'High' | 'Medium' | 'Low';
}

export interface SkillRecommendation {
    skill: string;
    resource: string;
    url: string;
    duration: string;
}

export interface CareerPath {
    title: string;
    match: string;
    match_score: number;
    description: string;
    next_steps: string[];
}

export interface CareerPathsResponse {
    skills_detected: string[];
    career_paths: CareerPath[];
    total_paths: number;
}

export interface ChatResponse {
    answer: string;
    rag_used: boolean;
}

export interface ArbitrageOpportunity {
    region: string;
    country: string;
    city: string;
    flag: string;
    value_index: number;
    value_multiplier: string;
    demand: string;
    salary_usd: number;
    col_index: number;
    remote_friendly: boolean;
    visa_ease: string;
    description: string;
    dominant_sector: string;
    is_local: boolean;
    top_matching_skills: string[];
}

export interface SkillArbitrageResponse {
    opportunities: ArbitrageOpportunity[];
    local_market: ArbitrageOpportunity;
    user_best_fit: string;
    total_regions: number;
}

export interface HealthCheck {
    status: string;
    service: string;
    features: string[];
}

// Check if Career API is available
export async function checkCareerApiHealth(): Promise<HealthCheck | null> {
    try {
        const response = await fetch(`${CAREER_API_URL}/`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Career API not available:', error);
        return null;
    }
}

// Upload and parse resume
export async function uploadResume(file: File): Promise<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${CAREER_API_URL}/upload-resume`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        let errorDetail = 'Failed to upload resume';
        try {
            const error = await response.json();
            errorDetail = error.detail || errorDetail;
        } catch (e) {
            errorDetail = `Server Error (${response.status})`;
        }
        throw new Error(errorDetail);
    }

    return await response.json();
}

// Extract and parse from LinkedIn URL
export async function extractLinkedIn(url: string): Promise<ResumeUploadResponse> {
    const response = await fetch(`${CAREER_API_URL}/extract-linkedin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target_role: url }), // Passing URL as the payload
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to link LinkedIn profile');
    }

    return await response.json();
}

// Get detailed resume analysis
export async function getResumeAnalysis(): Promise<ResumeAnalysis> {
    const response = await fetch(`${CAREER_API_URL}/analyze-resume`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get resume analysis');
    }

    return await response.json();
}

// Analyze skills gap for a target role
export async function analyzeSkillsGap(targetRole: string): Promise<SkillsGapAnalysis> {
    const response = await fetch(`${CAREER_API_URL}/skills-gap`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target_role: targetRole }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to analyze skills gap');
    }

    return await response.json();
}

// Get career path suggestions
export async function getCareerPaths(): Promise<CareerPathsResponse> {
    const response = await fetch(`${CAREER_API_URL}/career-paths`);

    if (!response.ok) {
        let errorDetail = 'Failed to get career paths';
        try {
            const error = await response.json();
            errorDetail = error.detail || errorDetail;
        } catch (e) {
            errorDetail = `Server Error (${response.status})`;
        }
        throw new Error(errorDetail);
    }

    return await response.json();
}

// Chat with AI career advisor
export async function sendChatMessage(question: string): Promise<ChatResponse> {
    const response = await fetch(`${CAREER_API_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
    });

    if (!response.ok) {
        let errorDetail = 'Failed to get chat response';
        try {
            const error = await response.json();
            errorDetail = error.detail || errorDetail;
        } catch (e) {
            errorDetail = `Server Error (${response.status})`;
        }
        throw new Error(errorDetail);
    }

    return await response.json();
}

// ============ Peer Learning Network ============

export interface PeerMatch {
    peer_id: string;
    pseudonym: string;
    target_role: string;
    they_can_teach: string[];
    you_can_teach: string[];
    match_score: number;
    contact_preference: string;
}

export interface PeerMatchesResponse {
    user_skills: string[];
    peers: PeerMatch[];
    total_potential_peers: number;
}

export interface PeerConnectionResponse {
    success: boolean;
    message: string;
    peer: {
        pseudonym: string;
        target_role: string;
        contact_preference: string;
        contact_value: string;
    };
}

// Get peer learning matches
export async function getPeerMatches(): Promise<PeerMatchesResponse> {
    const response = await fetch(`${CAREER_API_URL}/peer-matches`);

    if (!response.ok) {
        let errorDetail = 'Failed to get peer matches';
        try {
            const error = await response.json();
            errorDetail = error.detail || errorDetail;
        } catch (e) {
            // Handle 404 specifically for outdated server detection
            if (response.status === 404) {
                errorDetail = `Endpoint not found (404). Your server might be outdated.`;
            } else {
                errorDetail = `Server Error (${response.status})`;
            }
        }
        throw new Error(errorDetail);
    }

    return await response.json();
}

// Connect with a peer
export async function connectWithPeer(peerId: string): Promise<PeerConnectionResponse> {
    const response = await fetch(`${CAREER_API_URL}/connect-peer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ peer_id: peerId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to connect with peer');
    }

    return await response.json();
}

// Get global skill arbitrage opportunities
export async function getSkillArbitrage(): Promise<SkillArbitrageResponse> {
    const response = await fetch(`${CAREER_API_URL}/skill-arbitrage`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get skill arbitrage data');
    }

    return await response.json();
}
