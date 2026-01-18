import { NewsArticle } from "@/lib/news-data";
const API_URL = import.meta.env.VITE_API_URL;
export interface RSSItem {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    description: string;
    thumbnail?: string;
    enclosure?: { link: string };
}

const FEED_URLS = [
    // Smart Cities Dive (General Industry News)
    "https://www.smartcitiesdive.com/feeds/news/",
    // Press Information Bureau (Government of India) - Press Releases
    "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=1"
];

const RSS2JSON_API = "https://api.rss2json.com/v1/api.json?rss_url=";

export const fetchRealTimeNews = async (): Promise<NewsArticle[]> => {
    try {
        const allArticles: NewsArticle[] = [];

        for (const feedUrl of FEED_URLS) {
            try {
                const response = await fetch(`${RSS2JSON_API}${encodeURIComponent(feedUrl)}`);
                const data = await response.json();

                if (data.status === "ok" && data.items) {
                    const articles = data.items.map((item: RSSItem, index: number) => {
                        // Basic image extraction logic could be improved
                        const imageUrl = item.thumbnail || item.enclosure?.link;

                        // Smart City Dive specific parsing or PIB parsing
                        const isGovt = feedUrl.includes("pib.gov.in");
                        const source = isGovt ? "Government of India (PIB)" : "Smart Cities Dive";

                        // Strip HTML tags for summary
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = item.description || item.content || "";
                        const textContent = tempDiv.textContent || tempDiv.innerText || "";
                        const summary = textContent.slice(0, 150) + "...";

                        return {
                            id: `live-${isGovt ? 'govt' : 'scd'}-${index}-${Date.now()}`,
                            title: item.title,
                            summary: summary,
                            content: item.content || item.description, // Full content often not available in RSS
                            category: isGovt ? "Governance & Policy" : "Smart Cities",
                            source: source,
                            publishedDate: new Date(item.pubDate).toISOString().split('T')[0],
                            imageUrl: imageUrl,
                            relatedRoles: ["Urban Data Analyst", "City Operations Analyst"], // Default
                            skillsMentioned: ["Government Policy", "Urban Development"], // Default
                            careerRelevance: isGovt
                                ? "Keeping up with government updates is crucial for aligning projects with national missions."
                                : "External market dynamics often drive private sector smart city roles.",
                            isLive: true,
                        };
                    });
                    allArticles.push(...articles);
                }
            } catch (err) {
                console.error(`Failed to fetch feed ${feedUrl}:`, err);
                // Continue to next feed even if one fails
            }
        }

        return allArticles;
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};
