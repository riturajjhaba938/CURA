const Bytez = require('bytez.js');

// Initialize Bytez SDK with the API key
const bytezKey = process.env.BYTEZ_API_KEY;
const sdk = new Bytez(bytezKey);

// Biomedical NER model for extracting medical entities from text
const biomedicalNerModel = sdk.model("d4data/biomedical-ner-all");

// NLI model for fact-checking claims (BS Meter)
// Classifies premise-hypothesis pairs as: entailment, contradiction, or neutral
const nliModel = sdk.model("cross-encoder/nli-deberta-v3-small");

// PII masker model for PHI anonymization (HIPAA compliance)
// Detects and redacts patient names, locations, dates from medical narratives
const piiMaskerModel = sdk.model("obi/deid_roberta_i2b2");

module.exports = {
  sdk,
  biomedicalNerModel,
  nliModel,
  piiMaskerModel
};
