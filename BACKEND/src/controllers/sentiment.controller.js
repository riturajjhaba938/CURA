const { analyzeSentiment } = require('../services/sentiment.service');

const sentiment = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  try {
    const result = await analyzeSentiment(text);
    res.json(result);
  } catch (error) {
    console.error(`Sentiment Controller Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
};

module.exports = {
  sentiment
};
