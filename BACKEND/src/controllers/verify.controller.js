const { verifyClaim } = require('../services/verification.service');

const verify = async (req, res) => {
  const { drug, side_effect, claim_text } = req.body;

  if (!drug || !side_effect) {
    return res.status(400).json({ error: 'drug and side_effect are required' });
  }

  try {
    const result = await verifyClaim(drug, side_effect, claim_text);
    res.json(result);
  } catch (error) {
    console.error(`Verify Controller Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to verify claim' });
  }
};

module.exports = {
  verify
};
