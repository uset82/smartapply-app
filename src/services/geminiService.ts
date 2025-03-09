import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Gemini API with the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

// Create a safety settings configuration
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

// Initialize the API
let genAI: GoogleGenerativeAI;
let model: any;

try {
  if (!API_KEY) {
    console.error('Gemini API key is missing. Please check your .env file.');
    throw new Error('API key is missing');
  }
  
  genAI = new GoogleGenerativeAI(API_KEY);
  
  // Create a model instance with the specific model version
  model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro", // Using a more reliable model name
    safetySettings,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1000,
    },
  });
  
  console.log('Gemini API initialized successfully');
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
}

// Define the prompt for cover letter generation
const COVER_LETTER_PROMPT = `
Act as a CV and cover letter expert.
Your role is to help me create professional, compelling, and well-structured cover letters that align with my education, previous work experience, and skills.

You will analyze job offers, interpret their requirements, and craft the perfect cover letter to maximize my chances of getting hired.

You must use the right professional verbs and industry-specific language to ensure my cover letters sound natural, professional, and engaging.
Avoid AI-synthesized or robotic phrasing—the writing must feel human and reflect my unique personality and style.
You will not lie or add false descriptions about my skills or experience. Instead, you will first review my CV, transcripts, diplomas, and all relevant documents from my previous education and work history.
If a job posting requires a skill I don't have, you will find a smart, strategic way to handle it. Use reverse psychology and persuasive wording so that HR sees my cover letter as important, relevant, and the winning application.
`;

/**
 * Generate a cover letter based on a job posting URL and user data
 */
export async function generateCoverLetter(
  jobUrl: string, 
  userData: { 
    cv: string, 
    education?: string, 
    experience?: string,
    skills?: string,
    language?: 'english' | 'spanish' | 'norwegian'
  }
): Promise<string> {
  try {
    if (!model) {
      throw new Error('Gemini API not initialized');
    }
    
    // Construct the prompt with user data and job URL
    const fullPrompt = `
${COVER_LETTER_PROMPT}

Job Posting URL: ${jobUrl}

My CV Information:
${userData.cv || "No CV provided"}

${userData.education ? `My Education:\n${userData.education}\n` : ''}
${userData.experience ? `My Experience:\n${userData.experience}\n` : ''}
${userData.skills ? `My Skills:\n${userData.skills}\n` : ''}

Please generate a professional cover letter in ${userData.language || 'english'} for this job posting.
`;

    // For debugging
    console.log('Sending prompt to Gemini:', fullPrompt.substring(0, 100) + '...');

    // Generate content with Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return "I encountered an error while generating your cover letter. Please make sure you have provided a valid job URL and CV information, and try again later.";
  }
}

/**
 * Chat with the AI about job applications, cover letters, etc.
 */
export async function chatWithAI(
  message: string,
  history: { role: 'user' | 'model', content: string }[] = []
): Promise<string> {
  try {
    if (!model) {
      throw new Error('Gemini API not initialized');
    }
    
    console.log('Chat history:', history);
    console.log('User message:', message);
    
    // For simple messages with no history, just generate a response
    if (history.length <= 1) {
      const prompt = `You are an AI assistant for a job application platform called SmartApply. 
      You help users with their job applications, cover letters, and resumes.
      Be helpful, friendly, and professional. The user is asking: ${message}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }
    
    // For conversations with history, use a chat-like approach
    // Format the history and current message
    const formattedHistory = history.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
    
    // Create a chat session
    const chat = model.startChat({
      history: formattedHistory,
    });
    
    // Send the message to the chat
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error chatting with AI:', error);
    return "Sorry, I encountered an error. Please try again.";
  }
}

/**
 * Analyze a document (CV, diploma, etc.) to extract relevant information
 */
export async function analyzeDocument(documentText: string, documentType: 'cv' | 'diploma' | 'cover_letter'): Promise<any> {
  try {
    if (!model) {
      throw new Error('Gemini API not initialized');
    }
    
    const prompt = `
Please analyze this ${documentType} and extract the key information in a structured format:

${documentText}

Return the information as a detailed summary that can be used for job applications.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error(`Error analyzing ${documentType}:`, error);
    return `I encountered an error while analyzing your ${documentType}. Please try again later.`;
  }
} 