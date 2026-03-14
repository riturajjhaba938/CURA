const { anonymizeText } = require('../services/anonymization.service');

const anonymize = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  try {
    const result = await anonymizeText(text);
    res.json(result);
  } catch (error) {
    console.error(`Anonymize Controller Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to anonymize text' });
  }
};

module.exports = {
  anonymize
};
