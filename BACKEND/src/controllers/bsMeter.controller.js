const { analyzeClaim } = require('../services/bsMeter.service');

const bsMeter = async (req, res) => {
  const { drug, side_effect, claim_text } = req.body;

  if (!drug || !side_effect) {
    return res.status(400).json({ error: 'drug and side_effect are required' });
  }

  try {
    const claimText = claim_text || `I took ${drug} and experienced ${side_effect}`;
    const result = await analyzeClaim(drug, side_effect, claimText);
    res.json(result);
  } catch (error) {
    console.error(`BS Meter Controller Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to analyze claim' });
  }
};

module.exports = {
  bsMeter
};
