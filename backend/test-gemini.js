const { generateGeminiResponse } = require('./utils/gemini');

(async () => {
  try {
    const reply = await generateGeminiResponse('How can I feel better today?');
    console.log('✅ Gemini response:', reply);
  } catch (err) {
    console.error('❌ Error during Gemini test:', err.message || err);
  }
})();

