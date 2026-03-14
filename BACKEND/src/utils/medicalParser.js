/**
 * Helper to parse medical entities and validate them.
 * Since Bytez will return some text, we can use this to clean it up.
 */
const parseExtractedEntities = (data) => {
  return {
    drug: data.drug?.trim() || null,
    side_effect: data.side_effect?.trim() || null,
    dosage: data.dosage?.trim() || null,
    timeline_marker: data.timeline_marker?.trim() || null
  };
};

module.exports = {
  parseExtractedEntities
};
