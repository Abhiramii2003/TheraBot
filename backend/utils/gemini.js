const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('💡 Initializing Gemini client...');

// Initialize client (no apiVersion needed in current SDK)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Current working model names (July 2024)
const modelName = 'gemini-1.5-flash-002'; // Most capable model
// Alternatives: 'gemini-1.0-pro' or 'gemini-pro'

async function generateGeminiResponse(prompt) {
  try {
    console.log('🔍 Using model:', modelName);
    
    const model = genAI.getGenerativeModel({
      model: modelName,
      // Recommended safety settings
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ],
      // Optional generation config
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 2048
      }
    });

    // Current working request format
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    });

    const response = await result.response.text();
    return response;
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    throw new Error(`Gemini request failed: ${error.message}`);
  }
}

module.exports = { generateGeminiResponse };