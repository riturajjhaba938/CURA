const { biomedicalNerModel } = require('../config/bytez');
const { parseExtractedEntities } = require('../utils/medicalParser');
const { anonymizeText } = require('./anonymization.service');
const { getCache, setCache } = require('../utils/cache');
const { withRetry } = require('../utils/aiPatterns');

/**
 * Extracts medical entities from text using the Bytez biomedical-ner-all model.
 * Text is first anonymized (PHI stripped) before NER extraction.
 */
const extractEntities = async (commentId) => {
  try {
    const cacheKey = `extract_${commentId}`;
    const cached = getCache(cacheKey);
    if (cached) {
      console.log(`[Cache hit] Extract entities for ${commentId}`);
      return cached;
    }

    // In a real scenario, fetch the comment from DB:
    // const comment = await CommentModel.findById(commentId);
    // const rawText = comment.body;
    
    // For now, mock the text with PII included:
    const rawText = `My name is John Smith from NYC. I took 20mg of Accutane and by Week 2 I had severe dry lips.`;

    // Step 1: Anonymize the text (strip PHI for HIPAA compliance)
    const anonymized = await anonymizeText(rawText);
    const text = anonymized.anonymized_text;
    console.log(`[Extract] Anonymized text: "${text.substring(0, 80)}..."`);

    console.log(`[Bytez NER] Running biomedical-ner-all model for comment ${commentId}`);

    // Use the Bytez SDK to run the biomedical NER model with retry logic
    const nerOutput = await withRetry(async () => {
      const { error, output } = await biomedicalNerModel.run(text);
      if (error) {
        throw new Error(`Bytez API error: ${error}`);
      }
      return output;
    }, 3, 1000);

    console.log(`[Bytez NER] Raw output:`, JSON.stringify(nerOutput, null, 2));

    // Transform NER output into our expected entity format
    // The biomedical-ner-all model returns entities like:
    // [{ entity_group: "Drug", word: "Accutane", score: 0.99 }, ...]
    const extractedData = transformNerOutput(nerOutput);

    // Run through the medical parser for additional normalization
    const result = parseExtractedEntities(extractedData);
    
    setCache(cacheKey, result);
    return result;

  } catch (error) {
    console.error(`Error extracting entities after retries: ${error.message}`);
    // Return graceful fallback rather than crashing the app
    return parseExtractedEntities({
      drug: null,
      side_effect: null,
      dosage: null,
      timeline_marker: null
    });
  }
};

/**
 * Transforms raw NER model output into our structured entity format.
 * The biomedical-ner-all model returns BIO-tagged entities like:
 *   { entity: "B-Drug_brand", word: "Accutane", score: 0.99 }
 *   { entity: "B-Sign_symptom", word: "dry", score: 1.0 }
 *   { entity: "I-Sign_symptom", word: "lips", score: 0.99 }
 * 
 * B- prefix = Beginning of entity, I- prefix = Inside (continuation)
 */
const transformNerOutput = (nerEntities) => {
  const result = {
    drug: null,
    side_effect: null,
    dosage: null,
    timeline_marker: null
  };

  if (!Array.isArray(nerEntities)) {
    console.warn('[Bytez NER] Unexpected output format, returning empty extraction');
    return result;
  }

  // Group consecutive tokens that belong to the same entity type
  const groupedEntities = [];
  let currentGroup = null;

  for (const entity of nerEntities) {
    const rawLabel = (entity.entity || '').trim();
    const rawWord = (entity.word || '').trim();
    if (!rawWord || !rawLabel) continue;

    // Check if this is a subword token (starts with ##) before cleaning
    const isSubword = rawWord.startsWith('##');
    const word = rawWord.replace(/^##/, '');

    // Strip BIO prefix (B- or I-) to get just the label
    const isBeginning = rawLabel.startsWith('B-');
    const isContinuation = rawLabel.startsWith('I-');
    const label = rawLabel.replace(/^[BI]-/, '').toLowerCase();

    if (isSubword && currentGroup) {
      // Subword tokens always continue the current group, regardless of B- or I- tag
      // The model sometimes tags subwords like ##uta as B-Medication instead of I-Medication
      currentGroup.tokens.push({ word, isSubword: true });
    } else if (isBeginning) {
      // Start a new entity group
      if (currentGroup) groupedEntities.push(currentGroup);
      currentGroup = { label, tokens: [{ word, isSubword: false }] };
    } else if (isContinuation && currentGroup && currentGroup.label === label) {
      // Continue the current entity (track if it's a subword)
      currentGroup.tokens.push({ word, isSubword });
    } else {
      // Unrelated token, flush current group
      if (currentGroup) groupedEntities.push(currentGroup);
      currentGroup = null;
    }
  }
  if (currentGroup) groupedEntities.push(currentGroup);

  // Map grouped entities to our schema
  for (const group of groupedEntities) {
    // Join tokens: subwords attach without space, separate words get spaces
    let text = '';
    for (const token of group.tokens) {
      text += token.isSubword ? token.word : (text ? ' ' + token.word : token.word);
    }
    const label = group.label;

    if (label.includes('drug') || label.includes('chemical') || label.includes('medication')) {
      result.drug = result.drug || text;
    } else if (label.includes('sign_symptom') || label.includes('symptom') || label.includes('disease')) {
      result.side_effect = result.side_effect || text;
    } else if (label.includes('dosage') || label.includes('dose') || label.includes('strength')) {
      result.dosage = result.dosage || text;
    } else if (label.includes('date') || label.includes('duration') || label.includes('frequency') || label.includes('time')) {
      result.timeline_marker = result.timeline_marker || text;
    }
  }

  console.log('[Bytez NER] Mapped entities:', JSON.stringify(result));
  return result;
};

module.exports = {
  extractEntities
};
