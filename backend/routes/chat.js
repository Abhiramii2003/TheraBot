const express = require('express');
const router = express.Router();
const { generateGeminiResponse } = require('../utils/gemini');

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  console.log('Received prompt:', prompt);
  try {
    const response = await generateGeminiResponse(prompt);
    res.json({ response });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while generating the response',
      details: error.message || 'Unknown error',
    });
  }
});

module.exports = router;
