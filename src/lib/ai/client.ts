import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Model configurations
const HEALTHCARE_MODEL = "gemini-2.0-flash"; // Fast, efficient for general healthcare chat
const MEDICAL_MODEL = "gemini-2.0-flash"; // For medical analysis
const VISION_MODEL = "gemini-2.0-flash"; // For multimodal analysis

export type AIModelMode = "healthcare" | "medical" | "vision";

export function getModel(mode: AIModelMode) {
    switch (mode) {
        case "healthcare":
            return genAI.getGenerativeModel({ model: HEALTHCARE_MODEL });
        case "medical":
            // Fallback logic could be added here if 3.0 is not yet available in the specific region/tier
            return genAI.getGenerativeModel({ model: MEDICAL_MODEL });
        case "vision":
            return genAI.getGenerativeModel({ model: VISION_MODEL });
        default:
            return genAI.getGenerativeModel({ model: HEALTHCARE_MODEL });
    }
}

export async function generateText(prompt: string, mode: AIModelMode = "healthcare") {
    try {
        const model = getModel(mode);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
}
