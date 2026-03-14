const { extractEntities } = require('../services/entityExtraction.service');

const extract = async (req, res) => {
  const { comment_id } = req.body;

  if (!comment_id) {
    return res.status(400).json({ error: 'comment_id is required' });
  }

  try {
    const entities = await extractEntities(comment_id);
    res.json(entities);
  } catch (error) {
    console.error(`Extract Controller Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to extract entities from comment' });
  }
};

module.exports = {
  extract
};
