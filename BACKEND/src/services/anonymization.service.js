const { piiMaskerModel } = require('../config/bytez');
const { getCache, setCache } = require('../utils/cache');
const { withRetry } = require('../utils/aiPatterns');

/**
 * PHI Anonymization Service
 * Uses the PII masker model to detect and redact Protected Health Information
 * from medical narratives before storing in MongoDB.
 * 
 * Ensures HIPAA compliance by stripping:
 * - Patient names
 * - Locations (addresses, cities, hospitals)
 * - Specific dates (birth dates, visit dates)
 * - Ages, phone numbers, IDs
 * 
 * While preserving medical context (drug names, symptoms, dosages).
 */

/**
 * Anonymizes text by detecting and masking PII/PHI entities.
 * 
 * @param {string} text - Raw text containing potential PHI
 * @returns {Object} { anonymized_text, entities_found, entity_count }
 */
const anonymizeText = async (text) => {
  if (!text || typeof text !== 'string') {
    return { anonymized_text: text || '', entities_found: [], entity_count: 0 };
  }

  const cacheKey = `anon_${text.substring(0, 80)}`;
  const cached = getCache(cacheKey);
  if (cached) {
    console.log('[Anonymization] Cache hit');
    return cached;
  }

  console.log(`[Anonymization] Processing text: "${text.substring(0, 80)}..."`);

  let piiEntities;
  try {
    piiEntities = await withRetry(async () => {
      const { error, output } = await piiMaskerModel.run(text);
      if (error) {
        throw new Error(`PII masker model error: ${error}`);
      }
      return output;
    }, 3, 1000);
  } catch (err) {
    console.error('[Anonymization] PII masker model failed:', err.message);
    // Fallback: use regex-based anonymization
    return fallbackAnonymize(text);
  }

  console.log('[Anonymization] Raw PII output:', JSON.stringify(piiEntities));

  // Process the detected PII entities and mask them in the text
  const result = maskEntities(text, piiEntities);

  setCache(cacheKey, result);
  return result;
};

/**
 * Takes detected PII entities and replaces them in the original text.
 * 
 * The model returns entities with BIO tags like:
 *   { entity: "B-PATIENT", word: "John", start: 0, end: 4 }
 *   { entity: "B-LOCATION", word: "NYC", start: 13, end: 16 }
 */
const maskEntities = (originalText, piiEntities) => {
  if (!Array.isArray(piiEntities) || piiEntities.length === 0) {
    return {
      anonymized_text: originalText,
      entities_found: [],
      entity_count: 0
    };
  }

  // Group consecutive tokens into full entities (same BIO logic as NER)
  const groupedEntities = [];
  let currentGroup = null;

  for (const entity of piiEntities) {
    const rawLabel = (entity.entity || '').trim();
    const rawWord = (entity.word || '').trim();
    if (!rawWord || !rawLabel || rawLabel === 'O') continue;

    const isSubword = rawWord.startsWith('##');
    const word = rawWord.replace(/^##/, '');
    const isBeginning = rawLabel.startsWith('B-');
    const label = rawLabel.replace(/^[BI]-/, '').toUpperCase();

    if (isSubword && currentGroup) {
      currentGroup.tokens.push({ word, isSubword: true });
      currentGroup.end = entity.end || currentGroup.end;
    } else if (isBeginning) {
      if (currentGroup) groupedEntities.push(currentGroup);
      currentGroup = {
        label,
        tokens: [{ word, isSubword: false }],
        start: entity.start,
        end: entity.end
      };
    } else if (currentGroup && label === currentGroup.label) {
      currentGroup.tokens.push({ word, isSubword });
      currentGroup.end = entity.end || currentGroup.end;
    } else {
      if (currentGroup) groupedEntities.push(currentGroup);
      currentGroup = {
        label,
        tokens: [{ word, isSubword: false }],
        start: entity.start,
        end: entity.end
      };
    }
  }
  if (currentGroup) groupedEntities.push(currentGroup);

  // Build replacement text — replace PII with masked labels
  // Sort by start position in reverse to replace from end to start
  const sortedEntities = groupedEntities
    .filter(e => isPHILabel(e.label))
    .sort((a, b) => (b.start || 0) - (a.start || 0));

  let anonymizedText = originalText;

  for (const entity of sortedEntities) {
    // Reconstruct the original text span
    let entityText = '';
    for (const token of entity.tokens) {
      entityText += token.isSubword ? token.word : (entityText ? ' ' + token.word : token.word);
    }

    const maskLabel = `[${entity.label}]`;

    // Replace using start/end positions if available, otherwise use string replacement
    if (entity.start !== undefined && entity.end !== undefined) {
      anonymizedText = anonymizedText.substring(0, entity.start) + 
                       maskLabel + 
                       anonymizedText.substring(entity.end);
    } else {
      anonymizedText = anonymizedText.replace(new RegExp(escapeRegex(entityText), 'gi'), maskLabel);
    }
  }

  const entitiesFound = sortedEntities.map(e => ({
    type: e.label,
    original: e.tokens.map(t => t.word).join(''),
    masked_as: `[${e.label}]`
  }));

  console.log(`[Anonymization] Found ${entitiesFound.length} PHI entities`);

  return {
    anonymized_text: anonymizedText,
    entities_found: entitiesFound,
    entity_count: entitiesFound.length
  };
};

/**
 * Checks if a label corresponds to PHI that should be masked.
 * Medical entities (drugs, symptoms) are NOT masked.
 */
const isPHILabel = (label) => {
  const phiLabels = [
    'PATIENT', 'DOCTOR', 'USERNAME', 'PERSON',
    'HOSPITAL', 'LOCATION', 'ORGANIZATION', 'CITY', 'STATE', 'COUNTRY', 'STREET', 'ZIP',
    'DATE', 'AGE', 'BIRTHDATE',
    'PHONE', 'FAX', 'EMAIL', 'URL', 'IPADDR',
    'SSN', 'MEDICALRECORD', 'HEALTHPLAN', 'ACCOUNT',
    'IDNUM', 'BIOID', 'DEVICE'
  ];
  return phiLabels.includes(label);
};

/**
 * Regex-based fallback anonymizer when the AI model is unavailable.
 */
const fallbackAnonymize = (text) => {
  let anonymized = text;
  const entitiesFound = [];

  // Mask email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  anonymized = anonymized.replace(emailRegex, (match) => {
    entitiesFound.push({ type: 'EMAIL', original: match, masked_as: '[EMAIL]' });
    return '[EMAIL]';
  });

  // Mask phone numbers
  const phoneRegex = /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  anonymized = anonymized.replace(phoneRegex, (match) => {
    entitiesFound.push({ type: 'PHONE', original: match, masked_as: '[PHONE]' });
    return '[PHONE]';
  });

  // Mask dates (MM/DD/YYYY, DD-MM-YYYY patterns)
  const dateRegex = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g;
  anonymized = anonymized.replace(dateRegex, (match) => {
    entitiesFound.push({ type: 'DATE', original: match, masked_as: '[DATE]' });
    return '[DATE]';
  });

  // Mask SSN patterns
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  anonymized = anonymized.replace(ssnRegex, (match) => {
    entitiesFound.push({ type: 'SSN', original: match, masked_as: '[SSN]' });
    return '[SSN]';
  });

  console.log(`[Anonymization Fallback] Found ${entitiesFound.length} PHI entities`);

  return {
    anonymized_text: anonymized,
    entities_found: entitiesFound,
    entity_count: entitiesFound.length,
    fallback: true
  };
};

/** Escapes special regex characters in a string */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = {
  anonymizeText
};
