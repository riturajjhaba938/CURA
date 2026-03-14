require('dotenv').config();
const Bytez = require('bytez.js');

async function dump() {
  const sdk = new Bytez(process.env.BYTEZ_API_KEY);
  const model = sdk.model("d4data/biomedical-ner-all");
  const { error, output } = await model.run("I took 20mg of Accutane and by Week 2 I had severe dry lips.");
  
  if (error) { console.error('Error:', error); return; }
  
  console.log('Total entities:', output.length);
  for (let i = 0; i < output.length; i++) {
    const e = output[i];
    console.log(i + ':', e.entity, '|', JSON.stringify(e.word), '| score:', e.score?.toFixed(3));
  }
}

dump().catch(console.error);
